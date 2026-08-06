import os

from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.utils import timezone
from .models import EncryptedAsset
from .serializers import EncryptedAssetSerializer
from .crypto import encrypt_file, decrypt_file, DecryptionError
from audit.utils import log_action, get_client_ip
from users.notifications import send_file_upload_notification


class EncryptedAssetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = EncryptedAsset.objects.filter(user=request.user).order_by('-created_at')
        serializer = EncryptedAssetSerializer(queryset, many=True)
        return Response(serializer.data)


class EncryptedAssetUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        password = request.data.get('password')
        client_salt = request.data.get('salt')
        client_iv = request.data.get('iv')

        if not uploaded_file:
            return Response({'detail': 'No file provided.'}, status=400)

        # Check if file was pre-encrypted on client-side via WebCrypto
        if client_salt and client_iv:
            ciphertext = uploaded_file.read()
            salt_hex = client_salt
            iv_hex = client_iv
            file_name = request.data.get('name') or uploaded_file.name
            try:
                file_size = int(request.data.get('file_size') or len(ciphertext))
            except (ValueError, TypeError):
                file_size = len(ciphertext)
        else:
            if not password:
                return Response({'detail': 'No password provided.'}, status=400)
            plaintext_bytes = uploaded_file.read()
            file_size = len(plaintext_bytes)
            ciphertext, salt_hex, iv_hex = encrypt_file(plaintext_bytes, password)
            file_name = uploaded_file.name

        asset = EncryptedAsset(
            user=request.user,
            name=file_name,
            file_size=file_size,
            salt=salt_hex,
            iv=iv_hex,
        )

        relative_path = os.path.join('encrypted', str(request.user.pk), f'{asset.pk}.enc')
        asset.storage_path = relative_path

        full_path = os.path.join(settings.MEDIA_ROOT, relative_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'wb') as f:
            f.write(ciphertext)

        asset.save()

        ip = get_client_ip(request)
        timestamp = timezone.now()
        send_file_upload_notification(request.user, file_name, file_size, ip, timestamp)

        log_action(
            user=request.user,
            action='file_encrypted',
            request=request,
            data_item=file_name,
            status='success',
            metadata={'file_size': file_size, 'zero_knowledge': bool(client_salt and client_iv)}
        )

        serializer = EncryptedAssetSerializer(asset)
        return Response(serializer.data, status=201)



class EncryptedAssetDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            asset = EncryptedAsset.objects.get(pk=pk)
        except EncryptedAsset.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        if asset.user != request.user:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=403)

        # Delete file from disk
        full_path = os.path.join(settings.MEDIA_ROOT, asset.storage_path)
        if os.path.exists(full_path):
            os.remove(full_path)

        asset_name = asset.name
        asset.delete()

        log_action(
            user=request.user,
            action='file_deleted',
            request=request,
            data_item=asset_name,
            status='success',
        )

        return Response(status=204)


class EncryptedAssetRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            asset = EncryptedAsset.objects.get(pk=pk)
        except EncryptedAsset.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        if asset.user != request.user:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=403)

        password = request.data.get('password')
        if not password:
            return Response({'detail': 'No password provided.'}, status=400)

        full_path = os.path.join(settings.MEDIA_ROOT, asset.storage_path)
        with open(full_path, 'rb') as f:
            ciphertext = f.read()

        try:
            plaintext = decrypt_file(ciphertext, password, asset.salt, asset.iv)
        except DecryptionError:
            log_action(
                user=request.user,
                action='file_decrypted',
                request=request,
                data_item=asset.name,
                status='failed',
            )
            return Response({'detail': 'Incorrect password.'}, status=403)

        log_action(
            user=request.user,
            action='file_decrypted',
            request=request,
            data_item=asset.name,
            status='success',
        )

        response = HttpResponse(plaintext, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{asset.name}"'
        return response

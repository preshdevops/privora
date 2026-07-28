from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import PrivacySettings
from .serializers import PrivacySettingsSerializer
from .scoring import calculate_score
from audit.utils import log_action


class PrivacySettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = PrivacySettings.objects.get_or_create(user=request.user)
        serializer = PrivacySettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings, _ = PrivacySettings.objects.get_or_create(user=request.user)
        serializer = PrivacySettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            changed_keys = ', '.join(request.data.keys())
            log_action(
                user=request.user,
                action='privacy_setting_changed',
                request=request,
                data_item=changed_keys,
                status='success',
                metadata=dict(request.data),
            )

            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class PrivacyScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        score = calculate_score(request.user)
        return Response({'score': score})

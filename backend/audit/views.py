from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog, AuditAlert
from .serializers import AuditLogSerializer, AuditAlertSerializer

class AuditLogListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = request.query_params.get('limit', 50)
        try:
            limit = int(limit)
            if limit < 0:
                limit = 50
        except ValueError:
            limit = 50

        queryset = AuditLog.objects.filter(user=request.user).order_by('-timestamp')
        count = queryset.count()
        sliced_queryset = queryset[:limit]
        serializer = AuditLogSerializer(sliced_queryset, many=True)
        return Response({
            'count': count,
            'results': serializer.data
        })


class AuditAlertListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = AuditAlert.objects.filter(user=request.user).order_by('-created_at')
        serializer = AuditAlertSerializer(queryset, many=True)
        return Response(serializer.data)


class AuditAlertResolveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            alert = AuditAlert.objects.get(pk=pk)
        except AuditAlert.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        if alert.user != request.user:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=403)

        alert.resolved = True
        alert.save()
        serializer = AuditAlertSerializer(alert)
        return Response(serializer.data)

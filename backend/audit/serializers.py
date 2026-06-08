from rest_framework import serializers
from .models import AuditLog, AuditAlert

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'action', 'ip_address', 'data_item',
            'status', 'timestamp', 'metadata'
        ]


class AuditAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditAlert
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'title', 'description', 'severity',
            'resolved', 'created_at'
        ]

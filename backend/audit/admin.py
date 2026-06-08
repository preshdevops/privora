from django.contrib import admin
from .models import AuditLog, AuditAlert

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'action', 'ip_address', 'status', 'timestamp')
    list_filter = ('action', 'status', 'timestamp')
    search_fields = ('user__email', 'action', 'ip_address', 'data_item')


@admin.register(AuditAlert)
class AuditAlertAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'severity', 'resolved', 'created_at')
    list_filter = ('severity', 'resolved', 'created_at')
    search_fields = ('user__email', 'title', 'description')

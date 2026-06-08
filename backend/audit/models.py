from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    data_item = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(blank=True, default=dict)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        user_email = self.user.email if self.user else "System"
        return f"{user_email} - {self.action} ({self.status}) at {self.timestamp}"


class AuditAlert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='audit_alerts'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.severity}) - Resolved: {self.resolved}"

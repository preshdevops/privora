import uuid
from django.db import models
from django.conf import settings


class EncryptedAsset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='encrypted_assets'
    )
    name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    storage_path = models.CharField(max_length=512)
    salt = models.CharField(max_length=64)
    iv = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.user.email})"

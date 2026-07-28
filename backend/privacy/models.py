from django.db import models
from django.conf import settings


class PrivacySettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='privacy_settings'
    )
    tracking_protection = models.BooleanField(default=True)
    data_sharing = models.BooleanField(default=False)
    ad_blocking = models.BooleanField(default=True)
    cookie_control = models.BooleanField(default=True)
    location_masking = models.BooleanField(default=False)
    fingerprint_defense = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Privacy settings for {self.user.email}"

from rest_framework import serializers
from .models import PrivacySettings


class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySettings
        fields = (
            'tracking_protection',
            'data_sharing',
            'ad_blocking',
            'cookie_control',
            'location_masking',
            'fingerprint_defense',
        )

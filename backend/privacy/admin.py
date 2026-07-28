from django.contrib import admin
from .models import PrivacySettings


@admin.register(PrivacySettings)
class PrivacySettingsAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'tracking_protection',
        'data_sharing',
        'ad_blocking',
        'cookie_control',
        'location_masking',
        'fingerprint_defense',
    )
    search_fields = ('user__email',)

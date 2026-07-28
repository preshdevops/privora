from django.contrib import admin
from .models import EncryptedAsset


@admin.register(EncryptedAsset)
class EncryptedAssetAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'file_size', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'user__email')

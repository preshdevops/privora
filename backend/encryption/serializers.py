from rest_framework import serializers
from .models import EncryptedAsset


class EncryptedAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = EncryptedAsset
        fields = ('id', 'name', 'file_size', 'created_at')
        read_only_fields = ('id', 'name', 'file_size', 'created_at')

from django.urls import path
from .views import (
    EncryptedAssetListView,
    EncryptedAssetUploadView,
    EncryptedAssetDeleteView,
    EncryptedAssetRetrieveView,
)

urlpatterns = [
    path('assets/', EncryptedAssetListView.as_view(), name='encrypted-asset-list'),
    path('upload/', EncryptedAssetUploadView.as_view(), name='encrypted-asset-upload'),
    path('assets/<uuid:pk>/', EncryptedAssetDeleteView.as_view(), name='encrypted-asset-delete'),
    path('assets/<uuid:pk>/retrieve/', EncryptedAssetRetrieveView.as_view(), name='encrypted-asset-retrieve'),
]

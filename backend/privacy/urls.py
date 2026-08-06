from django.urls import path
from .views import PrivacySettingsView, PrivacyScoreView, BreachCheckView

urlpatterns = [
    path('settings/', PrivacySettingsView.as_view(), name='privacy-settings'),
    path('score/', PrivacyScoreView.as_view(), name='privacy-score'),
    path('breach-check/', BreachCheckView.as_view(), name='breach-check'),
]


from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, MeView, UserSettingsView, LogoutView,
    ChangePasswordView, ExportUserDataView, DeleteAccountView
)

urlpatterns = [
    path('register/', RegisterView.as_view(),      name='register'),
    path('login/',    LoginView.as_view(),          name='login'),
    path('logout/',   LogoutView.as_view(),         name='logout'),
    path('me/',       MeView.as_view(),             name='me'),
    path('settings/', UserSettingsView.as_view(),   name='user-settings'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('export-data/',     ExportUserDataView.as_view(), name='export-data'),
    path('delete-account/',  DeleteAccountView.as_view(),  name='delete-account'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
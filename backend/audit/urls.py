from django.urls import path
from .views import AuditLogListView, AuditAlertListView, AuditAlertResolveView

urlpatterns = [
    path('logs/', AuditLogListView.as_view(), name='audit-logs'),
    path('alerts/', AuditAlertListView.as_view(), name='audit-alerts'),
    path('alerts/<int:pk>/resolve/', AuditAlertResolveView.as_view(), name='audit-alert-resolve'),
]

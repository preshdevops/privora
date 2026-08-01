from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/users/',      include('users.urls')),
    path('api/encryption/', include('encryption.urls')),
    path('api/audit/',      include('audit.urls')),
    path('api/privacy/',    include('privacy.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
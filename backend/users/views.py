from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import User, UserSettings
from .serializers import RegisterSerializer, UserSerializer, UserSettingsSerializer
from audit.utils import log_action, get_client_ip
from audit.models import AuditAlert
from .notifications import send_login_notification


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user':    UserSerializer(user).data,
                'access':  str(refresh.access_token),
                'refresh': str(refresh),
            }, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            log_action(user=None, action='failed_login', request=request, status='failed', metadata={'reason': 'Email and password are required.'})
            return Response({'error': 'Email and password are required.'}, status=400)

        user = authenticate(request, username=email, password=password)
        if not user:
            attempted_user = User.objects.filter(email=email).first()
            log_action(user=attempted_user, action='failed_login', request=request, status='failed', metadata={'reason': 'Invalid credentials.'})
            return Response({'error': 'Invalid credentials.'}, status=401)

        log_action(user=user, action='login', request=request, status='success')

        ip = get_client_ip(request)
        timestamp_str = timezone.now().strftime('%Y-%m-%d %H:%M:%S UTC')
        AuditAlert.objects.create(
            user=user,
            title="New login detected",
            description=f"New login detected from IP {ip or 'Unknown'} at {timestamp_str}.",
            severity="low"
        )

        send_login_notification(user, ip, timezone.now())

        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserSerializer(user).data,
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)
        return Response(UserSettingsSerializer(settings).data)

    def patch(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            log_action(user=request.user, action='logout', request=request, status='success')
            return Response({'message': 'Logged out successfully.'})
        except Exception as e:
            log_action(user=request.user, action='logout', request=request, status='failed', metadata={'error': str(e)})
            return Response({'error': 'Invalid token.'}, status=400)
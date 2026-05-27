from django.db import models

# Create your models here.
import os
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name)
        user.set_password(password)
        user.encryption_salt = os.urandom(32).hex()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password):
        user = self.create_user(email, full_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email           = models.EmailField(unique=True)
    full_name       = models.CharField(max_length=150)
    encryption_salt = models.CharField(max_length=64, blank=True)
    is_2fa_enabled  = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    is_staff        = models.BooleanField(default=False)
    date_joined     = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return self.email


class UserSettings(models.Model):
    user                   = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    login_notifications    = models.BooleanField(default=True)
    third_party_access     = models.BooleanField(default=False)
    session_timeout_mins   = models.IntegerField(default=30)
    data_retention_days    = models.IntegerField(default=365)
    created_at             = models.DateTimeField(auto_now_add=True)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user.email}"

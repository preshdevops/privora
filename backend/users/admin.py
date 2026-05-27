from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserSettings

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ('email', 'full_name', 'is_2fa_enabled', 'date_joined')
    search_fields = ('email', 'full_name')
    ordering      = ('-date_joined',)
    fieldsets     = (
        (None,           {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'encryption_salt')}),
        ('Security',     {'fields': ('is_2fa_enabled',)}),
        ('Permissions',  {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields':  ('email', 'full_name', 'password1', 'password2'),
        }),
    )

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_notifications', 'third_party_access', 'session_timeout_mins')
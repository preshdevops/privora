import logging
from django.core.mail import send_mail
from django.conf import settings
from users.models import UserSettings

logger = logging.getLogger(__name__)

def send_login_notification(user, ip_address, timestamp):
    """
    Emails the user about a new login, if they haven't opted out.
    Never raises — a failed email must not break the login response.
    """
    try:
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        if not user_settings.login_notifications:
            return

        subject = "New login to your Privora account"
        body = (
            f"A new successful login to your Privora account was detected.\n\n"
            f"Time: {timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
            f"IP Address: {ip_address}\n\n"
            f"If this was you, no action is needed. If you don't recognise this activity, "
            f"change your password immediately and review your Access Logs."
        )

        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as e:
        logger.error(f"Failed to send login notification email to {user.email}: {e}")

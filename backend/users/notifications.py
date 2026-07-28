import logging
import requests
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

        api_key = getattr(settings, 'SENDLIB_API_KEY', None)
        if not api_key:
            logger.warning("SENDLIB_API_KEY is not set. Cannot send email.")
            return

        url = "https://sendlib.samueltuoyo.com/api/send"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        subject = "New login to your Privora account"
        time_str = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')
        html_content = (
            f"<h3>New Login Detected</h3>"
            f"<p>A new successful login to your Privora account was detected.</p>"
            f"<ul>"
            f"<li><strong>Time:</strong> {time_str}</li>"
            f"<li><strong>IP Address:</strong> {ip_address}</li>"
            f"</ul>"
            f"<p>If this was you, no action is needed. If you don't recognise this activity, "
            f"change your password immediately and review your Access Logs.</p>"
        )

        payload = {
            "to": user.email,
            "subject": subject,
            "html": html_content,
        }

        response = requests.post(url, json=payload, headers=headers, timeout=5)
        if response.status_code not in (200, 201, 202):
            logger.error(f"Failed to send email via SendLib: {response.text}")
    except Exception as e:
        logger.error(f"Failed to send login notification email to {user.email}: {e}")

import logging
import threading
import requests
from django.conf import settings
from users.models import UserSettings

logger = logging.getLogger(__name__)


def _send_email(user_email, api_key, ip_address, timestamp):
    """
    Actually sends the login-notification email via SendLib.
    Runs in a background daemon thread — never blocks the caller.
    """
    try:
        url = "https://sendlib.samueltuoyo.com/api/send"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

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
            "to": user_email,
            "subject": "New login to your Privora account",
            "html": html_content,
        }

        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code not in (200, 201, 202):
            logger.error(f"Failed to send email via SendLib: {response.text}")
    except Exception as e:
        logger.error(f"Failed to send login notification email to {user_email}: {e}")


def send_login_notification(user, ip_address, timestamp):
    """
    Queues a login-notification email in a background thread.
    Returns immediately — never delays or fails the login response.
    """
    try:
        user_settings, _ = UserSettings.objects.get_or_create(user=user)
        if not user_settings.login_notifications:
            return

        api_key = getattr(settings, 'SENDLIB_API_KEY', None)
        if not api_key:
            logger.warning("SENDLIB_API_KEY is not set. Cannot send email.")
            return

        # Fire-and-forget: daemon thread dies with the process, never blocks login.
        thread = threading.Thread(
            target=_send_email,
            args=(user.email, api_key, ip_address, timestamp),
            daemon=True,
        )
        thread.start()
    except Exception as e:
        logger.error(f"Failed to queue login notification for {user.email}: {e}")


def _send_welcome_email(user_email, api_key, ip_address, timestamp):
    try:
        url = "https://sendlib.samueltuoyo.com/api/send"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        time_str = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')
        html_content = (
            f"<h3>Welcome to Privora Vault</h3>"
            f"<p>Your personal data protection vault account has been created successfully.</p>"
            f"<ul>"
            f"<li><strong>Account Email:</strong> {user_email}</li>"
            f"<li><strong>Registration Time:</strong> {time_str}</li>"
            f"<li><strong>Registration IP:</strong> {ip_address or 'Unknown'}</li>"
            f"</ul>"
            f"<p>All account access and vault operations are tracked in your personal immutable access ledger.</p>"
        )

        payload = {
            "to": user_email,
            "subject": "Welcome to Privora — Your Vault is Ready",
            "html": html_content,
        }

        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code not in (200, 201, 202):
            logger.error(f"Failed to send welcome email via SendLib: {response.text}")
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user_email}: {e}")


def send_welcome_notification(user, ip_address, timestamp):
    try:
        api_key = getattr(settings, 'SENDLIB_API_KEY', None)
        if not api_key:
            logger.warning("SENDLIB_API_KEY is not set. Cannot send welcome email.")
            return

        thread = threading.Thread(
            target=_send_welcome_email,
            args=(user.email, api_key, ip_address, timestamp),
            daemon=True,
        )
        thread.start()
    except Exception as e:
        logger.error(f"Failed to queue welcome notification for {user.email}: {e}")


def _send_file_upload_email(user_email, api_key, file_name, file_size_str, ip_address, timestamp):
    try:
        url = "https://sendlib.samueltuoyo.com/api/send"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        time_str = timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')
        html_content = (
            f"<h3>File Protected in Privora Vault</h3>"
            f"<p>A new document has been encrypted and secured in your vault.</p>"
            f"<ul>"
            f"<li><strong>File Name:</strong> {file_name}</li>"
            f"<li><strong>File Size:</strong> {file_size_str}</li>"
            f"<li><strong>Protection Time:</strong> {time_str}</li>"
            f"<li><strong>IP Address:</strong> {ip_address or 'Unknown'}</li>"
            f"</ul>"
            f"<p>Your file is stored with zero-knowledge AES encryption and verified in your activity ledger.</p>"
        )

        payload = {
            "to": user_email,
            "subject": f"Vault Protection Alert: {file_name}",
            "html": html_content,
        }

        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code not in (200, 201, 202):
            logger.error(f"Failed to send file upload email via SendLib: {response.text}")
    except Exception as e:
        logger.error(f"Failed to send file upload email to {user_email}: {e}")


def send_file_upload_notification(user, file_name, file_size, ip_address, timestamp):
    try:
        api_key = getattr(settings, 'SENDLIB_API_KEY', None)
        if not api_key:
            return

        # Format file size human readable
        size_bytes = int(file_size or 0)
        if size_bytes >= 1_048_576:
            file_size_str = f"{size_bytes / 1_048_576:.2f} MB"
        elif size_bytes >= 1024:
            file_size_str = f"{size_bytes / 1024:.2f} KB"
        else:
            file_size_str = f"{size_bytes} Bytes"

        thread = threading.Thread(
            target=_send_file_upload_email,
            args=(user.email, api_key, file_name, file_size_str, ip_address, timestamp),
            daemon=True,
        )
        thread.start()
    except Exception as e:
        logger.error(f"Failed to queue file upload notification for {user.email}: {e}")


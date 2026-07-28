import logging
from datetime import timedelta

from django.utils import timezone

from .models import AuditLog, AuditAlert

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Threshold constants — edit these to tune detection sensitivity
# ---------------------------------------------------------------------------
FAILED_LOGIN_WINDOW_MINUTES = 15
FAILED_LOGIN_THRESHOLD = 5          # >= 5 failed_login for this user within the window -> high

DISTINCT_IP_WINDOW_HOURS = 24
DISTINCT_IP_THRESHOLD = 3           # >= 3 distinct IPs on successful logins within the window -> medium

FAILED_DECRYPT_WINDOW_MINUTES = 15
FAILED_DECRYPT_THRESHOLD = 3        # >= 3 failed file_decrypted attempts within the window -> high

BULK_DOWNLOAD_WINDOW_MINUTES = 5
BULK_DOWNLOAD_THRESHOLD = 5         # >= 5 successful file_decrypted (downloads) within the window -> medium


# ---------------------------------------------------------------------------
# Individual rule checks
# ---------------------------------------------------------------------------

def check_failed_logins(user):
    cutoff = timezone.now() - timedelta(minutes=FAILED_LOGIN_WINDOW_MINUTES)
    count = AuditLog.objects.filter(
        user=user,
        action='failed_login',
        timestamp__gte=cutoff,
    ).count()
    if count >= FAILED_LOGIN_THRESHOLD:
        return (
            'Repeated failed login attempts',
            f'{count} failed login attempts detected within the last {FAILED_LOGIN_WINDOW_MINUTES} minutes.',
            'high',
        )
    return None


def check_distinct_ips(user):
    cutoff = timezone.now() - timedelta(hours=DISTINCT_IP_WINDOW_HOURS)
    distinct_ips = AuditLog.objects.filter(
        user=user,
        action='login',
        status='success',
        timestamp__gte=cutoff,
    ).values('ip_address').distinct().count()
    if distinct_ips >= DISTINCT_IP_THRESHOLD:
        return (
            'Login from multiple locations',
            f'Successful logins from {distinct_ips} distinct IP addresses within the last {DISTINCT_IP_WINDOW_HOURS} hours.',
            'medium',
        )
    return None


def check_failed_decryptions(user):
    cutoff = timezone.now() - timedelta(minutes=FAILED_DECRYPT_WINDOW_MINUTES)
    count = AuditLog.objects.filter(
        user=user,
        action='file_decrypted',
        status='failed',
        timestamp__gte=cutoff,
    ).count()
    if count >= FAILED_DECRYPT_THRESHOLD:
        return (
            'Repeated failed decryption attempts',
            f'{count} failed decryption attempts detected within the last {FAILED_DECRYPT_WINDOW_MINUTES} minutes.',
            'high',
        )
    return None


def check_bulk_downloads(user):
    cutoff = timezone.now() - timedelta(minutes=BULK_DOWNLOAD_WINDOW_MINUTES)
    count = AuditLog.objects.filter(
        user=user,
        action='file_decrypted',
        status='success',
        timestamp__gte=cutoff,
    ).count()
    if count >= BULK_DOWNLOAD_THRESHOLD:
        return (
            'Unusual volume of file downloads',
            f'{count} file downloads detected within the last {BULK_DOWNLOAD_WINDOW_MINUTES} minutes.',
            'medium',
        )
    return None


# ---------------------------------------------------------------------------
# Rule engine — runs all checks, dedupes, and takes containment actions
# ---------------------------------------------------------------------------

# Map rule functions to their window durations for dedup queries
_RULE_WINDOWS = {
    check_failed_logins: timedelta(minutes=FAILED_LOGIN_WINDOW_MINUTES),
    check_distinct_ips: timedelta(hours=DISTINCT_IP_WINDOW_HOURS),
    check_failed_decryptions: timedelta(minutes=FAILED_DECRYPT_WINDOW_MINUTES),
    check_bulk_downloads: timedelta(minutes=BULK_DOWNLOAD_WINDOW_MINUTES),
}

ALL_RULES = [
    check_failed_logins,
    check_distinct_ips,
    check_failed_decryptions,
    check_bulk_downloads,
]


def _blacklist_user_tokens(user):
    """Blacklist all outstanding JWT refresh tokens for this user."""
    try:
        from rest_framework_simplejwt.token_blacklist.models import (
            OutstandingToken,
            BlacklistedToken,
        )
        outstanding = OutstandingToken.objects.filter(user=user)
        for token in outstanding:
            BlacklistedToken.objects.get_or_create(token=token)
    except Exception:
        logger.exception('Failed to blacklist tokens for user %s', user)


def evaluate_rules(user):
    """
    Run all detection rules for the given user.

    Creates AuditAlert rows when thresholds are crossed (with dedup).
    Blacklists JWT tokens on high-severity alerts.
    Defensive: never raises — one failing rule doesn't stop the others.
    """
    for rule_fn in ALL_RULES:
        try:
            result = rule_fn(user)
            if result is None:
                continue

            title, description, severity = result
            window = _RULE_WINDOWS[rule_fn]
            window_start = timezone.now() - window

            # Dedupe: skip if an unresolved alert with the same title
            # for this user already exists within the rule's window
            existing = AuditAlert.objects.filter(
                user=user,
                title=title,
                resolved=False,
                created_at__gte=window_start,
            ).exists()
            if existing:
                continue

            AuditAlert.objects.create(
                user=user,
                title=title,
                description=description,
                severity=severity,
            )

            # Containment: blacklist tokens on high-severity alerts
            if severity == 'high':
                _blacklist_user_tokens(user)

        except Exception:
            logger.exception('Rule %s failed for user %s', rule_fn.__name__, user)

from encryption.models import EncryptedAsset
from audit.models import AuditAlert
from .models import PrivacySettings


def calculate_score(user):
    """
    Calculate a privacy/security score for the user (0-100).

    Positive signals sum to 100 in the ideal case.
    Deductions for unresolved high/medium severity alerts.
    """
    ps, _ = PrivacySettings.objects.get_or_create(user=user)

    score = 0

    # Privacy toggle points
    if ps.tracking_protection:
        score += 10
    if not ps.data_sharing:
        score += 15
    if ps.ad_blocking:
        score += 5
    if ps.cookie_control:
        score += 10
    if ps.location_masking:
        score += 10
    if ps.fingerprint_defense:
        score += 10

    # 2FA
    if user.is_2fa_enabled:
        score += 20

    # Has at least one encrypted asset
    if EncryptedAsset.objects.filter(owner=user).exists():
        score += 10

    # No unresolved alerts
    unresolved_alerts = AuditAlert.objects.filter(user=user, resolved=False)
    if not unresolved_alerts.exists():
        score += 10
    else:
        # Deductions for unresolved high/medium alerts
        high_count = unresolved_alerts.filter(severity='high').count()
        medium_count = unresolved_alerts.filter(severity='medium').count()
        score -= high_count * 10
        score -= medium_count * 5

    # Clamp to [0, 100]
    return max(0, min(100, score))

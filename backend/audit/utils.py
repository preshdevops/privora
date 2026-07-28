from .models import AuditLog
from .rules import evaluate_rules

def get_client_ip(request):
    if not request or not hasattr(request, 'META'):
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')

def log_action(user, action, request=None, data_item='', status='success', metadata=None):
    if user and user.is_anonymous:
        user = None
    
    ip_address = get_client_ip(request)
    if metadata is None:
        metadata = {}

    log_entry = AuditLog.objects.create(
        user=user,
        action=action,
        ip_address=ip_address,
        data_item=data_item,
        status=status,
        metadata=metadata
    )

    if user is not None:
        evaluate_rules(user)

    return log_entry


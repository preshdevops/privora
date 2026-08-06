from .models import AuditLog
from .rules import evaluate_rules

def get_client_ip(request):
    if not request or not hasattr(request, 'META'):
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')

def parse_user_agent(ua_string):
    if not ua_string:
        return {'browser': 'Unknown Browser', 'os': 'Unknown OS', 'device': 'Desktop'}

    ua = ua_string.lower()

    # Device
    if 'ipad' in ua or 'tablet' in ua:
        device = 'Tablet'
    elif 'mobile' in ua or 'iphone' in ua or 'android' in ua:
        device = 'Mobile'
    else:
        device = 'Desktop'

    # OS
    if 'windows' in ua:
        os_name = 'Windows'
    elif 'macintosh' in ua or 'mac os' in ua or 'mac' in ua:
        os_name = 'macOS'
    elif 'android' in ua:
        os_name = 'Android'
    elif 'iphone' in ua or 'ipad' in ua or 'cpu os' in ua:
        os_name = 'iOS'
    elif 'linux' in ua:
        os_name = 'Linux'
    elif 'cros' in ua:
        os_name = 'Chrome OS'
    else:
        os_name = 'OS System'

    # Browser
    if 'edg' in ua or 'edge' in ua:
        browser = 'Microsoft Edge'
    elif 'chrome' in ua and 'chromium' not in ua:
        browser = 'Google Chrome'
    elif 'safari' in ua and 'chrome' not in ua:
        browser = 'Apple Safari'
    elif 'firefox' in ua:
        browser = 'Mozilla Firefox'
    elif 'opera' in ua or 'opr' in ua:
        browser = 'Opera'
    elif 'postman' in ua:
        browser = 'Postman Client'
    else:
        browser = 'Web Browser'

    return {'browser': browser, 'os': os_name, 'device': device}


def determine_category_and_severity(action, status):
    act = (action or '').lower()
    stat = (status or '').lower()

    if any(k in act for k in ['login', 'register', 'logout', 'token', 'auth']):
        category = 'Authentication'
    elif any(k in act for k in ['file', 'encrypt', 'asset', 'decrypt', 'unseal', 'download']):
        category = 'Vault Access'
    elif any(k in act for k in ['privacy', 'setting', 'password', 'delete_account']):
        category = 'Security Settings'
    else:
        category = 'System Event'

    if stat == 'failed' or 'failed' in act or 'alert' in act or 'threat' in act:
        severity = 'high'
    elif any(k in act for k in ['delete', 'password', 'change', 'purge']):
        severity = 'medium'
    else:
        severity = 'info'

    return category, severity


def log_action(user, action, request=None, data_item='', status='success', metadata=None):
    if user and user.is_anonymous:
        user = None

    ip_address = get_client_ip(request)
    if metadata is None:
        metadata = {}

    if request and hasattr(request, 'META'):
        ua_str = request.META.get('HTTP_USER_AGENT', '')
        ua_info = parse_user_agent(ua_str)
        metadata.setdefault('browser', ua_info['browser'])
        metadata.setdefault('os', ua_info['os'])
        metadata.setdefault('device', ua_info['device'])
        metadata.setdefault('user_agent', ua_str)
        metadata.setdefault('method', getattr(request, 'method', ''))

    category, severity = determine_category_and_severity(action, status)
    metadata.setdefault('category', category)
    metadata.setdefault('severity', severity)

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



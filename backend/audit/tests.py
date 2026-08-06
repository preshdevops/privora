from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from audit.models import AuditLog, AuditAlert
from audit.utils import log_action

User = get_user_model()

class AuditUtilsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com",
            full_name="Test User",
            password="testpassword123"
        )

    def test_log_action_creates_log(self):
        log = log_action(
            user=self.user,
            action="key_rotation",
            data_item="api_key_1",
            status="success",
            metadata={"source": "test"}
        )
        self.assertEqual(AuditLog.objects.count(), 1)
        self.assertEqual(log.user, self.user)
        self.assertEqual(log.action, "key_rotation")
        self.assertEqual(log.data_item, "api_key_1")
        self.assertEqual(log.status, "success")
        self.assertEqual(log.metadata.get('source'), "test")



class AuditAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="user1@example.com",
            full_name="User One",
            password="password123"
        )
        self.other_user = User.objects.create_user(
            email="user2@example.com",
            full_name="User Two",
            password="password123"
        )
        # Obtain tokens / authenticate
        self.client.force_authenticate(user=self.user)

    def test_login_creates_log_and_alert_auto_seed(self):
        self.client.logout()  # Clear auth for login post
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'user1@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)

        # Check audit log was created
        login_log = AuditLog.objects.filter(user=self.user, action='login').first()
        self.assertIsNotNone(login_log)
        self.assertEqual(login_log.status, 'success')

        # Check alert was auto-seeded
        alert = AuditAlert.objects.filter(user=self.user).first()
        self.assertIsNotNone(alert)
        self.assertEqual(alert.severity, 'low')
        self.assertEqual(alert.title, 'New login detected')
        self.assertIn('IP', alert.description)

    def test_failed_login_creates_log(self):
        self.client.logout()
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'user1@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)

        # Check failed login log was created for user
        failed_log = AuditLog.objects.filter(user=self.user, action='failed_login').first()
        self.assertIsNotNone(failed_log)
        self.assertEqual(failed_log.status, 'failed')

    def test_failed_login_nonexistent_user_creates_log(self):
        self.client.logout()
        login_url = reverse('login')
        response = self.client.post(login_url, {
            'email': 'nonexistent@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 401)

        # Check failed login log was created with user = None
        failed_log = AuditLog.objects.filter(user=None, action='failed_login').first()
        self.assertIsNotNone(failed_log)
        self.assertEqual(failed_log.status, 'failed')

    def test_logout_creates_log(self):
        logout_url = reverse('logout')
        response = self.client.post(logout_url, {
            'refresh': 'invalid_token_but_we_still_attempt'
        })
        # Invalid token yields 400, but we test logging.
        self.assertEqual(response.status_code, 400)
        
        # Check failed logout log
        logout_log = AuditLog.objects.filter(user=self.user, action='logout').first()
        self.assertIsNotNone(logout_log)
        self.assertEqual(logout_log.status, 'failed')

    def test_get_logs_endpoint_format(self):
        # Create a few logs
        for i in range(10):
            log_action(user=self.user, action=f"action_{i}", status="success")
        
        # Create one log for the other user to verify filtering
        log_action(user=self.other_user, action="other_action", status="success")

        url = reverse('audit-logs')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
        # Verify response shape: { count: N, results: [...] }
        data = response.json()
        self.assertIn('count', data)
        self.assertIn('results', data)
        self.assertEqual(data['count'], 10)
        self.assertEqual(len(data['results']), 10)
        
        # Check sorting (most recent first)
        results = data['results']
        self.assertEqual(results[0]['action'], 'action_9')

    def test_get_logs_endpoint_limit_param(self):
        for i in range(10):
            log_action(user=self.user, action=f"action_{i}", status="success")
        
        url = reverse('audit-logs')
        response = self.client.get(f"{url}?limit=3")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 10)
        self.assertEqual(len(data['results']), 3)

    def test_get_alerts_endpoint_format(self):
        # Create alerts
        AuditAlert.objects.create(
            user=self.user,
            title="Alert 1",
            description="Desc 1",
            severity="low"
        )
        AuditAlert.objects.create(
            user=self.user,
            title="Alert 2",
            description="Desc 2",
            severity="high"
        )
        AuditAlert.objects.create(
            user=self.other_user,
            title="Other Alert",
            description="Other Desc",
            severity="medium"
        )

        url = reverse('audit-alerts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
        # Verify response shape is a list/array
        data = response.json()
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 2)
        # Ordered by -created_at
        self.assertEqual(data[0]['title'], 'Alert 2')

    def test_resolve_alert_success(self):
        alert = AuditAlert.objects.create(
            user=self.user,
            title="Alert to resolve",
            description="Desc",
            severity="medium"
        )
        self.assertFalse(alert.resolved)

        url = reverse('audit-alert-resolve', kwargs={'pk': alert.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)
        
        alert.refresh_from_db()
        self.assertTrue(alert.resolved)
        self.assertEqual(response.json()['resolved'], True)

    def test_resolve_alert_forbidden_for_non_owner(self):
        alert = AuditAlert.objects.create(
            user=self.other_user,
            title="Other's alert",
            description="Desc",
            severity="medium"
        )

        url = reverse('audit-alert-resolve', kwargs={'pk': alert.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 403)
        
        alert.refresh_from_db()
        self.assertFalse(alert.resolved)


# ---------------------------------------------------------------------------
# Rule-based detection tests
# ---------------------------------------------------------------------------

from audit.rules import evaluate_rules


class AuditRulesTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ruleuser@example.com",
            full_name="Rule User",
            password="testpassword123"
        )

    def test_failed_login_threshold_creates_alert(self):
        """5 failed_login entries within 15 minutes -> one high alert."""
        for _ in range(5):
            log_action(user=self.user, action='failed_login', status='failed')

        alerts = AuditAlert.objects.filter(
            user=self.user,
            title='Repeated failed login attempts',
            resolved=False,
        )
        self.assertEqual(alerts.count(), 1)
        self.assertEqual(alerts.first().severity, 'high')

    def test_failed_login_dedupe(self):
        """A 6th failed login in the same window does NOT create a second alert."""
        for _ in range(5):
            log_action(user=self.user, action='failed_login', status='failed')

        alerts_after_5 = AuditAlert.objects.filter(
            user=self.user,
            title='Repeated failed login attempts',
            resolved=False,
        ).count()
        self.assertEqual(alerts_after_5, 1)

        # 6th failed login
        log_action(user=self.user, action='failed_login', status='failed')

        alerts_after_6 = AuditAlert.objects.filter(
            user=self.user,
            title='Repeated failed login attempts',
            resolved=False,
        ).count()
        self.assertEqual(alerts_after_6, 1)  # still just one

    def test_distinct_ips_creates_medium_alert(self):
        """3 distinct-IP successful logins within 24 hours -> medium alert."""
        for i, ip in enumerate(['1.1.1.1', '2.2.2.2', '3.3.3.3']):
            AuditLog.objects.create(
                user=self.user,
                action='login',
                status='success',
                ip_address=ip,
            )
        # Trigger rule evaluation
        evaluate_rules(self.user)

        alerts = AuditAlert.objects.filter(
            user=self.user,
            title='Login from multiple locations',
            resolved=False,
        )
        self.assertEqual(alerts.count(), 1)
        self.assertEqual(alerts.first().severity, 'medium')

    def test_failed_decryptions_creates_high_alert_and_blacklists_tokens(self):
        """3 failed file_decrypted attempts -> high alert + token blacklisting."""
        from rest_framework_simplejwt.token_blacklist.models import (
            OutstandingToken,
            BlacklistedToken,
        )
        # Create an outstanding token for the user
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.user)
        outstanding_count = OutstandingToken.objects.filter(user=self.user).count()
        self.assertGreaterEqual(outstanding_count, 1)

        # Log 3 failed decryption attempts
        for _ in range(3):
            log_action(
                user=self.user,
                action='file_decrypted',
                status='failed',
            )

        alerts = AuditAlert.objects.filter(
            user=self.user,
            title='Repeated failed decryption attempts',
            resolved=False,
        )
        self.assertEqual(alerts.count(), 1)
        self.assertEqual(alerts.first().severity, 'high')

        # Verify tokens were blacklisted
        blacklisted_count = BlacklistedToken.objects.filter(
            token__user=self.user,
        ).count()
        self.assertEqual(blacklisted_count, outstanding_count)

    def test_bulk_downloads_creates_medium_alert(self):
        """5 successful file_decrypted actions within 5 minutes -> medium alert."""
        for _ in range(5):
            log_action(
                user=self.user,
                action='file_decrypted',
                status='success',
            )

        alerts = AuditAlert.objects.filter(
            user=self.user,
            title='Unusual volume of file downloads',
            resolved=False,
        )
        self.assertEqual(alerts.count(), 1)
        self.assertEqual(alerts.first().severity, 'medium')

    def test_below_threshold_no_alerts(self):
        """Actions below every threshold should create no rule-based alerts."""
        # 2 failed logins (threshold is 5)
        for _ in range(2):
            log_action(user=self.user, action='failed_login', status='failed')

        # 1 failed decrypt (threshold is 3)
        log_action(user=self.user, action='file_decrypted', status='failed')

        # 2 successful downloads (threshold is 5)
        for _ in range(2):
            log_action(user=self.user, action='file_decrypted', status='success')

        # No rule-based alerts should exist (filter out any pre-existing ones)
        rule_titles = [
            'Repeated failed login attempts',
            'Login from multiple locations',
            'Repeated failed decryption attempts',
            'Unusual volume of file downloads',
        ]
        rule_alerts = AuditAlert.objects.filter(
            user=self.user,
            title__in=rule_titles,
        ).count()
        self.assertEqual(rule_alerts, 0)

    def test_evaluate_rules_no_logs_does_not_raise(self):
        """evaluate_rules on a fresh user with zero logs should not raise."""
        fresh_user = User.objects.create_user(
            email="fresh@example.com",
            full_name="Fresh User",
            password="testpassword123"
        )
        # Should complete without raising
        evaluate_rules(fresh_user)
        # No rule-based alerts
        rule_titles = [
            'Repeated failed login attempts',
            'Login from multiple locations',
            'Repeated failed decryption attempts',
            'Unusual volume of file downloads',
        ]
        rule_alerts = AuditAlert.objects.filter(
            user=fresh_user,
            title__in=rule_titles,
        ).count()
        self.assertEqual(rule_alerts, 0)


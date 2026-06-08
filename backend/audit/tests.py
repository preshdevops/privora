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
        self.assertEqual(log.metadata, {"source": "test"})


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

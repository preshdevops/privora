from django.test import TestCase
from rest_framework.test import APIClient
from django.core import mail
from unittest.mock import patch
from users.models import User, UserSettings

class LoginNotificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.email = 'testuser@example.com'
        self.password = 'testpassword123'
        self.user = User.objects.create_user(
            email=self.email,
            full_name='Test User',
            password=self.password
        )

    def test_successful_login_sends_email_when_opted_in(self):
        # By default, login_notifications is True
        response = self.client.post('/api/users/login/', {
            'email': self.email,
            'password': self.password
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        
        email = mail.outbox[0]
        self.assertIn('New login', email.subject)
        self.assertEqual(email.to, [self.email])
        
    def test_successful_login_no_email_when_opted_out(self):
        # Opt out
        settings, _ = UserSettings.objects.get_or_create(user=self.user)
        settings.login_notifications = False
        settings.save()

        response = self.client.post('/api/users/login/', {
            'email': self.email,
            'password': self.password
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)

    def test_failed_login_sends_no_email(self):
        response = self.client.post('/api/users/login/', {
            'email': self.email,
            'password': 'wrongpassword'
        })

        self.assertEqual(response.status_code, 401)
        self.assertEqual(len(mail.outbox), 0)

    @patch('users.notifications.send_mail')
    def test_failed_email_does_not_break_login(self, mock_send_mail):
        mock_send_mail.side_effect = Exception("SMTP Connection Error")

        response = self.client.post('/api/users/login/', {
            'email': self.email,
            'password': self.password
        })

        # Endpoint still returns 200
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())

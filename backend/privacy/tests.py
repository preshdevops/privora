import os
import shutil

from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from privacy.models import PrivacySettings
from privacy.scoring import calculate_score
from encryption.models import EncryptedAsset
from audit.models import AuditAlert

User = get_user_model()

TEST_MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_media')


class PrivacySettingsAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            full_name='Test User',
            password='testpassword123',
        )
        self.client.force_authenticate(user=self.user)

    def test_get_creates_default_settings(self):
        """First GET should create PrivacySettings with defaults."""
        self.assertFalse(PrivacySettings.objects.filter(user=self.user).exists())

        response = self.client.get('/api/privacy/settings/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertTrue(data['tracking_protection'])
        self.assertFalse(data['data_sharing'])
        self.assertTrue(data['ad_blocking'])
        self.assertTrue(data['cookie_control'])
        self.assertFalse(data['location_masking'])
        self.assertTrue(data['fingerprint_defense'])

        # Should not expose user or updated_at
        self.assertNotIn('user', data)
        self.assertNotIn('updated_at', data)

        # Row was created
        self.assertTrue(PrivacySettings.objects.filter(user=self.user).exists())

    def test_patch_persists_and_reflects_in_get(self):
        """PATCH a single toggle, then GET should reflect the change."""
        # First GET to create defaults
        self.client.get('/api/privacy/settings/')

        # PATCH tracking_protection to False
        response = self.client.patch(
            '/api/privacy/settings/',
            {'tracking_protection': False},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()['tracking_protection'])

        # GET should reflect the change
        response = self.client.get('/api/privacy/settings/')
        self.assertFalse(response.json()['tracking_protection'])

        # Other fields unchanged
        self.assertTrue(response.json()['ad_blocking'])

    def test_patch_multiple_fields(self):
        """PATCH multiple toggles at once."""
        self.client.get('/api/privacy/settings/')

        response = self.client.patch(
            '/api/privacy/settings/',
            {'data_sharing': True, 'location_masking': True},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['data_sharing'])
        self.assertTrue(response.json()['location_masking'])


class PrivacyScoreAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            full_name='Test User',
            password='testpassword123',
        )
        self.client.force_authenticate(user=self.user)

    def test_score_endpoint_returns_score(self):
        response = self.client.get('/api/privacy/score/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('score', data)
        self.assertIsInstance(data['score'], int)
        self.assertGreaterEqual(data['score'], 0)
        self.assertLessEqual(data['score'], 100)


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class CalculateScoreTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='scoreuser@example.com',
            full_name='Score User',
            password='testpassword123',
        )

    def tearDown(self):
        if os.path.exists(TEST_MEDIA_ROOT):
            shutil.rmtree(TEST_MEDIA_ROOT)

    def test_default_score(self):
        """Default privacy settings + no 2FA + no assets + no alerts."""
        # Defaults: tracking=T(10), sharing=F(15), adblock=T(5), cookie=T(10),
        #           location=F(0), fingerprint=T(10), 2FA=F(0), assets=no(0), alerts=none(10)
        score = calculate_score(self.user)
        self.assertEqual(score, 60)

    def test_2fa_increases_score(self):
        """Enabling 2FA should add 20 points."""
        base_score = calculate_score(self.user)
        self.user.is_2fa_enabled = True
        self.user.save()
        new_score = calculate_score(self.user)
        self.assertEqual(new_score, base_score + 20)

    def test_encrypted_asset_increases_score(self):
        """Having at least one encrypted asset adds 10 points."""
        base_score = calculate_score(self.user)
        EncryptedAsset.objects.create(
            user=self.user,
            name='test.txt',
            file_size=100,
            storage_path='encrypted/test.enc',
            salt='aa' * 16,
            iv='bb' * 8,
        )
        new_score = calculate_score(self.user)
        self.assertEqual(new_score, base_score + 10)

    def test_disabling_toggle_decreases_score(self):
        """Disabling tracking_protection should drop score by 10."""
        base_score = calculate_score(self.user)
        ps = PrivacySettings.objects.get(user=self.user)
        ps.tracking_protection = False
        ps.save()
        new_score = calculate_score(self.user)
        self.assertEqual(new_score, base_score - 10)

    def test_enabling_data_sharing_decreases_score(self):
        """Enabling data_sharing (the risky state) drops score by 15."""
        base_score = calculate_score(self.user)
        ps = PrivacySettings.objects.get(user=self.user)
        ps.data_sharing = True
        ps.save()
        new_score = calculate_score(self.user)
        self.assertEqual(new_score, base_score - 15)

    def test_high_severity_alert_deducts(self):
        """Unresolved high-severity alert deducts 10 + removes 'no alerts' bonus."""
        base_score = calculate_score(self.user)
        AuditAlert.objects.create(
            user=self.user,
            title='Critical alert',
            description='Something bad',
            severity='high',
            resolved=False,
        )
        new_score = calculate_score(self.user)
        # Lost 10 (no-unresolved bonus) and -10 (high deduction) = -20 total
        self.assertEqual(new_score, base_score - 20)

    def test_medium_severity_alert_deducts(self):
        """Unresolved medium-severity alert deducts 5 + removes 'no alerts' bonus."""
        base_score = calculate_score(self.user)
        AuditAlert.objects.create(
            user=self.user,
            title='Medium alert',
            description='Something',
            severity='medium',
            resolved=False,
        )
        new_score = calculate_score(self.user)
        # Lost 10 (no-unresolved bonus) and -5 (medium deduction) = -15 total
        self.assertEqual(new_score, base_score - 15)

    def test_resolved_alert_no_deduction(self):
        """Resolved alerts should not cause any deduction."""
        base_score = calculate_score(self.user)
        AuditAlert.objects.create(
            user=self.user,
            title='Resolved alert',
            description='Fixed',
            severity='high',
            resolved=True,
        )
        new_score = calculate_score(self.user)
        self.assertEqual(new_score, base_score)

    def test_score_clamped_at_zero(self):
        """Score should never go below 0 even with many deductions."""
        ps, _ = PrivacySettings.objects.get_or_create(user=self.user)
        ps.tracking_protection = False
        ps.data_sharing = True
        ps.ad_blocking = False
        ps.cookie_control = False
        ps.fingerprint_defense = False
        ps.save()

        # Add multiple high-severity unresolved alerts
        for i in range(10):
            AuditAlert.objects.create(
                user=self.user,
                title=f'Alert {i}',
                description='Bad',
                severity='high',
                resolved=False,
            )
        score = calculate_score(self.user)
        self.assertEqual(score, 0)

    def test_perfect_score(self):
        """All toggles optimal + 2FA + asset + no alerts = 100."""
        ps, _ = PrivacySettings.objects.get_or_create(user=self.user)
        ps.location_masking = True
        ps.save()

        self.user.is_2fa_enabled = True
        self.user.save()

        EncryptedAsset.objects.create(
            user=self.user,
            name='test.txt',
            file_size=100,
            storage_path='encrypted/test.enc',
            salt='aa' * 16,
            iv='bb' * 8,
        )

        score = calculate_score(self.user)
        self.assertEqual(score, 100)


class RegisterCreatesPrivacySettingsTestCase(APITestCase):
    def test_register_creates_privacy_settings(self):
        """Registering a new user should create PrivacySettings with defaults."""
        response = self.client.post('/api/users/register/', {
            'email': 'newuser@example.com',
            'full_name': 'New User',
            'password': 'StrongP@ss123!',
            'password2': 'StrongP@ss123!',
        })
        self.assertEqual(response.status_code, 201)

        user = User.objects.get(email='newuser@example.com')
        self.assertTrue(PrivacySettings.objects.filter(user=user).exists())
        ps = PrivacySettings.objects.get(user=user)
        self.assertTrue(ps.tracking_protection)
        self.assertFalse(ps.data_sharing)

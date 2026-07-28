import os
import shutil

from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from encryption.models import EncryptedAsset
from encryption.crypto import encrypt_file, decrypt_file, DecryptionError

User = get_user_model()

TEST_MEDIA_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'test_media')


class CryptoTestCase(TestCase):
    def test_encrypt_decrypt_roundtrip(self):
        plaintext = b'Hello, Privora! This is secret data.'
        password = 'strong-password-123'

        ciphertext, salt_hex, iv_hex = encrypt_file(plaintext, password)

        self.assertNotEqual(ciphertext, plaintext)
        self.assertEqual(len(bytes.fromhex(salt_hex)), 16)
        self.assertEqual(len(bytes.fromhex(iv_hex)), 16)

        result = decrypt_file(ciphertext, password, salt_hex, iv_hex)
        self.assertEqual(result, plaintext)

    def test_decrypt_wrong_password_raises(self):
        plaintext = b'Secret data'
        ciphertext, salt_hex, iv_hex = encrypt_file(plaintext, 'correct-password')

        with self.assertRaises(DecryptionError):
            decrypt_file(ciphertext, 'wrong-password', salt_hex, iv_hex)


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class EncryptionAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            full_name='Test User',
            password='testpassword123',
        )
        self.other_user = User.objects.create_user(
            email='otheruser@example.com',
            full_name='Other User',
            password='testpassword123',
        )
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        if os.path.exists(TEST_MEDIA_ROOT):
            shutil.rmtree(TEST_MEDIA_ROOT)

    def _upload_file(self, content=b'test file content', filename='test.txt', password='mypassword'):
        from io import BytesIO
        from django.core.files.uploadedfile import SimpleUploadedFile

        uploaded = SimpleUploadedFile(filename, content, content_type='application/octet-stream')
        return self.client.post('/api/encryption/upload/', {
            'file': uploaded,
            'password': password,
        }, format='multipart')

    def test_upload_creates_asset(self):
        response = self._upload_file()
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['name'], 'test.txt')
        self.assertEqual(data['file_size'], len(b'test file content'))
        self.assertIn('id', data)
        self.assertIn('created_at', data)
        # salt, iv, storage_path must NOT be exposed
        self.assertNotIn('salt', data)
        self.assertNotIn('iv', data)
        self.assertNotIn('storage_path', data)

    def test_upload_missing_file_returns_400(self):
        response = self.client.post('/api/encryption/upload/', {
            'password': 'mypassword',
        }, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_upload_missing_password_returns_400(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        uploaded = SimpleUploadedFile('test.txt', b'content', content_type='application/octet-stream')
        response = self.client.post('/api/encryption/upload/', {
            'file': uploaded,
        }, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_list_shows_uploaded_asset(self):
        self._upload_file()
        response = self.client.get('/api/encryption/assets/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(isinstance(data, list))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'test.txt')

    def test_list_only_shows_own_assets(self):
        self._upload_file()
        # Switch to other user
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get('/api/encryption/assets/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 0)

    def test_retrieve_correct_password_returns_original_bytes(self):
        original_content = b'This is the original plaintext content for testing.'
        upload_resp = self._upload_file(content=original_content, password='correct-pw')
        asset_id = upload_resp.json()['id']

        response = self.client.post(
            f'/api/encryption/assets/{asset_id}/retrieve/',
            {'password': 'correct-pw'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, original_content)
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertIn('test.txt', response['Content-Disposition'])

    def test_retrieve_wrong_password_returns_403(self):
        upload_resp = self._upload_file(password='correct-pw')
        asset_id = upload_resp.json()['id']

        response = self.client.post(
            f'/api/encryption/assets/{asset_id}/retrieve/',
            {'password': 'wrong-pw'},
            format='json',
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()['detail'], 'Incorrect password.')

    def test_retrieve_other_users_asset_returns_403(self):
        upload_resp = self._upload_file(password='pw')
        asset_id = upload_resp.json()['id']

        self.client.force_authenticate(user=self.other_user)
        response = self.client.post(
            f'/api/encryption/assets/{asset_id}/retrieve/',
            {'password': 'pw'},
            format='json',
        )
        self.assertEqual(response.status_code, 403)

    def test_delete_removes_from_list_and_disk(self):
        upload_resp = self._upload_file()
        asset_id = upload_resp.json()['id']

        # Verify file exists on disk
        asset = EncryptedAsset.objects.get(pk=asset_id)
        full_path = os.path.join(TEST_MEDIA_ROOT, asset.storage_path)
        self.assertTrue(os.path.exists(full_path))

        # Delete
        response = self.client.delete(f'/api/encryption/assets/{asset_id}/')
        self.assertEqual(response.status_code, 204)

        # Verify removed from DB
        list_resp = self.client.get('/api/encryption/assets/')
        self.assertEqual(len(list_resp.json()), 0)

        # Verify removed from disk
        self.assertFalse(os.path.exists(full_path))

    def test_delete_other_users_asset_returns_403(self):
        upload_resp = self._upload_file()
        asset_id = upload_resp.json()['id']

        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(f'/api/encryption/assets/{asset_id}/')
        self.assertEqual(response.status_code, 403)

    def test_delete_nonexistent_asset_returns_404(self):
        import uuid
        response = self.client.delete(f'/api/encryption/assets/{uuid.uuid4()}/')
        self.assertEqual(response.status_code, 404)

    def test_full_lifecycle(self):
        """Upload -> list shows it -> retrieve returns original -> delete removes it."""
        original = b'lifecycle test data with special chars: \x00\xff\x80'

        # Upload
        upload_resp = self._upload_file(content=original, filename='lifecycle.bin', password='lifecycle-pw')
        self.assertEqual(upload_resp.status_code, 201)
        asset_id = upload_resp.json()['id']

        # List
        list_resp = self.client.get('/api/encryption/assets/')
        self.assertEqual(len(list_resp.json()), 1)
        self.assertEqual(list_resp.json()[0]['id'], asset_id)

        # Retrieve with correct password
        retrieve_resp = self.client.post(
            f'/api/encryption/assets/{asset_id}/retrieve/',
            {'password': 'lifecycle-pw'},
            format='json',
        )
        self.assertEqual(retrieve_resp.status_code, 200)
        self.assertEqual(retrieve_resp.content, original)

        # Retrieve with wrong password
        bad_resp = self.client.post(
            f'/api/encryption/assets/{asset_id}/retrieve/',
            {'password': 'wrong'},
            format='json',
        )
        self.assertEqual(bad_resp.status_code, 403)

        # Delete
        del_resp = self.client.delete(f'/api/encryption/assets/{asset_id}/')
        self.assertEqual(del_resp.status_code, 204)

        # List is empty
        list_resp = self.client.get('/api/encryption/assets/')
        self.assertEqual(len(list_resp.json()), 0)

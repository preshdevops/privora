import os
import hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


class DecryptionError(Exception):
    """Raised when decryption fails due to wrong password or corrupted data."""
    pass


def encrypt_file(plaintext_bytes, password):
    """
    Encrypt plaintext bytes using AES-256-CBC with PBKDF2 key derivation.

    Returns (ciphertext_bytes, salt_hex, iv_hex).
    """
    salt = os.urandom(16)
    iv = os.urandom(16)

    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        600_000,
        dklen=32,
    )

    cipher = AES.new(key, AES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(pad(plaintext_bytes, AES.block_size))

    return ciphertext, salt.hex(), iv.hex()


def decrypt_file(ciphertext_bytes, password, salt_hex, iv_hex):
    """
    Decrypt ciphertext bytes using AES-256-CBC with PBKDF2 key derivation.

    Raises DecryptionError on wrong password / bad padding.
    """
    salt = bytes.fromhex(salt_hex)
    iv = bytes.fromhex(iv_hex)

    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        600_000,
        dklen=32,
    )

    try:
        cipher = AES.new(key, AES.MODE_CBC, iv)
        plaintext = unpad(cipher.decrypt(ciphertext_bytes), AES.block_size)
    except (ValueError, KeyError):
        raise DecryptionError('Decryption failed. Wrong password or corrupted data.')

    return plaintext

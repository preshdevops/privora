/**
 * WebCrypto Zero-Knowledge Client-Side Cryptography Engine
 * AES-256-GCM + PBKDF2 Key Derivation (600,000 Iterations)
 */

export function arrayBufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Derives a 256-bit AES-GCM key from a passphrase and salt using PBKDF2.
 */
async function deriveKey(passphrase, saltBytes, iterations = 600000) {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts an ArrayBuffer client-side with AES-256-GCM.
 * Returns { ciphertextBlob, saltHex, ivHex }
 */
export async function encryptFileWebCrypto(file, passphrase) {
  const fileArrayBuffer = await file.arrayBuffer();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const aesKey = await deriveKey(passphrase, salt);

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    aesKey,
    fileArrayBuffer
  );

  const ciphertextBlob = new Blob([encryptedContent], { type: 'application/octet-stream' });
  const saltHex = arrayBufferToHex(salt);
  const ivHex = arrayBufferToHex(iv);

  return {
    ciphertextBlob,
    saltHex,
    ivHex,
  };
}

/**
 * Decrypts an ArrayBuffer client-side with AES-256-GCM.
 * Fallback support for legacy backend files.
 */
export async function decryptFileWebCrypto(encryptedArrayBuffer, passphrase, saltHex, ivHex) {
  const salt = new Uint8Array(hexToArrayBuffer(saltHex));
  const iv = new Uint8Array(hexToArrayBuffer(ivHex));

  const aesKey = await deriveKey(passphrase, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      encryptedArrayBuffer
    );
    return decryptedBuffer;
  } catch (err) {
    throw new Error('Decryption failed. Incorrect password or corrupted payload.', { cause: err });
  }
}

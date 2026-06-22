// Vault encryption using Web Crypto API (AES-GCM 256-bit)
// Key derived from vault password + userId via PBKDF2
// Nothing here ever touches the server — runs entirely in the browser

const PBKDF2_ITERATIONS = 100000
const KEY_LENGTH = 256

// Derive a CryptoKey from the vault password + userId as salt
export async function deriveKey(vaultPassword: string, userId: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(vaultPassword),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(userId),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

// Encrypt a file buffer — returns encrypted bytes with IV prepended
export async function encryptFile(key: CryptoKey, fileBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for AES-GCM
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    fileBuffer
  )
  // Prepend IV to encrypted data so we can extract it during decryption
  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv, 0)
  result.set(new Uint8Array(encrypted), iv.length)
  return result.buffer
}

// Decrypt a file buffer — extracts IV from first 12 bytes, decrypts the rest
export async function decryptFile(key: CryptoKey, encryptedBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const data = new Uint8Array(encryptedBuffer)
  const iv = data.slice(0, 12)
  const ciphertext = data.slice(12)
  return crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  )
}

// Convert ArrayBuffer to base64 string for storage/transport
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach(b => binary += String.fromCharCode(b))
  return btoa(binary)
}

// Convert base64 string back to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

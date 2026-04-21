import crypto from 'crypto';

const rawKey = process.env.CREDENTIAL_ENCRYPTION_KEY;
if (!rawKey || rawKey.length !== 64) {
  // Don't throw at module load — allow the server to start for non-source features
  // But any encrypt/decrypt call will throw if key is missing
  console.warn('WARNING: CREDENTIAL_ENCRYPTION_KEY not set or invalid. Source credential encryption will fail.');
}
const KEY = rawKey && rawKey.length === 64 ? Buffer.from(rawKey, 'hex') : null;

export function encryptCredential(plaintext) {
  if (!KEY) throw new Error('CREDENTIAL_ENCRYPTION_KEY must be a 64-char hex string. Generate with: openssl rand -hex 32');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptCredential(ciphertext) {
  if (!KEY) throw new Error('CREDENTIAL_ENCRYPTION_KEY must be a 64-char hex string. Cannot decrypt.');
  const data = Buffer.from(ciphertext, 'base64');
  if (data.length < 28) throw new Error('Ciphertext too short');
  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const encrypted = data.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

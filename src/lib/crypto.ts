const STORAGE_KEY = "media_vault_encrypted";
const SESSION_KEY = "media_vault_session_key";

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function generateSalt(): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return bufferToBase64(salt.buffer);
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: base64ToBuffer(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return bufferToBase64(hash);
}

async function deriveKey(pin: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: base64ToBuffer(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptData(
  data: string,
  pin: string,
  salt: string,
): Promise<string> {
  const key = await deriveKey(pin, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data),
  );
  return JSON.stringify({
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(encrypted),
  });
}

export async function decryptData(
  encryptedJson: string,
  pin: string,
  salt: string,
): Promise<string> {
  const { iv, data } = JSON.parse(encryptedJson);
  const key = await deriveKey(pin, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBuffer(iv) },
    key,
    base64ToBuffer(data),
  );
  return new TextDecoder().decode(decrypted);
}

export function saveSessionKey(key: CryptoKey): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "active");
  (window as unknown as { __vaultKey: CryptoKey }).__vaultKey = key;
}

export async function createSessionKey(
  pin: string,
  salt: string,
): Promise<CryptoKey> {
  const key = await deriveKey(pin, salt);
  saveSessionKey(key);
  return key;
}

export function hasActiveSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "active";
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  delete (window as unknown as { __vaultKey?: CryptoKey }).__vaultKey;
}

export async function saveEncrypted(
  data: string,
  pin: string,
  salt: string,
): Promise<void> {
  if (typeof window === "undefined") return;
  const encrypted = await encryptData(data, pin, salt);
  localStorage.setItem(STORAGE_KEY, encrypted);
}

export function loadEncryptedRaw(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export async function loadDecrypted(
  pin: string,
  salt: string,
): Promise<string | null> {
  const raw = loadEncryptedRaw();
  if (!raw) return null;
  return decryptData(raw, pin, salt);
}

export async function verifyPin(
  pin: string,
  salt: string,
  storedHash: string,
): Promise<boolean> {
  const hash = await hashPin(pin, salt);
  return hash === storedHash;
}

export function exportData(data: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `media-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

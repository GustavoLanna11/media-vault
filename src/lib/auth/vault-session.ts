import { SignJWT, jwtVerify } from "jose";
import { VAULT_SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";

function getSecret(): Uint8Array | null {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 32) return null;
  return new TextEncoder().encode(raw);
}

export function isVaultSessionConfigured(): boolean {
  return getSecret() !== null && Boolean(process.env.VAULT_PIN_HASH);
}

export async function signVaultSession(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  return new SignJWT({ v: 1 })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${VAULT_SESSION_MAX_AGE_SEC}s`)
    .sign(secret);
}

export async function verifyVaultSessionToken(
  token: string,
): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

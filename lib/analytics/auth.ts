import "server-only";
import crypto from "node:crypto";

/** Name of the admin session cookie. */
export const SESSION_COOKIE = "teheranro_admin";

/** Deliberately short. When it lapses, the operator signs in again. */
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return value;
}

/**
 * Derives a purpose-specific key from the one configured secret. Signing
 * sessions and salting IPs with the same bytes would mean a leak on either
 * side breaks both, so each use gets its own label.
 */
function derive(label: string) {
  return crypto.createHmac("sha256", secret()).update(label).digest();
}

/** The anonymous stand-in stored instead of a raw IP: stable, but not reversible. */
export function hashIp(ip: string | null) {
  if (!ip) return null;
  return crypto.createHmac("sha256", derive("ip-salt")).update(ip).digest("hex").slice(0, 32);
}

/**
 * Checks a password against a `scrypt$<saltHex>$<hashHex>` value. Both the
 * length check and the byte comparison stay on timing-safe paths.
 */
export function verifyPassword(password: string, stored: string | undefined) {
  if (typeof stored !== "string") return false;
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  let actual: Buffer;
  try {
    actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length, { N: 16384, r: 8, p: 1 });
  } catch {
    return false;
  }
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/** Compares values of differing length without leaking that length through timing. */
export function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

const b64url = (s: string) => Buffer.from(s).toString("base64url");

/**
 * A signed session token. The expiry travels inside the token and is sealed
 * with an HMAC, so no server-side session store is needed.
 */
export function signSession(username: string) {
  const payload = b64url(JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS }));
  const mac = crypto.createHmac("sha256", derive("session")).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifySession(token: string | undefined): { u: string; exp: number } | null {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [payload, mac] = token.split(".");

  const expected = crypto.createHmac("sha256", derive("session")).update(payload).digest("base64url");
  const a = Buffer.from(mac ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

/** The session behind a request's cookie, or null when there is none or it has lapsed. */
export function sessionOf(req: Request) {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i >= 0 && part.slice(0, i).trim() === SESSION_COOKIE) {
      return verifySession(decodeURIComponent(part.slice(i + 1).trim()));
    }
  }
  return null;
}

export function sessionCookie(value: string, maxAgeSeconds: number) {
  return [
    `${SESSION_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    // Nothing ever links into the admin page from elsewhere, so the strictest
    // value costs nothing.
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ].join("; ");
}

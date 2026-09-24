import { hashIp, safeEqual, sessionCookie, signSession, SESSION_TTL_MS, verifyPassword } from "@/lib/analytics/auth";
import { clientIp } from "@/lib/analytics/request";
import { supabase } from "@/lib/analytics/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** One address gets this many failures in this window before it is locked out. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

const json = (body: unknown, status: number, headers?: HeadersInit) => Response.json(body, { status, headers });

export async function POST(req: Request) {
  let body: { username?: unknown; password?: unknown } | null = null;
  try {
    body = await req.json();
  } catch {
    /* Treated as empty credentials. */
  }
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");

  const expectedUser = process.env.ADMIN_USERNAME;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !storedHash || !process.env.ADMIN_SESSION_SECRET) {
    console.error("[login] ADMIN_USERNAME / ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET are not set.");
    return json({ error: "not_configured" }, 500);
  }

  const ip_hash = hashIp(clientIp(req)) ?? "unknown";
  const db = supabase();

  // The counter lives in the database because each serverless instance has its
  // own memory, and an in-process tally would reset itself away.
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await db
    .from("teheranro_admin_login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ip_hash)
    .eq("ok", false)
    .gte("attempted_at", since);

  if ((count ?? 0) >= MAX_FAILURES) return json({ error: "too_many_attempts", retryAfterMinutes: 15 }, 429);

  // The password is verified even when the username is already wrong: skipping
  // the scrypt work would make a wrong username answer measurably faster and
  // so reveal which half of the guess was correct.
  const userOk = safeEqual(username, expectedUser);
  const passOk = verifyPassword(password, storedHash);
  const ok = userOk && passOk;

  await db.from("teheranro_admin_login_attempts").insert({ ip_hash, username: username.slice(0, 64), ok });

  if (!ok) return json({ error: "invalid_credentials" }, 401);

  return json({ ok: true, expiresIn: SESSION_TTL_MS }, 200, {
    "Set-Cookie": sessionCookie(signSession(expectedUser), SESSION_TTL_MS / 1000),
  });
}

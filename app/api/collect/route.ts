import { hashIp } from "@/lib/analytics/auth";
import { clamp, clientIp, geoFrom, isBot, parseUa } from "@/lib/analytics/request";
import { supabase } from "@/lib/analytics/supabase";

/**
 * Visit-event intake.
 *
 * The browser batches events and ships them with `navigator.sendBeacon`.
 * Location, device and bot status are filled in here from the request headers
 * rather than trusted from the payload, so a forged request cannot claim to be
 * a desktop visitor in Seoul.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EVENTS = new Set(["pageview", "section", "click", "exit"]);
const MAX_EVENTS_PER_REQUEST = 40;

/**
 * Addresses whose visits are never recorded — the operator's own, normally.
 * Backs up the per-browser opt-out the client honours. Comma- or
 * whitespace-separated; empty means the check does nothing.
 */
const EXCLUDED_IPS = new Set(
  (process.env.ANALYTICS_EXCLUDE_IPS ?? "")
    .split(/[,\s]+/)
    .map((ip) => ip.trim())
    .filter(Boolean),
);

type IncomingEvent = {
  event?: string;
  path?: unknown;
  lang?: unknown;
  referrer?: unknown;
  target?: unknown;
  dwellMs?: unknown;
  ago?: unknown;
};

const json = (body: unknown, status: number) => Response.json(body, { status });

export async function POST(req: Request) {
  // sendBeacon posts a Blob, which arrives as text/plain or application/json
  // depending on the browser, so the body is read as text either way.
  let body: { sessionId?: unknown; events?: unknown } | null = null;
  try {
    body = JSON.parse(await req.text());
  } catch {
    /* Handled as a bad request below. */
  }

  const sessionId = clamp(body?.sessionId, 64);
  const events = Array.isArray(body?.events) ? (body.events as IncomingEvent[]).slice(0, MAX_EVENTS_PER_REQUEST) : [];
  if (!sessionId || events.length === 0) return json({ error: "bad_request" }, 400);

  const ip = clientIp(req);
  // 204, not 403: the browser asked to record something and the answer is
  // "done". Telling it otherwise would only produce console noise.
  if (ip && EXCLUDED_IPS.has(ip)) return new Response(null, { status: 204 });

  const ua = req.headers.get("user-agent") ?? "";
  const { device, browser, os } = parseUa(ua);
  const geo = geoFrom(req);
  const ip_hash = hashIp(ip);
  const bot = isBot(ua);
  const now = Date.now();

  const rows = events
    .filter((e) => typeof e?.event === "string" && ALLOWED_EVENTS.has(e.event))
    .map((e) => ({
      // A visitor's clock can be wrong by hours, so the client sends "how long
      // ago" and the server reads it back off its own clock. Negative values
      // and anything past a day are clamped away.
      occurred_at: new Date(now - Math.min(Math.max(Number(e.ago) || 0, 0), 86_400_000)).toISOString(),
      session_id: sessionId,
      event: e.event,
      path: clamp(e.path, 300) ?? "/",
      lang: clamp(e.lang, 8),
      referrer: clamp(e.referrer, 500),
      target: clamp(e.target, 120),
      dwell_ms: Number.isFinite(Number(e.dwellMs))
        ? Math.min(Math.max(Math.round(Number(e.dwellMs)), 0), 86_400_000)
        : null,
      ...geo,
      device,
      browser,
      os,
      ip_hash,
      is_bot: bot,
    }));

  if (!rows.length) return json({ error: "no_valid_events" }, 400);

  try {
    const { error } = await supabase().from("teheranro_page_views").insert(rows);
    if (error) throw error;
  } catch (err) {
    console.error("[collect] insert failed", err instanceof Error ? err.message : err);
    return json({ error: "insert_failed" }, 500);
  }

  // Keeps retention without a cron job. Once in a hundred requests is plenty.
  if (Math.random() < 0.01) {
    const { error } = await supabase().rpc("teheranro_prune_analytics", { retain_days: 400 });
    if (error) console.error("[collect] prune failed", error.message);
  }

  return new Response(null, { status: 204 });
}

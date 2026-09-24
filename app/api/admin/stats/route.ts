import type { SupabaseClient } from "@supabase/supabase-js";
import { aggregate, TZ, type VisitRow } from "@/lib/analytics/aggregate";
import { sessionOf } from "@/lib/analytics/auth";
import { supabase } from "@/lib/analytics/supabase";

/**
 * The single query endpoint behind the dashboard.
 *
 * It reads the window's raw events once and hands them to `aggregate`, which
 * folds every breakdown in one pass. Giving each breakdown its own SQL would
 * mean a dozen round trips; at this site's volume, one read and one pass is
 * faster and leaves the schema with nothing but the events table in it.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ceiling on how many events one request will examine, newest first. */
const MAX_ROWS = 30_000;
const PAGE = 1000;

const COLUMNS =
  "occurred_at,session_id,event,path,lang,referrer,target,dwell_ms,country,region,city,timezone,device,browser,os,is_bot";

/**
 * Bot traffic is counted on its own, because when bots are filtered out of the
 * main query there are no bot rows left to count.
 */
async function countBotEvents(db: SupabaseClient, fromIso: string) {
  const { count, error } = await db
    .from("teheranro_page_views")
    .select("id", { count: "exact", head: true })
    .gte("occurred_at", fromIso)
    .eq("is_bot", true);
  if (error) throw error;
  return count ?? 0;
}

async function fetchRows(db: SupabaseClient, fromIso: string, includeBots: boolean) {
  const rows: VisitRow[] = [];
  // PostgREST caps a single response at 1000 rows, so the window is paged
  // through rather than asked for all at once.
  for (let offset = 0; offset < MAX_ROWS; offset += PAGE) {
    let query = db
      .from("teheranro_page_views")
      .select(COLUMNS)
      .gte("occurred_at", fromIso)
      .order("occurred_at", { ascending: false })
      .range(offset, offset + PAGE - 1);
    if (!includeBots) query = query.eq("is_bot", false);

    const { data, error } = await query;
    if (error) throw error;
    rows.push(...(data as unknown as VisitRow[]));
    if (data.length < PAGE) break;
  }
  return rows;
}

export async function GET(req: Request) {
  let signedIn = false;
  try {
    signedIn = sessionOf(req) !== null;
  } catch {
    /* No secret configured means no valid session. */
  }
  if (!signedIn) return Response.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get("days") ?? "", 10) || 30, 1), 365);
  const includeBots = url.searchParams.get("bots") === "include";
  const fromIso = new Date(Date.now() - days * 86_400_000).toISOString();

  let rows: VisitRow[];
  let botEvents: number;
  try {
    const db = supabase();
    [rows, botEvents] = await Promise.all([fetchRows(db, fromIso, includeBots), countBotEvents(db, fromIso)]);
  } catch (err) {
    console.error("[stats] query failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "query_failed" }, { status: 500 });
  }

  const ownHost = (req.headers.get("host") ?? "").split(":")[0].replace(/^www\./, "");
  const folded = aggregate(rows, { days, ownHost });

  return Response.json({
    range: { days, from: fromIso, to: new Date().toISOString(), timezone: TZ },
    truncated: rows.length >= MAX_ROWS,
    includeBots,
    ...folded,
    totals: { ...folded.totals, botEvents },
  });
}

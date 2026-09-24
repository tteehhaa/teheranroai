import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * The service_role key bypasses RLS, so it must never reach a browser. The
 * `server-only` import turns any attempt to pull this module into a client
 * component into a build error.
 */
let cached: SupabaseClient | null = null;

export function supabase() {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.");

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "teheranro-analytics" } },
  });
  return cached;
}

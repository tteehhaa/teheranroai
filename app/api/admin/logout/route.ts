import { sessionCookie } from "@/lib/analytics/auth";

export const runtime = "nodejs";

export function POST() {
  // Returning the same cookie name with Max-Age=0 makes the browser drop it.
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie("", 0) } });
}

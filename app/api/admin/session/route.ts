import { sessionOf } from "@/lib/analytics/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lets the dashboard decide, on load, whether to show the sign-in form. */
export function GET(req: Request) {
  let session = null;
  try {
    session = sessionOf(req);
  } catch {
    // ADMIN_SESSION_SECRET missing: nobody is signed in, and the login form
    // will say what is wrong.
  }
  if (!session) return Response.json({ authenticated: false }, { status: 401 });
  return Response.json({ authenticated: true, username: session.u, expiresAt: session.exp });
}

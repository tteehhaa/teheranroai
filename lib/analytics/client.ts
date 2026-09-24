/**
 * First-party visit analytics, the raw material for the dashboard at /admin/.
 *
 * The site is one screen whose content changes in place — door, project
 * slides, menu — so "which information did a visitor look at" is measured as
 * time spent on each of those views. The studio controller reports every view
 * change through `trackView`.
 *
 * It collects as little as it can: no cookies, a visit id that lives in
 * sessionStorage and dies with the tab, and no IP address (the server stores
 * only a salted hash of it).
 */

import { PROJECTS } from "@/lib/projects";

const ENDPOINT = "/api/collect";

/**
 * Per-browser opt-out, so the operator's own visits do not drown the real
 * ones. public/admin/app.js writes the same key from the same origin.
 */
const OPT_OUT_KEY = "teheranro.optout";

/** Below this, a view was passed through rather than looked at. */
const MIN_DWELL_MS = 800;

type TrackedEvent = {
  event: "pageview" | "section" | "click" | "exit";
  path: string;
  lang: string;
  referrer?: string;
  target?: string;
  dwellMs?: number;
  at: number;
};

let active = false;
let queue: TrackedEvent[] = [];
let sessionId = "";

/** The view on screen now, when it started counting (null while the tab is hidden), and time owed per view. */
let current: string | null = null;
let since: number | null = null;
const dwell = new Map<string, number>();

function makeSessionId(): string {
  const key = "teheranro.sid";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(key, fresh);
    return fresh;
  } catch {
    // Storage is blocked. A value that lives only as long as this page still
    // groups the visit's events together.
    return crypto.randomUUID();
  }
}

function push(event: TrackedEvent["event"], extra: Partial<TrackedEvent> = {}) {
  queue.push({ event, path: location.pathname, lang: document.documentElement.lang || "ko", at: Date.now(), ...extra });
  if (queue.length >= 20) flush();
}

function flush() {
  if (!queue.length) return;

  const now = Date.now();
  const body = JSON.stringify({
    sessionId,
    // Elapsed time rather than a timestamp, so a visitor's misconfigured clock
    // cannot scatter their events across the calendar.
    events: queue.map(({ at, ...rest }) => ({ ...rest, ago: Math.max(0, now - at) })),
  });
  queue = [];

  // sendBeacon still delivers while the page is being torn down, which is
  // exactly when the last and most complete batch is sent.
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
  } catch {
    /* Fall through to fetch below. */
  }
  void fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
    () => {
      /* A failed measurement must never be visible to the visitor. */
    },
  );
}

/** Moves the running timer's time onto the current view. */
function stopClock() {
  if (current !== null && since !== null) dwell.set(current, (dwell.get(current) ?? 0) + Date.now() - since);
  since = null;
}

function startClock() {
  since = active && current !== null && document.visibilityState === "visible" ? Date.now() : null;
}

/** Queues every view's accrued time. Anything too short to count is dropped. */
function settle() {
  stopClock();
  for (const [id, ms] of dwell) {
    if (ms >= MIN_DWELL_MS) push("section", { target: id, dwellMs: Math.round(ms) });
  }
  dwell.clear();
}

/**
 * Called by the studio controller whenever what is on screen changes: "door",
 * a project id, or "menu". Safe to call before `initAnalytics` — the view is
 * remembered and starts counting once measuring begins.
 */
export function trackView(id: string) {
  if (id === current) return;
  stopClock();
  current = id;
  startClock();
}

function optedOut() {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * `?no-track` silences this browser for good, `?track` undoes it. The admin
 * page has a switch for the same thing; this is the way in on a device where
 * signing in first is more trouble than it is worth.
 *
 * Returns true when the visit should not be measured.
 */
function applyOptOutFromUrl() {
  const params = new URLSearchParams(location.search);
  try {
    if (params.has("no-track")) {
      localStorage.setItem(OPT_OUT_KEY, "1");
      return true;
    }
    if (params.has("track")) localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    return params.has("no-track");
  }
  return false;
}

/** Which way out a visitor took: a product, the company, email. */
function clickLabel(link: HTMLAnchorElement) {
  const href = link.getAttribute("href") ?? "";
  if (link.hreflang) return `lang:${link.hreflang}`;
  if (href.startsWith("mailto:")) return "email";
  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return "other";
  }
  if (url.origin === location.origin) return `internal:${url.pathname}`;
  const host = url.hostname.replace(/^www\./, "");
  const project = PROJECTS.find((p) => p.link && new URL(p.link).hostname.replace(/^www\./, "") === host);
  if (project) return `open:${project.id}`;
  return host;
}

function watchClicks() {
  document.addEventListener(
    "click",
    (e) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href") ?? "";
      if (!href || href.startsWith("#")) return;
      // The door mark is an in-page control (the controller cancels the navigation).
      if (link.id === "to-door") return;

      push("click", { target: clickLabel(link) });
      // A click often navigates away, so this batch goes out immediately.
      flush();
    },
    { capture: true },
  );
}

/**
 * Starts collecting. Local development and automated browsers are skipped so
 * they never reach the production numbers.
 */
export function initAnalytics() {
  if (active) return;
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
  if (navigator.webdriver) return;
  if (applyOptOutFromUrl() || optedOut()) return;

  active = true;
  sessionId = makeSessionId();

  push("pageview", { referrer: document.referrer || undefined });
  // Sent right away: a visitor who leaves after three seconds still counts.
  flush();

  startClock();
  watchClicks();

  // Hiding the tab is the practical end of a visit; the clock stops until the
  // tab comes back, so time spent in another tab is never credited.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      settle();
      push("exit");
      flush();
    } else {
      startClock();
    }
  });
  window.addEventListener("pagehide", () => {
    settle();
    flush();
  });
}

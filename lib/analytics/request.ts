import "server-only";

/**
 * Reads a visitor's context — location, device, bot status — off the request.
 *
 * Location comes from the headers Vercel's edge attaches, so no GeoIP service
 * is called and neither latency nor cost is added to the collect endpoint.
 */

/** Vercel percent-encodes city and region names (`Seoul`, `%EC%84%9C%EC%9A%B8`). */
function headerText(req: Request, name: string) {
  const raw = req.headers.get(name);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw) || null;
  } catch {
    return raw;
  }
}

export function clientIp(req: Request) {
  const first = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  return first || req.headers.get("x-real-ip") || null;
}

export function geoFrom(req: Request) {
  return {
    country: headerText(req, "x-vercel-ip-country"),
    region: headerText(req, "x-vercel-ip-country-region"),
    city: headerText(req, "x-vercel-ip-city"),
    timezone: headerText(req, "x-vercel-ip-timezone"),
  };
}

/**
 * Crawler detection.
 *
 * The site publishes llms.txt and welcomes AI search crawlers, so bot traffic
 * is a real share of the total. Flagging rather than dropping keeps the
 * default numbers human while still letting "how often does ClaudeBot come by"
 * be answered from the same table.
 */
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|lighthouse|headless|python-requests|curl\/|wget|axios|node-fetch|gptbot|claude|perplexity|bytespider|applebot|amazonbot|diffbot|ccbot|youbot|cohere-ai|yeti/i;

export function isBot(ua: string) {
  return BOT_PATTERN.test(ua);
}

/**
 * Pulls device, browser and OS out of a User-Agent. The dashboard only shows
 * a distribution, so a dedicated parsing library would be more precision than
 * the display needs.
 */
export function parseUa(ua: string) {
  const tablet = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua);
  const mobile = /Mobi|iPhone|iPod|Android|IEMobile|BlackBerry|Opera Mini/i.test(ua);
  const device = tablet ? "tablet" : mobile ? "mobile" : "desktop";

  // Order matters: Edge, Samsung and Opera all carry Chrome in their UA, and
  // Chrome carries Safari. Check the narrowest match first.
  const browser =
    /Edg\//i.test(ua) ? "Edge"
    : /OPR\/|Opera/i.test(ua) ? "Opera"
    : /SamsungBrowser/i.test(ua) ? "Samsung Internet"
    : /NAVER|Whale/i.test(ua) ? "Whale"
    : /KAKAOTALK/i.test(ua) ? "KakaoTalk"
    : /FxiOS|Firefox/i.test(ua) ? "Firefox"
    : /CriOS|Chrome|Chromium/i.test(ua) ? "Chrome"
    : /Safari/i.test(ua) ? "Safari"
    : null;

  const os =
    /Windows NT/i.test(ua) ? "Windows"
    : /iPhone|iPad|iPod/i.test(ua) ? "iOS"
    : /Mac OS X/i.test(ua) ? "macOS"
    : /Android/i.test(ua) ? "Android"
    : /Linux/i.test(ua) ? "Linux"
    : null;

  return { device, browser, os };
}

/** Trims before storage so a forged request cannot push large strings through. */
export function clamp(value: unknown, max: number) {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

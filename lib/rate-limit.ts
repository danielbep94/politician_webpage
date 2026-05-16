/**
 * In-memory IP-based rate limiter.
 * Allows MAX_HITS requests per IP within WINDOW_MS milliseconds.
 * Resets the window on first request after expiry.
 *
 * Note: In-memory only — resets on server restart and is not shared
 * across Cloud Run instances. Sufficient for low-traffic political sites.
 * For multi-instance production, replace with a Redis-backed solution.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_HITS = 5;

type RateLimitEntry = {
  count: number;
  reset: number; // epoch ms when window expires
};

const hits = new Map<string, RateLimitEntry>();

/**
 * Returns true if the given IP has exceeded the rate limit.
 * Side effect: increments the hit counter for this IP.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_HITS;
}

/**
 * Extracts the best available IP from a Next.js Request.
 * Handles Cloud Run's x-forwarded-for proxy header.
 */
export function getIp(request: Request): string {
  const forwarded = (request.headers as Headers).get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

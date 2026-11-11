import "server-only";

/** In-memory, per server instance. Fine for one user. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();

/** Records an attempt. Returns seconds to wait if over the limit, otherwise 0. */
export function hitLoginLimit(ip: string, now = Date.now()): number {
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(ip, recent);
    return Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
  }
  recent.push(now);
  attempts.set(ip, recent);
  return 0;
}

export function clearLoginLimit(ip: string) {
  attempts.delete(ip);
}

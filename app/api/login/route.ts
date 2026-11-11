import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { clearLoginLimit, hitLoginLimit } from "@/lib/rateLimit";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

/** Compare hashes so length differences don't leak through timing. */
function matches(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const wait = hitLoginLimit(ip);
  if (wait > 0) {
    return NextResponse.json(
      { error: "too many tries. wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(wait) } },
    );
  }

  const expected = process.env.MEORISOK_PASSWORD;
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!expected) {
    console.error("[meorisok] MEORISOK_PASSWORD is not set");
    return NextResponse.json({ error: "login is broken on the server. check MEORISOK_PASSWORD." }, { status: 500 });
  }
  if (!matches(password, expected)) {
    return NextResponse.json({ error: "that's not it. try again." }, { status: 401 });
  }

  clearLoginLimit(ip);
  let token: string;
  try {
    token = await createSessionToken();
  } catch (err) {
    // Usually SESSION_SECRET missing or under 32 characters. Details stay in the server log.
    console.error("[meorisok] couldn't create a session:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "login is broken on the server. check SESSION_SECRET." }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}

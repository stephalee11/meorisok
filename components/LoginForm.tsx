"use client";

import { useSearchParams } from "next/navigation";
import { LoginCard } from "./LoginCard";

/** Only allow same-site paths, so ?next= can't send you somewhere else. */
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/today";
}

async function login(password: string): Promise<string | null> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) return null;
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? "something went wrong. try again.";
  } catch {
    return "couldn't reach the cafe. try again in a sec.";
  }
}

export function LoginForm() {
  const next = safeNext(useSearchParams().get("next"));
  // Full page load so the server renders the app with the new cookie.
  return <LoginCard onSubmit={login} onSuccess={() => window.location.assign(next)} />;
}

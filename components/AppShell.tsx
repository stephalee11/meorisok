"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/dates";
import { Button } from "./Button";
import { Mascot } from "./Mascot";
import { useTasks } from "./TasksContext";
import { ViewTabs } from "./ViewTabs";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { basePath, mode, refresh, refreshing, updatedAt, celebrate } = useTasks();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 sm:px-6">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-cocoa-900 focus:px-4 focus:py-2 focus:text-cream-50"
      >
        skip to tickets
      </a>
      <header className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-6 pb-4">
        <Link href={`${basePath}/today`} className="flex items-center gap-2 no-underline" aria-label="meorisok home">
          <Mascot size={44} bounceKey={celebrate} />
          <span className="font-display text-xl font-bold text-cocoa-900">meorisok</span>
        </Link>
        {mode === "demo" && (
          <span className="rounded-pill bg-butter-300 px-2.5 py-0.5 text-xs font-bold text-cocoa-900">
            demo · changes stay in this tab
          </span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <UpdatedAgo at={updatedAt} />
          <Button variant="secondary" size="sm" onClick={refresh} disabled={refreshing}>
            <svg aria-hidden viewBox="0 0 16 16" className={`size-4 ${refreshing ? "animate-spin" : ""}`}>
              <path
                d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5V5h-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {refreshing ? "refreshing" : "refresh"}
          </Button>
        </div>
      </header>

      <ViewTabs basePath={basePath} />

      <main id="main" className="flex-1 py-6">
        {children}
      </main>

      <footer className="flex flex-wrap gap-x-4 gap-y-1 border-t border-cream-200 py-6 text-sm text-cocoa-500">
        <span>meorisok · a tiny cafe for your tasks</span>
        <Link href="/design">design system</Link>
      </footer>
    </div>
  );
}

function UpdatedAgo({ at }: { at: number }) {
  const [now, setNow] = useState(at);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-sm text-cocoa-500" aria-live="polite">
      updated {timeAgo(at, Math.max(now, at))}
    </span>
  );
}

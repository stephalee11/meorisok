"use client";

import { use, useState } from "react";
import { browser } from "react-dom";
import { toISODate } from "@/lib/dates";
import { SOURCE_META } from "@/lib/sources";
import type { TasksPayload } from "@/lib/types";
import { AppShell } from "./AppShell";
import { TasksProvider } from "./TasksContext";
import { ToastProvider } from "./Toast";

async function reload(): Promise<TasksPayload> {
  const res = await fetch("/api/tasks?refresh=1", { method: "POST" });
  if (!res.ok) throw new Error(`refresh failed: ${res.status}`);
  return res.json();
}

/** Real data. The server hands over the first payload; Refresh goes through /api/tasks. */
export function LiveApp({ initial, children }: { initial: TasksPayload; children: React.ReactNode }) {
  // "Today" must come from the viewer's clock, not the server's.
  use(browser("Task dates are shown in your local time."));
  const [today] = useState(() => toISODate(new Date()));

  return (
    <ToastProvider>
      <TasksProvider
        initialTasks={initial.tasks}
        initialFailed={initial.failed}
        initialUpdatedAt={initial.fetchedAt}
        sources={SOURCE_META}
        today={today}
        basePath=""
        mode="live"
        reload={reload}
      >
        <AppShell>{children}</AppShell>
      </TasksProvider>
    </ToastProvider>
  );
}

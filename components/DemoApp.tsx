"use client";

import { use, useState } from "react";
import { browser } from "react-dom";
import { toISODate } from "@/lib/dates";
import { DEMO_SOURCES, makeDemoTasks } from "@/lib/demoData";
import { AppShell } from "./AppShell";
import { TasksProvider } from "./TasksContext";
import { ToastProvider } from "./Toast";

/** Public demo. Fake tasks, all writes stay in memory. Never calls Notion. */
export function DemoApp({ children }: { children: React.ReactNode }) {
  // "Today" must come from the viewer's clock, not the server's, so render in the browser only.
  use(browser("The demo builds its fake tasks around your local date."));
  const [today] = useState(() => toISODate(new Date()));
  const [initialTasks] = useState(() => makeDemoTasks(today));
  const [loadedAt] = useState(() => Date.now());

  return (
    <ToastProvider>
      <TasksProvider
        initialTasks={initialTasks}
        sources={DEMO_SOURCES}
        today={today}
        basePath="/demo"
        mode="demo"
        initialUpdatedAt={loadedAt}
      >
        <AppShell>{children}</AppShell>
      </TasksProvider>
    </ToastProvider>
  );
}

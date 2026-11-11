"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { SourceMeta } from "@/lib/sources";
import type { StatusKey, Task, TasksPayload } from "@/lib/types";
import { useToast } from "./Toast";

export const ERROR_COPY = "couldn't reach notion. try again in a sec.";

type TasksContextValue = {
  tasks: Task[];
  sources: SourceMeta[];
  today: string;
  basePath: string;
  mode: "demo" | "live";
  setStatus: (id: string, next: StatusKey) => void;
  refresh: () => Promise<void>;
  refreshing: boolean;
  updatedAt: number;
  /** Last ticket that changed column; drives the "slides onto the pass" animation. */
  landed: { id: string; n: number; at: number } | null;
  /** Bumps when something moves to Enjoyed; drives the mascot bounce. */
  celebrate: number;
  /** Sources that didn't load on the last fetch. */
  failed: TasksPayload["failed"];
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside <TasksProvider>");
  return ctx;
}

type Props = {
  initialTasks: Task[];
  sources: SourceMeta[];
  today: string;
  basePath: string;
  mode: "demo" | "live";
  /** Persist a status change. Throw to roll back. Omit for local-only (demo). */
  write?: (task: Task, next: StatusKey) => Promise<Partial<Task> | void>;
  /** Fetch fresh tasks. Omit for demo. */
  reload?: () => Promise<TasksPayload>;
  initialUpdatedAt: number;
  initialFailed?: TasksPayload["failed"];
  children: React.ReactNode;
};

export function TasksProvider({
  initialTasks,
  sources,
  today,
  basePath,
  mode,
  write,
  reload,
  initialUpdatedAt,
  initialFailed = [],
  children,
}: Props) {
  const toast = useToast();
  const [tasks, setTasks] = useState(initialTasks);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [landed, setLanded] = useState<TasksContextValue["landed"]>(null);
  const [celebrate, setCelebrate] = useState(0);
  const [failed, setFailed] = useState(initialFailed);

  const patch = (id: string, p: Partial<Task>) =>
    setTasks((xs) => xs.map((t) => (t.id === id ? { ...t, ...p } : t)));

  const setStatus = useCallback(
    (id: string, next: StatusKey) => {
      const before = tasks.find((t) => t.id === id);
      if (!before || before.status === next) return;

      // Optimistic first.
      patch(id, { status: next, editedAt: new Date().toISOString() });
      setLanded((l) => ({ id, n: (l?.n ?? 0) + 1, at: Date.now() }));
      if (next === "done") setCelebrate((c) => c + 1);

      if (!write) return;
      write(before, next).then(
        (server) => server && patch(id, server),
        () => {
          patch(id, { status: before.status, editedAt: before.editedAt, notionStatusName: before.notionStatusName });
          toast(ERROR_COPY, "error");
        },
      );
    },
    [tasks, write, toast],
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (reload) {
        const fresh = await reload();
        setTasks(fresh.tasks);
        setFailed(fresh.failed);
        setUpdatedAt(fresh.fetchedAt);
      } else {
        await new Promise((r) => setTimeout(r, 450)); // demo: just feel like a fetch
        setUpdatedAt(Date.now());
      }
    } catch {
      toast(ERROR_COPY, "error");
    } finally {
      setRefreshing(false);
    }
  }, [reload, toast]);

  return (
    <TasksContext.Provider
      value={{ tasks, sources, today, basePath, mode, setStatus, refresh, refreshing, updatedAt, landed, celebrate, failed }}
    >
      {children}
    </TasksContext.Provider>
  );
}

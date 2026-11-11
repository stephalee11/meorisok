import "server-only";

import { Client, collectPaginatedAPI, isFullPage } from "@notionhq/client";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { sources } from "@/meorisok.config";
import { normalizePages, type NotionPageLike, type SourceProps } from "./normalize";
import type { TasksPayload } from "./types";

/** Pinned on purpose. 2025-09-03 is the data sources API. Bump deliberately, not by upgrading the SDK. */
export const NOTION_VERSION = "2025-09-03";

export const TASKS_TAG = "tasks";

type Source = (typeof sources)[number];

let client: Client | null = null;

/** Never import this from client code. `server-only` makes that a build error. */
export function notion(): Client {
  const auth = process.env.NOTION_TOKEN;
  if (!auth) throw new Error("NOTION_TOKEN is not set");
  client ??= new Client({ auth, notionVersion: NOTION_VERSION, logLevel: undefined });
  return client;
}

export function findSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

function propsOf(source: Source): SourceProps {
  return source.props as SourceProps;
}

/** All rows of one source. collectPaginatedAPI follows next_cursor past the 100-row page size. */
async function fetchSource(source: Source) {
  const pages = await collectPaginatedAPI(notion().dataSources.query, {
    data_source_id: source.dataSourceId,
  });
  const full = pages.filter(isFullPage) as unknown as NotionPageLike[];
  return normalizePages(full, { id: source.id, props: propsOf(source) });
}

/** One failing source never breaks the others. Errors are logged here and never sent to the browser. */
export async function fetchAllTasks(): Promise<TasksPayload> {
  const results = await Promise.allSettled(sources.map(fetchSource));
  const payload: TasksPayload = { tasks: [], failed: [], fetchedAt: Date.now() };
  results.forEach((r, i) => {
    const s = sources[i];
    if (r.status === "fulfilled") payload.tasks.push(...r.value);
    else {
      payload.failed.push({ id: s.id, label: s.label });
      console.error(`[meorisok] ${s.id} didn't load:`, describe(r.reason));
    }
  });
  return payload;
}

/** Cached for 60s. `refreshTasks` throws the cache away. */
export async function getTasks(): Promise<TasksPayload> {
  "use cache";
  cacheTag(TASKS_TAG);
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  return fetchAllTasks();
}

/** Expire right away (no stale copy), then fetch fresh. */
export async function refreshTasks(): Promise<TasksPayload> {
  revalidateTag(TASKS_TAG, { expire: 0 });
  return fetchAllTasks();
}

/** Short, token-free description for server logs. */
export function describe(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { code?: string; status?: number; message?: string };
    return [e.status, e.code, e.message].filter(Boolean).join(" ");
  }
  return String(err);
}

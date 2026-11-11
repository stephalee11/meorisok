import "server-only";

import { Client, collectPaginatedAPI, isFullPage } from "@notionhq/client";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { me, sources } from "@/meorisok.config";
import { normalizePages, notionLabelFor, type NotionPageLike, type SourceProps } from "./normalize";
import type { StatusKey, Task, TasksPayload } from "./types";

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
  return normalizePages(full, { id: source.id, props: propsOf(source) }, undefined, me.notionUserId);
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

/* ---------- write ---------- */

type StatusSchema = { type: "status" | "select"; options: string[] };

/** The status property's type and option labels, straight from the source's schema. Cached for an hour. */
async function getStatusSchema(sourceId: string): Promise<StatusSchema> {
  "use cache";
  cacheTag(`schema:${sourceId}`);
  cacheLife("hours");
  const source = findSource(sourceId);
  if (!source) throw new WriteError(400, "unknown source");
  const ds = await notion().dataSources.retrieve({ data_source_id: source.dataSourceId });
  const prop = "properties" in ds ? ds.properties[propsOf(source).status] : undefined;
  if (prop?.type === "status") return { type: "status", options: prop.status.options.map((o) => o.name) };
  if (prop?.type === "select") return { type: "select", options: prop.select.options.map((o) => o.name) };
  throw new WriteError(500, `${sourceId} has no status or select property named "${propsOf(source).status}"`);
}

export class WriteError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const bare = (id: string) => id.replace(/-/g, "").toLowerCase();

/**
 * Set a page's status using the exact label its own source uses ("This Week" vs "this week").
 * Refuses pages that don't belong to that source, so the route can't touch anything else the integration sees.
 */
export async function updateStatus(pageId: string, sourceId: string, key: StatusKey): Promise<Partial<Task>> {
  const source = findSource(sourceId);
  if (!source) throw new WriteError(400, "unknown source");

  const page = await notion().pages.retrieve({ page_id: pageId });
  const parent = "parent" in page ? page.parent : undefined;
  if (!parent || parent.type !== "data_source_id" || bare(parent.data_source_id) !== bare(source.dataSourceId)) {
    throw new WriteError(404, "page not in that source");
  }

  let schema = await getStatusSchema(sourceId);
  let label = notionLabelFor(key, schema.options);
  if (!label) {
    // Labels may have been renamed in Notion since we cached the schema. Look once more.
    revalidateTag(`schema:${sourceId}`, { expire: 0 });
    schema = await getStatusSchema(sourceId);
    label = notionLabelFor(key, schema.options);
  }
  if (!label) throw new WriteError(422, `${sourceId} has no status matching "${key}"`);

  const value = schema.type === "status" ? { status: { name: label } } : { select: { name: label } };
  const updated = await notion().pages.update({
    page_id: pageId,
    properties: { [propsOf(source).status]: value } as Parameters<Client["pages"]["update"]>[0]["properties"],
  });
  revalidateTag(TASKS_TAG, { expire: 0 });

  return {
    status: key,
    notionStatusName: label,
    editedAt: "last_edited_time" in updated ? updated.last_edited_time : new Date().toISOString(),
  };
}

/** Short, token-free description for server logs. */
export function describe(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { code?: string; status?: number; message?: string };
    return [e.status, e.code, e.message].filter(Boolean).join(" ");
  }
  return String(err);
}

/**
 * Notion page -> Task. Pure functions, no Notion client here, so it's easy to test.
 * Only type imports, so this file also runs under plain Node for quick checks.
 */
import type { Priority, StatusKey, Task } from "./types";

export type SourceProps = {
  title: string;
  status: string;
  due: string;
  assignee?: string;
  priority?: string;
  phase?: string;
};

export type NormalizeSource = { id: string; props: SourceProps };

/** Loose shape of a Notion page property. We only read what we need. */
type NotionProp =
  | { type: "title"; title: { plain_text: string }[] }
  | { type: "status"; status: { name: string } | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "date"; date: { start: string } | null }
  | { type: "people"; people: { id: string }[] }
  | { type: string; [k: string]: unknown };

export type NotionPageLike = {
  id: string;
  url: string;
  last_edited_time: string;
  in_trash?: boolean;
  archived?: boolean;
  properties: Record<string, NotionProp | undefined>;
};

const STATUS_BY_NAME: Record<string, StatusKey> = {
  backlog: "backlog",
  "this week": "this_week",
  doing: "doing",
  done: "done",
};

type Warn = (msg: string) => void;
const defaultWarn: Warn = (m) => console.warn(`[meorisok] ${m}`);

/** Case-insensitive match. Unknown labels fall back to backlog and warn. */
export function toStatusKey(name: string | null | undefined, warn: Warn = defaultWarn): StatusKey {
  const key = name ? STATUS_BY_NAME[name.trim().toLowerCase()] : undefined;
  if (!key) {
    warn(`Unknown status "${name ?? "(empty)"}", showing it as backlog.`);
    return "backlog";
  }
  return key;
}

/** The exact Notion label a source uses for a status key, read from its own schema options. */
export function notionLabelFor(key: StatusKey, optionNames: string[]): string | undefined {
  return optionNames.find((n) => STATUS_BY_NAME[n.trim().toLowerCase()] === key);
}

function text(p: NotionProp | undefined): string | undefined {
  if (!p) return undefined;
  if (p.type === "title" && Array.isArray(p.title)) return (p.title as { plain_text: string }[]).map((t) => t.plain_text).join("");
  if (p.type === "status") return (p.status as { name: string } | null)?.name;
  if (p.type === "select") return (p.select as { name: string } | null)?.name;
  return undefined;
}

function dateStart(p: NotionProp | undefined): string | null {
  if (!p || p.type !== "date") return null;
  const start = (p.date as { start: string } | null)?.start;
  // "2026-11-10" or "2026-11-10T09:00:00.000-08:00": the first 10 chars are the date as written in Notion.
  return start ? start.slice(0, 10) : null;
}

const bareId = (id: string) => id.replace(/-/g, "").toLowerCase();

/** True if `meId` is among the people. Sources without an assignee column count as mine. */
function isMine(p: NotionProp | undefined, hasColumn: boolean, meId: string | undefined): boolean {
  if (!hasColumn || !meId) return true;
  if (!p || p.type !== "people" || !Array.isArray(p.people)) return false;
  return (p.people as { id: string }[]).some((x) => bareId(x.id) === bareId(meId));
}

function priority(p: NotionProp | undefined): Priority | undefined {
  const v = text(p)?.trim().toUpperCase();
  return v === "P1" || v === "P2" || v === "P3" ? v : undefined;
}

export function normalizePage(
  page: NotionPageLike,
  source: NormalizeSource,
  warn: Warn = defaultWarn,
  meId?: string,
): Task {
  const props = page.properties ?? {};
  const statusName = text(props[source.props.status]) ?? "";
  const phase = source.props.phase ? text(props[source.props.phase])?.trim() : undefined;
  return {
    id: page.id,
    sourceId: source.id,
    title: text(props[source.props.title])?.trim() || "(untitled)",
    status: toStatusKey(statusName, (m) => warn(`${source.id}: ${m}`)),
    notionStatusName: statusName,
    due: dateStart(props[source.props.due]),
    priority: source.props.priority ? priority(props[source.props.priority]) : undefined,
    phase: phase || undefined,
    url: page.url,
    mine: isMine(source.props.assignee ? props[source.props.assignee] : undefined, !!source.props.assignee, meId),
    editedAt: page.last_edited_time,
  };
}

export function normalizePages(
  pages: NotionPageLike[],
  source: NormalizeSource,
  warn: Warn = defaultWarn,
  meId?: string,
): Task[] {
  return pages.filter((p) => !p.in_trash && !p.archived).map((p) => normalizePage(p, source, warn, meId));
}

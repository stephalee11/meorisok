import type { StatusKey } from "./types";

/** Display layer only. Notion keeps its own labels. */
export const STATUSES: { key: StatusKey; label: string; notion: string }[] = [
  { key: "backlog", label: "Menu", notion: "Backlog" },
  { key: "this_week", label: "Order Up", notion: "This Week" },
  { key: "doing", label: "Brewing", notion: "Doing" },
  { key: "done", label: "Enjoyed", notion: "Done" },
];

export const STATUS_LABEL: Record<StatusKey, string> = Object.fromEntries(
  STATUSES.map((s) => [s.key, s.label]),
) as Record<StatusKey, string>;

export function isStatusKey(v: unknown): v is StatusKey {
  return STATUSES.some((s) => s.key === v);
}

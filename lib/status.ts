import type { StatusKey } from "./types";

/** Display layer only. Notion keeps its own labels. */
export const STATUSES: { key: StatusKey; label: string; notion: string }[] = [
  { key: "backlog", label: "menu", notion: "Backlog" },
  { key: "this_week", label: "order up", notion: "This Week" },
  { key: "doing", label: "brewing", notion: "Doing" },
  { key: "done", label: "enjoyed", notion: "Done" },
];

/** Small dot color per status (Tailwind classes). */
export const STATUS_DOT: Record<StatusKey, string> = {
  backlog: "bg-cream-200",
  this_week: "bg-butter-300",
  doing: "bg-milk-pink-500",
  done: "bg-matcha-400",
};

export const STATUS_LABEL: Record<StatusKey, string> = Object.fromEntries(
  STATUSES.map((s) => [s.key, s.label]),
) as Record<StatusKey, string>;

export function isStatusKey(v: unknown): v is StatusKey {
  return STATUSES.some((s) => s.key === v);
}

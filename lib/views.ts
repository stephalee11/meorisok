import { addDays } from "./dates";
import type { Priority, StatusKey, Task } from "./types";

const PRIORITY_RANK: Record<Priority, number> = { P1: 0, P2: 1, P3: 2 };

export function isLate(t: Task, today: string): boolean {
  return t.status !== "done" && t.due !== null && t.due < today;
}

/** Due date (no date last), then priority (none last), then title. */
export function byDueThenPriority(a: Task, b: Task): number {
  if (a.due !== b.due) {
    if (a.due === null) return 1;
    if (b.due === null) return -1;
    return a.due < b.due ? -1 : 1;
  }
  const pa = a.priority ? PRIORITY_RANK[a.priority] : 9;
  const pb = b.priority ? PRIORITY_RANK[b.priority] : 9;
  if (pa !== pb) return pa - pb;
  return a.title.localeCompare(b.title);
}

/** Brewing, due today, or overdue. Never Enjoyed. */
export function todayTasks(tasks: Task[], today: string): Task[] {
  return tasks
    .filter((t) => t.status !== "done" && (t.status === "doing" || (t.due !== null && t.due <= today)))
    .sort(byDueThenPriority);
}

export type DayGroup = { key: string; date: string | null; tasks: Task[] };

/** Order Up plus anything due in the next 7 days, grouped by day. */
export function weekGroups(tasks: Task[], today: string): DayGroup[] {
  const end = addDays(today, 7);
  const picked = tasks.filter(
    (t) => t.status !== "done" && (t.status === "this_week" || (t.due !== null && t.due >= today && t.due <= end)),
  );
  const late: Task[] = [];
  const noDate: Task[] = [];
  const byDay = new Map<string, Task[]>();
  for (const t of picked) {
    if (t.due === null) noDate.push(t);
    else if (t.due < today) late.push(t);
    else {
      const list = byDay.get(t.due) ?? [];
      list.push(t);
      byDay.set(t.due, list);
    }
  }
  const groups: DayGroup[] = [];
  if (late.length) groups.push({ key: "late", date: null, tasks: late.sort(byDueThenPriority) });
  for (const date of [...byDay.keys()].sort()) {
    groups.push({ key: date, date, tasks: byDay.get(date)!.sort(byDueThenPriority) });
  }
  if (noDate.length) groups.push({ key: "nodate", date: null, tasks: noDate.sort(byDueThenPriority) });
  return groups;
}

export const ENJOYED_WINDOW_DAYS = 14;

export function boardColumns(
  tasks: Task[],
  today: string,
  showAllEnjoyed: boolean,
): Record<StatusKey, Task[]> {
  const cutoff = addDays(today, -ENJOYED_WINDOW_DAYS);
  const cols: Record<StatusKey, Task[]> = { backlog: [], this_week: [], doing: [], done: [] };
  for (const t of tasks) {
    if (t.status === "done" && !showAllEnjoyed && t.editedAt.slice(0, 10) < cutoff) continue;
    cols[t.status].push(t);
  }
  cols.backlog.sort(byDueThenPriority);
  cols.this_week.sort(byDueThenPriority);
  cols.doing.sort(byDueThenPriority);
  cols.done.sort((a, b) => (a.editedAt < b.editedAt ? 1 : -1));
  return cols;
}

/* ---------- filters ---------- */

export type Filters = {
  projects: string[];
  priorities: Priority[];
  q: string;
};

export const EMPTY_FILTERS: Filters = { projects: [], priorities: [], q: "" };

const PRIORITIES: Priority[] = ["P1", "P2", "P3"];

function list(v: string | null): string[] {
  return v ? v.split(",").filter(Boolean) : [];
}

export function readFilters(params: URLSearchParams): Filters {
  return {
    projects: list(params.get("project")),
    priorities: list(params.get("priority")).filter((p): p is Priority => PRIORITIES.includes(p as Priority)),
    q: params.get("q") ?? "",
  };
}

export function writeFilters(params: URLSearchParams, f: Filters): URLSearchParams {
  const next = new URLSearchParams(params);
  const set = (k: string, v: string) => (v ? next.set(k, v) : next.delete(k));
  set("project", f.projects.join(","));
  set("priority", f.priorities.join(","));
  set("q", f.q);
  return next;
}

export function hasActiveFilters(f: Filters): boolean {
  return activeFilterCount(f) > 0;
}

export function activeFilterCount(f: Filters): number {
  return f.projects.length + f.priorities.length + (f.q.trim() ? 1 : 0);
}

/** Which priorities the priority control can offer, based on tasks in view after the project filter. */
export function filterOptions(tasks: Task[], f: Filters) {
  const scoped = f.projects.length ? tasks.filter((t) => f.projects.includes(t.sourceId)) : tasks;
  const priorities = PRIORITIES.filter((p) => scoped.some((t) => t.priority === p));
  return { priorities };
}

/** The priority filter only applies while its control is shown. */
export function applyFilters(tasks: Task[], f: Filters): Task[] {
  const opts = filterOptions(tasks, f);
  const priorities = f.priorities.filter((p) => opts.priorities.includes(p));
  const q = f.q.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (!f.projects.length || f.projects.includes(t.sourceId)) &&
      (!priorities.length || (t.priority !== undefined && priorities.includes(t.priority))) &&
      (!q || t.title.toLowerCase().includes(q)),
  );
}

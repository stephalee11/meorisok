import { addDays } from "./dates";
import type { SourceMeta } from "./sources";
import type { Priority, StatusKey, Task } from "./types";

/** Fake projects for the public demo. One per project color, and only "thesis" has priority + phase. */
export const DEMO_SOURCES: SourceMeta[] = [
  { id: "garden", label: "Garden club", color: "berry" },
  { id: "thesis", label: "Thesis", color: "matcha" },
  { id: "apartment", label: "Apartment", color: "butter" },
  { id: "sidequest", label: "Side quest", color: "sky" },
];

const NOTION_LABEL: Record<StatusKey, string> = {
  backlog: "Backlog",
  this_week: "This Week",
  doing: "Doing",
  done: "Done",
};

type Seed = [source: string, title: string, status: StatusKey, dueOffset: number | null, extra?: { priority?: Priority; phase?: string; editedDaysAgo?: number }];

const SEEDS: Seed[] = [
  ["thesis", "Outline chapter 3", "doing", 0, { priority: "P1", phase: "Build" }],
  ["thesis", "Email advisor about survey", "this_week", -2, { priority: "P1", phase: "Research" }],
  ["garden", "Order tomato seedlings", "this_week", -1],
  ["apartment", "Pay internet bill", "this_week", 0],
  ["sidequest", "Sketch mascot stickers", "doing", null],
  ["thesis", "Clean survey data", "this_week", 1, { priority: "P2", phase: "Build" }],
  ["garden", "Fix the leaky hose", "this_week", 2],
  ["apartment", "Return library books", "backlog", 3],
  ["thesis", "Pilot test with 3 people", "this_week", 4, { priority: "P2", phase: "Test" }],
  ["sidequest", "Try the new matcha place", "this_week", 5],
  ["garden", "Compost workshop sign-ups", "backlog", 6],
  ["thesis", "Draft methods section", "this_week", null, { priority: "P3", phase: "Report" }],
  ["apartment", "Descale the kettle", "this_week", null],
  ["thesis", "Read two papers on recall", "backlog", null, { priority: "P3", phase: "Research" }],
  ["garden", "Plan fall bulbs", "backlog", 12],
  ["sidequest", "Learn three ukulele chords", "backlog", null],
  ["apartment", "Swap winter blankets", "backlog", null],
  ["thesis", "Write ethics form", "done", -3, { priority: "P1", phase: "Research", editedDaysAgo: 2 }],
  ["garden", "Water the basil", "done", 0, { editedDaysAgo: 0 }],
  ["sidequest", "Bake strawberry milk bread", "done", null, { editedDaysAgo: 5 }],
  ["apartment", "Hang the new shelf", "done", -10, { editedDaysAgo: 9 }],
  ["thesis", "Pick a research question", "done", -30, { priority: "P1", phase: "Research", editedDaysAgo: 28 }],
  ["garden", "Join garden club", "done", null, { editedDaysAgo: 40 }],
];

export function makeDemoTasks(today: string): Task[] {
  return SEEDS.map(([sourceId, title, status, dueOffset, extra = {}], i) => ({
    id: `demo-${i + 1}`,
    sourceId,
    title,
    status,
    notionStatusName: NOTION_LABEL[status],
    due: dueOffset === null ? null : addDays(today, dueOffset),
    priority: extra.priority,
    phase: extra.phase,
    url: "#",
    editedAt: `${addDays(today, -(extra.editedDaysAgo ?? 1))}T12:00:00.000Z`,
  }));
}

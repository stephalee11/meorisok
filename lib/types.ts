export type StatusKey = "backlog" | "this_week" | "doing" | "done";
export type Priority = "P1" | "P2" | "P3";

export type Task = {
  id: string; // Notion page id
  sourceId: string; // from config
  title: string;
  status: StatusKey;
  notionStatusName: string; // original label, needed for write-back
  due: string | null; // ISO date (YYYY-MM-DD)
  priority?: Priority;
  phase?: string;
  url: string; // link back to the Notion page
  mine: boolean; // assigned to me (or the source has no assignee column)
  editedAt: string; // ISO datetime (Notion last_edited_time), used for the Enjoyed 14-day window
};

/** What the server hands the app: tasks plus which sources failed to load. */
export type TasksPayload = {
  tasks: Task[];
  failed: { id: string; label: string }[];
  fetchedAt: number; // epoch ms
};

import type { Metadata } from "next";
import { WeekView } from "@/components/WeekView";

export const metadata: Metadata = { title: "this week" };

// Browser-only app shell (see (app)/layout.tsx).
export const instant = false;

export default function WeekPage() {
  return <WeekView />;
}

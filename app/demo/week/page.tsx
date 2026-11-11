import type { Metadata } from "next";
import { WeekView } from "@/components/WeekView";

export const metadata: Metadata = { title: "this week" };

// Browser-only demo (see demo/layout.tsx).
export const instant = false;

export default function DemoWeekPage() {
  return <WeekView />;
}

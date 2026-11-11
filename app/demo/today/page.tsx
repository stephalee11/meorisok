import type { Metadata } from "next";
import { TodayView } from "@/components/TodayView";

export const metadata: Metadata = { title: "today" };

// Browser-only demo (see demo/layout.tsx).
export const instant = false;

export default function DemoTodayPage() {
  return <TodayView />;
}

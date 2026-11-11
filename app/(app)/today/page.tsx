import type { Metadata } from "next";
import { TodayView } from "@/components/TodayView";

export const metadata: Metadata = { title: "today" };

// Browser-only app shell (see (app)/layout.tsx).
export const instant = false;

export default function TodayPage() {
  return <TodayView />;
}

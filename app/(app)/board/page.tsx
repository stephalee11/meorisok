import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";

export const metadata: Metadata = { title: "board" };

// Browser-only app shell (see (app)/layout.tsx).
export const instant = false;

export default function BoardPage() {
  return <BoardView />;
}

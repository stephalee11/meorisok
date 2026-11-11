import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";

export const metadata: Metadata = { title: "board" };

// Browser-only demo (see demo/layout.tsx).
export const instant = false;

export default function DemoBoardPage() {
  return <BoardView />;
}

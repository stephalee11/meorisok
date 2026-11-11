import { connection } from "next/server";
import { Suspense } from "react";
import { LiveApp } from "@/components/LiveApp";
import { ShellSkeleton } from "@/components/ShellSkeleton";
import { getTasks } from "@/lib/notion";

// Renders in the browser (local dates) with request-time data, so skip instant-nav validation.
export const instant = false;

async function LiveData({ children }: { children: React.ReactNode }) {
  await connection(); // fetch at request time, never at build
  const initial = await getTasks();
  return <LiveApp initial={initial}>{children}</LiveApp>;
}

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <LiveData>{children}</LiveData>
    </Suspense>
  );
}

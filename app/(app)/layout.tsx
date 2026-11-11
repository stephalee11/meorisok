import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LiveApp } from "@/components/LiveApp";
import { ShellSkeleton } from "@/components/ShellSkeleton";
import { hasSession } from "@/lib/auth";
import { getTasks } from "@/lib/notion";

// Renders in the browser (local dates) with request-time data, so skip instant-nav validation.
export const instant = false;

async function LiveData({ children }: { children: React.ReactNode }) {
  // Reading the cookie makes this request-time. proxy.ts already guards this, but check again next to the data.
  if (!(await hasSession())) redirect("/login");
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

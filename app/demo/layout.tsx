import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoApp } from "@/components/DemoApp";
import { ShellSkeleton } from "@/components/ShellSkeleton";

// The demo renders in the browser only (dates come from the viewer's clock), so skip instant-nav validation.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "demo", template: "%s · demo · meorisok" },
  description: "Try meorisok with fake tasks. Nothing leaves your browser.",
};

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <DemoApp>{children}</DemoApp>
    </Suspense>
  );
}

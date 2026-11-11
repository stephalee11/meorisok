import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";

export const metadata: Metadata = { title: "not found" };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <Mascot size={72} />
        <h1 className="font-display text-xl font-bold text-cocoa-900">no table here.</h1>
        <p className="text-cocoa-500">this page isn&apos;t on the menu.</p>
        <Link
          href="/today"
          className="mt-2 inline-flex h-10 items-center rounded-pill bg-milk-pink-500 px-4 font-bold text-cocoa-900 no-underline shadow-[0_2px_0_var(--berry-600)] hover:bg-milk-pink-300"
        >
          back to today
        </Link>
      </div>
    </main>
  );
}

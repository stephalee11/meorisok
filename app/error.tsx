"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { Mascot } from "@/components/Mascot";

/** Anything that throws while rendering lands here. Details stay in the console / server logs. */
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <Mascot size={72} />
        <h1 className="font-display text-xl font-bold text-cocoa-900">something spilled.</h1>
        <p className="text-cocoa-500">that&apos;s on us. try again, or peek at the demo.</p>
        <div className="mt-2 flex gap-2">
          <Button onClick={() => retry()}>try again</Button>
          <Link
            href="/demo"
            className="inline-flex h-10 items-center rounded-pill border border-cream-200 bg-cream-100 px-4 font-bold text-cocoa-900 no-underline hover:bg-milk-pink-100"
          >
            demo
          </Link>
        </div>
      </div>
    </main>
  );
}

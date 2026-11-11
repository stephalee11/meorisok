"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const VIEWS = [
  { slug: "today", label: "today" },
  { slug: "week", label: "this week" },
  { slug: "board", label: "board" },
];

/** Tabs are links so each view has its own URL. Filters ride along in the query string. */
export function ViewTabs({ basePath = "" }: { basePath?: string }) {
  const pathname = usePathname();
  const qs = useSearchParams().toString();

  return (
    <nav aria-label="Views">
      <ul className="inline-flex gap-1 rounded-pill border border-cream-200 bg-cream-100 p-1">
        {VIEWS.map((v) => {
          const href = `${basePath}/${v.slug}`;
          const current = pathname === href;
          return (
            <li key={v.slug}>
              <Link
                href={qs ? `${href}?${qs}` : href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex h-9 items-center rounded-pill px-4 text-sm font-bold no-underline transition-colors duration-150 ease-out ${
                  current
                    ? "bg-milk-pink-500 text-cocoa-900 shadow-[0_2px_0_var(--berry-600)]"
                    : "text-cocoa-700 hover:bg-milk-pink-100"
                }`}
              >
                {v.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

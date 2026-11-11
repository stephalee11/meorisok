"use client";

import { useEffect, useRef } from "react";
import { friendlyDate } from "@/lib/dates";
import type { SourceMeta } from "@/lib/sources";
import { stopDrag } from "@/lib/stopDrag";
import type { StatusKey, Task } from "@/lib/types";
import { isLate } from "@/lib/views";
import { PhaseChip, PriorityChip, ProjectChip } from "./Chip";

type Props = {
  task: Task;
  project: SourceMeta;
  today: string;
  onStatusChange?: (next: StatusKey) => void;
  /** Set when this ticket just changed column. Plays "slides onto the pass". */
  landed?: { n: number; at: number };
  lifted?: boolean;
  /** Hide the date when the surrounding group already says it (This Week). */
  hideDue?: boolean;
  /** Drag handle (Board only). */
  handle?: React.ReactNode;
};

export function TaskTicket({ task, project, today, onStatusChange, landed, lifted, hideDue, handle }: Props) {
  const done = task.status === "done";
  const late = isLate(task, today);
  const hasLink = task.url && task.url !== "#";
  const rootRef = useRef<HTMLDivElement>(null);
  const landedN = landed?.n;
  const landedAt = landed?.at;

  // Animate without remounting, so keyboard focus survives. If the move dropped focus, put it back here.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || landedAt === undefined || Date.now() - landedAt > 1000) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.animate(
        [
          { transform: "translateY(-10px) scale(0.98)", opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }
    if (!document.activeElement || document.activeElement === document.body) {
      el.querySelector<HTMLElement>('input[type="checkbox"]')?.focus();
    }
  }, [landedN, landedAt]);

  return (
    <div ref={rootRef} className="ticket-wrap" data-lifted={lifted || undefined}>
      <article className="ticket px-4 pt-4 pb-3" aria-label={task.title}>
        <div className="flex items-start gap-3">
          {handle}
          {onStatusChange && (
            <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => {
                  // If the ticket leaves the view, hand focus to its neighbour instead of the page.
                  const all = [...document.querySelectorAll<HTMLInputElement>('article input[type="checkbox"]')];
                  const i = all.indexOf(e.currentTarget);
                  const neighbour = all[i + 1] ?? all[i - 1];
                  onStatusChange(e.target.checked ? "done" : "this_week");
                  requestAnimationFrame(() => {
                    if (document.activeElement === document.body && neighbour?.isConnected) neighbour.focus();
                  });
                }}
                aria-label={done ? `Move ${task.title} back to order up` : `Mark ${task.title} as enjoyed`}
                className="peer size-5 cursor-pointer appearance-none rounded-full border-2 border-cocoa-500 bg-cream-50 transition-colors duration-150 ease-out hover:border-berry-600 checked:border-cocoa-700 checked:bg-matcha-400"
                {...stopDrag}
              />
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="pointer-events-none absolute size-3 opacity-0 peer-checked:opacity-100"
              >
                <path d="M3 6.2 5 8.2 9 4" fill="none" stroke="var(--cocoa-900)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <h3
            className={`flex-1 min-w-0 text-md font-semibold leading-snug [overflow-wrap:anywhere] ${
              done ? "text-cocoa-500 line-through decoration-cocoa-500/60" : "text-cocoa-900"
            }`}
          >
            {hasLink ? (
              <a
                href={task.url}
                target="_blank"
                rel="noreferrer"
                className="text-inherit no-underline hover:underline"
                {...stopDrag}
              >
                {task.title}
              </a>
            ) : (
              task.title
            )}
          </h3>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
          <ProjectChip label={project.label} color={project.color} />
          {task.due && !hideDue && (
            <span className="inline-flex items-center gap-1 font-semibold text-cocoa-500">
              <svg aria-hidden viewBox="0 0 12 12" className="size-3">
                <rect x="1.5" y="2.5" width="9" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1.5 5h9M4 1.5v2M8 1.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              {friendlyDate(task.due, today)}
            </span>
          )}
          {late && (
            <span className="inline-flex h-5 items-center rounded-pill bg-butter-300 px-2 text-xs font-bold text-cocoa-900">
              late
            </span>
          )}
          {task.priority && <PriorityChip priority={task.priority} />}
          {task.phase && <PhaseChip phase={task.phase} />}
        </div>
      </article>
    </div>
  );
}

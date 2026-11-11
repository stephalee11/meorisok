"use client";

import { friendlyDate } from "@/lib/dates";
import { sourceMeta } from "@/lib/sources";
import { applyFilters, EMPTY_FILTERS, weekGroups, type DayGroup } from "@/lib/views";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { NoMatches } from "./NoMatches";
import { TaskTicket } from "./TaskTicket";
import { useTasks } from "./TasksContext";
import { useFilters } from "./useFilters";
import { ViewHeader } from "./ViewHeader";

function groupLabel(g: DayGroup, today: string) {
  if (g.key === "late") return "late";
  if (g.key === "nodate") return "no date yet";
  return friendlyDate(g.date!, today).toLowerCase();
}

export function WeekView() {
  const { tasks, sources, today, setStatus, landed } = useTasks();
  const [filters, setFilters] = useFilters();
  const inView = weekGroups(tasks, today).flatMap((g) => g.tasks);
  const shown = applyFilters(inView, filters);
  const groups = weekGroups(shown, today);

  return (
    <section aria-labelledby="view-title" className="mx-auto max-w-2xl">
      <div id="view-title">
        <ViewHeader title="this week" subtitle="orders up and anything due soon" count={shown.length} />
      </div>
      {inView.length > 0 && (
        <div className="mb-6">
          <FilterBar tasks={inView} sources={sources} filters={filters} onChange={setFilters} />
        </div>
      )}
      {inView.length === 0 ? (
        <EmptyState title="nothing ordered this week." body="enjoy the quiet." />
      ) : shown.length === 0 ? (
        <NoMatches onClear={() => setFilters(EMPTY_FILTERS)} />
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((g) => (
            <section key={g.key} aria-labelledby={`day-${g.key}`}>
              <h2
                id={`day-${g.key}`}
                className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-cocoa-700"
              >
                {groupLabel(g, today)}
                {g.key === "late" && (
                  <span className="rounded-pill bg-butter-300 px-2 py-0.5 font-sans text-xs font-bold text-cocoa-900">
                    {g.tasks.length}
                  </span>
                )}
                <span aria-hidden className="h-px flex-1 border-t-2 border-dashed border-cream-200" />
              </h2>
              <ul className="flex flex-col gap-3">
                {g.tasks.map((t) => (
                  <li key={t.id}>
                    <TaskTicket
                      task={t}
                      project={sourceMeta(t.sourceId, sources)}
                      today={today}
                      onStatusChange={(s) => setStatus(t.id, s)}
                      landed={landed?.id === t.id ? landed : undefined}
                      hideDue={g.date !== null}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

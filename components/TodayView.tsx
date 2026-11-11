"use client";

import { sourceMeta } from "@/lib/sources";
import { applyFilters, EMPTY_FILTERS, todayTasks } from "@/lib/views";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { NoMatches } from "./NoMatches";
import { TaskTicket } from "./TaskTicket";
import { useTasks } from "./TasksContext";
import { useFilters } from "./useFilters";
import { ViewHeader } from "./ViewHeader";

const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" });

export function TodayView() {
  const { tasks, sources, today, setStatus, landed } = useTasks();
  const [filters, setFilters] = useFilters();
  const inView = todayTasks(tasks, today);
  const shown = applyFilters(inView, filters);
  const [y, m, d] = today.split("-").map(Number);

  return (
    <section aria-labelledby="view-title" className="mx-auto max-w-2xl">
      <div id="view-title">
        <ViewHeader
          title="today"
          subtitle={longDate.format(new Date(y, m - 1, d)).toLowerCase()}
          count={shown.length}
        />
      </div>
      {inView.length > 0 && (
        <div className="mb-6">
          <FilterBar tasks={inView} sources={sources} filters={filters} onChange={setFilters} />
        </div>
      )}
      {inView.length === 0 ? (
        <EmptyState title="nothing on the stove." body="go get a snack." />
      ) : shown.length === 0 ? (
        <NoMatches onClear={() => setFilters(EMPTY_FILTERS)} />
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((t) => (
            <li key={t.id}>
              <TaskTicket
                task={t}
                project={sourceMeta(t.sourceId, sources)}
                today={today}
                onStatusChange={(s) => setStatus(t.id, s)}
                landed={landed?.id === t.id ? landed : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

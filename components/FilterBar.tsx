"use client";

import type { SourceMeta } from "@/lib/sources";
import type { Priority, Task } from "@/lib/types";
import { EMPTY_FILTERS, filterOptions, hasActiveFilters, type Filters } from "@/lib/views";
import { Button } from "./Button";
import { FilterChip, PriorityDot } from "./Chip";

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

type Props = {
  /** Tasks in the current view, before filters. Decides which controls show. */
  tasks: Task[];
  sources: SourceMeta[];
  filters: Filters;
  onChange: (f: Filters) => void;
};

export function FilterBar({ tasks, sources, filters, onChange }: Props) {
  const { priorities, phases } = filterOptions(tasks, filters);
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div role="search" aria-label="Filter tickets" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search titles</span>
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cocoa-500"
          >
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Search tickets"
            className="h-10 w-full rounded-pill border border-cream-200 bg-cream-100 pl-9 pr-4 text-sm text-cocoa-900 placeholder:text-cocoa-500 hover:border-milk-pink-300 focus:border-berry-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-berry-600"
          />
        </label>
        {hasActiveFilters(filters) && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Group label="Project">
          {sources.map((s) => (
            <FilterChip
              key={s.id}
              color={s.color}
              pressed={filters.projects.includes(s.id)}
              onToggle={() => set({ projects: toggle(filters.projects, s.id) })}
            >
              {s.label}
            </FilterChip>
          ))}
        </Group>

        {priorities.length > 0 && (
          <Group label="Priority">
            {priorities.map((p: Priority) => (
              <FilterChip
                key={p}
                pressed={filters.priorities.includes(p)}
                onToggle={() => set({ priorities: toggle(filters.priorities, p) })}
              >
                <PriorityDot priority={p} />
                {p}
              </FilterChip>
            ))}
          </Group>
        )}

        {phases.length > 0 && (
          <Group label="Phase">
            {phases.map((p) => (
              <FilterChip
                key={p}
                pressed={filters.phases.includes(p)}
                onToggle={() => set({ phases: toggle(filters.phases, p) })}
              >
                {p}
              </FilterChip>
            ))}
          </Group>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-bold uppercase tracking-wide text-cocoa-500">{label}</span>
      {children}
    </div>
  );
}

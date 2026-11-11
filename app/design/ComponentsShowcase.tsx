"use client";

import { Suspense, useState } from "react";
import { BoardColumn } from "@/components/BoardColumn";
import { Button } from "@/components/Button";
import { FilterChip, PriorityChip, ProjectChip } from "@/components/Chip";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { LoginCard } from "@/components/LoginCard";
import { Mascot } from "@/components/Mascot";
import { SkeletonTicket } from "@/components/SkeletonTicket";
import { TaskTicket } from "@/components/TaskTicket";
import { Toast } from "@/components/Toast";
import { ViewTabs } from "@/components/ViewTabs";
import { DEMO_SOURCES } from "@/lib/demoData";
import { sourceMeta } from "@/lib/sources";
import type { StatusKey, Task } from "@/lib/types";
import { EMPTY_FILTERS } from "@/lib/views";
import { Section, Specimen } from "./Section";

// Fixed date so this page can be prerendered.
const TODAY = "2026-03-12";

const SAMPLES: Task[] = [
  {
    id: "s1",
    sourceId: "thesis",
    title: "Email advisor about survey",
    status: "this_week",
    notionStatusName: "this week",
    due: "2026-03-10",
    priority: "P1",
    phase: "Research",
    url: "#",
    mine: true,
    editedAt: "2026-03-11T10:00:00Z",
  },
  {
    id: "s2",
    sourceId: "garden",
    title: "Order tomato seedlings",
    status: "doing",
    notionStatusName: "Doing",
    due: "2026-03-13",
    url: "#",
    mine: true,
    editedAt: "2026-03-11T10:00:00Z",
  },
  {
    id: "s3",
    sourceId: "sidequest",
    title: "Bake strawberry milk bread",
    status: "done",
    notionStatusName: "Done",
    due: null,
    url: "#",
    mine: true,
    editedAt: "2026-03-11T10:00:00Z",
  },
];

export function ComponentsShowcase() {
  const [tasks, setTasks] = useState(SAMPLES);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [pressed, setPressed] = useState(true);
  const [bounce, setBounce] = useState(0);

  const move = (id: string, status: StatusKey) => {
    setTasks((xs) => xs.map((t) => (t.id === id ? { ...t, status } : t)));
    if (status === "done") setBounce((b) => b + 1);
  };

  return (
    <Section id="components" title="components" intro="The real components, with sample data. Everything here is interactive.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen label="button">
          <Button>refresh</Button>
          <Button variant="secondary">clear filters</Button>
          <Button variant="ghost">show all</Button>
          <Button size="sm">small</Button>
          <Button disabled>disabled</Button>
        </Specimen>

        <Specimen label="chip: project, priority">
          {DEMO_SOURCES.map((s) => (
            <ProjectChip key={s.id} label={s.label} color={s.color} />
          ))}
          <PriorityChip priority="P1" />
          <PriorityChip priority="P2" />
          <PriorityChip priority="P3" />
        </Specimen>

        <Specimen label="filter chip (toggle)">
          <FilterChip pressed={pressed} onToggle={() => setPressed((p) => !p)} color="matcha">
            Thesis
          </FilterChip>
          <FilterChip pressed={!pressed} onToggle={() => setPressed((p) => !p)}>
            P1
          </FilterChip>
        </Specimen>

        <Specimen label="view tabs">
          <Suspense fallback={<div className="h-11 w-72 rounded-pill skeleton-bar" />}>
            <ViewTabs basePath="/demo" />
          </Suspense>
        </Specimen>

        <Specimen label="mascot (click for the happy bounce)">
          <button type="button" onClick={() => setBounce((b) => b + 1)} aria-label="Make the mascot bounce">
            <Mascot size={64} bounceKey={bounce} />
          </button>
          <Mascot size={44} />
          <Mascot size={32} />
          <Mascot size={16} />
        </Specimen>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-panel border border-cream-200 bg-cream-50 p-4">
          <p className="text-xs font-bold tracking-wide text-cocoa-500">
            task ticket (late, brewing, enjoyed)
          </p>
          {tasks.map((t) => (
            <TaskTicket
              key={t.id}
              task={t}
              project={sourceMeta(t.sourceId, DEMO_SOURCES)}
              today={TODAY}
              onStatusChange={(s) => move(t.id, s)}
            />
          ))}
          <p className="text-xs font-bold tracking-wide text-cocoa-500">skeleton ticket</p>
          <SkeletonTicket />
        </div>

        <div className="flex flex-col gap-4">
          <BoardColumn status="doing" label="brewing" hint="in progress" count={1}>
            <TaskTicket task={SAMPLES[1]} project={sourceMeta("garden", DEMO_SOURCES)} today={TODAY} />
          </BoardColumn>
          <BoardColumn status="done" label="enjoyed" hint="last 14 days" count={0} isOver>
            <p className="rounded-card border-2 border-dashed border-cream-200 px-3 py-6 text-center text-sm text-cocoa-500">
              drop here (column while hovered)
            </p>
          </BoardColumn>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Specimen label="filter bar">
          <div className="w-full">
            <FilterBar tasks={tasks} sources={DEMO_SOURCES} filters={filters} onChange={setFilters} />
          </div>
        </Specimen>
        <Specimen label="toast">
          <Toast message="moved to enjoyed." />
          <Toast message="couldn't reach notion. try again in a sec." tone="error" onClose={() => {}} />
        </Specimen>
      </div>

      <div className="mt-4">
        <Specimen label="login card (any password shows the error state)">
          <div className="flex w-full justify-center py-4">
            <LoginCard onSubmit={async () => "that's not it. try again."} />
          </div>
        </Specimen>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <EmptyState title="nothing on the stove." body="go get a snack." />
        <EmptyState
          title="no tickets match."
          body="try fewer filters."
          action={
            <Button variant="secondary" size="sm">
              clear filters
            </Button>
          }
        />
      </div>
    </Section>
  );
}

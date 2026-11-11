"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type KeyboardCoordinateGetter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { sourceMeta, type SourceMeta } from "@/lib/sources";
import { isStatusKey, STATUS_LABEL, STATUSES } from "@/lib/status";
import type { StatusKey, Task } from "@/lib/types";
import { applyFilters, boardColumns, EMPTY_FILTERS, ENJOYED_WINDOW_DAYS } from "@/lib/views";
import { BoardColumn } from "./BoardColumn";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { NoMatches } from "./NoMatches";
import { TaskTicket } from "./TaskTicket";
import { useTasks } from "./TasksContext";
import { useFilters } from "./useFilters";
import { ViewHeader } from "./ViewHeader";

const HINT: Record<StatusKey, string> = {
  backlog: "someday",
  this_week: "this week",
  doing: "in progress",
  done: `last ${ENJOYED_WINDOW_DAYS} days`,
};

const EMPTY_COPY: Record<StatusKey, string> = {
  backlog: "menu's empty.",
  this_week: "no orders yet.",
  doing: "nothing brewing.",
  done: "nothing enjoyed yet.",
};

/** Arrow keys jump a whole column instead of 25px. */
const columnJump: KeyboardCoordinateGetter = (event, { context, currentCoordinates }) => {
  const { collisionRect, droppableRects, droppableContainers } = context;
  if (!collisionRect) return undefined;
  const dir = event.code === "ArrowRight" ? 1 : event.code === "ArrowLeft" ? -1 : 0;
  if (!dir) {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault();
      return currentCoordinates;
    }
    return undefined;
  }
  event.preventDefault();
  const centerX = collisionRect.left + collisionRect.width / 2;
  const target = droppableContainers
    .getEnabled()
    .map((c) => droppableRects.get(c.id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .filter((r) => (dir > 0 ? r.left > centerX : r.right < centerX))
    .sort((a, b) => (dir > 0 ? a.left - b.left : b.left - a.left))[0];
  if (!target) return currentCoordinates;
  return {
    x: target.left + (target.width - collisionRect.width) / 2,
    y: target.top + 56,
  };
};

export function BoardView() {
  const { tasks, sources, today, setStatus, landed } = useTasks();
  const [filters, setFilters] = useFilters();
  const [showAll, setShowAll] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const shown = applyFilters(tasks, filters);
  const cols = boardColumns(shown, today, showAll);
  const hiddenDone = shown.filter((t) => t.status === "done").length - cols.done.length;
  const active = activeId ? tasks.find((t) => t.id === activeId) : undefined;
  const titleOf = (id: string | number) => tasks.find((t) => t.id === id)?.title ?? "ticket";

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: columnJump }),
  );

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over && isStatusKey(over.id) ? `${titleOf(active.id)} is over ${STATUS_LABEL[over.id]}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over && isStatusKey(over.id)
        ? `Moved ${titleOf(active.id)} to ${STATUS_LABEL[over.id]}.`
        : `Put ${titleOf(active.id)} back.`,
    onDragCancel: ({ active }) => `Put ${titleOf(active.id)} back.`,
  };

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const to = e.over?.id;
    if (isStatusKey(to)) setStatus(String(e.active.id), to);
  }

  return (
    <section aria-labelledby="view-title">
      <div id="view-title">
        <ViewHeader title="board" subtitle="your tickets. drag one to move it" />
      </div>
      {tasks.length > 0 && (
        <div className="mb-6">
          <FilterBar tasks={tasks} sources={sources} filters={filters} onChange={setFilters} />
        </div>
      )}
      {tasks.length === 0 ? (
        <EmptyState title="the cafe's quiet." body="no tickets anywhere yet." />
      ) : shown.length === 0 ? (
        <NoMatches onClear={() => setFilters(EMPTY_FILTERS)} />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
          accessibility={{
            announcements,
            screenReaderInstructions: {
              draggable:
                "To move a ticket, press space or enter on its grip. Use the arrow keys to move between columns, then space or enter to drop. Escape cancels.",
            },
          }}
        >
          {/* Phone: columns scroll sideways inside the board. Desktop: four across. */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {STATUSES.map((s) => (
              <div key={s.key} className="w-[82%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
                <DroppableColumn
                  status={s.key}
                  label={s.label}
                  count={cols[s.key].length}
                  footer={
                    s.key === "done" && (hiddenDone > 0 || showAll) ? (
                      <Button variant="ghost" size="sm" onClick={() => setShowAll((v) => !v)}>
                        {showAll ? `only last ${ENJOYED_WINDOW_DAYS} days` : `show all (${hiddenDone} older)`}
                      </Button>
                    ) : null
                  }
                >
                  {cols[s.key].length === 0 ? (
                    <p className="rounded-card border-2 border-dashed border-cream-200 px-3 py-6 text-center text-sm text-cocoa-500">
                      {EMPTY_COPY[s.key]}
                    </p>
                  ) : (
                    cols[s.key].map((t) => (
                      <DraggableTicket
                        key={t.id}
                        task={t}
                        project={sourceMeta(t.sourceId, sources)}
                        today={today}
                        landed={landed?.id === t.id ? landed : undefined}
                        onStatusChange={(next) => setStatus(t.id, next)}
                      />
                    ))
                  )}
                </DroppableColumn>
              </div>
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {active ? (
              <TaskTicket task={active} project={sourceMeta(active.sourceId, sources)} today={today} lifted />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </section>
  );
}

function DroppableColumn({
  status,
  ...rest
}: { status: StatusKey; label: string; count: number; footer: React.ReactNode; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return <BoardColumn status={status} hint={HINT[status]} isOver={isOver} dropRef={setNodeRef} {...rest} />;
}

function DraggableTicket({
  task,
  project,
  today,
  landed,
  onStatusChange,
}: {
  task: Task;
  project: SourceMeta;
  today: string;
  landed?: { n: number; at: number };
  onStatusChange: (s: StatusKey) => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({ id: task.id });
  // Mouse and touch can grab the whole ticket; the keyboard uses the grip so other buttons keep working.
  const { onKeyDown, ...pointerListeners } = listeners ?? {};

  return (
    <div ref={setNodeRef} {...pointerListeners} className={`cursor-grab ${isDragging ? "opacity-40" : ""}`}>
      <TaskTicket
        task={task}
        project={project}
        today={today}
        landed={landed}
        onStatusChange={onStatusChange}
        handle={
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined}
            aria-label={`Drag ${task.title}`}
            className="-ml-2 mt-0.5 grid h-5 w-4 shrink-0 cursor-grab place-items-center rounded text-cocoa-500 hover:text-cocoa-900"
          >
            <svg aria-hidden viewBox="0 0 8 14" className="h-3.5 w-2">
              {[2, 7, 12].map((y) => (
                <g key={y} fill="currentColor">
                  <circle cx="2" cy={y} r="1.2" />
                  <circle cx="6" cy={y} r="1.2" />
                </g>
              ))}
            </svg>
          </button>
        }
      />
    </div>
  );
}

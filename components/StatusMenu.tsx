"use client";

import { useEffect, useId, useRef, useState } from "react";
import { STATUSES } from "@/lib/status";
import { stopDrag } from "@/lib/stopDrag";
import type { StatusKey } from "@/lib/types";

const STATUS_DOT: Record<StatusKey, string> = {
  backlog: "bg-cream-200",
  this_week: "bg-butter-300",
  doing: "bg-milk-pink-500",
  done: "bg-matcha-400",
};

type Props = {
  value: StatusKey;
  onChange: (next: StatusKey) => void;
  /** Used in the accessible name, e.g. "Status for Outline chapter 3". */
  taskTitle: string;
  disabled?: boolean;
};

/** Menu button with arrow-key navigation. Escape closes and returns focus. */
export function StatusMenu({ value, onChange, taskTitle, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();
  const current = STATUSES.find((s) => s.key === value) ?? STATUSES[0];

  useEffect(() => {
    if (!open) return;
    itemRefs.current[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [open]);

  function openMenu(focusIndex = STATUSES.findIndex((s) => s.key === value)) {
    const rect = buttonRef.current?.getBoundingClientRect();
    setUp(!!rect && window.innerHeight - rect.bottom < 200);
    setActive(Math.max(0, focusIndex));
    setOpen(true);
  }

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function pick(key: StatusKey) {
    close();
    if (key !== value) onChange(key);
  }

  function onButtonKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(e.key === "ArrowUp" ? STATUSES.length - 1 : undefined);
    }
  }

  function onMenuKey(e: React.KeyboardEvent) {
    const n = STATUSES.length;
    if (e.key === "ArrowDown") setActive((i) => (i + 1) % n);
    else if (e.key === "ArrowUp") setActive((i) => (i - 1 + n) % n);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") return setOpen(false);
    else return;
    e.preventDefault();
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      // Keep clicks and keys here from starting a drag on the Board.
      {...stopDrag}
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Status for ${taskTitle}: ${current.label}. Change status`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKey}
        className="inline-flex items-center gap-1.5 h-7 pl-2 pr-1.5 rounded-pill border border-cream-200 bg-cream-50 text-xs font-bold text-cocoa-700 hover:bg-milk-pink-100 transition-colors duration-150 ease-out"
      >
        <span aria-hidden className={`size-2 rounded-full ${STATUS_DOT[current.key]}`} />
        {current.label}
        <svg aria-hidden viewBox="0 0 12 12" className="size-3">
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={`Move ${taskTitle} to`}
          onKeyDown={onMenuKey}
          className={`absolute right-0 z-30 w-40 rounded-card border border-cream-200 bg-cream-50 p-1 shadow-lift ${
            up ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {STATUSES.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={s.key === value}
              tabIndex={i === active ? 0 : -1}
              onClick={() => pick(s.key)}
              onMouseEnter={() => setActive(i)}
              className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-sm font-semibold text-cocoa-900 outline-none focus-visible:bg-milk-pink-100 hover:bg-milk-pink-100 aria-checked:bg-milk-pink-100/60"
            >
              <span aria-hidden className={`size-2 rounded-full ${STATUS_DOT[s.key]}`} />
              <span className="flex-1">{s.label}</span>
              {s.key === value && <span aria-hidden>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { STATUS_DOT };

"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Tone = "info" | "error";
type ToastItem = { id: number; message: string; tone: Tone };

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function Toast({ message, tone = "info", onClose }: { message: string; tone?: Tone; onClose?: () => void }) {
  return (
    <div
      className={`animate-toast pointer-events-auto flex items-center gap-3 rounded-pill border px-4 py-2 text-sm font-semibold shadow-lift ${
        tone === "error" ? "bg-butter-300 border-cocoa-700/20 text-cocoa-900" : "bg-cocoa-900 border-cocoa-900 text-cream-50"
      }`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="-mr-1 grid size-6 place-items-center rounded-full hover:bg-cream-50/20"
        >
          <svg aria-hidden viewBox="0 0 12 12" className="size-3">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);

  const show = useCallback(
    (message: string, tone: Tone = "info") => {
      const id = nextId.current++;
      setItems((xs) => [...xs.slice(-2), { id, message, tone }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => (
          <Toast key={t.id} message={t.message} tone={t.tone} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

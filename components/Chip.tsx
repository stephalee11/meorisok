import type { ProjectColor } from "@/lib/sources";
import type { Priority } from "@/lib/types";

const PROJECT_BG: Record<ProjectColor, string> = {
  berry: "bg-milk-pink-300",
  matcha: "bg-matcha-400",
  butter: "bg-butter-300",
  sky: "bg-sky-300",
};

const base = "inline-flex items-center gap-1 rounded-pill px-2 h-6 text-xs font-bold leading-none whitespace-nowrap";

export function ProjectChip({ label, color }: { label: string; color: ProjectColor }) {
  return <span className={`${base} text-cocoa-900 ${PROJECT_BG[color]}`}>{label}</span>;
}

const PRIORITY_DOT: Record<Priority, string> = {
  P1: "bg-berry-600",
  P2: "bg-milk-pink-500",
  P3: "bg-cocoa-500",
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return <span aria-hidden className={`inline-block size-2 rounded-full ${PRIORITY_DOT[priority]}`} />;
}

export function PriorityChip({ priority }: { priority: Priority }) {
  return (
    <span className={`${base} bg-cream-50 border border-cream-200 text-cocoa-700`}>
      <PriorityDot priority={priority} />
      {priority}
    </span>
  );
}

/** Toggle chip for filters. Uses aria-pressed. */
export function FilterChip({
  pressed,
  onToggle,
  color,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  color?: ProjectColor;
  children: React.ReactNode;
}) {
  const on = color ? `${PROJECT_BG[color]} border-cocoa-700` : "bg-milk-pink-300 border-cocoa-700";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-pill border h-8 px-3 text-sm font-semibold text-cocoa-900 transition-colors duration-150 ease-out ${
        pressed ? on : "bg-cream-100 border-cream-200 hover:bg-milk-pink-100"
      }`}
    >
      {color && (
        <span aria-hidden className={`size-2.5 rounded-full border border-cocoa-700/40 ${PROJECT_BG[color]}`} />
      )}
      {children}
      {pressed && <span aria-hidden>✓</span>}
    </button>
  );
}

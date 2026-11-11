import type { Ref } from "react";
import { STATUS_DOT } from "./StatusMenu";
import type { StatusKey } from "@/lib/types";

type Props = {
  status: StatusKey;
  label: string;
  hint: string;
  count: number;
  isOver?: boolean;
  dropRef?: Ref<HTMLElement>;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function BoardColumn({ status, label, hint, count, isOver, dropRef, footer, children }: Props) {
  return (
    <section
      ref={dropRef}
      aria-labelledby={`col-${status}`}
      className={`flex min-h-64 flex-col gap-3 rounded-panel border-2 p-3 transition-colors duration-150 ease-out ${
        isOver ? "border-dashed border-milk-pink-500 bg-milk-pink-100" : "border-transparent bg-cream-100/60"
      }`}
    >
      <header className="flex items-center gap-2 px-1">
        <span aria-hidden className={`size-2.5 rounded-full ${STATUS_DOT[status]}`} />
        <h2 id={`col-${status}`} className="font-display text-lg font-semibold text-cocoa-900">
          {label}
        </h2>
        <span className="text-sm font-bold text-cocoa-500">{count}</span>
        <span className="ml-auto text-xs text-cocoa-500">{hint}</span>
      </header>
      <div className="flex flex-1 flex-col gap-3">{children}</div>
      {footer}
    </section>
  );
}

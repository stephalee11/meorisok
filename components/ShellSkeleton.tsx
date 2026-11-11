import { Mascot } from "./Mascot";
import { SkeletonTicket } from "./SkeletonTicket";

/** Shown while the browser-only app boots. */
export function ShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6" aria-busy="true" aria-label="Loading tickets">
      <div className="flex items-center gap-2 pt-6 pb-4">
        <Mascot size={44} />
        <span className="font-display text-xl font-bold text-cocoa-900">meorisok</span>
      </div>
      <div className="h-11 w-72 max-w-full rounded-pill skeleton-bar" />
      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
        <div className="mb-2 h-8 w-40 rounded-pill skeleton-bar" />
        <SkeletonTicket />
        <SkeletonTicket />
        <SkeletonTicket />
      </div>
    </div>
  );
}

export function SkeletonTicket() {
  return (
    <div className="ticket-wrap" aria-hidden>
      <div className="ticket px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="size-5 rounded-full skeleton-bar" />
          <div className="h-4 flex-1 rounded-pill skeleton-bar" />
          <div className="h-6 w-16 rounded-pill skeleton-bar" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-5 w-20 rounded-pill skeleton-bar" />
          <div className="h-5 w-14 rounded-pill skeleton-bar" />
        </div>
      </div>
    </div>
  );
}

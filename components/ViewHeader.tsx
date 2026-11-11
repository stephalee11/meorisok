export function ViewHeader({ title, subtitle, count }: { title: string; subtitle?: string; count?: number }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h1 className="font-display text-xl font-bold text-cocoa-900 sm:text-2xl">{title}</h1>
      {subtitle && <p className="text-md text-cocoa-500">{subtitle}</p>}
      {count !== undefined && (
        <span className="rounded-pill bg-milk-pink-100 px-2 py-0.5 text-xs font-bold text-cocoa-700">
          {count} {count === 1 ? "ticket" : "tickets"}
        </span>
      )}
    </div>
  );
}

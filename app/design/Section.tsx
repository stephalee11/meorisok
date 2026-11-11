export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 border-t border-cream-200 py-10">
      <h2 id={`${id}-title`} className="font-display text-xl font-bold text-cocoa-900">
        {title}
      </h2>
      {intro && <p className="mt-1 max-w-2xl text-cocoa-500">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-panel border border-cream-200 bg-cream-50 p-4">
      <p className="text-xs font-bold tracking-wide text-cocoa-500">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

import { Mascot } from "./Mascot";

export function EmptyState({
  title,
  body,
  action,
  size = "md",
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  size?: "sm" | "md";
}) {
  const sm = size === "sm";
  return (
    <div
      className={`flex flex-col items-center text-center rounded-panel border-2 border-dashed border-cream-200 ${
        sm ? "gap-1 px-3 py-5" : "gap-2 px-6 py-12"
      }`}
    >
      <Mascot size={sm ? 32 : 64} />
      <p className={`font-display font-semibold text-cocoa-700 ${sm ? "text-sm" : "text-lg"}`}>{title}</p>
      {body && <p className="text-sm text-cocoa-500">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

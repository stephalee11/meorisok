import { sources } from "@/meorisok.config";

/** Client-safe source info (no secrets live in the config, but keep the UI to what it needs). */
export type ProjectColor = "berry" | "matcha" | "butter" | "sky";
export type SourceMeta = { id: string; label: string; color: ProjectColor };

const CYCLE: ProjectColor[] = ["berry", "matcha", "butter", "sky"];

export const SOURCE_META: SourceMeta[] = sources.map((s, i) => ({
  id: s.id,
  label: s.label,
  color: (CYCLE.includes(s.color as ProjectColor) ? s.color : CYCLE[i % CYCLE.length]) as ProjectColor,
}));

export function sourceMeta(id: string, list: SourceMeta[] = SOURCE_META): SourceMeta {
  return list.find((s) => s.id === id) ?? { id, label: id, color: "sky" };
}

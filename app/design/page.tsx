import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { contrast } from "@/lib/contrast";
import { COLORS, hex, RADII, SPACING, TEXT_PAIRS, TYPE_SCALE } from "@/lib/tokens";
import { ComponentsShowcase } from "./ComponentsShowcase";
import { Section } from "./Section";

export const metadata: Metadata = {
  title: "meorisok design system",
  description: "Tokens and components for meorisok, a cozy cafe for your tasks.",
};

const NAV = [
  ["color", "Color"],
  ["contrast", "Contrast"],
  ["type", "Type"],
  ["shape", "Shape and space"],
  ["motion", "Motion"],
  ["components", "Components"],
];

export default function DesignPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <header className="flex flex-wrap items-center gap-4 pt-10 pb-8">
        <Mascot size={64} />
        <div>
          <h1 className="font-display text-2xl font-bold text-cocoa-900">meorisok design system</h1>
          <p className="text-cocoa-500">
            Strawberry milk, cream, and cocoa. Tasks are order tickets.{" "}
            <Link href="/demo">Try the demo</Link>
          </p>
        </div>
      </header>

      <nav aria-label="Sections" className="mb-2 flex flex-wrap gap-2">
        {NAV.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-pill border border-cream-200 bg-cream-100 px-3 py-1 text-sm font-semibold text-cocoa-700 no-underline hover:bg-milk-pink-100"
          >
            {label}
          </a>
        ))}
      </nav>

      <Section id="color" title="Color" intro="Defined once in app/tokens.css as CSS variables, then mapped into Tailwind.">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-card border border-cream-200 bg-cream-50">
              <div className="h-16 border-b border-cream-200" style={{ background: `var(--${c.token})` }} />
              <div className="p-3">
                <p className="font-bold text-cocoa-900">--{c.token}</p>
                <p className="font-mono text-sm text-cocoa-700">{c.hex}</p>
                {"was" in c && (
                  <p className="text-xs text-cocoa-500">
                    was <s>{c.was}</s>, darkened for AA
                  </p>
                )}
                <p className="mt-1 text-sm text-cocoa-500">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="contrast"
        title="Contrast"
        intro="Every text color on every background it sits on. Body text needs 4.5:1 (WCAG AA). Ratios are computed from the hexes above when this page builds."
      >
        <div className="overflow-x-auto rounded-card border border-cream-200">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-cream-100 text-cocoa-700">
              <tr>
                <th scope="col" className="p-3">Sample</th>
                <th scope="col" className="p-3">Text / background</th>
                <th scope="col" className="p-3">Used for</th>
                <th scope="col" className="p-3 text-right">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {TEXT_PAIRS.map((p) => {
                const r = contrast(hex(p.fg), hex(p.bg));
                const pass = r >= 4.5;
                return (
                  <tr key={`${p.fg}-${p.bg}`} className="border-t border-cream-200">
                    <td className="p-3">
                      <span
                        className="inline-block rounded-[8px] px-3 py-1 font-semibold"
                        style={{ color: `var(--${p.fg})`, background: `var(--${p.bg})` }}
                      >
                        Aa ticket
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-cocoa-700">
                      {p.fg} / {p.bg}
                    </td>
                    <td className="p-3 text-cocoa-500">{p.where}</td>
                    <td className="p-3 text-right font-bold whitespace-nowrap">
                      {r.toFixed(2)}:1{" "}
                      <span
                        className={`ml-1 rounded-pill px-2 py-0.5 text-xs ${
                          pass ? "bg-matcha-400 text-cocoa-900" : "bg-butter-300 text-cocoa-900"
                        }`}
                      >
                        {pass ? "AA" : "fails"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-cocoa-500">
          White text fails on every pink, so buttons use cocoa text. Two spec colors were darkened:{" "}
          <code>cocoa-500</code> (#8A6B63, 4.35:1 on cards) and <code>berry-600</code> (#D2587E, 3.70:1 as link
          text).
        </p>
      </Section>

      <Section id="type" title="Type" intro="Fraunces for headings (600-700), Nunito for everything else (400-700). Loaded with next/font.">
        <ul className="flex flex-col gap-4">
          {TYPE_SCALE.map((t) => (
            <li key={t.px} className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <span className="w-28 shrink-0 font-mono text-xs text-cocoa-500">
                {t.px}px · text-{t.token}
              </span>
              <span
                className={t.font === "display" ? "font-display font-bold text-cocoa-900" : "font-sans text-cocoa-900"}
                style={{ fontSize: t.px, lineHeight: 1.2 }}
              >
                {t.sample}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="shape" title="Shape and space">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-bold text-cocoa-700">Radius</h3>
            <ul className="flex flex-col gap-3">
              {RADII.map((r) => (
                <li key={r.name} className="flex items-center gap-3">
                  <span
                    className="block h-10 w-16 border-2 border-milk-pink-500 bg-milk-pink-100"
                    style={{ borderRadius: `var(--radius-${r.name})` }}
                  />
                  <span className="text-sm">
                    <b>{r.name}</b> {r.px} <span className="text-cocoa-500">· {r.use}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-cocoa-700">Spacing (4px base)</h3>
            <ul className="flex flex-col gap-2">
              {SPACING.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className="w-10 font-mono text-cocoa-500">{s}</span>
                  <span className="block h-3 rounded-pill bg-milk-pink-300" style={{ width: s * 2 }} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-cocoa-700">Shadow</h3>
            <div className="rounded-card bg-cream-100 p-4 shadow-sticker">
              <p className="text-sm font-semibold">Sticker shadow</p>
              <p className="font-mono text-xs text-cocoa-500">0 2px 0 cream-200 + faint blur</p>
            </div>
            <div className="mt-4 rounded-card bg-cream-100 p-4 shadow-lift">
              <p className="text-sm font-semibold">Lift (while dragging)</p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="motion"
        title="Motion"
        intro="150-200ms ease-out for hover and drag. Tickets slide onto the pass when they land in a column. The mascot does a small bounce when something is enjoyed. All of it switches off with prefers-reduced-motion."
      >
        <div className="flex flex-wrap gap-6 text-sm text-cocoa-700">
          <span>
            <b>fast</b> 150ms
          </span>
          <span>
            <b>base</b> 200ms
          </span>
          <span>
            <b>ease</b> cubic-bezier(0.22, 1, 0.36, 1)
          </span>
        </div>
      </Section>

      <ComponentsShowcase />
    </div>
  );
}

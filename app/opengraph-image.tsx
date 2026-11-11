import { ImageResponse } from "next/og";
import { MASCOT_HEX, MascotArt } from "@/components/MascotArt";
import { googleFont } from "@/lib/ogFont";

export const alt = "meorisok: a tiny cafe for your Notion tasks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TICKETS = [
  { title: "Outline chapter 3", chip: "Thesis", color: "#A9C9A4" },
  { title: "Order tomato seedlings", chip: "Garden club", color: "#FFB8CA" },
  { title: "Pay internet bill", chip: "Apartment", color: "#F7DC9A" },
];

const HEADLINE = "meorisok";
const TAGLINE = "a tiny cafe for your notion tasks.";

export default async function OpengraphImage() {
  const body = TAGLINE + TICKETS.map((t) => t.title + t.chip).join("");
  const [fraunces, nunito, nunitoBold] = await Promise.all([
    googleFont("Fraunces", 700, HEADLINE),
    googleFont("Nunito", 400, body),
    googleFont("Nunito", 700, body),
  ]);
  const fonts = [
    fraunces && { name: "Fraunces", data: fraunces, weight: 700 as const, style: "normal" as const },
    nunito && { name: "Nunito", data: nunito, weight: 400 as const, style: "normal" as const },
    nunitoBold && { name: "Nunito", data: nunitoBold, weight: 700 as const, style: "normal" as const },
  ].filter((f) => !!f);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF9F3", padding: 72, color: "#3B2622", fontFamily: "Nunito" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <MascotArt c={MASCOT_HEX} size={150} />
          <div style={{ fontSize: 104, fontWeight: 700, marginTop: 16, fontFamily: "Fraunces" }}>{HEADLINE}</div>
          <div style={{ fontSize: 36, color: "#7A5C55", marginTop: 8 }}>{TAGLINE}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, width: 440 }}>
          {TICKETS.map((t) => (
            <div
              key={t.title}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "#FFF1E6",
                borderRadius: 16,
                borderTop: "3px dashed #F6E3D3",
                padding: "22px 26px",
                boxShadow: "0 3px 0 #F6E3D3",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700 }}>{t.title}</div>
              <div style={{ display: "flex" }}>
                <div style={{ background: t.color, borderRadius: 999, padding: "4px 14px", fontSize: 20, fontWeight: 700 }}>{t.chip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

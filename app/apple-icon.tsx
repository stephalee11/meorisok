import { ImageResponse } from "next/og";
import { MASCOT_HEX, MascotArt } from "@/components/MascotArt";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF1E6" }}>
        <MascotArt c={MASCOT_HEX} size={150} />
      </div>
    ),
    size,
  );
}

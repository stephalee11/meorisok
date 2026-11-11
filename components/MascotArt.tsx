/** The mascot's shapes, with colors passed in. Used by <Mascot> (CSS vars) and by the generated icons (hex). */
export type MascotColors = { steam: string; cup: string; outline: string; face: string; cheek: string };

export const MASCOT_HEX: MascotColors = {
  steam: "#7A5C55", // cocoa-500
  cup: "#FFB8CA", // milk-pink-300
  outline: "#5B3F39", // cocoa-700
  face: "#3B2622", // cocoa-900
  cheek: "#F28AA6", // milk-pink-500
};

export function MascotArt({ c, size }: { c: MascotColors; size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <path d="M19 13c-2.5-2.5 2.5-4 0-7M27 13c-2.5-2.5 2.5-4 0-7" fill="none" stroke={c.steam} strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M8 18h30v7a15 15 0 0 1-30 0zM38 22.5a5.5 5.5 0 0 1 0 11"
        fill={c.cup}
        stroke={c.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="18" cy="26" r="1.8" fill={c.face} />
      <circle cx="28" cy="26" r="1.8" fill={c.face} />
      <path d="M20.5 30.5q2.5 2.6 5 0" fill="none" stroke={c.face} strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="14.5" cy="30" rx="2" ry="1.2" fill={c.cheek} />
      <ellipse cx="31.5" cy="30" rx="2" ry="1.2" fill={c.cheek} />
    </svg>
  );
}

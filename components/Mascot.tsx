import { MascotArt, type MascotColors } from "./MascotArt";

type Props = {
  size?: number;
  /** Change this number to play the happy bounce once. 0 = no bounce. */
  bounceKey?: number;
  className?: string;
};

const VARS: MascotColors = {
  steam: "var(--cocoa-500)",
  cup: "var(--milk-pink-300)",
  outline: "var(--cocoa-700)",
  face: "var(--cocoa-900)",
  cheek: "var(--milk-pink-500)",
};

/** A round little cup with a face and steam. Decorative, so hidden from screen readers. */
export function Mascot({ size = 40, bounceKey = 0, className = "" }: Props) {
  return (
    <span
      key={bounceKey}
      className={`inline-block ${bounceKey ? "animate-happy" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <MascotArt c={VARS} size={size} />
    </span>
  );
}

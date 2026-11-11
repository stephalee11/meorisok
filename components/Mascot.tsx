type Props = {
  size?: number;
  /** Change this number to play the happy bounce once. 0 = no bounce. */
  bounceKey?: number;
  className?: string;
  title?: string;
};

/** A round little cup with a face and steam. Three shapes: steam, cup, face. */
export function Mascot({ size = 40, bounceKey = 0, className = "", title }: Props) {
  return (
    <span
      key={bounceKey}
      className={`inline-block ${bounceKey ? "animate-happy" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
      >
        {/* steam */}
        <path
          d="M19 13c-2.5-2.5 2.5-4 0-7M27 13c-2.5-2.5 2.5-4 0-7"
          fill="none"
          stroke="var(--cocoa-500)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* cup with handle */}
        <path
          d="M8 18h30v7a15 15 0 0 1-30 0zM38 22.5a5.5 5.5 0 0 1 0 11"
          fill="var(--milk-pink-300)"
          stroke="var(--cocoa-700)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* face */}
        <g fill="var(--cocoa-900)">
          <circle cx="18" cy="26" r="1.8" />
          <circle cx="28" cy="26" r="1.8" />
          <path d="M20.5 30.5q2.5 2.6 5 0" fill="none" stroke="var(--cocoa-900)" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="14.5" cy="30" rx="2" ry="1.2" fill="var(--milk-pink-500)" />
          <ellipse cx="31.5" cy="30" rx="2" ry="1.2" fill="var(--milk-pink-500)" />
        </g>
      </svg>
    </span>
  );
}

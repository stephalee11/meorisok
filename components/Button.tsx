import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-milk-pink-500 text-cocoa-900 hover:bg-milk-pink-300 active:bg-berry-600 active:text-cream-50 shadow-[0_2px_0_var(--berry-600)]",
  secondary:
    "bg-cream-100 text-cocoa-900 border border-cream-200 hover:bg-milk-pink-100 active:bg-milk-pink-300 shadow-sticker",
  ghost: "bg-transparent text-cocoa-700 hover:bg-milk-pink-100 active:bg-milk-pink-300",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-md gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-pill font-bold whitespace-nowrap transition-colors duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
}

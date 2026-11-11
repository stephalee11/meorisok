/** Mirrors app/tokens.css so /design can show and check the values. Keep in sync. */
export const COLORS = [
  { token: "cream-50", hex: "#FFF9F3", use: "Page background" },
  { token: "cream-100", hex: "#FFF1E6", use: "Cards, panels" },
  { token: "cream-200", hex: "#F6E3D3", use: "Borders, dividers" },
  { token: "milk-pink-100", hex: "#FFE3EA", use: "Soft fills, hover" },
  { token: "milk-pink-300", hex: "#FFB8CA", use: "Tags, highlights, berry project" },
  { token: "milk-pink-500", hex: "#F28AA6", use: "Primary accent, buttons" },
  { token: "berry-600", hex: "#B43F66", use: "Pressed, links", was: "#D2587E" },
  { token: "cocoa-900", hex: "#3B2622", use: "Primary text" },
  { token: "cocoa-700", hex: "#5B3F39", use: "Headings on pink" },
  { token: "cocoa-500", hex: "#7A5C55", use: "Secondary text", was: "#8A6B63" },
  { token: "matcha-400", hex: "#A9C9A4", use: "Second project color" },
  { token: "butter-300", hex: "#F7DC9A", use: "Third project color, late marker" },
  { token: "sky-300", hex: "#B9D8EC", use: "Fourth project color" },
] as const;

export type ColorToken = (typeof COLORS)[number]["token"];

export const hex = (t: ColorToken) => COLORS.find((c) => c.token === t)!.hex;

/** Every text/background pair the UI actually uses. */
export const TEXT_PAIRS: { fg: ColorToken; bg: ColorToken; where: string }[] = [
  { fg: "cocoa-900", bg: "cream-50", where: "Body text on page" },
  { fg: "cocoa-900", bg: "cream-100", where: "Ticket titles" },
  { fg: "cocoa-900", bg: "milk-pink-100", where: "Text on hover" },
  { fg: "cocoa-900", bg: "milk-pink-300", where: "Berry project chip" },
  { fg: "cocoa-900", bg: "milk-pink-500", where: "Primary button" },
  { fg: "cocoa-900", bg: "matcha-400", where: "Matcha project chip" },
  { fg: "cocoa-900", bg: "butter-300", where: "Butter chip, late marker" },
  { fg: "cocoa-900", bg: "sky-300", where: "Sky project chip" },
  { fg: "cocoa-700", bg: "milk-pink-100", where: "Phase chip, headings on pink" },
  { fg: "cocoa-700", bg: "milk-pink-300", where: "Headings on pink" },
  { fg: "cocoa-700", bg: "cream-100", where: "Status menu button" },
  { fg: "cocoa-500", bg: "cream-50", where: "Secondary text on page" },
  { fg: "cocoa-500", bg: "cream-100", where: "Secondary text on tickets" },
  { fg: "cocoa-500", bg: "milk-pink-100", where: "Secondary text on hover" },
  { fg: "berry-600", bg: "cream-50", where: "Links on page" },
  { fg: "berry-600", bg: "cream-100", where: "Links on cards" },
  { fg: "cream-50", bg: "berry-600", where: "Pressed button" },
  { fg: "cream-50", bg: "cocoa-900", where: "Toast" },
];

export const TYPE_SCALE = [
  { px: 40, token: "2xl", font: "display", sample: "Order up" },
  { px: 28, token: "xl", font: "display", sample: "Today" },
  { px: 20, token: "lg", font: "display", sample: "Tomorrow" },
  { px: 16, token: "md", font: "sans", sample: "Outline chapter 3" },
  { px: 14, token: "sm", font: "sans", sample: "Updated 2 min ago" },
  { px: 12, token: "xs", font: "sans", sample: "late · P1 · Research" },
] as const;

export const SPACING = [4, 8, 12, 16, 24, 32, 48];

export const RADII = [
  { name: "card", px: "12px", use: "Tickets" },
  { name: "panel", px: "20px", use: "Columns, panels" },
  { name: "pill", px: "999px", use: "Chips, buttons" },
];

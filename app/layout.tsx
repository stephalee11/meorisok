import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "meorisok",
  description: "All my Notion tasks in one cozy place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

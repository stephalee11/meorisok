import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Suspense fallback={<div className="h-[440px] w-full max-w-sm rounded-panel bg-cream-100" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

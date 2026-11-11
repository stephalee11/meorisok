"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Button } from "./Button";
import { Mascot } from "./Mascot";

type Props = {
  /** Resolve to an error message to show, or null on success. */
  onSubmit: (password: string) => Promise<string | null>;
  onSuccess?: () => void;
};

export function LoginCard({ onSubmit, onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputId = useId();
  const errorId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await onSubmit(password);
    if (err) {
      setError(err);
      setBusy(false);
    } else {
      onSuccess?.();
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm rounded-panel border border-cream-200 bg-cream-100 p-6 shadow-sticker sm:p-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Mascot size={72} />
        <h1 className="font-display text-2xl font-bold text-cocoa-900">meorisok</h1>
        <p className="text-cocoa-500">log in to see your tickets.</p>
      </div>

      <label htmlFor={inputId} className="mt-6 block text-sm font-bold text-cocoa-700">
        password
      </label>
      <input
        id={inputId}
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 h-11 w-full rounded-pill border border-cream-200 bg-cream-50 px-4 text-cocoa-900 hover:border-milk-pink-300 focus:border-berry-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-berry-600 aria-invalid:border-berry-600"
      />
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm font-semibold text-berry-600">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-5 w-full" disabled={busy || !password}>
        {busy ? "checking" : "log in"}
      </Button>

      <p className="mt-4 text-center text-sm text-cocoa-500">
        just looking? <Link href="/demo">try the demo</Link>
      </p>
    </form>
  );
}

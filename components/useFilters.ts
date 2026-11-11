"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { readFilters, writeFilters, type Filters } from "@/lib/views";

/** Filters live in the URL. replaceState keeps typing snappy (no server round trip). */
export function useFilters(): [Filters, (f: Filters) => void] {
  const params = useSearchParams();
  const filters = useMemo(() => readFilters(new URLSearchParams(params.toString())), [params]);
  const setFilters = useCallback((f: Filters) => {
    const next = writeFilters(new URLSearchParams(window.location.search), f).toString();
    window.history.replaceState(null, "", next ? `?${next}` : window.location.pathname);
  }, []);
  return [filters, setFilters];
}

"use client";

import { useEffect, useState } from "react";
import { getApi } from "./api";

export function useResource<T>(path: string | null) {
  const [revision, setRevision] = useState(0);
  const key = `${path}:${revision}`;
  const [result, setResult] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  useEffect(() => {
    if (path === null) return;
    const controller = new AbortController();
    getApi<T>(path, controller.signal).then(data => setResult({ key, data })).catch(error => {
      if (!controller.signal.aborted) setResult({ key, error: error instanceof Error ? error.message : "Could not load this page." });
    });
    return () => controller.abort();
  }, [path, key]);
  const current = result.key === key;
  return { data: current ? result.data : undefined, error: current ? result.error : undefined, loading: path !== null && !current, refresh: () => setRevision(value => value + 1) };
}

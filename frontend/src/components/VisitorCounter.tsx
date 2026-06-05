"use client";

import { useEffect, useState } from "react";

const visitorStorageKey = "navijob.visitor_id";

type VisitorState = {
  count: number | null;
  mode: "supabase" | "local" | null;
  error: boolean;
};

function createVisitorKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorKey() {
  const existingKey = window.localStorage.getItem(visitorStorageKey);

  if (existingKey) {
    return existingKey;
  }

  const visitorKey = createVisitorKey();
  window.localStorage.setItem(visitorStorageKey, visitorKey);
  return visitorKey;
}

export function VisitorCounter() {
  const [visitorState, setVisitorState] = useState<VisitorState>({
    count: null,
    mode: null,
    error: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function recordVisit() {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorKey: getVisitorKey(),
          }),
        });

        if (!response.ok) {
          throw new Error("Visitor counter failed.");
        }

        const data = (await response.json()) as {
          count?: number;
          mode?: "supabase" | "local";
        };

        if (isMounted) {
          setVisitorState({
            count: typeof data.count === "number" ? data.count : null,
            mode: data.mode || null,
            error: false,
          });
        }
      } catch {
        if (isMounted) {
          setVisitorState({
            count: null,
            mode: null,
            error: true,
          });
        }
      }
    }

    recordVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayCount =
    visitorState.count === null
      ? "Counting"
      : new Intl.NumberFormat("en").format(visitorState.count);

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-zinc-200 bg-white/80 px-5 py-4 text-center shadow-sm shadow-zinc-200/70">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
        Visitor counter
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
        {visitorState.error ? "Unavailable" : displayCount}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {visitorState.error
          ? "Counter will reconnect when the visitor API is available."
          : "unique visitors have checked the Navijob launch page."}
      </p>
      {visitorState.mode === "local" && (
        <p className="mt-2 text-xs font-medium text-amber-700">
          Local development counter active.
        </p>
      )}
    </div>
  );
}

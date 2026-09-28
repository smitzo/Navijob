"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useResource } from "@/lib/useResource";

export type AccountUser = { id: number; name: string; email: string; role: "candidate" | "recruiter"; email_verified: boolean };
type Session = { user: AccountUser | null; loading: boolean; error?: string; refresh: () => void };
const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refresh } = useResource<{ user: AccountUser | null }>("auth/session/");
  useEffect(() => {
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);
  return <SessionContext.Provider value={{ user: data?.user ?? null, loading, error, refresh }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession requires SessionProvider");
  return value;
}

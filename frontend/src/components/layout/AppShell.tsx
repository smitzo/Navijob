"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/layout/BrandMark";
import { MenuItem } from "@/components/layout/MenuItem";
import { Button } from "@/components/ui/Button";
import { clearDemoSession, readDemoSession, type DemoRole, type DemoSession } from "@/lib/demoAuth";

type NavigationItem = {
  href: string;
  label: string;
};

type AppShellProps = {
  children: ReactNode;
  activePath: string;
  expectedRole: DemoRole;
  navigationItems: NavigationItem[];
};

export function AppShell({ children, activePath, expectedRole, navigationItems }: AppShellProps) {
  const router = useRouter();
  const [session, setSession] = useState<DemoSession | null>(null);

  useEffect(() => {
    let sessionUpdateTimer: number | null = null;
    const currentSession = readDemoSession();

    if (!currentSession) {
      router.replace("/login");
      return;
    }

    if (currentSession.role !== expectedRole) {
      router.replace(currentSession.role === "candidate" ? "/candidate" : "/recruiter");
      return;
    }

    sessionUpdateTimer = window.setTimeout(() => {
      setSession(currentSession);
    }, 0);

    return () => {
      if (sessionUpdateTimer !== null) {
        window.clearTimeout(sessionUpdateTimer);
      }
    };
  }, [expectedRole, router]);

  function handleSignOut() {
    clearDemoSession();
    router.replace("/login");
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 px-5">
        <p className="text-sm font-semibold text-zinc-600">Checking demo session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <BrandMark />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <MenuItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={activePath === item.href}
                />
              ))}
            </nav>
            <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {session.role}
                </p>
                <p className="text-sm font-bold text-zinc-950">{session.displayName}</p>
              </div>
              <Button type="button" variant="ghost" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/components/auth/SessionProvider";
import { ActionButton, ButtonLink, LoadingState, Notice } from "@/components/ui/Controls";
import { PublicLayout } from "./PublicLayout";

const candidateLinks = [["/candidate", "Overview"], ["/candidate/profile", "Career profile"], ["/candidate/experience", "Experience"], ["/candidate/education", "Education"], ["/candidate/projects", "Projects"], ["/candidate/resumes", "Resume versions"], ["/candidate/saved", "Saved jobs"], ["/candidate/applications", "Applications"], ["/candidate/updates", "Updates"], ["/candidate/settings", "Privacy & settings"]];
const recruiterLinks = [["/recruiter", "Overview"], ["/recruiter/setup", "Company setup"], ["/recruiter/jobs", "Your roles"], ["/recruiter/applicants", "Applications"], ["/recruiter/updates", "Updates"]];

export function Workspace({ children, role }: { children: ReactNode; role: "candidate" | "recruiter" }) {
  const { user, loading, error, refresh } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (!loading && !error && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [loading, error, user, pathname, router]);
  if (loading || (!user && !error)) return <PublicLayout><LoadingState label="Opening your workspace…" /></PublicLayout>;
  if (error) return <PublicLayout><div className="container workspace-content"><Notice kind="error"><p>Your account could not be checked. {error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice></div></PublicLayout>;
  if (user?.role !== role) return <PublicLayout><div className="container workspace-content"><Notice>This area is for {role} accounts. Your account is a {user?.role} account.</Notice><ButtonLink href={user?.role === "recruiter" ? "/recruiter" : "/candidate"}>Open your workspace</ButtonLink></div></PublicLayout>;
  return <PublicLayout><div className="container workspace-grid"><aside className="workspace-sidebar"><div className="workspace-person"><span className="company-initial" aria-hidden="true">{user.name[0] || user.email[0]}</span><div><strong>{user.name || "Your workspace"}</strong><p>{role === "candidate" ? "Your next chapter" : "Your hiring workspace"}</p></div></div><nav aria-label="Workspace navigation">{(role === "candidate" ? candidateLinks : recruiterLinks).map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav><Link className="sidebar-browse" href="/jobs">Explore jobs ↗</Link></aside><div className="workspace-main">{children}</div></div></PublicLayout>;
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ActionButton, ButtonLink, EmptyState, LoadingState, Notice, SelectField } from "@/components/ui/Controls";
import { mutateApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { formatLabel, formatSalary } from "@/lib/formatters";
import type { RecruiterRole } from "./RoleEditor";
import type { RecruiterCompany } from "./CompanySetup";

export function RoleDashboard() {
  const roles = useResource<RecruiterRole[]>("recruiter/jobs/");
  const company = useResource<RecruiterCompany>("recruiter/company/");
  const [filter, setFilter] = useState("");
  const [closing, setClosing] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");
  const data = (roles.data ?? []).filter(role => !filter || role.status === filter);
  async function close(id: number) {
    setPending(true); setFailure("");
    try { await mutateApi(`recruiter/jobs/${id}/close/`); setMessage("Role closed. Existing applications remain available to your team."); setClosing(null); roles.refresh(); }
    catch (reason) { setFailure(reason instanceof Error ? reason.message : "Could not close the role."); }
    finally { setPending(false); }
  }
  if (roles.loading || company.loading) return <LoadingState />;
  if (roles.error || company.error) return <Notice kind="error"><p>{roles.error || company.error}</p><ActionButton variant="outline" onClick={() => { roles.refresh(); company.refresh(); }}>Try again</ActionButton></Notice>;
  if (!company.data?.company) return <EmptyState title="Start with your company." href="/recruiter/setup" action="Introduce your team">Roles belong to a company and publishing follows identity and hiring-authority review.</EmptyState>;
  const canManage = company.data.recruiter?.can_manage_company;
  return <section className="stack"><div className="section-heading"><div><p className="eyebrow">Your hiring, with a clearer view</p><h1>Your roles</h1><p className="muted">{company.data.company.name} · Manage drafts, publication review and open positions.</p></div>{canManage && <ButtonLink href="/recruiter/jobs/new">Create role +</ButtonLink>}</div>{message && <Notice kind="success">{message}</Notice>}{failure && <Notice kind="error">{failure}</Notice>}<SelectField label="Show roles" value={filter} onChange={event => setFilter(event.target.value)}><option value="">All roles</option><option value="draft">Drafts and review requests</option><option value="published">Published</option><option value="closed">Closed</option></SelectField>{data.length ? <div className="stack">{data.map(role => <article className="panel stack" key={role.id}><div className="section-heading"><div><span className="badge">{role.status === "draft" && role.review_requested_at ? "In publication review" : role.status === "draft" && role.review_status === "rejected" ? "Changes requested" : formatLabel(role.status)}</span><h2 className="role-dashboard-title">{role.title}</h2><p className="small-copy muted">{role.location || "Location not shared"} · {formatSalary(role)}</p></div><span className="badge">{role.applications_count ?? 0} applications</span></div>{role.review_feedback && <Notice>{role.review_feedback}</Notice>}<div className="actions"><Link className="button button--outline" href={`/recruiter/jobs/${role.id}/edit`}>{canManage ? "Edit role" : "View role"}</Link><Link className="button button--quiet" href={`/recruiter/applicants?job=${role.id}`}>View applications ↗</Link>{role.status === "published" && <Link className="button button--quiet" href={`/jobs/${role.slug}`}>Public role ↗</Link>}{canManage && role.status !== "closed" && <ActionButton variant="quiet" onClick={() => setClosing(role.id)}>Close role</ActionButton>}</div>{closing === role.id && <Notice><p>Close this role for new applications? Submitted applications and their history will remain.</p><div className="actions"><ActionButton variant="outline" onClick={() => close(role.id)} disabled={pending}>{pending ? "Closing…" : "Confirm close"}</ActionButton><ActionButton variant="quiet" onClick={() => setClosing(null)} disabled={pending}>Keep open</ActionButton></div></Notice>}</article>)}</div> : <EmptyState title={filter ? "No roles in this view." : "Write a clear brief for your next teammate."} href="/recruiter/jobs/new" action="Create your first role">Start with a draft. A publication request follows company and recruiter review.</EmptyState>}</section>;
}

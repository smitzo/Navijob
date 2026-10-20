"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ActionButton, EmptyState, InputField, LoadingState, Notice, SelectField } from "@/components/ui/Controls";
import { useResource } from "@/lib/useResource";
import type { PageResult } from "@/lib/api";
import { formatDate, formatLabel } from "@/lib/formatters";
import type { Job } from "@/lib/types";
import type { RecruiterRole } from "./RoleEditor";

type ApplicantBrief = { id: number; job: Job; status: string; submitted_at: string; candidate: { full_name: string; headline: string; location: string; skills: string[] } };

export function ApplicantList() {
  const search = useSearchParams();
  const params = new URLSearchParams();
  for (const key of ["job", "status", "q", "page"]) { const value = search.get(key); if (value) params.set(key, value); }
  const roles = useResource<RecruiterRole[]>("recruiter/jobs/");
  const { data, loading, error, refresh } = useResource<PageResult<ApplicantBrief>>(`recruiter/applications/?${params}`);
  const current = Number(search.get("page") || 1);
  const pageLink = (page: number) => { const next = new URLSearchParams(params); next.set("page", String(page)); return `/recruiter/applicants?${next}`; };
  return <section className="stack"><div><p className="eyebrow">The people behind each application</p><h1>Applications to your team</h1><p className="muted">Review the profile, projects and resume each candidate chose to submit.</p></div><form action="/recruiter/applicants" method="get" className="panel applicant-filters" key={search.toString()}><InputField label="Search submitted profiles" name="q" defaultValue={search.get("q") ?? ""} maxLength={160} placeholder="Name or headline" /><SelectField label="Role" name="job" defaultValue={search.get("job") ?? ""}><option value="">All company roles</option>{roles.data?.map(role => <option value={role.id} key={role.id}>{role.title}</option>)}</SelectField><SelectField label="Stage" name="status" defaultValue={search.get("status") ?? ""}><option value="">All stages</option>{["submitted", "reviewing", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"].map(value => <option key={value} value={value}>{formatLabel(value)}</option>)}</SelectField><ActionButton type="submit">Find applications</ActionButton></form>{loading ? <LoadingState label="Opening your team’s applications…" /> : error ? <Notice kind="error"><p>{error}</p><div className="actions"><ActionButton onClick={refresh} variant="outline">Try again</ActionButton><Link href="/recruiter/setup">Check company review status</Link></div></Notice> : data?.results.length ? <><p className="small-copy muted">{data.count} applications in this view</p><div className="panel record-list">{data.results.map(application => <article className="record-row" key={application.id}><div><span className="badge">{formatLabel(application.status)}</span><h2 className="application-title"><Link href={`/recruiter/applicants/${application.id}`}>{application.candidate.full_name || "Candidate"}</Link></h2><p>{application.candidate.headline || "Profile headline not provided"}</p><p className="small-copy muted">{application.job.title} · {application.candidate.location || "Location not shared"}</p><p className="small-copy muted">Submitted {formatDate(application.submitted_at)}</p>{Array.isArray(application.candidate.skills) && <div className="actions">{application.candidate.skills.slice(0, 6).map(skill => <span className="badge" key={skill}>{skill}</span>)}</div>}</div><Link className="button button--outline" href={`/recruiter/applicants/${application.id}`}>Review application ↗</Link></article>)}</div>{(data.next || data.previous) && <nav className="pagination" aria-label="Applicant result pages">{data.previous ? <Link className="button button--outline" href={pageLink(current - 1)}>← Previous</Link> : <span />}<span>Page {current}</span>{data.next ? <Link className="button button--outline" href={pageLink(current + 1)}>Next →</Link> : <span />}</nav>}</> : <EmptyState title="No applications in this view yet." href="/recruiter/jobs" action="View your roles">Try another filter or check the publication status of your roles. Published roles do not guarantee applications.</EmptyState>}</section>;
}

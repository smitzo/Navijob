"use client";

import Link from "next/link";
import { useState } from "react";
import { ActionButton, EmptyState, LoadingState, Notice, SelectField } from "@/components/ui/Controls";
import { useResource } from "@/lib/useResource";
import { formatDate, formatLabel } from "@/lib/formatters";
import type { ApplicationRecord } from "@/lib/applications";

export function ApplicationTracker() {
  const [status, setStatus] = useState("");
  const { data, loading, error, refresh } = useResource<ApplicationRecord[]>(`applications/${status ? `?status=${status}` : ""}`);
  return <section className="stack"><div className="section-heading"><div><p className="eyebrow">Keep your next steps in sight</p><h1>Your applications</h1><p className="muted">Applications received on NaviJob, with the profile and resume you submitted.</p></div><SelectField label="Application status" value={status} onChange={event => setStatus(event.target.value)}><option value="">All stages</option>{["submitted", "reviewing", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"].map(value => <option key={value} value={value}>{formatLabel(value)}</option>)}</SelectField></div>{loading ? <LoadingState label="Opening your applications…" /> : error ? <Notice kind="error"><p>{error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice> : data?.length ? <div className="panel record-list">{data.map(application => <article className="record-row" key={application.id}><div><span className="badge">{formatLabel(application.status)}</span><h2 className="application-title"><Link href={`/candidate/applications/${application.id}`}>{application.job.title}</Link></h2><p className="muted">{application.job.company.name} · {application.job.location}</p><p className="small-copy muted">Submitted {formatDate(application.submitted_at)}</p></div><Link className="button button--outline" href={`/candidate/applications/${application.id}`}>View application ↗</Link></article>)}</div> : <EmptyState title={status ? "No applications at this stage." : "Your next chapter starts with a role."} href="/jobs" action="Explore jobs">When you apply on NaviJob, your receipt and submitted profile will appear here. External applications are handled by the employer’s own website.</EmptyState>}</section>;
}

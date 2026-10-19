"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ActionButton, ButtonLink, EmptyState, LoadingState, Notice, SelectField, TextAreaField } from "@/components/ui/Controls";
import { ApiError, asPage, mutateApi, type PageResult } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import type { ApplicationPreview, ApplicationRecord } from "@/lib/applications";
import type { ResumeVersion } from "./ResumeManager";
import type { Job } from "@/lib/types";
import { ApplicationSnapshot } from "./ApplicationSnapshot";
import { formatDate, safeExternalUrl } from "@/lib/formatters";

function SubmissionForm({ preview, refresh }: { preview: ApplicationPreview; refresh: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [stale, setStale] = useState(false);
  const [receipt, setReceipt] = useState<{ id: number; date?: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    const answers = Object.fromEntries(preview.snapshot.questions.map(question => [question.id, String(form.get(`answer-${question.id}`) ?? "")]));
    try {
      const result = await mutateApi<ApplicationRecord>("applications/", { job_id: preview.snapshot.job.id, resume: preview.snapshot.resume.id, review_token: preview.review_token, consent: form.get("consent") === "on", cover_letter: form.get("cover_letter"), answers });
      setReceipt({ id: result.id, date: result.submitted_at });
    } catch (reason) {
      if (reason instanceof ApiError && reason.fields.code === "already_applied") setReceipt({ id: Number(reason.fields.application_id) });
      else { setError(reason instanceof Error ? reason.message : "Could not send this application."); setStale(reason instanceof ApiError && reason.fields.code === "review_changed"); }
    } finally { setPending(false); }
  }
  if (receipt) return <section className="panel stack"><p className="eyebrow">Application received on NaviJob</p><h2>Your next chapter is in motion.</h2><p>Your application to {preview.snapshot.job.company.name} is recorded.{receipt.date ? ` Submitted ${formatDate(receipt.date)}.` : " You already have an application for this role."}</p><Notice>The submitted profile and PDF are saved with this application. This receipt confirms a NaviJob submission, rather than a hiring decision.</Notice><ButtonLink href={`/candidate/applications/${receipt.id}`}>View your application ↗</ButtonLink></section>;
  return <form className="panel stack" onSubmit={submit}><h2>Before you send</h2><fieldset className="stack record-fields" disabled={pending}>{preview.snapshot.questions.map(question => <TextAreaField key={question.id} label={question.label} name={`answer-${question.id}`} required={question.required} maxLength={4000} />)}<TextAreaField label="A note to the team (optional)" name="cover_letter" maxLength={5000} hint="Add useful context for this role." /><label className="checkbox-field"><input name="consent" type="checkbox" required />I’ve reviewed this profile and resume and agree to share them with {preview.snapshot.job.company.name} for this role.</label><p className="small-copy muted">Submitted copies stay with your application if you later edit your profile or remove this resume version.</p></fieldset>{error && <Notice kind="error">{error}</Notice>}{stale ? <ActionButton type="button" onClick={refresh}>Refresh and review again</ActionButton> : <ActionButton type="submit" disabled={pending}>{pending ? "Sending your application…" : "Send application ↗"}</ActionButton>}</form>;
}

export function ApplyReview({ slug }: { slug: string }) {
  const job = useResource<Job>(`jobs/${encodeURIComponent(slug)}/`);
  const resumes = useResource<ResumeVersion[] | PageResult<ResumeVersion>>("resumes/");
  const existing = useResource<ApplicationRecord[]>(job.data ? `applications/?job_id=${job.data.id}` : null);
  const [selected, setSelected] = useState<number | null>(null);
  const versions = resumes.data ? asPage(resumes.data).results : [];
  const chosen = versions.find(version => version.id === selected) ?? versions.find(version => version.is_primary) ?? versions[0];
  const preview = useResource<ApplicationPreview>(chosen && job.data?.application_mode === "native" && job.data.accepting_applications ? `jobs/${encodeURIComponent(slug)}/application-preview/?resume_id=${chosen.id}` : null);
  if (job.loading || resumes.loading || existing.loading) return <LoadingState label="Preparing your application…" />;
  if (job.error || resumes.error) return <Notice kind="error"><p>{job.error || resumes.error}</p><ActionButton onClick={() => { job.refresh(); resumes.refresh(); }} variant="outline">Try again</ActionButton></Notice>;
  if (existing.data?.length) return <section className="panel stack"><h1>You’ve already applied.</h1><p>Your submitted profile and resume are saved with the application.</p><ButtonLink href={`/candidate/applications/${existing.data[0].id}`}>View your application ↗</ButtonLink></section>;
  if (!job.data?.accepting_applications) return <EmptyState title="This role is closed for applications." href="/jobs" action="Explore other roles">Your next opportunity may be with another team.</EmptyState>;
  if (job.data.application_mode !== "native") { const url = safeExternalUrl(job.data.apply_url); return <Notice><p>This role uses the employer’s application site.</p>{url && <a href={url} target="_blank" rel="noopener noreferrer">Open the employer site ↗</a>}</Notice>; }
  if (!chosen) return <EmptyState title="Bring a resume to the next step." href="/candidate/resumes" action="Upload a resume">Upload a PDF first. Then return here to choose your version and review what you’ll share.</EmptyState>;
  return <section className="stack"><div><Link className="back-link" href={`/jobs/${slug}`}>← Back to the role</Link><p className="eyebrow">You choose what goes with you</p><h1>Review your application</h1><p className="muted">{job.data.title} · {job.data.company.name}</p></div><div className="panel stack"><SelectField label="Resume for this role" value={chosen.id} onChange={event => setSelected(Number(event.target.value))}>{versions.map(version => <option key={version.id} value={version.id}>{version.title}{version.is_primary ? " · Default" : ""}</option>)}</SelectField><Link href="/candidate/profile" className="small-copy">Edit your career profile before sending ↗</Link></div>{preview.loading ? <LoadingState label="Loading the exact profile and resume to share…" /> : preview.error ? <Notice kind="error"><p>{preview.error}</p><ActionButton variant="outline" onClick={preview.refresh}>Retry preview</ActionButton></Notice> : preview.data ? <><ApplicationSnapshot snapshot={preview.data.snapshot} downloadUrl={`/api/resumes/${chosen.id}/download/`} /><SubmissionForm preview={preview.data} refresh={preview.refresh} key={preview.data.review_token} /></> : null}</section>;
}

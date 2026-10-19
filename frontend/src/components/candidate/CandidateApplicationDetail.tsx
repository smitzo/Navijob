"use client";

import Link from "next/link";
import { useState } from "react";
import { ActionButton, LoadingState, Notice } from "@/components/ui/Controls";
import { mutateApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { formatDate, formatLabel } from "@/lib/formatters";
import type { ApplicationRecord } from "@/lib/applications";
import { ApplicationSnapshot } from "./ApplicationSnapshot";

export function CandidateApplicationDetail({ id }: { id: string }) {
  const { data, loading, error, refresh } = useResource<ApplicationRecord>(`applications/${encodeURIComponent(id)}/`);
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  async function withdraw() {
    setPending(true); setFailure("");
    try { await mutateApi(`applications/${id}/withdraw/`); setConfirm(false); refresh(); }
    catch (reason) { setFailure(reason instanceof Error ? reason.message : "Could not withdraw this application."); }
    finally { setPending(false); }
  }
  if (loading) return <LoadingState label="Opening your submitted application…" />;
  if (error) return <Notice kind="error"><p>{error}</p><ActionButton variant="outline" onClick={refresh}>Try again</ActionButton></Notice>;
  if (!data) return null;
  return <section className="stack"><div><Link className="back-link" href="/candidate/applications">← Your applications</Link><span className="badge">{formatLabel(data.status)}</span><h1>{data.job.title}</h1><p className="muted">{data.job.company.name} · Submitted {formatDate(data.submitted_at)}</p></div>{failure && <Notice kind="error">{failure}</Notice>}<section className="panel stack"><h2>Application history</h2><ol className="timeline">{data.events.map(event => <li key={event.id}><strong>{formatLabel(event.status)}</strong><span className="small-copy muted">{formatDate(event.created_at)}</span><p className="small-copy">{event.note}</p></li>)}</ol>{!["withdrawn", "rejected", "hired"].includes(data.status) && (confirm ? <Notice><p>Withdraw this application? Your submitted record will remain in its history and you cannot submit another application for this role.</p><div className="actions"><ActionButton onClick={withdraw} disabled={pending}>{pending ? "Withdrawing…" : "Confirm withdrawal"}</ActionButton><ActionButton variant="quiet" onClick={() => setConfirm(false)} disabled={pending}>Keep application</ActionButton></div></Notice> : <div><ActionButton variant="outline" onClick={() => setConfirm(true)}>Withdraw application</ActionButton></div>)}</section><Notice>This is the information shared at submission. Later profile changes do not rewrite this copy.</Notice>{data.snapshot?.candidate && data.snapshot?.resume ? <ApplicationSnapshot snapshot={data.snapshot} downloadUrl={data.resume_download_url} /> : <Notice>This older application does not contain a complete submitted snapshot.</Notice>}{data.cover_letter && <section className="panel"><h2>Your note to the team</h2><p className="preserve-lines">{data.cover_letter}</p></section>}{data.snapshot?.questions?.length ? <section className="panel stack"><h2>Your answers</h2>{data.snapshot.questions.map(question => <div key={question.id}><h3>{question.label}</h3><p className="preserve-lines small-copy">{data.answers[question.id] || "No answer provided."}</p></div>)}</section> : null}</section>;
}

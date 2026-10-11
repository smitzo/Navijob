"use client";

import { useState, type FormEvent } from "react";
import { ActionButton, EmptyState, InputField, LoadingState, Notice } from "@/components/ui/Controls";
import { asPage, mutateApi, type PageResult } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { formatDate } from "@/lib/formatters";

export type ResumeVersion = { id: number; title: string; original_filename: string; file_size: number; is_primary: boolean; created_at: string };

export function ResumeManager() {
  const { data, loading, error, refresh } = useResource<ResumeVersion[] | PageResult<ResumeVersion>>("resumes/");
  const versions = data ? asPage(data).results : [];
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");
  const [renaming, setRenaming] = useState<{ id: number; title: string } | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFailure(""); setMessage("");
    const element = event.currentTarget;
    const form = new FormData(element);
    const file = form.get("pdf_file");
    if (!(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) { setFailure("Choose a PDF of 5 MB or less."); return; }
    setPending(true);
    try { await mutateApi("resumes/", form); element.reset(); setMessage("Resume uploaded. You can choose this version when applying."); refresh(); }
    catch (reason) { setFailure(reason instanceof Error ? reason.message : "Could not upload your resume."); }
    finally { setPending(false); }
  }

  async function change(id: number, action: "rename" | "primary" | "remove") {
    setPending(true); setFailure(""); setMessage("");
    try {
      await mutateApi(`resumes/${id}/${action === "primary" ? "make-primary/" : ""}`, action === "rename" ? { title: renaming?.title } : {}, action === "rename" ? "PATCH" : action === "remove" ? "DELETE" : "POST");
      setMessage(action === "rename" ? "Resume name updated." : action === "primary" ? "Default resume updated. You can still choose a different version for each application." : "Profile version removed. Submitted application copies are retained separately.");
      setRenaming(null); setRemoving(null); refresh();
    } catch (reason) { setFailure(reason instanceof Error ? reason.message : "Could not update this version."); }
    finally { setPending(false); }
  }

  return <section className="stack"><div><p className="eyebrow">The right story for each role</p><h1>Your resume versions</h1><p className="muted">Keep up to four private PDF resumes. Choose the version you want each employer to receive.</p></div>{failure && <Notice kind="error">{failure}</Notice>}{message && <Notice kind="success">{message}</Notice>}<form className="panel stack" onSubmit={upload}><div className="section-heading"><h2>Add a resume</h2><span className="badge">{versions.length} / 4 versions</span></div><div className="grid2"><InputField label="Version name" name="title" required maxLength={160} placeholder="Backend roles · October" disabled={pending || versions.length >= 4} /><InputField label="PDF file" name="pdf_file" type="file" accept=".pdf,application/pdf" required hint="PDF only. Maximum 5 MB." disabled={pending || versions.length >= 4} /></div>{versions.length >= 4 ? <Notice>You’ve reached four versions. Remove one before uploading another.</Notice> : <div><ActionButton type="submit" disabled={pending || loading}>{pending ? "Please wait…" : "Upload resume ↗"}</ActionButton></div>}</form>{loading ? <LoadingState label="Opening your resume versions…" /> : error ? <Notice kind="error"><p>{error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice> : versions.length ? <div className="stack">{versions.map(version => <article className="panel stack" key={version.id}><div className="section-heading"><div><h2>{version.title}</h2><p className="small-copy muted">{version.original_filename || "Resume file"} · {Math.round(version.file_size / 1024)} KB · {formatDate(version.created_at)}</p></div>{version.is_primary && <span className="badge">Default version</span>}</div>{renaming?.id === version.id ? <form className="actions" onSubmit={event => { event.preventDefault(); change(version.id, "rename"); }}><InputField label="New version name" value={renaming.title} onChange={event => setRenaming({ id: version.id, title: event.target.value })} maxLength={160} required /><ActionButton type="submit" disabled={pending}>Save name</ActionButton><ActionButton type="button" variant="quiet" onClick={() => setRenaming(null)}>Cancel</ActionButton></form> : <div className="actions"><a className="button button--outline" href={`/api/resumes/${version.id}/download/`}>Download PDF ↗</a>{!version.is_primary && <ActionButton variant="quiet" onClick={() => change(version.id, "primary")} disabled={pending}>Make default</ActionButton>}<ActionButton variant="quiet" onClick={() => setRenaming({ id: version.id, title: version.title })} disabled={pending}>Rename</ActionButton><ActionButton variant="quiet" onClick={() => setRemoving(version.id)} disabled={pending}>Remove</ActionButton></div>}{removing === version.id && <Notice><p>Remove this version from your profile? Existing submitted copies will remain with their applications.</p><div className="actions"><ActionButton variant="outline" onClick={() => change(version.id, "remove")} disabled={pending}>Confirm removal</ActionButton><ActionButton variant="quiet" onClick={() => setRemoving(null)} disabled={pending}>Keep version</ActionButton></div></Notice>}</article>)}</div> : <EmptyState title="Your first version belongs here.">Upload a resume above. Give each version a useful name so it’s easy to choose the right one later.</EmptyState>}</section>;
}

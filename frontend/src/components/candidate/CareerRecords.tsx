"use client";

import { useState, type FormEvent } from "react";
import { ApiError, asPage, mutateApi, type PageResult } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { safeExternalUrl } from "@/lib/formatters";
import { ActionButton, EmptyState, InputField, LoadingState, Notice, SelectField, TextAreaField } from "@/components/ui/Controls";

export type RecordField = { name: string; label: string; type?: "text" | "date" | "number" | "textarea" | "checkbox" | "url" | "select" | "list"; required?: boolean; hint?: string; maxLength?: number; min?: number; max?: number; nullable?: boolean; options?: [string, string][] };
export type CareerRecord = { id: number } & Record<string, unknown>;
type RecordConfig = { title: string; description: string; endpoint: string; titleKey: string; subtitleKey: string; fields: RecordField[]; emptyTitle: string };

function RecordForm({ config, record, done, cancel }: { config: RecordConfig; record: CareerRecord | null; done: () => void; cancel: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setErrors({});
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {};
    for (const field of config.fields) {
      const value = form.get(field.name);
      body[field.name] = field.type === "checkbox" ? value === "on" : field.type === "list" ? String(value ?? "").split(",").map(item => item.trim()).filter(Boolean) : (value === "" || value === null) && field.nullable ? null : field.type === "number" ? Number(value) : value ?? "";
    }
    try { await mutateApi(`${config.endpoint}${record ? `${record.id}/` : ""}`, body, record ? "PATCH" : "POST"); done(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this entry."); if (reason instanceof ApiError) setErrors(reason.fields); }
    finally { setPending(false); }
  }
  return <form className="panel stack" onSubmit={submit}><h2>{record ? "Edit entry" : "Add an entry"}</h2><fieldset disabled={pending} className="stack record-fields">{config.fields.map(field => {
    const value = record?.[field.name];
    const common = { name: field.name, label: field.label, hint: field.hint, error: errors[field.name], required: field.required };
    if (field.type === "checkbox") return <label key={field.name} className="checkbox-field"><input type="checkbox" name={field.name} defaultChecked={!!value} />{field.label}</label>;
    if (field.type === "textarea") return <TextAreaField key={field.name} {...common} defaultValue={String(value ?? "")} maxLength={field.maxLength} />;
    if (field.type === "select") return <SelectField key={field.name} {...common} defaultValue={String(value ?? field.options?.[0]?.[0] ?? "")}>{field.options?.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</SelectField>;
    return <InputField key={field.name} {...common} type={field.type === "list" ? "text" : field.type ?? "text"} defaultValue={Array.isArray(value) ? value.join(", ") : String(value ?? "")} maxLength={field.maxLength} min={field.min} max={field.max} />;
  })}</fieldset>{error && <Notice kind="error">{error}</Notice>}<div className="actions"><ActionButton type="submit" disabled={pending}>{pending ? "Saving…" : "Save entry"}</ActionButton><ActionButton type="button" variant="quiet" onClick={cancel} disabled={pending}>Cancel</ActionButton></div></form>;
}

export function CareerRecords({ config }: { config: RecordConfig }) {
  const { data, loading, error, refresh } = useResource<CareerRecord[] | PageResult<CareerRecord>>(config.endpoint);
  const rows = data ? asPage(data).results : [];
  const [editing, setEditing] = useState<CareerRecord | "new" | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");
  async function remove(id: number) {
    setPending(true); setFailure("");
    try { await mutateApi(`${config.endpoint}${id}/`, {}, "DELETE"); setRemoving(null); setMessage("Entry removed from your profile. Previously submitted applications keep their submitted snapshot."); refresh(); }
    catch (reason) { setFailure(reason instanceof Error ? reason.message : "Could not remove this entry."); }
    finally { setPending(false); }
  }
  return <section className="stack"><div className="section-heading"><div><p className="eyebrow">Your career, in your words</p><h1>{config.title}</h1><p className="muted">{config.description}</p></div>{!editing && <ActionButton onClick={() => { setMessage(""); setEditing("new"); }}>Add entry +</ActionButton>}</div>{message && <Notice kind="success">{message}</Notice>}{failure && <Notice kind="error">{failure}</Notice>}{editing && <RecordForm config={config} record={editing === "new" ? null : editing} key={editing === "new" ? "new" : editing.id} cancel={() => setEditing(null)} done={() => { setEditing(null); setMessage("Entry saved to your career profile."); refresh(); }} />}{loading ? <LoadingState /> : error ? <Notice kind="error"><p>{error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice> : rows.length ? <div className="panel record-list">{rows.map(record => <article className="record-row" key={record.id}><div><h2>{String(record[config.titleKey] || "Untitled entry")}</h2><p className="muted">{String(record[config.subtitleKey] ?? "")}</p>{record.evidence_status === "candidate_provided" && <span className="badge">Candidate supplied</span>}<div className="actions small-copy">{[["source_url", "Source code"], ["demo_url", "Live demo"]].map(([key, label]) => { const url = safeExternalUrl(String(record[key] || "")); return url ? <a key={key} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a> : null; })}</div>{record.description ? <p className="small-copy preserve-lines">{String(record.description)}</p> : null}</div><div className="actions">{removing === record.id ? <><span className="small-copy">Remove this entry?</span><ActionButton variant="outline" disabled={pending} onClick={() => remove(record.id)}>{pending ? "Removing…" : "Confirm removal"}</ActionButton><ActionButton variant="quiet" onClick={() => setRemoving(null)} disabled={pending}>Keep</ActionButton></> : <><ActionButton variant="outline" onClick={() => setEditing(record)}>Edit</ActionButton><ActionButton variant="quiet" onClick={() => setRemoving(record.id)}>Remove</ActionButton></>}</div></article>)}</div> : !editing && <EmptyState title={config.emptyTitle}>Use “Add entry” to bring the next part of your story into your reusable profile.</EmptyState>}</section>;
}

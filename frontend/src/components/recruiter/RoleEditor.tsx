"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionButton, EmptyState, InputField, LoadingState, Notice, SelectField, TextAreaField } from "@/components/ui/Controls";
import { ApiError, mutateApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import type { Job } from "@/lib/types";
import type { RecruiterCompany } from "./CompanySetup";

export type RecruiterRole = Job & { description: string; experience_min: number; experience_max: number | null; review_status: string; review_feedback: string; review_requested_at: string | null; applications_count: number; responsibilities: string[]; requirements: string[]; benefits: string[] };

function RoleForm({ role, company }: { role?: RecruiterRole; company: RecruiterCompany }) {
  const router = useRouter();
  const [id, setId] = useState<number | null>(role?.id ?? null);
  const [mode, setMode] = useState(role?.application_mode ?? "native");
  const [questions, setQuestions] = useState(role?.application_questions ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const canManage = !!company.recruiter?.can_manage_company;
  const canReview = canManage && company.recruiter?.is_verified && company.company?.is_verified && company.company.review_status === "approved";
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setFields({});
    const action = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value;
    const form = new FormData(event.currentTarget);
    const values: Record<string, unknown> = Object.fromEntries(form);
    for (const key of ["responsibilities", "requirements", "benefits"]) values[key] = String(form.get(key) || "").split("\n").map(item => item.trim()).filter(Boolean);
    values.skills = String(form.get("skills") || "").split(",").map(item => item.trim()).filter(Boolean);
    for (const key of ["salary_min", "salary_max", "experience_max"]) values[key] = form.get(key) ? Number(form.get(key)) : null;
    values.experience_min = Number(form.get("experience_min") || 0);
    values.application_deadline = form.get("application_deadline") || null;
    values.application_questions = questions;
    if (mode === "native") values.apply_url = "";
    try {
      const saved = await mutateApi<RecruiterRole>(id ? `recruiter/jobs/${id}/` : "recruiter/jobs/", values, id ? "PATCH" : "POST");
      setId(saved.id);
      if (action === "review") { await mutateApi(`recruiter/jobs/${saved.id}/submit-review/`); router.push("/recruiter/jobs"); }
      else router.replace(`/recruiter/jobs/${saved.id}/edit`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this role."); if (reason instanceof ApiError) setFields(reason.fields); }
    finally { setPending(false); }
  }
  return <form className="stack" onSubmit={save}>{role?.status === "published" && <Notice>Saving changes returns this role to draft and removes it from discovery until it is reviewed again. Existing applications keep their submitted version.</Notice>}{!canManage && <Notice>This account can view this company’s roles, but a company manager must edit them.</Notice>}<fieldset disabled={pending || !canManage} className="stack record-fields"><section className="panel stack"><h2>The role</h2><InputField label="Role title" name="title" defaultValue={role?.title ?? ""} required maxLength={220} error={fields.title} /><TextAreaField label="About the work and team" name="description" defaultValue={role?.description ?? ""} required maxLength={20000} error={fields.description} hint="Use a useful description of at least 40 characters before requesting publication." /><div className="grid2"><InputField label="Location" name="location" defaultValue={role?.location ?? ""} maxLength={180} error={fields.location} /><SelectField label="Work arrangement" name="work_mode" defaultValue={role?.work_mode ?? "hybrid"}><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></SelectField><SelectField label="Job type" name="job_type" defaultValue={role?.job_type ?? "full_time"}>{[["full_time", "Full-time"], ["internship", "Internship"], ["contract", "Contract"], ["part_time", "Part-time"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField><SelectField label="Seniority" name="seniority" defaultValue={role?.seniority ?? ""}><option value="">Not specified</option>{["intern", "junior", "mid", "senior", "lead", "executive"].map(value => <option key={value} value={value}>{value}</option>)}</SelectField><InputField label="Minimum experience (years)" type="number" name="experience_min" defaultValue={role?.experience_min ?? 0} min={0} max={60} error={fields.experience_min} /><InputField label="Maximum experience (optional)" type="number" name="experience_max" defaultValue={role?.experience_max ?? ""} min={0} max={60} error={fields.experience_max} /></div><InputField label="Skills" name="skills" defaultValue={role?.skills.join(", ") ?? ""} hint="Separate skills with commas." error={fields.skills} /></section><section className="panel stack"><h2>The details candidates need</h2>{[["responsibilities", "What will they work on?"], ["requirements", "What should they bring?"], ["benefits", "What does the team offer?"]].map(([name, label]) => <TextAreaField key={name} label={label} name={name} defaultValue={(role?.[name as "responsibilities" | "requirements" | "benefits"] ?? []).join("\n")} hint="One item per line, up to 30." error={fields[name]} />)}<div className="grid2"><InputField label="Salary minimum" name="salary_min" type="number" min={0} max={1000000000} defaultValue={role?.salary_min ?? ""} error={fields.salary_min} /><InputField label="Salary maximum" name="salary_max" type="number" min={0} max={1000000000} defaultValue={role?.salary_max ?? ""} error={fields.salary_max} /><SelectField label="Currency" name="currency" defaultValue={role?.currency ?? "INR"}>{["INR", "USD", "EUR", "GBP"].map(currency => <option key={currency}>{currency}</option>)}</SelectField><SelectField label="Pay period" name="salary_period" defaultValue={role?.salary_period ?? "year"}><option value="year">Per year</option><option value="month">Per month</option><option value="hour">Per hour</option></SelectField></div><p className="small-copy muted">Leave salary empty if it is unknown. It will be shown as not shared.</p></section><section className="panel stack"><h2>Application details</h2><SelectField label="Where should candidates apply?" name="application_mode" value={mode} onChange={event => setMode(event.target.value as "native" | "external")}><option value="native">Apply on NaviJob</option><option value="external">Employer website</option></SelectField>{mode === "external" && <InputField label="Official application URL" name="apply_url" type="url" required defaultValue={role?.apply_url ?? ""} error={fields.apply_url} />}<InputField label="Application deadline (optional)" name="application_deadline" type="date" defaultValue={role?.application_deadline ?? ""} error={fields.application_deadline} />{mode === "native" && <div className="stack"><h3>Role-specific questions</h3><p className="small-copy muted">Ask only what is needed beyond the reusable profile. Up to 10 questions.</p>{questions.map((question, index) => <div className="panel stack" key={question.id}><InputField label={`Question ${index + 1}`} value={question.label} required maxLength={400} onChange={event => setQuestions(items => items.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} /><label className="checkbox-field"><input type="checkbox" checked={question.required} onChange={event => setQuestions(items => items.map((item, i) => i === index ? { ...item, required: event.target.checked } : item))} />Answer required</label><ActionButton type="button" variant="quiet" onClick={() => setQuestions(items => items.filter((_, i) => i !== index))}>Remove question</ActionButton></div>)}<ActionButton type="button" variant="outline" disabled={questions.length >= 10} onClick={() => setQuestions(items => [...items, { id: crypto.randomUUID(), label: "", required: false }])}>Add a question +</ActionButton></div>}</section></fieldset>{error && <Notice kind="error">{error}</Notice>}{!canReview && <Notice>Company identity and your hiring authority need review before a publication request. You can still save a draft.</Notice>}<div className="actions"><ActionButton type="submit" value="draft" variant="outline" disabled={pending || !canManage}>{pending ? "Saving…" : "Save draft"}</ActionButton><ActionButton type="submit" value="review" disabled={pending || !canReview}>Save and request review ↗</ActionButton><Link href="/recruiter/jobs">Back to your roles</Link></div>{id && <Link className="small-copy" href={`/recruiter/jobs/${id}/edit`}>Open saved draft ↗</Link>}</form>;
}

export function RoleEditor({ id }: { id?: string }) {
  const company = useResource<RecruiterCompany>("recruiter/company/");
  const role = useResource<RecruiterRole>(id ? `recruiter/jobs/${encodeURIComponent(id)}/` : null);
  if (company.loading || role.loading) return <LoadingState />;
  if (company.error || role.error) return <Notice kind="error"><p>{company.error || role.error}</p><ActionButton variant="outline" onClick={() => { company.refresh(); role.refresh(); }}>Try again</ActionButton></Notice>;
  if (!company.data?.company) return <EmptyState title="Introduce your company first." href="/recruiter/setup" action="Set up your company">Roles belong to a company, so start with its identity and your hiring relationship.</EmptyState>;
  return <section className="stack"><div><p className="eyebrow">A clear brief makes a better next step</p><h1>{id ? "Edit your role" : "Create a role"}</h1><p className="muted">{company.data.company.name} · Draft first. Publication follows review.</p></div>{role.data?.review_feedback && <Notice>{role.data.review_feedback}</Notice>}<RoleForm role={role.data} company={company.data} key={role.data?.id ?? "new"} /></section>;
}

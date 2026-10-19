"use client";

import { useState, type FormEvent } from "react";
import { ActionButton, InputField, LoadingState, Notice, SelectField, TextAreaField } from "@/components/ui/Controls";
import { ApiError, mutateApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import type { Company } from "@/lib/types";

export type RecruiterCompany = { company: (Company & { careers_url: string; review_status: string; review_feedback: string }) | null; recruiter: { title: string; is_verified: boolean; can_manage_company: boolean } | null };

function SetupForm({ initial, refresh }: { initial: RecruiterCompany; refresh: () => void }) {
  const company = initial.company;
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setFields({});
    const form = new FormData(event.currentTarget);
    const values = { ...Object.fromEntries(form), declaration: form.get("declaration") === "on" };
    try { await mutateApi("recruiter/company/", values, company ? "PATCH" : "POST"); setMessage(company ? "Company details updated." : "Company details received. Identity and hiring authority need review before publishing."); refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save company details."); if (reason instanceof ApiError) setFields(reason.fields); }
    finally { setPending(false); }
  }
  return <form className="stack" onSubmit={save}>{message && <Notice kind="success">{message}</Notice>}<section className="panel stack"><h2>Introduce your company</h2><div className="grid2"><InputField label="Company name" name="name" defaultValue={company?.name ?? ""} maxLength={180} required disabled={pending || !!company?.is_verified} error={fields.name} /><InputField label="Company website" name="website" type="url" defaultValue={company?.website ?? ""} required disabled={pending || !!company?.is_verified} error={fields.website} /></div>{company?.is_verified && <p className="small-copy muted">Ask the review team to change the reviewed company name or website.</p>}<TextAreaField label="What does your team do?" name="description" defaultValue={company?.description ?? ""} maxLength={8000} required error={fields.description} /><div className="grid2"><InputField label="Industry" name="industry" defaultValue={company?.industry ?? ""} maxLength={120} /><InputField label="Location" name="location" defaultValue={company?.location ?? ""} maxLength={160} /><InputField label="Headquarters" name="headquarters" defaultValue={company?.headquarters ?? ""} maxLength={160} /><InputField label="Your role at the company" name="recruiter_title" defaultValue={initial.recruiter?.title ?? ""} maxLength={160} /><SelectField label="Company size" name="company_size" defaultValue={company?.company_size ?? ""}><option value="">Not shared</option>{[["1_10", "1–10"], ["11_50", "11–50"], ["51_200", "51–200"], ["201_500", "201–500"], ["500_plus", "500+"]].map(([value, label]) => <option key={value} value={value}>{label} people</option>)}</SelectField><SelectField label="Stage" name="stage" defaultValue={company?.stage ?? ""}><option value="">Not shared</option>{[["idea", "Idea"], ["pre_seed", "Pre-seed"], ["seed", "Seed"], ["series_a", "Series A"], ["series_b", "Series B"], ["growth", "Growth"], ["public", "Public"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField></div><InputField label="Careers page (optional)" name="careers_url" type="url" defaultValue={company?.careers_url ?? ""} error={fields.careers_url} />{!company && <label className="checkbox-field"><input name="declaration" type="checkbox" required />I represent this company or have permission to hire for it.</label>}</section>{error && <Notice kind="error">{error}</Notice>}<ActionButton type="submit" disabled={pending || (company !== null && !initial.recruiter?.can_manage_company)}>{pending ? "Saving…" : company ? "Save company details" : "Send for company review ↗"}</ActionButton></form>;
}

export function CompanySetup() {
  const { data, loading, error, refresh } = useResource<RecruiterCompany>("recruiter/company/");
  return <section className="stack"><div><p className="eyebrow">Start with the people behind the role</p><h1>Your company</h1><p className="muted">Share the work your team does. We keep company identity and hiring authority checks separate from account signup.</p></div>{loading ? <LoadingState /> : error ? <Notice kind="error"><p>{error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice> : data ? <>{data.company && <Notice kind={data.company.review_status === "rejected" ? "error" : "info"}><p><strong>Company review: {data.company.review_status.replaceAll("_", " ")}</strong></p><p>{data.company.review_feedback || (data.company.is_verified && data.recruiter?.is_verified ? "Company identity and your hiring authority are marked reviewed." : "You can prepare role drafts. Publishing requires company and recruiter review.")}</p></Notice>}<SetupForm initial={data} refresh={refresh} key={data.company?.id ?? "new"} /></> : null}</section>;
}

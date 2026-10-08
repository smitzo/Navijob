"use client";

import { useState, type FormEvent } from "react";
import { ApiError, mutateApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { ActionButton, InputField, LoadingState, Notice, SelectField, TextAreaField } from "@/components/ui/Controls";

export type CareerProfile = { id: number; full_name: string; email: string; headline: string; current_title: string; summary: string; phone: string; location: string; experience_years: number; notice_period_days: number; preferred_work_mode: string; target_roles: string[]; target_locations: string[]; skills: string[]; portfolio_url: string; linkedin_url: string; github_url: string; available_from: string | null; is_open_to_work: boolean; public_visibility: boolean };

function ProfileForm({ profile }: { profile: CareerProfile }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setMessage(""); setFields({});
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = Object.fromEntries(form);
    for (const key of ["skills", "target_roles", "target_locations"]) body[key] = String(form.get(key) || "").split(",").map(value => value.trim()).filter(Boolean);
    body.experience_years = Number(form.get("experience_years"));
    body.notice_period_days = Number(form.get("notice_period_days"));
    body.available_from = form.get("available_from") || null;
    body.is_open_to_work = form.get("is_open_to_work") === "on";
    try { await mutateApi("me/profile/", body, "PATCH"); setMessage("Your career profile is saved. These details will be ready for your next application."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save your profile."); if (reason instanceof ApiError) setFields(reason.fields); }
    finally { setPending(false); }
  }
  return <form className="stack" onSubmit={save}><section className="panel stack"><h2>The introduction</h2><div className="grid2"><InputField label="Full name" name="full_name" defaultValue={profile.full_name} maxLength={150} minLength={2} required error={fields.full_name} /><InputField label="Email address" type="email" value={profile.email} readOnly hint="Your confirmed account email." /></div><InputField label="Profile headline" name="headline" defaultValue={profile.headline} maxLength={180} placeholder="Backend engineer building useful products" error={fields.headline} /><TextAreaField label="About you" name="summary" defaultValue={profile.summary} maxLength={3000} rows={5} hint="What do you work on, and what would you like to do next?" error={fields.summary} /><div className="grid2"><InputField label="Current title" name="current_title" defaultValue={profile.current_title} maxLength={160} /><InputField label="Location" name="location" defaultValue={profile.location} maxLength={160} error={fields.location} /><InputField label="Phone (optional)" type="tel" name="phone" defaultValue={profile.phone} maxLength={40} /><InputField label="Years of experience" name="experience_years" type="number" min="0" max="60" required defaultValue={profile.experience_years} error={fields.experience_years} /></div></section><section className="panel stack"><h2>Your next move</h2><InputField label="Skills" name="skills" defaultValue={profile.skills.join(", ")} placeholder="Python, PostgreSQL, React" hint="Separate skills with commas. Up to 40 skills." error={fields.skills} /><div className="grid2"><InputField label="Target roles" name="target_roles" defaultValue={profile.target_roles.join(", ")} hint="Separate roles with commas." error={fields.target_roles} /><InputField label="Preferred locations" name="target_locations" defaultValue={profile.target_locations.join(", ")} hint="Separate locations with commas." error={fields.target_locations} /><SelectField label="Preferred work arrangement" name="preferred_work_mode" defaultValue={profile.preferred_work_mode}><option value="flexible">Flexible</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></SelectField><InputField label="Notice period (days)" name="notice_period_days" type="number" min="0" max="365" defaultValue={profile.notice_period_days} error={fields.notice_period_days} /><InputField label="Available from (optional)" name="available_from" type="date" defaultValue={profile.available_from ?? ""} error={fields.available_from} /></div><label className="checkbox-field"><input type="checkbox" name="is_open_to_work" defaultChecked={profile.is_open_to_work} />I’m open to new opportunities</label></section><section className="panel stack"><h2>Links to your work</h2><p className="muted small-copy">These are links you provide, rather than independently verified skill checks.</p><InputField label="Portfolio" name="portfolio_url" type="url" defaultValue={profile.portfolio_url} error={fields.portfolio_url} /><InputField label="GitHub" name="github_url" type="url" defaultValue={profile.github_url} error={fields.github_url} /><InputField label="LinkedIn" name="linkedin_url" type="url" defaultValue={profile.linkedin_url} error={fields.linkedin_url} /></section>{error && <Notice kind="error">{error}</Notice>}{message && <Notice kind="success">{message}</Notice>}<div className="save-bar"><p className="small-copy muted">You’ll review the profile and resume you share before applying.</p><ActionButton type="submit" disabled={pending}>{pending ? "Saving…" : "Save career profile ↗"}</ActionButton></div></form>;
}

export function ProfileEditor() {
  const { data, loading, error, refresh } = useResource<CareerProfile>("me/profile/");
  return <section className="stack"><div><p className="eyebrow">One profile, ready for the next role</p><h1>Your career profile</h1><p className="muted">Keep the details here, so you don’t have to start from scratch.</p></div>{loading ? <LoadingState /> : error ? <Notice kind="error"><p>{error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice> : data ? <ProfileForm profile={data} /> : null}</section>;
}

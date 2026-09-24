"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ActionButton, EmptyState, InputField, LoadingState, Notice, SelectField } from "@/components/ui/Controls";
import { RoleTile } from "./RoleTile";
import { ResultsPagination, ResultsSort } from "./ResultsControls";
import { useResource } from "@/lib/useResource";
import { asPage, type PageResult } from "@/lib/api";
import type { Job } from "@/lib/types";

export function JobsBrowser() {
  const search = useSearchParams();
  const query = new URLSearchParams();
  for (const key of ["q", "location", "work_mode", "job_type", "skill", "experience", "salary_min", "page", "ordering"]) {
    const value = search.get(key);
    if (value) query.set(key, value);
  }
  const { data, error, loading, refresh } = useResource<Job[] | PageResult<Job>>(`jobs/?${query}`);
  const page = data ? asPage(data) : null;
  return <section className="container discovery"><div className="discovery-heading"><p className="eyebrow">A little closer to your next chapter</p><h1>Find work that fits.</h1><p className="muted">Clear role details. Real team context. Your next move, on your terms.</p></div><div className="discovery-layout"><aside><form action="/jobs" method="get" className="stack filter-panel" key={search.toString()}><div className="section-heading"><h2>Find your fit</h2><Link href="/jobs">Clear</Link></div><InputField label="Role or keyword" name="q" defaultValue={search.get("q") ?? ""} maxLength={160} placeholder="Backend, design…" /><InputField label="Location" name="location" defaultValue={search.get("location") ?? ""} maxLength={160} placeholder="City or remote" /><SelectField label="Work arrangement" name="work_mode" defaultValue={search.get("work_mode") ?? ""}><option value="">Any arrangement</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></SelectField><SelectField label="Job type" name="job_type" defaultValue={search.get("job_type") ?? ""}><option value="">Any type</option><option value="full_time">Full-time</option><option value="internship">Internship</option><option value="contract">Contract</option><option value="part_time">Part-time</option></SelectField><InputField label="Skill" name="skill" defaultValue={search.get("skill") ?? ""} placeholder="Python, Figma…" maxLength={60} /><InputField label="Your experience (years)" name="experience" type="number" min="0" max="60" defaultValue={search.get("experience") ?? ""} /><InputField label="Minimum annual salary (INR)" name="salary_min" type="number" min="0" max="100000000" step="10000" defaultValue={search.get("salary_min") ?? ""} hint="Only INR roles with comparable annual pay." /><ActionButton type="submit">Find jobs ↗</ActionButton></form></aside><div><div className="results-toolbar"><p aria-live="polite">{loading ? "Finding roles…" : page ? `${page.count} ${page.count === 1 ? "role" : "roles"}` : "Roles"}</p><ResultsSort /></div>{loading ? <LoadingState label="Finding roles that fit…" /> : error ? <Notice kind="error"><p>{error}</p><ActionButton onClick={refresh} variant="outline">Try again</ActionButton></Notice> : page?.results.length ? <div className="role-grid discovery-results">{page.results.map(job => <RoleTile key={job.id} job={job} />)}</div> : <EmptyState title="No roles match just yet." href="/jobs" action="Clear filters">Try a broader search or a different location. New roles appear after publication review.</EmptyState>}{page && <ResultsPagination count={page.count} next={page.next} previous={page.previous} />}</div></div></section>;
}

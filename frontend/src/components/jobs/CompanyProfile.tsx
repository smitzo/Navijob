"use client";

import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ActionButton, EmptyState, LoadingState, Notice } from "@/components/ui/Controls";
import { RoleTile } from "./RoleTile";
import { useResource } from "@/lib/useResource";
import { formatLabel, safeExternalUrl } from "@/lib/formatters";
import type { Company, Job } from "@/lib/types";

export function CompanyProfile({ slug }: { slug: string }) {
  const { data, loading, error, refresh } = useResource<Company & { jobs: Job[] }>(`companies/${encodeURIComponent(slug)}/`);
  const website = safeExternalUrl(data?.website);
  return <PublicLayout><section className="container company-profile"><Link href="/jobs" className="back-link">← Explore jobs</Link>{loading ? <LoadingState label="Opening the company…" /> : error ? <Notice kind="error"><p>This company profile could not be loaded.</p><ActionButton variant="outline" onClick={refresh}>Try again</ActionButton></Notice> : data ? <><div className="company-heading"><span className="company-initial" aria-hidden="true">{data.name[0]}</span><div><p className="eyebrow">Meet the team</p><h1>{data.name}</h1></div></div>{data.is_sample && <Notice>Fictional company for local preview; not an employer partnership.</Notice>}<div className="company-facts"><span>{data.industry || "Industry not shared"}</span><span>{data.location || data.headquarters || "Location not shared"}</span><span>{data.company_size ? `${data.company_size.replaceAll("_", "–")} people` : "Team size not shared"}</span><span>{data.stage ? formatLabel(data.stage) : "Stage not shared"}</span></div><div className="grid2"><article><h2>About {data.name}</h2><p className="preserve-lines muted">{data.description || "The team hasn’t shared its company story yet."}</p>{website && <a href={website} target="_blank" rel="noopener noreferrer">Company website ↗</a>}</article><aside className="panel"><h2>What the labels mean</h2><p>{data.is_verified ? "Company identity has been reviewed by NaviJob." : "Company identity has not yet been marked reviewed."}</p><p className="small-copy muted">An identity review is a limited company check. It is not a hiring guarantee or independent confirmation of every claim in a role.</p></aside></div><section className="company-roles"><div className="section-heading"><h2>Open roles</h2><span>{data.jobs?.length ?? 0} published</span></div>{data.jobs?.length ? <div className="role-grid">{data.jobs.map(job => <RoleTile key={job.id} job={job} />)}</div> : <EmptyState title="No open roles right now." href="/jobs" action="Explore other teams">Check back when the team has a new opening.</EmptyState>}</section></> : null}</section></PublicLayout>;
}

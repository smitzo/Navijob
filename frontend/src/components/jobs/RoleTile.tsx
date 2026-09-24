import Link from "next/link";
import type { Job } from "@/lib/types";
import { formatSalary } from "@/lib/formatters";

export function RoleTile({ job }: { job: Job }) {
  const salary = formatSalary(job);
  return <article className="role-tile"><div className="role-company"><span className="company-initial" aria-hidden="true">{job.company.name.slice(0, 1)}</span><Link href={`/companies/${job.company.slug}`}>{job.company.name}</Link>{job.is_sample && <span className="badge">Sample</span>}</div><h3><Link href={`/jobs/${job.slug}`}>{job.title}</Link></h3><p className="role-location">{job.location || "Location not shared"} · {job.work_mode.replaceAll("_", " ")}</p><p className="role-salary">{salary}</p><p className="role-description">{job.skills.slice(0, 4).join(" · ") || "See the role for the work, requirements and team context."}</p><Link className="button button--outline role-action" href={`/jobs/${job.slug}`}>View role <span aria-hidden="true">↗</span></Link></article>;
}

import Link from "next/link";
import type { DemoJobWithCompany } from "@/lib/demoMarketplace";
import { formatJobType, formatSalary, formatWorkMode, getExperienceRequirement } from "@/lib/demoMarketplace";

type JobCardProps = {
  job: DemoJobWithCompany;
};

export function JobCard({ job }: JobCardProps) {
  const experienceYears = getExperienceRequirement(job);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-200/70 transition hover:border-teal-300 hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {job.is_premium && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                Premium
              </span>
            )}
            {job.company.is_verified && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Verified company
              </span>
            )}
          </div>

          <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">{job.title}</h3>
          <p className="mt-1 text-sm font-semibold text-zinc-600">
            {job.company.name} · {job.location}
          </p>
        </div>

        <Link
          href={`/candidate/jobs/${job.slug}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-bold text-white transition hover:bg-teal-800"
        >
          View details
        </Link>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2 lg:grid-cols-4">
        <span className="rounded-md bg-zinc-50 px-3 py-2">{formatWorkMode(job.work_mode)}</span>
        <span className="rounded-md bg-zinc-50 px-3 py-2">{formatJobType(job.job_type)}</span>
        <span className="rounded-md bg-zinc-50 px-3 py-2">
          {experienceYears === 0 ? "Fresher friendly" : `${experienceYears}+ years`}
        </span>
        <span className="rounded-md bg-zinc-50 px-3 py-2">{formatSalary(job)}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.slice(0, 6).map((skill) => (
          <span key={skill} className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600">
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

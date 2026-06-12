"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyJobState } from "@/components/jobs/EmptyJobState";
import { JobCard } from "@/components/jobs/JobCard";
import {
  defaultJobFilters,
  JobFilterPanel,
  type JobFilters,
} from "@/components/jobs/JobFilterPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import type { DemoJobsResponse, DemoJobWithCompany } from "@/lib/demoMarketplace";
import { getExperienceRequirement } from "@/lib/demoMarketplace";

function normalizeAnnualSalary(job: DemoJobWithCompany) {
  if (job.salary_period === "year") {
    return job.salary_min;
  }

  if (job.salary_period === "month") {
    return job.salary_min * 12;
  }

  return job.salary_min * 2080;
}

function jobMatchesFilters(job: DemoJobWithCompany, filters: JobFilters) {
  const query = filters.query.trim().toLowerCase();
  const searchableText = [
    job.title,
    job.company.name,
    job.company.industry,
    job.location,
    ...job.skills,
    ...job.requirements,
  ]
    .join(" ")
    .toLowerCase();

  if (query && !searchableText.includes(query)) {
    return false;
  }

  if (filters.location && job.location !== filters.location) {
    return false;
  }

  if (filters.workMode && job.work_mode !== filters.workMode) {
    return false;
  }

  if (filters.jobType && job.job_type !== filters.jobType) {
    return false;
  }

  if (filters.techStack && !job.skills.includes(filters.techStack)) {
    return false;
  }

  if (filters.experience) {
    const requiredExperience = getExperienceRequirement(job);
    const selectedExperience = Number(filters.experience);

    if (selectedExperience === 0 && requiredExperience > 0) {
      return false;
    }

    if (selectedExperience > 0 && requiredExperience < selectedExperience) {
      return false;
    }
  }

  if (filters.salary && normalizeAnnualSalary(job) < Number(filters.salary)) {
    return false;
  }

  return true;
}

export function CandidateJobDiscovery() {
  const [jobs, setJobs] = useState<DemoJobWithCompany[]>([]);
  const [filters, setFilters] = useState<JobFilters>(defaultJobFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        const response = await fetch("/api/demo/jobs");

        if (!response.ok) {
          throw new Error("Could not load demo jobs.");
        }

        const data = (await response.json()) as DemoJobsResponse;

        if (isMounted) {
          setJobs(data.jobs);
          setError("");
        }
      } catch {
        if (isMounted) {
          setError("Demo jobs are unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.location))).sort(),
    [jobs],
  );

  const techStacks = useMemo(
    () => Array.from(new Set(jobs.flatMap((job) => job.skills))).sort(),
    [jobs],
  );

  const filteredJobs = useMemo(
    () => jobs.filter((job) => jobMatchesFilters(job, filters)),
    [jobs, filters],
  );

  const premiumCount = filteredJobs.filter((job) => job.is_premium).length;
  const internshipCount = filteredJobs.filter((job) => job.job_type === "internship").length;

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
          Candidate workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Discover premium startup jobs.
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
          Browse demo jobs with practical filters for location, required experience, tech stack,
          work mode, job type, and salary.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Matching jobs" value={String(filteredJobs.length)} helper="Results after active filters." />
        <MetricCard label="Premium roles" value={String(premiumCount)} helper="Verified higher-signal listings." />
        <MetricCard label="Internships" value={String(internshipCount)} helper="Intern-friendly opportunities." />
      </div>

      <JobFilterPanel
        filters={filters}
        locations={locations}
        techStacks={techStacks}
        onChange={setFilters}
        onReset={() => setFilters(defaultJobFilters)}
      />

      {loading && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm font-semibold text-zinc-600">
          Loading demo jobs...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-zinc-950">Job results</h2>
            <span className="text-sm font-semibold text-zinc-500">
              Showing {filteredJobs.length} of {jobs.length}
            </span>
          </div>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <EmptyJobState onReset={() => setFilters(defaultJobFilters)} />
          )}
        </div>
      )}
    </section>
  );
}

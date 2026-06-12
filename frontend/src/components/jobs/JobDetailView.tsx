"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DemoJobWithCompany } from "@/lib/demoMarketplace";
import { formatJobType, formatSalary, formatWorkMode, getExperienceRequirement } from "@/lib/demoMarketplace";

type JobDetailResponse = {
  job: DemoJobWithCompany;
};

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 size-1.5 rounded-full bg-teal-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function JobDetailView() {
  const params = useParams<{ slug: string }>();
  const [job, setJob] = useState<DemoJobWithCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadJob() {
      try {
        const response = await fetch(`/api/demo/jobs/${params.slug}`);

        if (!response.ok) {
          throw new Error("Could not load demo job.");
        }

        const data = (await response.json()) as JobDetailResponse;

        if (isMounted) {
          setJob(data.job);
          setError("");
        }
      } catch {
        if (isMounted) {
          setError("This demo job could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadJob();

    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm font-semibold text-zinc-600">
        Loading job details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <Card className="p-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-950">Job unavailable</h1>
        <p className="mt-2 text-sm text-zinc-600">{error || "This demo job does not exist."}</p>
        <Link href="/candidate" className="mt-5 inline-flex text-sm font-bold text-teal-700">
          Back to jobs
        </Link>
      </Card>
    );
  }

  const experienceYears = getExperienceRequirement(job);

  return (
    <section className="grid gap-6">
      <Link href="/candidate" className="text-sm font-bold text-teal-700">
        Back to jobs
      </Link>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              {job.is_premium && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Premium
                </span>
              )}
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {job.company.is_verified ? "Verified company" : "Demo company"}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
              {job.title}
            </h1>
            <p className="mt-2 text-base font-semibold text-zinc-600">
              {job.company.name} · {job.location}
            </p>
          </div>
          <Button type="button">Apply in demo</Button>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2 lg:grid-cols-5">
          <span className="rounded-md bg-zinc-50 px-3 py-2">{formatWorkMode(job.work_mode)}</span>
          <span className="rounded-md bg-zinc-50 px-3 py-2">{formatJobType(job.job_type)}</span>
          <span className="rounded-md bg-zinc-50 px-3 py-2">
            {experienceYears === 0 ? "Fresher friendly" : `${experienceYears}+ years`}
          </span>
          <span className="rounded-md bg-zinc-50 px-3 py-2">{formatSalary(job)}</span>
          <span className="rounded-md bg-zinc-50 px-3 py-2">{job.company.stage}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span key={skill} className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600">
              {skill}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <DetailList title="Responsibilities" items={job.responsibilities} />
        <DetailList title="Requirements" items={job.requirements} />
        <DetailList title="Benefits" items={job.benefits} />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-zinc-950">Company context</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {job.company.name} is a {job.company.funding_summary.toLowerCase()} based in{" "}
          {job.company.headquarters}. Hiring focus: {job.company.hiring_focus.join(", ")}.
        </p>
      </Card>
    </section>
  );
}

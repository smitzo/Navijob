export type DemoCompany = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  stage: string;
  company_size: string;
  headquarters: string;
  locations: string[];
  website: string;
  careers_url: string;
  funding_summary: string;
  is_verified: boolean;
  is_premium_partner: boolean;
  hiring_focus: string[];
};

export type DemoJob = {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  status: string;
  job_type: "full_time" | "internship" | "contract" | "part_time";
  seniority: string;
  work_mode: "remote" | "hybrid" | "onsite";
  location: string;
  currency: string;
  salary_min: number;
  salary_max: number;
  salary_period: "year" | "month" | "hour";
  equity_min: number | null;
  equity_max: number | null;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  is_premium: boolean;
};

export type DemoJobWithCompany = DemoJob & {
  company: DemoCompany;
};

export type DemoJobsResponse = {
  jobs: DemoJobWithCompany[];
};

export function formatJobType(jobType: DemoJob["job_type"]) {
  return jobType
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("-");
}

export function formatWorkMode(workMode: DemoJob["work_mode"]) {
  return workMode[0].toUpperCase() + workMode.slice(1);
}

export function formatSalary(job: DemoJob) {
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  const suffix = job.salary_period === "year" ? "yr" : job.salary_period === "month" ? "mo" : "hr";
  return `${job.currency} ${formatter.format(job.salary_min)} - ${formatter.format(job.salary_max)} / ${suffix}`;
}

export function getExperienceRequirement(job: DemoJob) {
  const requirementsText = job.requirements.join(" ").toLowerCase();
  const match = requirementsText.match(/(\d+)\+?\s*years?/);
  return match ? Number(match[1]) : 0;
}

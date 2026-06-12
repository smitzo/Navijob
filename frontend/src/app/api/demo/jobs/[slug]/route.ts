import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { DemoCompany, DemoJob, DemoJobWithCompany } from "@/lib/demoMarketplace";

type CompaniesFile = {
  companies: DemoCompany[];
};

type JobsFile = {
  jobs: DemoJob[];
};

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const dataDirectory = path.join(process.cwd(), "..", "backend", "data");

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataDirectory, fileName);
  const rawFile = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawFile) as T;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  const [jobsFile, companiesFile] = await Promise.all([
    readJsonFile<JobsFile>("demo_jobs.json"),
    readJsonFile<CompaniesFile>("demo_companies.json"),
  ]);

  const job = jobsFile.jobs.find((demoJob) => demoJob.slug === slug && demoJob.status === "published");

  if (!job) {
    return NextResponse.json({ error: "Demo job not found." }, { status: 404 });
  }

  const company = companiesFile.companies.find((demoCompany) => demoCompany.id === job.company_id);

  if (!company) {
    return NextResponse.json({ error: "Demo company not found." }, { status: 404 });
  }

  const enrichedJob: DemoJobWithCompany = {
    ...job,
    company,
  };

  return NextResponse.json({ job: enrichedJob });
}

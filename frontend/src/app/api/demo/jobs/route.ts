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

const dataDirectory = path.join(process.cwd(), "..", "backend", "data");

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataDirectory, fileName);
  const rawFile = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawFile) as T;
}

export async function GET() {
  const [jobsFile, companiesFile] = await Promise.all([
    readJsonFile<JobsFile>("demo_jobs.json"),
    readJsonFile<CompaniesFile>("demo_companies.json"),
  ]);

  const companiesById = new Map(companiesFile.companies.map((company) => [company.id, company]));

  const jobs: DemoJobWithCompany[] = jobsFile.jobs
    .filter((job) => job.status === "published")
    .map((job) => {
      const company = companiesById.get(job.company_id);

      if (!company) {
        throw new Error(`Missing demo company for job ${job.id}.`);
      }

      return {
        ...job,
        company,
      };
    });

  return NextResponse.json({ jobs });
}

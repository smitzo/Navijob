"use client";

import { AppShell } from "@/components/layout/AppShell";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { MetricCard } from "@/components/ui/MetricCard";

type CandidateJobRow = {
  id: string;
  role: string;
  company: string;
  type: string;
  match: string;
  status: string;
};

const candidateNavigation = [
  { href: "/candidate", label: "Dashboard" },
  { href: "/candidate", label: "Jobs" },
  { href: "/candidate", label: "Applications" },
];

const candidateJobs: CandidateJobRow[] = [
  {
    id: "candidate-job-1",
    role: "Fullstack AI Product Engineer",
    company: "Aurora AI Labs",
    type: "Full-time",
    match: "94%",
    status: "Recommended",
  },
  {
    id: "candidate-job-2",
    role: "AI Engineer Intern",
    company: "PromptLane",
    type: "Internship",
    match: "88%",
    status: "New",
  },
  {
    id: "candidate-job-3",
    role: "Machine Learning Engineer",
    company: "VectorGrid",
    type: "Full-time",
    match: "82%",
    status: "Saved",
  },
];

const candidateColumns: DataTableColumn<CandidateJobRow>[] = [
  { key: "role", header: "Role", render: (row) => row.role },
  { key: "company", header: "Company", render: (row) => row.company },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "match", header: "Match", render: (row) => row.match },
  { key: "status", header: "Status", render: (row) => row.status },
];

export default function CandidatePage() {
  return (
    <AppShell activePath="/candidate" expectedRole="candidate" navigationItems={candidateNavigation}>
      <section className="grid gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            Candidate workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            Find premium startup roles faster.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            This is a basic candidate dashboard shell. Next steps can wire it to demo JSON jobs,
            saved roles, and applications.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Recommended jobs" value="18" helper="Curated from demo marketplace data." />
          <MetricCard label="Saved roles" value="3" helper="Roles marked for later review." />
          <MetricCard label="Application draft" value="1" helper="Resume and answers waiting to submit." />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950">Role matches</h2>
            <span className="text-sm font-semibold text-zinc-500">Demo preview</span>
          </div>
          <DataTable columns={candidateColumns} rows={candidateJobs} getRowKey={(row) => row.id} />
        </div>
      </section>
    </AppShell>
  );
}

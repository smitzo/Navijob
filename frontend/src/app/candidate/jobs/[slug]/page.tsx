"use client";

import { AppShell } from "@/components/layout/AppShell";
import { JobDetailView } from "@/components/jobs/JobDetailView";

const candidateNavigation = [
  { href: "/candidate", label: "Jobs" },
  { href: "/candidate", label: "Saved" },
  { href: "/candidate", label: "Applications" },
];

export default function CandidateJobDetailPage() {
  return (
    <AppShell activePath="/candidate" expectedRole="candidate" navigationItems={candidateNavigation}>
      <JobDetailView />
    </AppShell>
  );
}

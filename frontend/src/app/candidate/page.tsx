"use client";

import { CandidateJobDiscovery } from "@/components/candidate/CandidateJobDiscovery";
import { AppShell } from "@/components/layout/AppShell";

const candidateNavigation = [
  { href: "/candidate", label: "Jobs" },
  { href: "/candidate", label: "Saved" },
  { href: "/candidate", label: "Applications" },
];

export default function CandidatePage() {
  return (
    <AppShell activePath="/candidate" expectedRole="candidate" navigationItems={candidateNavigation}>
      <CandidateJobDiscovery />
    </AppShell>
  );
}

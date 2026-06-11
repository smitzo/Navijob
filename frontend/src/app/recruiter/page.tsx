"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectInput, TextInput } from "@/components/ui/FormField";
import { MetricCard } from "@/components/ui/MetricCard";

const recruiterNavigation = [
  { href: "/recruiter", label: "Setup" },
  { href: "/recruiter", label: "Jobs" },
  { href: "/recruiter", label: "Applicants" },
];

const initialRecruiterDetails = {
  fullName: "",
  companyName: "",
  workEmail: "",
  hiringRole: "Fullstack Developer",
  companyStage: "seed",
};

export default function RecruiterPage() {
  const [details, setDetails] = useState(initialRecruiterDetails);
  const [message, setMessage] = useState("");

  function updateField(field: keyof typeof initialRecruiterDetails, value: string) {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Recruiter demo details saved locally for this preview.");
  }

  return (
    <AppShell activePath="/recruiter" expectedRole="recruiter" navigationItems={recruiterNavigation}>
      <section className="grid gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            Recruiter workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
            Set up your hiring profile.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Recruiters land here after choosing recruiter mode. For now this captures the basic
            details needed before posting jobs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Open roles" value="0" helper="Create roles after setup is complete." />
          <MetricCard label="Applicants" value="0" helper="Applicant review comes in the next pass." />
          <MetricCard label="Company profile" value="Draft" helper="Complete details to unlock posting." />
        </div>

        <Card className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Recruiter details
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                This is a frontend-only demo form for the initial recruiter onboarding shape.
              </p>
            </div>

            <TextInput
              label="Full name"
              value={details.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Smit Joshi"
              required
            />
            <TextInput
              label="Work email"
              type="email"
              value={details.workEmail}
              onChange={(event) => updateField("workEmail", event.target.value)}
              placeholder="you@company.com"
              required
            />
            <TextInput
              label="Company name"
              value={details.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
              placeholder="Aurora AI Labs"
              required
            />
            <SelectInput
              label="Primary hiring role"
              value={details.hiringRole}
              onChange={(event) => updateField("hiringRole", event.target.value)}
            >
              <option>Fullstack Developer</option>
              <option>AI Developer</option>
              <option>ML Developer</option>
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
              <option>Interns</option>
            </SelectInput>
            <SelectInput
              label="Company stage"
              value={details.companyStage}
              onChange={(event) => updateField("companyStage", event.target.value)}
            >
              <option value="pre_seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series_a">Series A</option>
              <option value="series_b">Series B</option>
              <option value="growth">Growth</option>
            </SelectInput>

            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center">
              <Button type="submit">Save recruiter details</Button>
              {message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}
            </div>
          </form>
        </Card>
      </section>
    </AppShell>
  );
}

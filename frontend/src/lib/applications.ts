import type { Job } from "./types";
export type ApplicationSnapshot = {
  candidate: { full_name: string; email: string; headline: string; summary: string; phone: string; location: string; skills: string[]; experiences: { id: number; title: string; company: string; start_date: string; end_date: string | null; description: string; is_current: boolean }[]; education: { id: number; qualification: string; institution: string; start_year: number; end_year: number | null }[] };
  projects: { id: number; title: string; description: string; contribution: string; stage: string; stack: string[]; source_url: string; demo_url: string }[];
  resume: { id: number; title: string; filename: string; size: number; sha256: string };
  job: Job;
  questions: { id: string; label: string; required: boolean }[];
};
export type ApplicationRecord = { id: number; job: Job; status: string; submitted_at: string; reviewed_at: string | null; snapshot: ApplicationSnapshot; answers: Record<string, string>; cover_letter: string; events: { id: number; status: string; note: string; created_at: string }[]; resume_download_url: string | null };
export type ApplicationPreview = { snapshot: ApplicationSnapshot; review_token: string };

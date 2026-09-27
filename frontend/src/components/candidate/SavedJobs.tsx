"use client";

import { ActionButton, ButtonLink, EmptyState, LoadingState, Notice } from "@/components/ui/Controls";
import { RoleTile } from "@/components/jobs/RoleTile";
import { asPage, type PageResult } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import type { Job } from "@/lib/types";

export type SavedRole = { id: number; job: Job };

export function SavedJobs() {
  const { data, loading, error, refresh } = useResource<SavedRole[] | PageResult<SavedRole>>("saved-jobs/");
  const roles = data ? asPage(data).results : [];
  return <section className="stack"><div className="section-heading"><div><p className="eyebrow">Keep your options together</p><h1 className="workspace-title">Saved jobs</h1><p className="muted">A shortlist for your next move. Saving a role does not submit an application.</p></div><ButtonLink href="/jobs" variant="outline">Find more roles ↗</ButtonLink></div>{loading ? <LoadingState label="Opening your saved jobs…" /> : error ? <Notice kind="error"><p>{error}</p><div className="actions"><ActionButton onClick={refresh} variant="outline">Try again</ActionButton><ButtonLink href="/login?next=%2Fcandidate%2Fsaved" variant="quiet">Sign in</ButtonLink></div></Notice> : roles.length ? <div className="role-grid">{roles.map(saved => <RoleTile job={saved.job} key={saved.id} />)}</div> : <EmptyState title="Your next move, shortlisted." href="/jobs" action="Find a role to save">Save interesting roles as you browse. They’ll be waiting here when you’re ready.</EmptyState>}</section>;
}

"use client";

import Link from "next/link";
import { RoleTile } from "@/components/jobs/RoleTile";
import { ActionButton, EmptyState, LoadingState, Notice } from "@/components/ui/Controls";
import { asPage, type PageResult } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import type { Job } from "@/lib/types";

export function HomeRoles() {
  const { data, loading, error, refresh } = useResource<Job[] | PageResult<Job>>("jobs/?page_size=3");
  const roles = data ? asPage(data).results.slice(0, 3) : [];
  return <section className="container home-roles"><div className="section-heading"><h2>Find your next chapter.</h2><Link href="/jobs">View all jobs ↗</Link></div><nav className="category-links" aria-label="Browse job categories"><Link href="/jobs">All roles</Link>{["Engineering", "Design", "Product", "Marketing", "Operations"].map(label => <Link key={label} href={`/jobs?q=${encodeURIComponent(label)}`}>{label}</Link>)}</nav>{loading ? <LoadingState label="Finding the latest roles…" /> : error ? <Notice kind="error"><p>{error}</p><ActionButton variant="outline" onClick={refresh}>Try again</ActionButton></Notice> : roles.length ? <div className="role-grid">{roles.map(job => <RoleTile key={job.id} job={job} />)}</div> : <EmptyState title="The next opportunity is on its way." href="/signup" action="Create your profile">There are no published roles to show yet. You can prepare your profile while the first roles are reviewed.</EmptyState>}</section>;
}

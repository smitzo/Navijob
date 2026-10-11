"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function ResultsSort() {
  const search = useSearchParams();
  const router = useRouter();
  return <label className="sort-control">Sort by<select value={search.get("ordering") ?? "newest"} onChange={event => { const query = new URLSearchParams(search); query.set("ordering", event.target.value); query.delete("page"); router.push(`/jobs?${query}`); }}><option value="newest">Newest first</option><option value="salary">Highest annual INR pay</option></select></label>;
}

export function ResultsPagination({ count, next, previous }: { count: number; next: string | null; previous: string | null }) {
  const search = useSearchParams();
  const raw = Number(search.get("page") ?? 1);
  const current = Number.isSafeInteger(raw) && raw > 0 ? raw : 1;
  const link = (page: number) => { const query = new URLSearchParams(search); query.set("page", String(page)); return `/jobs?${query}`; };
  if (!next && !previous) return null;
  return <nav className="pagination" aria-label="Job results pages">{previous ? <Link className="button button--outline" href={link(current - 1)}>← Previous</Link> : <span />}<span>Page {current} · {count} roles</span>{next ? <Link className="button button--outline" href={link(current + 1)}>Next →</Link> : <span />}</nav>;
}

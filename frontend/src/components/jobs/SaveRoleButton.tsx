"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/auth/SessionProvider";
import { ActionButton, Notice } from "@/components/ui/Controls";
import { mutateApi } from "@/lib/api";
import { useResource } from "@/lib/useResource";

export function SaveRoleButton({ jobId, slug }: { jobId: number; slug: string }) {
  const { user } = useSession();
  const { data, loading, error: lookupError, refresh } = useResource<{ id: number }[]>(user?.role === "candidate" ? `saved-jobs/?job_id=${jobId}` : null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  if (!user) return <Link className="button button--outline" href={`/login?next=${encodeURIComponent(`/jobs/${slug}`)}`}>Sign in to save this role</Link>;
  if (user.role !== "candidate") return null;
  async function toggle() {
    setPending(true); setError("");
    try { if (data?.[0]) await mutateApi(`saved-jobs/${data[0].id}/`, {}, "DELETE"); else await mutateApi("saved-jobs/", { job_id: jobId }); refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update saved jobs."); }
    finally { setPending(false); }
  }
  return <div className="stack"><ActionButton variant="outline" onClick={toggle} disabled={pending || loading || !!lookupError}>{pending ? "Updating…" : data?.length ? "Saved · Remove" : "Save this role"}</ActionButton>{lookupError && <Notice kind="error"><p>{lookupError}</p><ActionButton variant="outline" onClick={refresh}>Retry saved status</ActionButton></Notice>}{error && <Notice kind="error">{error}</Notice>}</div>;
}

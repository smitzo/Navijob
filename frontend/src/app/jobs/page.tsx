import { Suspense } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { JobsBrowser } from "@/components/jobs/JobsBrowser";
import { LoadingState } from "@/components/ui/Controls";

export default function JobsPage() {
  return <PublicLayout><Suspense fallback={<LoadingState label="Preparing job search…" />}><JobsBrowser /></Suspense></PublicLayout>;
}

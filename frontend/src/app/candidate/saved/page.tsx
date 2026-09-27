import { PublicLayout } from "@/components/layout/PublicLayout";
import { SavedJobs } from "@/components/candidate/SavedJobs";

export default function SavedJobsPage() {
  return <PublicLayout><div className="container workspace-content"><SavedJobs /></div></PublicLayout>;
}

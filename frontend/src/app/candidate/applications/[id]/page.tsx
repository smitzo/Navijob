import { Workspace } from "@/components/layout/Workspace";
import { CandidateApplicationDetail } from "@/components/candidate/CandidateApplicationDetail";
export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Workspace role="candidate"><CandidateApplicationDetail id={id} /></Workspace>; }

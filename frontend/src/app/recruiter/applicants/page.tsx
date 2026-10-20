import { Suspense } from "react";
import { Workspace } from "@/components/layout/Workspace";
import { ApplicantList } from "@/components/recruiter/ApplicantList";
import { LoadingState } from "@/components/ui/Controls";
export default function ApplicantsPage() { return <Workspace role="recruiter"><Suspense fallback={<LoadingState />}><ApplicantList /></Suspense></Workspace>; }

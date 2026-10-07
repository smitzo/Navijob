import { Suspense } from "react";
import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { LoadingState } from "@/components/ui/Controls";
export default function ConfirmEmailPage() { return <Suspense fallback={<LoadingState />}><RecoveryForm mode="confirm" /></Suspense>; }

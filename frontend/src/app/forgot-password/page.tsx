import { Suspense } from "react";
import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { LoadingState } from "@/components/ui/Controls";
export default function ForgotPasswordPage() { return <Suspense fallback={<LoadingState />}><RecoveryForm mode="recovery" /></Suspense>; }

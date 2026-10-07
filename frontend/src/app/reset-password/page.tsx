import { Suspense } from "react";
import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { LoadingState } from "@/components/ui/Controls";
export default function ResetPasswordPage() { return <Suspense fallback={<LoadingState />}><RecoveryForm mode="reset" /></Suspense>; }

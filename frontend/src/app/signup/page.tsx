import { AuthForm } from "@/components/auth/AuthForm";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/Controls";

export default function SignupPage() {
  return <Suspense fallback={<LoadingState />}><AuthForm mode="signup" /></Suspense>;
}

import { AuthForm } from "@/components/auth/AuthForm";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/Controls";

export default function LoginPage() {
  return <Suspense fallback={<LoadingState />}><AuthForm mode="login" /></Suspense>;
}

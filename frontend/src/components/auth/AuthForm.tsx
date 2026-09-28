"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionButton, InputField, Notice, SelectField } from "@/components/ui/Controls";
import { ApiError, mutateApi, safeReturnPath } from "@/lib/api";
import { AccountLayout } from "./AccountLayout";
import { useSession, type AccountUser } from "./SessionProvider";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const search = useSearchParams();
  const router = useRouter();
  const { refresh } = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(""); setFields({});
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (signup) {
        const result = await mutateApi<{ detail: string }>("auth/signup/", data);
        setMessage(result.detail);
      } else {
        const { user } = await mutateApi<{ user: AccountUser }>("auth/login/", data);
        refresh();
        router.replace(safeReturnPath(search.get("next"), user.role));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn’t complete this request.");
      if (reason instanceof ApiError) setFields(reason.fields);
    } finally { setPending(false); }
  }

  return <AccountLayout title={signup ? "Your next chapter starts here." : "Good to see you again."} description={signup ? "Create a profile once. Keep your experience and resume versions together." : "Sign in to your profile, applications and saved roles."}>{message ? <div className="stack"><Notice kind="success">{message}</Notice><Link href="/confirm-email">Resend a confirmation link</Link><Link className="button button--primary" href="/login">Go to sign in ↗</Link></div> : <form className="stack" onSubmit={submit}>{signup && <InputField label="Full name" name="name" autoComplete="name" minLength={2} maxLength={150} required error={fields.name} />}<InputField label="Email address" name="email" type="email" autoComplete="email" required maxLength={150} error={fields.email} /><InputField label="Password" name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 10 : 1} maxLength={128} required error={fields.password} hint={signup ? "At least 10 characters. Avoid common passwords." : undefined} />{signup && <SelectField label="What brings you here?" name="role" defaultValue={search.get("role") === "recruiter" ? "recruiter" : "candidate"}><option value="candidate">I’m looking for work</option><option value="recruiter">I’m hiring for my team</option></SelectField>}{error && <Notice kind="error">{error}</Notice>}<ActionButton type="submit" disabled={pending}>{pending ? "Please wait…" : signup ? "Create account ↗" : "Sign in ↗"}</ActionButton>{signup ? <p className="small-copy muted">By creating an account, you agree to our <Link href="/terms">terms</Link> and acknowledge the <Link href="/privacy">privacy notice</Link>.</p> : <div className="actions account-help"><Link href="/forgot-password">Forgot password?</Link><Link href="/confirm-email">Confirm your email</Link></div>}<p className="account-switch">{signup ? "Already have an account?" : "New to NaviJob?"} <Link href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create your profile"}</Link></p></form>}</AccountLayout>;
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionButton, InputField, Notice } from "@/components/ui/Controls";
import { mutateApi } from "@/lib/api";
import { AccountLayout } from "./AccountLayout";

export function RecoveryForm({ mode }: { mode: "confirm" | "recovery" | "reset" }) {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token");
  const uid = search.get("uid");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const title = mode === "confirm" ? "A quick email check." : mode === "recovery" ? "Let’s get you back in." : "A fresh password.";
  const description = mode === "confirm" ? "Confirm your email before signing in, or request a fresh confirmation link." : mode === "recovery" ? "Enter your account email and we’ll send a password reset link if it exists." : "Choose a strong new password for your account.";
  const missingLink = mode === "reset" && (!uid || !token);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (mode === "reset" && form.password !== form.confirm_password) { setError("The passwords do not match."); setPending(false); return; }
    try {
      const endpoint = mode === "reset" ? "reset-password" : mode === "recovery" ? "recovery" : token ? "confirm-email" : "resend-confirmation";
      const body = mode === "reset" ? { uid, token, password: form.password } : mode === "confirm" && token ? { token } : { email: form.email };
      const result = await mutateApi<{ detail: string }>(`auth/${endpoint}/`, body);
      setMessage(result.detail);
      if (token) router.replace(mode === "reset" ? "/reset-password" : "/confirm-email", { scroll: false });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); }
    finally { setPending(false); }
  }

  return <AccountLayout title={title} description={description}>{message ? <div className="stack"><Notice kind="success">{message}</Notice><Link className="button button--primary" href="/login">Continue to sign in ↗</Link></div> : missingLink ? <div className="stack"><Notice kind="error">This reset link is incomplete. Request a new one to continue.</Notice><Link href="/forgot-password">Request a new reset link</Link></div> : <form className="stack" onSubmit={submit}>{mode === "reset" ? <><InputField label="New password" name="password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required hint="Use at least 10 characters." /><InputField label="Confirm new password" name="confirm_password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /></> : mode === "confirm" && token ? <Notice>Confirm that this email belongs to you, then sign in with your password.</Notice> : <InputField label="Email address" name="email" type="email" maxLength={150} autoComplete="email" required />}{error && <Notice kind="error">{error}</Notice>}<ActionButton type="submit" disabled={pending}>{pending ? "Please wait…" : mode === "reset" ? "Save new password ↗" : mode === "confirm" && token ? "Confirm my email ↗" : "Send link ↗"}</ActionButton><Link className="small-copy" href="/login">Back to sign in</Link></form>}</AccountLayout>;
}

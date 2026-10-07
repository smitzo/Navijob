"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutateApi } from "@/lib/api";
import { useSession } from "./SessionProvider";

export function AccountMenu() {
  const { user, refresh } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setPending(true); setError("");
    try { await mutateApi("auth/logout/"); refresh(); router.push("/"); }
    catch { setError("Couldn’t sign out. Please try again."); }
    finally { setPending(false); }
  }
  return user ? <><Link href={user.role === "recruiter" ? "/recruiter" : "/candidate"}>Your workspace ↗</Link><button className="button button--quiet" disabled={pending} onClick={signOut}>{pending ? "Signing out…" : "Sign out"}</button>{error && <span role="alert" className="small-copy">{error}</span>}</> : <><Link href="/login">Sign in</Link><Link className="button button--primary" href="/signup">Create profile ↗</Link></>;
}

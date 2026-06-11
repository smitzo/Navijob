"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectInput, TextInput } from "@/components/ui/FormField";
import {
  authenticateDemoUser,
  saveDemoSession,
  type DemoCredentials,
  type DemoRole,
} from "@/lib/demoAuth";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const initialCredentials: DemoCredentials = {
  username: "demo",
  password: "demo",
  role: "candidate",
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [credentials, setCredentials] = useState<DemoCredentials>(initialCredentials);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  function updateField(field: keyof DemoCredentials, value: string) {
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [field]: field === "role" ? (value as DemoRole) : value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const session = authenticateDemoUser(credentials);

    if (!session) {
      setError("Use demo/demo or admin/admin for this demo build.");
      return;
    }

    saveDemoSession(session);
    router.replace(session.role === "candidate" ? "/candidate" : "/recruiter");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ecfeff_52%,#fff7ed_100%)] px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between gap-10">
        <nav className="flex items-center justify-between">
          <BrandMark />
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="rounded-md border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm shadow-zinc-200/60 transition hover:border-teal-700 hover:text-teal-800"
          >
            {isSignup ? "Login" : "Sign up"}
          </Link>
        </nav>

        <section className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
              Demo access
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {isSignup ? "Create a demo workspace role." : "Enter the Navijob demo workspace."}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              Pick candidate or recruiter, then use one of the bypass users:
              `demo/demo` or `admin/admin`. This is client-side demo access only.
            </p>
          </div>

          <Card className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {isSignup ? "Demo signup" : "Demo login"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Choose how you want to enter the product preview.
                </p>
              </div>

              <TextInput
                label="Username"
                name="username"
                value={credentials.username}
                onChange={(event) => updateField("username", event.target.value)}
                autoComplete="username"
                required
              />

              <TextInput
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />

              <SelectInput
                label="Continue as"
                name="role"
                value={credentials.role}
                onChange={(event) => updateField("role", event.target.value)}
                helper="Candidate sees job discovery. Recruiter starts company/recruiter setup."
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </SelectInput>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full">
                {isSignup ? "Create demo session" : "Continue"}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </main>
  );
}

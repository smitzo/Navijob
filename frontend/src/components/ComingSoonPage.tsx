import Image from "next/image";
import { siteConfig } from "@/config/site";
import { FeatureCard } from "./FeatureCard";
import { VisitorCounter } from "./VisitorCounter";
import { WaitlistForm } from "./WaitlistForm";

const proofPoints = [
  "Verified startup roles",
  "Compensation clarity",
  "Recruiter-led hiring",
];

export function ComingSoonPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fafaf9_0%,#ecfeff_48%,#fff7ed_100%)]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-5 py-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
        <div className="flex flex-col justify-between gap-10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md bg-zinc-950 text-base font-black text-white">
                N
              </div>
              <span className="text-base font-bold text-zinc-950">
                {siteConfig.name}
              </span>
            </div>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="rounded-md border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm shadow-zinc-200/60 transition hover:border-teal-700 hover:text-teal-800"
            >
              Contact
            </a>
          </nav>

          <div className="max-w-3xl py-4 lg:py-10">
            <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
              Coming soon
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
              Premium startup jobs for people who want a sharper career move.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              {siteConfig.description} Join early and get notified when curated
              roles, recruiter access, and application tools open.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm shadow-zinc-200/60"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-3">
            <FeatureCard
              eyebrow="Curated"
              title="No noisy job dumps"
              description="Roles are shaped around startup quality, verified company signals, and clear candidate fit."
            />
            <FeatureCard
              eyebrow="Premium"
              title="Salary and equity matter"
              description="Listings are designed to show compensation, equity, stage, and work mode without guesswork."
            />
            <FeatureCard
              eyebrow="Focused"
              title="Built for startup hiring"
              description="Applicant profiles, recruiter ownership, and job applications are modeled from day one."
            />
          </div>
        </div>

        <aside className="flex flex-col justify-center gap-6 pb-10 lg:pb-0">
          <div className="relative overflow-hidden rounded-lg border border-white/80 bg-white/70 p-2 shadow-2xl shadow-teal-900/10">
            <Image
              src="/hero-jobs-dashboard.png"
              alt="Navijob startup jobs dashboard preview"
              width={1280}
              height={768}
              priority
              className="aspect-[16/10] rounded-md object-cover"
            />
          </div>

          <WaitlistForm />
          <VisitorCounter />
        </aside>
      </section>
    </main>
  );
}

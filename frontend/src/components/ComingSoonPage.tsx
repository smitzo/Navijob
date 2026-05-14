import { siteConfig } from "@/config/site";
import { FeatureCard } from "./FeatureCard";
import { WaitlistForm } from "./WaitlistForm";

export function ComingSoonPage() {
  return (
    <main className="page-shell">
      <section className="hero-grid">
        <div className="hero-content">
          <div className="brand-row">
            <div className="brand-mark">N</div>
            <span>{siteConfig.name}</span>
          </div>

          <p className="pill">Coming soon for freshers and early-career talent</p>
          <h1>{siteConfig.tagline}</h1>
          <p className="hero-copy">{siteConfig.description}</p>

          <div className="trust-row">
            <span>Verified jobs</span>
            <span>ATS-ready resumes</span>
            <span>Smart alerts</span>
          </div>
        </div>

        <WaitlistForm />
      </section>

      <section className="features-grid" aria-label="Navijob features">
        <FeatureCard
          title="Curated fresher jobs"
          description="No spammy listings. Navijob focuses on relevant opportunities for students, freshers, and early-career professionals."
        />
        <FeatureCard
          title="Resume tools"
          description="Build an ATS-friendly resume, improve weak sections, and prepare better applications before launch."
        />
        <FeatureCard
          title="Early alerts"
          description="Get notified when matching jobs open so you can apply before the crowd."
        />
      </section>
    </main>
  );
}

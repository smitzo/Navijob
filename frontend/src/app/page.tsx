import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HomeHero } from "@/components/marketing/HomeHero";

export default function Home() {
  return <PublicLayout><HomeHero /><section id="how-it-works" className="container how-it-works"><p className="eyebrow">Make your next move</p><h2>Good work starts with<br />a little less busywork.</h2><div className="how-grid"><article><span>01</span><h3>Bring your experience together.</h3><p>Save your experience, education and projects in one career profile. Keep it up to date as your work grows.</p></article><article><span>02</span><h3>Choose the right version.</h3><p>Keep up to four resume versions. Pick the one that tells the right story for each application.</p></article><article><span>03</span><h3>Apply with a clear picture.</h3><p>Review exactly what you share. Track applications made on NaviJob, with your details already in place.</p></article></div><Link className="button button--primary" href="/signup">Build your profile ↗</Link></section></PublicLayout>;
}

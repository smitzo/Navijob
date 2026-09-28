import type { ReactNode } from "react";
import Link from "next/link";
import { CareerPath } from "@/components/marketing/CareerPath";

export function AccountLayout({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return <main className="account-layout" id="main"><aside className="account-story"><Link className="wordmark" href="/">navijob<span aria-hidden="true">↗</span></Link><div><p className="eyebrow">A little less busywork</p><h2>Your experience.<br />Your next chapter.</h2><p>One profile for the work you’ve done.<br />A clearer path to what comes next.</p><CareerPath /></div><span className="small-copy">Keep your details. Choose what you share.</span></aside><section className="account-form-area"><div className="account-form"><Link href="/" className="back-link">← Back to NaviJob</Link><h1>{title}</h1><p className="muted">{description}</p>{children}</div></section></main>;
}

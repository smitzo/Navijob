import Link from "next/link";
import type { ReactNode } from "react";
import { AccountMenu } from "@/components/auth/AccountMenu";

export function SiteHeader() {
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><div className="container header-inner"><Link className="wordmark" href="/" aria-label="NaviJob home">navijob<span aria-hidden="true">↗</span></Link><nav className="desktop-nav" aria-label="Main navigation"><Link href="/jobs">Find jobs</Link><Link href="/for-employers">For employers</Link><Link href="/#how-it-works">How it works</Link></nav><div className="desktop-nav header-actions"><AccountMenu /></div><details className="mobile-menu"><summary>Menu</summary><nav aria-label="Mobile navigation"><Link href="/jobs">Find jobs</Link><Link href="/for-employers">For employers</Link><Link href="/#how-it-works">How it works</Link><AccountMenu /></nav></details></div></header></>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Link className="wordmark" href="/">navijob<span aria-hidden="true">↗</span></Link><p>Less paperwork.<br />More possibilities.</p></div><div><h2>Find your next step</h2><Link href="/jobs">Browse jobs</Link><Link href="/signup">Create your profile</Link><Link href="/candidate/applications">Your applications</Link></div><div><h2>Build your team</h2><Link href="/for-employers">For employers</Link><Link href="/signup?role=recruiter">Recruiter signup</Link><Link href="/recruiter">Hiring workspace</Link></div><div><h2>The details</h2><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:hello@navijob.in">hello@navijob.in</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} NaviJob</span><span>Made for the people behind the work.</span></div></footer>;
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main id="main">{children}</main><SiteFooter /></>;
}

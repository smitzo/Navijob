import Link from "next/link";
import { Workspace } from "@/components/layout/Workspace";
export default function RecruiterPage() {
  return <Workspace role="recruiter"><p className="eyebrow">Build your team</p><h1>Good hiring starts with clarity.</h1><p className="muted">Share the role, review the work behind each application and keep candidates informed.</p><div className="grid2 overview-links"><Link className="panel" href="/recruiter/setup"><h2>Introduce your company ↗</h2><p>Provide company identity and your hiring contact. Publishing follows review.</p></Link><Link className="panel" href="/recruiter/jobs"><h2>Manage your roles ↗</h2><p>Draft a role, submit it for review and keep its details current.</p></Link><Link className="panel" href="/recruiter/applicants"><h2>Review applications ↗</h2><p>See submitted profiles, chosen resumes and candidate project evidence.</p></Link></div></Workspace>;
}

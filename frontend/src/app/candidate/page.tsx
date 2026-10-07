import Link from "next/link";
import { Workspace } from "@/components/layout/Workspace";
export default function CandidatePage() {
  return <Workspace role="candidate"><p className="eyebrow">Your next chapter</p><h1>Bring your story together.</h1><p className="muted">Keep your career details ready, so the next application starts with you.</p><div className="grid2 overview-links">{[["/candidate/profile", "Build your career profile", "Your experience, skills and work preferences, saved once."], ["/candidate/resumes", "Choose your resume versions", "Keep up to four private resumes for different roles."], ["/candidate/projects", "Show the work behind your skills", "Describe your contribution and link to projects you’re proud of."], ["/jobs", "Find your next role", "Browse the work, team and compensation before applying."]].map(([href, title, copy]) => <Link className="panel" href={href} key={href}><h2>{title} ↗</h2><p>{copy}</p></Link>)}</div></Workspace>;
}

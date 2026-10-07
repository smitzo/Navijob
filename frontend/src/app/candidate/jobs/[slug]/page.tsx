import { redirect } from "next/navigation";
export default async function LegacyCandidateRole({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; redirect(`/jobs/${encodeURIComponent(slug)}`); }

import { Workspace } from "@/components/layout/Workspace";
import { ApplyReview } from "@/components/candidate/ApplyReview";
export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <Workspace role="candidate"><ApplyReview slug={slug} /></Workspace>; }

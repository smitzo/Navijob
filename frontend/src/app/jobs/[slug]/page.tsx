import { PublicJobDetail } from "@/components/jobs/PublicJobDetail";

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicJobDetail slug={slug} />;
}

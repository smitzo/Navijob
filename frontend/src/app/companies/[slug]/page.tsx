import { CompanyProfile } from "@/components/jobs/CompanyProfile";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CompanyProfile slug={slug} />;
}

import { EvidenceDetailShell } from "@/features/evidence/components/evidence-detail-shell";

export const metadata = {
  title: "Evidence Inspector | SIH26188",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EvidenceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <EvidenceDetailShell id={resolvedParams.id} />;
}

import { VerificationDetailShell } from "@/features/verifications/components/verification-detail-shell";

export const metadata = {
  title: "Case Detail | JANPRAMAAN",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VerificationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <VerificationDetailShell id={resolvedParams.id} />;
}

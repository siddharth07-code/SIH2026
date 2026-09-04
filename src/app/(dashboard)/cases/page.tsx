import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { CasesShell } from "@/features/cases/components/cases-shell";

export const metadata: Metadata = {
  title: "Case Management — JANPRAMAAN",
  description: "Review, triage, and resolve flagged identity document screening cases.",
};

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Management & Triage"
        description="Assigned investigation workflows for flagged documents, MRZ mismatches, and biometric anomalies."
        badge={
          <Badge variant="outline" className="text-xs font-mono">
            SSB TRIAGE
          </Badge>
        }
      />
      <CasesShell />
    </div>
  );
}

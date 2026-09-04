import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsShell } from "@/features/analytics/components/analytics-shell";

export const metadata: Metadata = {
  title: "Operational Analytics & Fraud Trends — JANPRAMAAN",
  description: "Screening throughput, risk level distribution, inference latency, and fraud typology analytics.",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Screening Analytics & Fraud Intelligence"
        description="Comprehensive throughput telemetry, pipeline inference latency, and risk distribution across checkpoints."
        badge={
          <Badge variant="outline" className="text-xs font-mono">
            SSB TELEMETRY
          </Badge>
        }
      />
      <AnalyticsShell />
    </div>
  );
}

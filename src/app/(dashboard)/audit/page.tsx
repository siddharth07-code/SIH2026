import * as React from "react";
import { AuditCenter } from "@/features/audit/components/audit-center";

export const metadata = {
  title: "Audit Trail & Governance | SIH26188",
  description: "Immutable operational audit journal and regulatory governance records for identity screenings and determinations.",
};

export default function AuditPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 sm:p-12 text-center text-xs font-mono text-muted-foreground bg-slate-900/50 rounded-lg border border-white/[0.08] animate-pulse">
          Loading audit trail and governance workspace...
        </div>
      }
    >
      <AuditCenter />
    </React.Suspense>
  );
}

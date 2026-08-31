import * as React from "react";
import { Suspense } from "react";
import { VerificationsListShell } from "@/features/verifications/components/verifications-list-shell";

export const metadata = {
  title: "Verification Queue | JANPRAMAAN",
  description: "Operational document screening triage queue and case investigation.",
};

export default function VerificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse" role="status" aria-label="Loading verification screening queue">
          <div className="h-10 bg-muted/60 rounded-lg w-72" />
          <div className="h-16 bg-muted/40 rounded-lg" />
          <div className="h-72 bg-muted/30 rounded-lg" />
        </div>
      }
    >
      <VerificationsListShell />
    </Suspense>
  );
}

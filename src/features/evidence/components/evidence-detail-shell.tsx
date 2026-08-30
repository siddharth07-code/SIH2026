"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useEvidence } from "../hooks/use-evidence";
import { EvidenceHeader } from "./evidence-header";
import { EvidenceSummary } from "./evidence-summary";
import { DocumentInspector } from "./document-inspector";
import { FieldComparison } from "./field-comparison";
import { ForensicInspector } from "./forensic-inspector";
import { BiometricEvidence } from "./biometric-evidence";
import { EvidenceProvenanceCard } from "./evidence-provenance";
import { EvidenceTimeline } from "./evidence-timeline";
import { EvidenceActions } from "./evidence-actions";
import type { ForensicSignal } from "@/types";

interface EvidenceDetailShellProps {
  id: string;
}

export function EvidenceDetailShell({ id }: EvidenceDetailShellProps) {
  const { data: evidence, isLoading, isError } = useEvidence(id);
  const [selectedRegionId, setSelectedRegionId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 sm:p-12 text-center text-xs font-mono text-muted-foreground bg-slate-900/50 rounded-lg border border-white/[0.08] animate-pulse">
        Retrieving multi-signal forensic evidence record...
      </div>
    );
  }

  if (isError || !evidence) {
    return (
      <div className="space-y-6">
        <Link href="/verifications">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Screening Queue</span>
          </Button>
        </Link>
        <EmptyState
          icon={ShieldAlert}
          title={`Evidence Artifact ${id} Unavailable`}
          description="The requested evidence record does not exist or has not completed backend AI verification orchestration."
          notice="Evidence artifacts are generated asynchronously across OCR, MRZ validation, forensic localization, and biometric matching."
          action={
            <Link href="/verifications">
              <Button variant="outline" size="sm" className="text-xs">
                Return to Screening Queue
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { verificationId, assets, regions, fieldComparisons, forensicSignals, biometrics, provenance, timeline } = evidence;

  const handleSelectSignal = (sig: ForensicSignal | null) => {
    if (sig && sig.regions && sig.regions.length > 0) {
      setSelectedRegionId(sig.regions[0].id);
    } else {
      setSelectedRegionId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Header & Quick Case Navigation */}
      <EvidenceHeader evidence={evidence} />

      {/* 2. 6-Category Evidence Status Matrix */}
      <EvidenceSummary evidence={evidence} />

      {/* 3. Primary Document Inspection & Forensic Inspector Workspace (Responsive 2-Col Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DocumentInspector
          assets={assets}
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
        />
        <ForensicInspector
          signals={forensicSignals}
          onSelectSignal={handleSelectSignal}
        />
      </div>

      {/* 4. OCR ↔ MRZ Field Parity Comparison */}
      <FieldComparison comparisons={fieldComparisons} />

      {/* 5. Biometric Face & Liveness Evidence */}
      <BiometricEvidence biometrics={biometrics} />

      {/* 6. Forensic Provenance & Integrity Signature */}
      <EvidenceProvenanceCard provenance={provenance} />

      {/* 7. Verification Lifecycle Timeline */}
      <EvidenceTimeline timeline={timeline} />

      {/* 8. Investigator Determination Actions */}
      <EvidenceActions evidenceId={id} verificationId={verificationId} />
    </div>
  );
}

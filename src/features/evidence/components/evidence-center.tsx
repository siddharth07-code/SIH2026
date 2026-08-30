"use client";

import * as React from "react";
import { EvidenceHeader } from "./evidence-header";
import { EvidenceSummary } from "./evidence-summary";
import { DocumentInspector } from "./document-inspector";
import { FieldComparison } from "./field-comparison";
import { ForensicInspector } from "./forensic-inspector";
import { BiometricEvidence } from "./biometric-evidence";
import { EvidenceProvenanceCard } from "./evidence-provenance";
import { EvidenceTimeline } from "./evidence-timeline";
import { EvidenceActions } from "./evidence-actions";
import type { EvidenceDetail } from "@/types";

interface EvidenceCenterProps {
  evidence: EvidenceDetail;
}

export function EvidenceCenter({ evidence }: EvidenceCenterProps) {
  return (
    <div className="space-y-6">
      {/* 1. Evidence Header */}
      <EvidenceHeader evidence={evidence} />

      {/* 2. Category Status Summary Matrix */}
      <EvidenceSummary evidence={evidence} />

      {/* 3. Document Inspection Viewport */}
      <DocumentInspector
        assets={evidence.assets}
        regions={evidence.regions}
      />

      {/* 4. Visual OCR ↔ MRZ Consistency Comparator */}
      <FieldComparison comparisons={evidence.fieldComparisons} />

      {/* 5. Forensic Anomaly Signal Inspector & Heatmaps */}
      <ForensicInspector
        signals={evidence.forensicSignals}
      />

      {/* 6. Biometric Facial Comparison & Liveness Signal */}
      <BiometricEvidence biometrics={evidence.biometrics} />

      {/* 7. Provenance & Integrity Audit */}
      <EvidenceProvenanceCard provenance={evidence.provenance} />

      {/* 8. Audited Evidence Lifecycle Timeline */}
      <EvidenceTimeline timeline={evidence.timeline} />

      {/* 9. Investigator Actions & Governance */}
      <EvidenceActions
        evidenceId={evidence.id}
        verificationId={evidence.verificationId}
      />
    </div>
  );
}

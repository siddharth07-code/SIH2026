"use client";

import * as React from "react";
import { FileText, CheckCircle2, ShieldAlert, User, ShieldCheck, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/shared/status-indicator";
import type { EvidenceDetail, EvidenceCategory, EvidenceStatus } from "@/types";

interface EvidenceSummaryProps {
  evidence: EvidenceDetail;
}

interface CategoryStatus {
  label: string;
  category: EvidenceCategory;
  status: EvidenceStatus;
  icon: React.ElementType;
}

export function EvidenceSummary({ evidence }: EvidenceSummaryProps) {
  const { fieldComparisons, forensicSignals, biometrics, provenance } = evidence;

  // Compute category statuses
  const categories: CategoryStatus[] = [
    {
      label: "Visual OCR",
      category: "OCR",
      status: fieldComparisons && fieldComparisons.length > 0 ? "PASS" : "UNAVAILABLE",
      icon: FileText,
    },
    {
      label: "MRZ Validator",
      category: "MRZ",
      status:
        fieldComparisons?.some((c) => c.status === "MISMATCH")
          ? "FAIL"
          : fieldComparisons?.length
          ? "PASS"
          : "UNAVAILABLE",
      icon: CheckCircle2,
    },
    {
      label: "Consistency",
      category: "CONSISTENCY",
      status:
        fieldComparisons?.some((c) => c.status === "MISMATCH")
          ? "FAIL"
          : fieldComparisons?.length
          ? "PASS"
          : "UNAVAILABLE",
      icon: ShieldCheck,
    },
    {
      label: "Forensic Signals",
      category: "FORENSICS",
      status:
        forensicSignals && forensicSignals.length > 0
          ? forensicSignals.some((s) => s.severity === "HIGH" || s.severity === "CRITICAL")
            ? "FAIL"
            : "WARNING"
          : "PASS",
      icon: ShieldAlert,
    },
    {
      label: "Face Biometrics",
      category: "BIOMETRICS",
      status: biometrics
        ? biometrics.status === "MATCH"
          ? "PASS"
          : biometrics.status === "MISMATCH"
          ? "FAIL"
          : "WARNING"
        : "UNAVAILABLE",
      icon: User,
    },
    {
      label: "Integrity Hash",
      category: "METADATA",
      status: provenance ? "PASS" : "UNAVAILABLE",
      icon: Database,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Card
            key={cat.label}
            variant="elevated"
            className="p-3 flex flex-col justify-between space-y-2 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {cat.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </div>
            <div className="pt-1">
              <StatusIndicator status={cat.status} size="sm" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

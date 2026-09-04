"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, FileCheck, Cpu, UserCheck, ShieldCheck, Layers, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/shared/status-indicator";
import type { EvidenceItem, EvidenceCategory } from "@/types";

interface VerificationEvidenceGridProps {
  evidence?: EvidenceItem[];
  verificationId: string;
}

interface CategoryDefinition {
  category: EvidenceCategory;
  name: string;
  icon: React.ElementType;
  description: string;
}

const CATEGORIES: CategoryDefinition[] = [
  {
    category: "OCR",
    name: "Visual OCR Extraction",
    icon: Eye,
    description: "Visual text field confidence & character extraction",
  },
  {
    category: "MRZ",
    name: "MRZ Checksum Validator",
    icon: FileCheck,
    description: "ICAO 9303 check digit & line length verification",
  },
  {
    category: "CONSISTENCY",
    name: "Cross-Field Consistency",
    icon: Layers,
    description: "Visual OCR ↔ MRZ date/name parity checks",
  },
  {
    category: "FORENSICS",
    name: "Digital Forensics",
    icon: Cpu,
    description: "Compression, copy-move, and splicing localization",
  },
  {
    category: "BIOMETRICS",
    name: "Face Biometrics",
    icon: UserCheck,
    description: "Photo embedding similarity & liveness detection",
  },
  {
    category: "METADATA",
    name: "Capture Metadata",
    icon: ShieldCheck,
    description: "Device signature, resolution & illumination checks",
  },
];

export function VerificationEvidenceGrid({
  evidence = [],
  verificationId,
}: VerificationEvidenceGridProps) {
  const getEvidenceForCategory = (cat: EvidenceCategory) => {
    return evidence.filter((e) => e.category === cat);
  };

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold text-foreground">
            Multi-Signal Verification Signals
          </CardTitle>
        </div>
        <Link
          href={`/evidence/${verificationId}`}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          <span>Evidence Deep-Dive</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {CATEGORIES.map((catDef) => {
          const Icon = catDef.icon;
          const items = getEvidenceForCategory(catDef.category);
          const hasItems = items.length > 0;
          const failedItem = items.find((i) => i.status === "FAIL");
          const warningItem = items.find((i) => i.status === "WARNING");
          const passItem = items.find((i) => i.status === "PASS");

          let statusLabel = "PENDING / UNAVAILABLE";
          let statusType: "INFO" | "LOW" | "MEDIUM" | "HIGH" = "INFO";

          if (failedItem) {
            statusLabel = "ANOMALY DETECTED";
            statusType = "HIGH";
          } else if (warningItem) {
            statusLabel = "WARNING FLAG";
            statusType = "MEDIUM";
          } else if (passItem) {
            statusLabel = "VERIFIED PASS";
            statusType = "LOW";
          }

          return (
            <div
              key={catDef.category}
              className="rounded-md border border-border p-3 space-y-2 flex flex-col justify-between"
              style={{ backgroundColor: "var(--jp-bg-root)" }}
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground" style={{ backgroundColor: "var(--jp-bg-surface)" }}>
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-xs font-semibold text-foreground leading-tight m-0">
                      {catDef.name}
                    </h3>
                  </div>
                  <StatusIndicator status={statusType} size="sm" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight m-0">
                  {catDef.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>{hasItems ? `${items.length} findings logged` : "No findings"}</span>
                <span>{statusLabel}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

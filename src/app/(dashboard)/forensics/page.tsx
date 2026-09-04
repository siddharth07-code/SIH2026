"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { ForensicStudio } from "@/features/forensics/forensic-studio";

export default function ForensicsPage() {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <PageHeader
        title="Digital Forensics & Tampering Analysis Studio"
        description="Multi-spectral Error Level Analysis (ELA), frequency domain noise analysis, and localized manipulation detection."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              FORENSIC LAB
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono">
              LOCALIZED ANOMALIES
            </Badge>
          </div>
        }
      />

      <ForensicStudio />
    </div>
  );
}

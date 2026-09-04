"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { MrzValidatorTool } from "@/features/mrz/mrz-validator-tool";

export default function MrzValidatorPage() {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <PageHeader
        title="ICAO 9303 MRZ Engine & Checksum Validator"
        description="Deterministic modulo-10 algorithmic validator implementing Part 3 & 4 check digit verification."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              ICAO 9303 ENGINE
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono">
              7-3-1 WEIGHTING
            </Badge>
          </div>
        }
      />

      <MrzValidatorTool />
    </div>
  );
}

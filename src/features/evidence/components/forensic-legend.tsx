"use client";

import * as React from "react";
import { Info } from "lucide-react";

export function ForensicLegend() {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-2 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-foreground">
        <Info className="w-3.5 h-3.5 text-primary" />
        <span>Forensic Anomaly Signal Scale</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border" style={{ backgroundColor: "var(--jp-status-low-bg)", borderColor: "var(--jp-status-low-border)" }} />
          <span>Lower Signal / Baseline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border" style={{ backgroundColor: "var(--jp-status-medium-bg)", borderColor: "var(--jp-status-medium-border)" }} />
          <span>Moderate Variance Signal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border" style={{ backgroundColor: "var(--jp-status-high-bg)", borderColor: "var(--jp-status-high-border)" }} />
          <span>High Anomaly Signal</span>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground leading-tight">
        * Note: Digital forensics signals represent localized compression/noise inconsistencies and edge artifacts. Final operational verification rests with the authorized officer.
      </p>
    </div>
  );
}

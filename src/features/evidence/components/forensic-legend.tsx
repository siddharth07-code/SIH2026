"use client";

import * as React from "react";
import { Info } from "lucide-react";

export function ForensicLegend() {
  return (
    <div className="rounded-md border border-white/[0.08] bg-slate-950/60 p-3 space-y-2 text-xs backdrop-blur-sm">
      <div className="flex items-center gap-1.5 font-semibold text-foreground">
        <Info className="w-3.5 h-3.5 text-primary" />
        <span>Forensic Anomaly Signal Scale</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span>Lower Signal / Baseline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
          <span>Moderate Variance Signal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
          <span>High Anomaly Signal</span>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground leading-tight">
        * Note: Digital forensics signals represent localized compression/noise inconsistencies and edge artifacts. Final operational verification rests with the authorized officer.
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { DashboardHeader } from "./dashboard-header";
import { ScreeningOverview } from "./screening-overview";
import { AttentionQueue } from "./attention-queue";
import { VerificationActivity } from "./verification-activity";
import { RiskDistribution } from "./risk-distribution";
import { OperationalEvents } from "./operational-events";
import { QuickActions } from "./quick-actions";

export function DashboardShell() {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Command Context Header */}
      <DashboardHeader />

      {/* 2. Critical Screening Overview Metrics */}
      <ScreeningOverview />

      {/* 3. Priority Attention Queue (Triage Table / Mobile Cards) */}
      <AttentionQueue />

      {/* 4. Telemetry & Calibration Section (Responsive 2-Col Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <VerificationActivity />
        <RiskDistribution />
      </div>

      {/* 5. Live Operational Event Stream */}
      <OperationalEvents />

      {/* 6. Quick Action Shortcuts */}
      <QuickActions />

      {/* 7. Human-in-the-Loop Governance Notice */}
      <div className="rounded-lg border border-white/[0.08] bg-slate-900/40 backdrop-blur-md p-3.5 sm:p-4 text-xs text-muted-foreground flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="leading-tight text-[11px] sm:text-xs">
            <strong className="text-foreground font-semibold">ISO/IEC 23894 Human-in-the-Loop Architecture:</strong> AI models generate risk signals; deterministic algorithms validate check digits; authorized human officers execute all operational decisions.
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/80 shrink-0 self-end xs:self-auto">
          BUILD: 2026.08-PROD
        </span>
      </div>
    </div>
  );
}

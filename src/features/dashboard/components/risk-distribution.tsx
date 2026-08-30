"use client";

import * as React from "react";
import { PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Badge } from "@/components/ui/badge";
import { useRiskDistribution } from "../hooks/use-dashboard-queries";

export function RiskDistribution() {
  const { data: distribution } = useRiskDistribution();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <PieChart className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Risk Tier Distribution & Action Criteria
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-[9px] sm:text-[10px] font-mono shrink-0 hidden xs:inline-flex">
          ICAO 9303 CALIBRATION
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
        {/* Low Risk Tier */}
        <div className="rounded-md border border-emerald-500/30 bg-emerald-950/20 p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIndicator status="LOW" size="sm" />
              <span className="text-xs font-semibold text-foreground">Clearance Candidate</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Deterministic checksums valid, OCR ↔ MRZ consistent, zero forensic anomalies.
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-white/[0.06] w-full xs:w-auto flex xs:flex-col justify-between items-center xs:items-end">
            <div className="text-sm font-bold font-mono text-emerald-400">
              {distribution?.low.count !== null && distribution?.low.count !== undefined
                ? `${distribution.low.count} (${distribution.low.percentage}%)`
                : "—"}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Action: Clear Document
            </span>
          </div>
        </div>

        {/* Medium Risk Tier */}
        <div className="rounded-md border border-amber-500/30 bg-amber-950/20 p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIndicator status="MEDIUM" size="sm" />
              <span className="text-xs font-semibold text-foreground">Supervisory Review</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Minor field inconsistencies, lower OCR confidence, or borderline biometrics.
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-white/[0.06] w-full xs:w-auto flex xs:flex-col justify-between items-center xs:items-end">
            <div className="text-sm font-bold font-mono text-amber-400">
              {distribution?.medium.count !== null && distribution?.medium.count !== undefined
                ? `${distribution.medium.count} (${distribution.medium.percentage}%)`
                : "—"}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Action: Supervisor Triage
            </span>
          </div>
        </div>

        {/* High Risk Tier */}
        <div className="rounded-md border border-rose-500/35 bg-rose-950/20 p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIndicator status="HIGH" size="sm" />
              <span className="text-xs font-semibold text-foreground">Manual Inspection / Escalation</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Calculated MRZ checksum mismatch, digital splicing, or facial mismatch.
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-white/[0.06] w-full xs:w-auto flex xs:flex-col justify-between items-center xs:items-end">
            <div className="text-sm font-bold font-mono text-rose-400">
              {distribution?.high.count !== null && distribution?.high.count !== undefined
                ? `${distribution.high.count} (${distribution.high.percentage}%)`
                : "—"}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Action: Physical Inspection
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

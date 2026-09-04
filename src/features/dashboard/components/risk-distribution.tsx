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
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <PieChart className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Risk Tier Distribution & Action Criteria
          </CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono shrink-0 hidden xs:inline-flex">
          ICAO 9303 CALIBRATION
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-2.5">
        {/* Low Risk Tier */}
        <div className="jp-risk-tier-row jp-risk-tier-low">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIndicator status="LOW" size="sm" />
              <span className="text-xs font-semibold text-foreground">Clearance Candidate</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              Deterministic checksums valid, OCR ↔ MRZ consistent, zero forensic anomalies.
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-border w-full xs:w-auto flex xs:flex-col justify-between items-center xs:items-end">
            <div className="jp-risk-stat-value text-emerald-400">
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
        <div className="jp-risk-tier-row jp-risk-tier-medium">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIndicator status="MEDIUM" size="sm" />
              <span className="text-xs font-semibold text-foreground">Supervisory Review</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              Minor field inconsistencies, lower OCR confidence, or borderline biometrics.
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-border w-full xs:w-auto flex xs:flex-col justify-between items-center xs:items-end">
            <div className="jp-risk-stat-value text-amber-400">
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
        <div className="jp-risk-tier-row jp-risk-tier-high">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIndicator status="HIGH" size="sm" />
              <span className="text-xs font-semibold text-foreground">Manual Inspection / Escalation</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              Calculated MRZ checksum mismatch, digital splicing, or facial mismatch.
            </p>
          </div>
          <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-border w-full xs:w-auto flex xs:flex-col justify-between items-center xs:items-end">
            <div className="jp-risk-stat-value text-rose-400">
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

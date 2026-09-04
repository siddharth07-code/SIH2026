"use client";

import * as React from "react";
import { Shield, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskAssessment } from "@/types";

interface VerificationRiskCardProps {
  riskAssessment?: RiskAssessment;
}

export function VerificationRiskCard({ riskAssessment }: VerificationRiskCardProps) {
  if (!riskAssessment) {
    return (
      <Card className="p-6 text-center text-xs font-mono text-muted-foreground">
        Deterministic risk assessment is evaluating...
      </Card>
    );
  }

  const { level, score, recommendedAction, explanationSummary, engineVersion } = riskAssessment;

  const config = {
    LOW: {
      cardClass: "jp-risk-tier-low",
      textClass: "text-emerald-400",
      badgeVariant: "success" as const,
      icon: CheckCircle2,
    },
    MEDIUM: {
      cardClass: "jp-risk-tier-medium",
      textClass: "text-amber-400",
      badgeVariant: "warning" as const,
      icon: AlertTriangle,
    },
    HIGH: {
      cardClass: "jp-risk-tier-high",
      textClass: "text-rose-400",
      badgeVariant: "destructive" as const,
      icon: AlertOctagon,
    },
  }[level] || {
    cardClass: "",
    textClass: "text-foreground",
    badgeVariant: "outline" as const,
    icon: Shield,
  };

  const Icon = config.icon;

  return (
    <Card className={`jp-card ${config.cardClass}`}>
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`w-4 h-4 ${config.textClass} shrink-0`} />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Deterministic Risk Evaluation
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground self-start xs:self-auto">
          <span>ENGINE: v{engineVersion || "2.1"}</span>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        {/* Metric Triad: Score | Tier | Recommended Action */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-md border border-border p-2.5 text-center space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Calibrated Score
            </span>
            <div className={`text-2xl sm:text-3xl font-bold font-mono ${config.textClass}`}>
              {score}
              <span className="text-xs text-muted-foreground font-normal"> / 100</span>
            </div>
          </div>

          <div className="rounded-md border border-border p-2.5 text-center space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Evaluated Tier
            </span>
            <div className="pt-1">
              <Badge variant={config.badgeVariant} className="text-xs px-2 py-0.5 font-mono font-bold uppercase">
                {level} RISK
              </Badge>
            </div>
          </div>

          <div className="rounded-md border border-border p-2.5 text-center space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Recommended Action
            </span>
            <div className="text-xs sm:text-sm font-bold font-mono text-foreground pt-1 truncate">
              {recommendedAction.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Explanation Summary */}
        <div className="rounded-md border border-border p-3 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
          <span className="text-[11px] font-semibold text-foreground uppercase block">
            Evidence Reasoning Summary
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed m-0">
            {explanationSummary}
          </p>
        </div>

        {/* WHY FLAGGED? (Section 22 Specification) */}
        {level !== "LOW" && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/5 p-3 space-y-1.5">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>WHY FLAGGED?</span>
            </span>
            <ul className="text-xs text-foreground space-y-1 pl-4 list-disc marker:text-rose-500 m-0">
              <li>Deterministic risk rule trigger: {level} risk threshold flagged</li>
              <li>Operational protocol: {recommendedAction.replace("_", " ")}</li>
              {score >= 70 && <li>High risk score ({score}/100) — Mandatory supervisory review required</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

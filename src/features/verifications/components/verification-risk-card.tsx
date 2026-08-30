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
      <Card className="p-6 text-center text-xs font-mono text-muted-foreground bg-slate-900/40">
        Deterministic risk assessment is evaluating...
      </Card>
    );
  }

  const { level, score, recommendedAction, explanationSummary, engineVersion } = riskAssessment;

  const config = {
    LOW: {
      bg: "bg-emerald-950/20 border-emerald-500/30",
      text: "text-emerald-400",
      badge: "border-emerald-500/40 text-emerald-300",
      icon: CheckCircle2,
      shadow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]",
    },
    MEDIUM: {
      bg: "bg-amber-950/20 border-amber-500/30",
      text: "text-amber-400",
      badge: "border-amber-500/40 text-amber-300",
      icon: AlertTriangle,
      shadow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]",
    },
    HIGH: {
      bg: "bg-rose-950/25 border-rose-500/35",
      text: "text-rose-400",
      badge: "border-rose-500/40 text-rose-300",
      icon: AlertOctagon,
      shadow: "shadow-[0_0_25px_-5px_rgba(244,63,94,0.25)]",
    },
  }[level] || {
    bg: "bg-slate-900/60 border-white/[0.08]",
    text: "text-foreground",
    badge: "border-white/10 text-foreground",
    icon: Shield,
    shadow: "shadow-none",
  };

  const Icon = config.icon;

  return (
    <Card className={`border ${config.bg} ${config.shadow} transition-all`}>
      <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-white/[0.08] flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`w-4 h-4 ${config.text} shrink-0`} />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Deterministic Risk Evaluation
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground self-start xs:self-auto">
          <span>ENGINE: v{engineVersion || "2.1"}</span>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 space-y-4">
        {/* Metric Triad: Score | Tier | Recommended Action */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 text-center space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Calibrated Score
            </span>
            <div className={`text-2xl sm:text-3xl font-bold font-mono ${config.text}`}>
              {score}
              <span className="text-xs text-muted-foreground font-normal"> / 100</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 text-center space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Evaluated Tier
            </span>
            <div className="pt-1">
              <Badge variant="outline" className={`text-xs px-2 py-0.5 font-mono font-bold uppercase ${config.badge}`}>
                {level} RISK
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 text-center space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Recommended Action
            </span>
            <div className="text-xs sm:text-sm font-bold font-mono text-foreground pt-1 truncate">
              {recommendedAction.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Explanation Summary */}
        <div className="rounded-lg border border-white/[0.08] bg-slate-950/40 p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block">
            Evidence Reasoning Summary
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {explanationSummary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

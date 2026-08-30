"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Badge } from "@/components/ui/badge";
import type { EvidenceItem } from "@/types";

interface VerificationFindingsListProps {
  evidence?: EvidenceItem[];
}

export function VerificationFindingsList({ evidence = [] }: VerificationFindingsListProps) {
  const findings = evidence.filter((e) => e.finding && e.finding.trim() !== "");
  const hasFindings = findings.length > 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-4 pb-3 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <CardTitle className="text-sm font-semibold text-foreground">
            Structured Forensic & Validation Findings
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {findings.length} LOGGED ANOMALIES
        </span>
      </CardHeader>

      <CardContent className="p-4">
        {hasFindings ? (
          <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-md overflow-hidden bg-slate-950/40">
            {findings.map((item) => (
              <div key={item.id} className="p-3 space-y-1.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={item.severity} size="sm" />
                    <span className="text-xs font-semibold text-foreground">{item.title}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {item.category}
                    </Badge>
                  </div>
                  {item.confidence !== undefined && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Confidence: {(item.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  {item.finding}
                </p>
                <div className="pl-6 flex items-center gap-3 text-[10px] font-mono text-muted-foreground/80">
                  <span>Source: {item.source}</span>
                  {item.modelVersion && <span>Model: v{item.modelVersion}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center space-y-2 border border-dashed border-white/[0.12] rounded-lg bg-slate-900/20 backdrop-blur-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-semibold text-foreground">
              Zero High-Severity Discrepancies Logged
            </h4>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
              When deterministic check digits or computer vision models identify inconsistencies, granular findings will populate this register.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

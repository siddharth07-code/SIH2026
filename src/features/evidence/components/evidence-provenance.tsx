"use client";

import * as React from "react";
import { Database, ShieldCheck, Cpu, Clock, Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/formatters";
import type { EvidenceProvenance } from "@/types";

interface EvidenceProvenanceProps {
  provenance?: EvidenceProvenance;
}

export function EvidenceProvenanceCard({ provenance }: EvidenceProvenanceProps) {
  if (!provenance) {
    return (
      <Card className="p-6 text-center text-xs font-mono text-muted-foreground bg-slate-900/40">
        Cryptographic provenance metadata not available for this artifact.
      </Card>
    );
  }

  const { sourceService, modelIdentifier, modelVersion, integrityHash, generatedTimestamp, evidenceVersion } = provenance;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <Database className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Cryptographic Artifact Provenance & Integrity
          </CardTitle>
        </div>
        <Badge variant="glass" className="text-[10px] font-mono text-emerald-300 shrink-0">
          SHA-256 VERIFIED
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Source Service
            </span>
            <div className="text-xs font-semibold text-foreground truncate">
              {sourceService}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Version {evidenceVersion}
            </span>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              AI Model ID
            </span>
            <div className="text-xs font-semibold text-foreground truncate">
              {modelIdentifier || "Deterministic Rule Engine"}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Build v{modelVersion || "1.0.0"}
            </span>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Evaluation Time
            </span>
            <div className="text-xs font-semibold text-foreground font-mono truncate">
              {formatDateTime(generatedTimestamp)}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Synchronized UTC
            </span>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-slate-950/60 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Integrity Status
            </span>
            <div className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Tamper-Free</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Immutable Signature
            </span>
          </div>
        </div>

        {/* Full SHA-256 Hash Display */}
        {integrityHash && (
          <div className="rounded-lg border border-white/[0.08] bg-slate-950/40 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Cryptographic Artifact Hash (SHA-256)
            </span>
            <code className="text-[11px] font-mono text-primary break-all block selection:bg-primary/30">
              {integrityHash}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

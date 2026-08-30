"use client";

import * as React from "react";
import { Database, Server, GitFork, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AuditProvenance as AuditProvenanceType } from "@/types";

interface AuditProvenanceProps {
  provenance?: AuditProvenanceType;
}

export function AuditProvenanceCard({ provenance }: AuditProvenanceProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <Database className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Audit Event Provenance & Correlation
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          SCHEMA: v{provenance?.schemaVersion || "1.0"}
        </span>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-primary" />
              Source Service
            </span>
            <div className="text-xs font-semibold text-foreground truncate">
              {provenance?.sourceService || "—"}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block truncate">
              Host: {provenance?.host || "cluster-gateway-01"}
            </span>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-emerald-400" />
              Correlation ID
            </span>
            <div className="text-xs font-mono text-emerald-400 truncate" title={provenance?.correlationId}>
              {provenance?.correlationId || "—"}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block">
              Distributed Trace Span
            </span>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-sky-400" />
              Request ID
            </span>
            <div className="text-xs font-mono text-sky-400 truncate" title={provenance?.requestId}>
              {provenance?.requestId || "—"}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block">
              HTTP Ingest Reference
            </span>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-3 space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Event Schema Version
            </span>
            <div className="text-xs font-mono font-bold text-foreground">
              v{provenance?.schemaVersion || "1.0-alpha"}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block">
              ISO/IEC 27001 Audit Spec
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

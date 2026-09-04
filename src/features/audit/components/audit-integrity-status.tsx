"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, Link as LinkIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditIntegrity } from "@/types";

interface AuditIntegrityStatusProps {
  integrity?: AuditIntegrity;
}

export function AuditIntegrityStatus({ integrity }: AuditIntegrityStatusProps) {
  const status = integrity?.status || "UNAVAILABLE";

  const config = {
    VERIFIED: {
      label: "CRYPTOGRAPHICALLY VERIFIED",
      variant: "success" as const,
      icon: ShieldCheck,
      color: "text-emerald-400",
      cardClass: "jp-risk-tier-low",
      desc: "Event hash signature and previous block chaining validated against append-only journal.",
    },
    UNVERIFIED: {
      label: "UNVERIFIED PENDING BLOCK",
      variant: "warning" as const,
      icon: AlertTriangle,
      color: "text-amber-400",
      cardClass: "jp-risk-tier-medium",
      desc: "Event logged in transit; pending block finalization by backend governance worker.",
    },
    INVALID: {
      label: "INTEGRITY MISMATCH / CORRUPT",
      variant: "destructive" as const,
      icon: ShieldAlert,
      color: "text-rose-400",
      cardClass: "jp-risk-tier-high",
      desc: "Event hash or chaining sequence violates append-only consistency. Security alert triggered.",
    },
    UNAVAILABLE: {
      label: "INTEGRITY STATUS UNAVAILABLE",
      variant: "outline" as const,
      icon: HelpCircle,
      color: "text-muted-foreground",
      cardClass: "",
      desc: "Integrity verification telemetry will appear when the backend audit service is connected.",
    },
  }[status];

  const Icon = config.icon;

  return (
    <Card className={`jp-card ${config.cardClass}`}>
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Cryptographic Integrity & Chain Validation
          </CardTitle>
        </div>
        <Badge variant={config.variant} className="text-[10px] font-mono shrink-0">
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-2.5">
        <p className="text-xs text-muted-foreground leading-relaxed m-0">
          {config.desc}
        </p>

        {/* Chaining Hashes & Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
          <div className="rounded-md border border-border p-2 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Event Sequence ID
            </span>
            <div className="text-xs font-mono font-bold text-foreground">
              {integrity?.sequenceNumber !== undefined ? `#${integrity.sequenceNumber}` : "—"}
            </div>
          </div>

          <div className="rounded-md border border-border p-2 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-primary" />
              Previous Block Hash
            </span>
            <div className="text-[10px] font-mono text-muted-foreground truncate" title={integrity?.previousHash}>
              {integrity?.previousHash || "—"}
            </div>
          </div>

          <div className="rounded-md border border-border p-2 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Current Event Hash (SHA-256)
            </span>
            <div className="text-[10px] font-mono truncate" style={{ color: "var(--jp-primary)" }} title={integrity?.hash}>
              {integrity?.hash || "—"}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded border border-border p-2 text-[10px] text-muted-foreground font-mono" style={{ backgroundColor: "var(--jp-bg-root)" }}>
          Authoritative append-only validation and cryptographic hashing are computed and persisted by the backend governance service.
        </div>
      </CardContent>
    </Card>
  );
}

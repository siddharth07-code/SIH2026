"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Eye,
  ExternalLink,
  ShieldAlert,
  Binary,
  Layers,
  ScanFace,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import type { AttentionQueueItem } from "@/types";

interface QuickPeekDrawerProps {
  item: AttentionQueueItem | null;
  onClose: () => void;
}

export function QuickPeekDrawer({ item, onClose }: QuickPeekDrawerProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Quick Peek Case Inspector"
    >
      <div
        className="w-full max-w-2xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "var(--jp-bg-surface)" }}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-foreground text-base truncate">
                  {item.trackingNumber}
                </span>
                <StatusIndicator status={item.riskLevel} size="md" />
              </div>
              <span className="text-xs text-muted-foreground block truncate mt-0.5">
                {item.documentType} • {maskDocumentNumber(item.maskedDocumentNumber)}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Close inspector drawer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          {/* Risk Summary Banner */}
          <div
            className="p-3 rounded-lg border flex items-start gap-3"
            style={{
              backgroundColor: "var(--jp-status-high-bg)",
              borderColor: "var(--jp-status-high-border)",
            }}
          >
            <ShieldAlert
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: "var(--jp-status-high-text)" }}
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <span
                  className="font-bold uppercase tracking-wider text-[11px]"
                  style={{ color: "var(--jp-status-high-text)" }}
                >
                  {item.riskLevel} Risk Case Assessment
                </span>
                {item.riskScore && (
                  <span
                    className="font-mono font-bold text-xs px-1.5 py-0.2 rounded border"
                    style={{
                      borderColor: "var(--jp-status-high-border)",
                      color: "var(--jp-status-high-text)",
                    }}
                  >
                    SCORE: {item.riskScore}/100
                  </span>
                )}
              </div>
              <p className="text-foreground leading-snug m-0 text-xs font-medium">
                {item.primaryFinding}
              </p>
            </div>
          </div>

          {/* Screening Ingest Metadata */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded border border-border bg-elevated space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                Physical Scan Location
              </span>
              <span className="font-semibold text-foreground block truncate">
                {item.scanLocation || item.checkpointName}
              </span>
            </div>

            <div className="p-2.5 rounded border border-border bg-elevated space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono flex items-center gap-1">
                <User className="w-3 h-3 text-primary" />
                Submitting Profile
              </span>
              <span className="font-mono font-semibold text-foreground block truncate">
                {item.officerBadge || "SSB-OFF-201"}
              </span>
              {item.userRole && (
                <span className="text-[10px] font-sans font-medium text-muted-foreground block">
                  Role: {item.userRole !== "CITIZEN" ? item.userRole : "OFFICER"}
                </span>
              )}
            </div>

            <div className="p-2.5 rounded border border-border bg-elevated space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                Timestamp
              </span>
              <span className="font-mono text-foreground block">
                {formatDateTime(item.submittedAt)}
              </span>
            </div>

            <div className="p-2.5 rounded border border-border bg-elevated space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono flex items-center gap-1">
                <FileText className="w-3 h-3 text-primary" />
                Document Type
              </span>
              <span className="font-semibold text-foreground block">
                {item.documentType} (ICAO TD3)
              </span>
            </div>
          </div>

          {/* ICAO 9303 Checksum Diagnostic Preview */}
          <div className="p-3 rounded-lg border border-border bg-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-primary" />
                <span>ICAO 9303 Checksum Validation</span>
              </span>
              <Badge variant="outline" className="text-[9px] font-mono text-rose-500 border-rose-500/30">
                MISMATCH DETECTED
              </Badge>
            </div>

            <div className="p-2 rounded bg-black/90 text-emerald-400 font-mono text-[11px] space-y-0.5 select-all overflow-x-auto">
              <div>P&lt;INDSHARMA&lt;&lt;DEEP&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              <div>Z1234567&lt;8IND980412<span className="text-rose-400 bg-rose-950/60 px-0.5">3</span>M2809015&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Document Number Check Digit:</span>
                <span className="font-mono text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MATCH (8)
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Date of Birth Check Digit:</span>
                <span className="font-mono text-rose-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> FAIL (Read 3, Calculated 7)
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Composite Checksum:</span>
                <span className="font-mono text-rose-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> FAIL (Modulo 10 Invariant)
                </span>
              </div>
            </div>
          </div>

          {/* Forensic Image Anomaly Signal */}
          <div className="p-3 rounded-lg border border-border bg-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Forensic Tampering Heatmap</span>
              </span>
              <Badge variant="outline" className="text-[9px] font-mono text-amber-500 border-amber-500/30">
                ANOMALY LOCATED
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed m-0">
              Error Level Analysis (ELA) detected high-frequency compression gradient inconsistencies in the DOB visual zone [Y: 180-220, X: 410-480].
            </p>
          </div>

          {/* Biometric Parity Signal */}
          <div className="p-3 rounded-lg border border-border bg-subtle/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                <ScanFace className="w-3.5 h-3.5 text-primary" />
                <span>Biometric Face & Liveness</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-500">
                SIMILARITY: 0.88 (PASS)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Presentation Attack Detection:</span>
              <span className="font-mono text-emerald-500 font-medium">GENUINE LIVE HOLDER</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-elevated flex flex-col sm:flex-row items-center gap-3">
          <Link href={`/verifications/${item.id}`} className="w-full sm:flex-1">
            <Button variant="default" size="default" className="w-full gap-2 text-sm justify-center font-semibold">
              <FileText className="w-4 h-4" />
              <span>Open Full Case Dossier</span>
            </Button>
          </Link>
          <Link href={`/evidence/${item.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full sm:w-auto gap-2 text-sm justify-center">
              <ExternalLink className="w-4 h-4" />
              <span>Evidence Lab</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

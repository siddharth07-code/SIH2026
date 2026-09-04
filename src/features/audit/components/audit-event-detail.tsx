"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  X,
  ExternalLink,
  User,
  Clock,
  Database,
  KeyRound,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/formatters";
import type { AuditEvent } from "@/types";

interface AuditEventDetailProps {
  event: AuditEvent;
  onClose: () => void;
}

export function AuditEventDetail({ event, onClose }: AuditEventDetailProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(event.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVerification = event.target.type === "VERIFICATION" || !!event.target.trackingNumber;
  const isEvidence = event.target.type === "EVIDENCE";
  const targetId = event.target.id;

  return (
    <Card className="jp-card overflow-hidden flex flex-col h-full">
      {/* Header */}
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between" style={{ backgroundColor: "var(--jp-bg-root)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded border border-border flex items-center justify-center text-primary shrink-0" style={{ backgroundColor: "var(--jp-primary-subtle)" }}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground truncate">
              Audit Event Dossier
            </CardTitle>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[160px] sm:max-w-[220px]">
                {event.id}
              </span>
              <button
                onClick={handleCopyId}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                title="Copy Event ID"
                aria-label="Copy Event ID"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Close event detail panel"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3.5 overflow-y-auto max-h-[calc(100vh-220px)]">
        {/* Core Event Badges & Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-md border border-border" style={{ backgroundColor: "var(--jp-bg-root)" }}>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-mono">
              {event.category}
            </Badge>
            <Badge
              variant={
                event.outcome === "SUCCESS"
                  ? "success"
                  : event.outcome === "WARNING"
                  ? "warning"
                  : "destructive"
              }
              className="text-[10px] font-mono"
            >
              {event.outcome}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
              SEVERITY: {event.severity}
            </Badge>
          </div>

          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            {formatDateTime(event.timestamp)}
          </span>
        </div>

        {/* Action Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Executed Operation
          </span>
          <h3 className="text-base font-bold text-foreground font-mono m-0">
            {event.action.replace(/_/g, " ")}
          </h3>
          {event.reason && (
            <p className="text-xs text-muted-foreground p-2.5 rounded border border-border italic leading-relaxed m-0" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              &quot;{event.reason}&quot;
            </p>
          )}
        </div>

        {/* Actor Section */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            Authenticated Actor
          </span>
          <div className="rounded-md border border-border p-2.5 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {event.actor.fullName}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {event.actor.role}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-mono text-muted-foreground">
              <span>Badge: <strong className="text-foreground">{event.actor.badgeNumber}</strong></span>
              {event.actor.unit && <span>Unit: {event.actor.unit}</span>}
              {event.actor.ipAddress && <span>IP: {event.actor.ipAddress}</span>}
            </div>
          </div>
        </div>

        {/* Target & Deep Link Navigation */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Target Resource
          </span>
          <div className="rounded-md border border-border p-2.5 space-y-2" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground block">
                  RESOURCE TYPE
                </span>
                <span className="text-xs font-semibold text-foreground font-mono">
                  {event.target.type}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                ID: {event.target.id}
              </span>
            </div>

            {/* Direct Link to Verification Case */}
            {isVerification && (
              <div className="pt-2 border-t border-border">
                <Link href={`/verifications/${targetId}`} className="block">
                  <Button variant="default" size="sm" className="w-full justify-between text-xs h-8">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Open Verification Case {event.target.trackingNumber ? `(${event.target.trackingNumber})` : ""}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Direct Link to Evidence Center */}
            {isEvidence && (
              <div className="pt-2 border-t border-border">
                <Link href={`/evidence/${targetId}`} className="block">
                  <Button variant="default" size="sm" className="w-full justify-between text-xs h-8">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Inspect Forensic Evidence Artifact
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* State Changes Diff View (Before vs After) */}
        {event.stateChange && (event.stateChange.before || event.stateChange.after) && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              State Transition (Before → After)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded border border-border p-2 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
                <span className="text-[10px] text-muted-foreground block uppercase">Before State</span>
                <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap overflow-x-auto m-0">
                  {event.stateChange.before ? JSON.stringify(event.stateChange.before, null, 2) : "—"}
                </pre>
              </div>

              <div className="rounded border border-border p-2 space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
                <span className="text-[10px] text-emerald-400 block uppercase">After State</span>
                <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap overflow-x-auto m-0">
                  {event.stateChange.after ? JSON.stringify(event.stateChange.after, null, 2) : "—"}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Additional Payload Details */}
        {event.details && Object.keys(event.details).length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              Operational Payload Telemetry
            </span>
            <pre className="text-[11px] font-mono p-2.5 rounded border border-border text-muted-foreground whitespace-pre-wrap overflow-x-auto m-0" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              {JSON.stringify(event.details, null, 2)}
            </pre>
          </div>
        )}

        {/* Cryptographic Integrity Signature */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            Integrity Verification
          </span>
          <div className="rounded-md border border-border p-2.5 space-y-1.5 text-xs font-mono" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px]">Integrity Status</span>
              <Badge variant="outline" className="text-[10px]">
                {event.integrity?.status || "UNAVAILABLE"}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground break-all">
              Hash: <strong className="text-primary">{event.integrity?.hash || "—"}</strong>
            </div>
            <div className="text-[10px] text-muted-foreground break-all">
              Sequence: #{event.integrity?.sequenceNumber ?? "—"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

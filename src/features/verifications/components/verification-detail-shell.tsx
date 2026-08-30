"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, FileText, User, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import { useVerification } from "../hooks/use-verifications";
import { VerificationRiskCard } from "./verification-risk-card";
import { VerificationEvidenceGrid } from "./verification-evidence-grid";
import { VerificationFindingsList } from "./verification-findings-list";
import { VerificationTimeline } from "./verification-timeline";
import { VerificationActionsPanel } from "./verification-actions-panel";

interface VerificationDetailShellProps {
  id: string;
}

export function VerificationDetailShell({ id }: VerificationDetailShellProps) {
  const { data: verification, isLoading, isError } = useVerification(id);

  if (isLoading) {
    return (
      <div className="p-8 sm:p-12 text-center text-xs font-mono text-muted-foreground bg-slate-900/50 rounded-lg border border-white/[0.08] animate-pulse">
        Retrieving verification case record from backend...
      </div>
    );
  }

  if (isError || !verification) {
    return (
      <div className="space-y-6">
        <Link href="/verifications">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Screening Queue</span>
          </Button>
        </Link>
        <EmptyState
          icon={ShieldAlert}
          title={`Verification Case ${id} Not Found`}
          description="The requested screening case record does not exist or has not been ingested into the system yet."
          notice="Verification cases are submitted by authorized officers via mobile terminal ingest."
          action={
            <Link href="/verifications">
              <Button variant="outline" size="sm" className="text-xs">
                Return to Verification Queue
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { trackingNumber, checkpointName, officerName, officerBadge, status, document, riskAssessment, evidence, timeline } = verification;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Navigation Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <Link href="/verifications">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Screening Queue</span>
          </Button>
        </Link>
        <Badge variant="outline" className="text-[11px] font-mono">
          CASE DOSSIER
        </Badge>
      </div>

      <PageHeader
        title={`Verification Case: ${trackingNumber}`}
        description={`Identity screening inspection for ${document.type} ${maskDocumentNumber(document.documentNumber)} (${document.issuingCountry}).`}
        badge={<StatusIndicator status={status} size="sm" />}
      >
        <Link href={`/evidence/${id}`} className="w-full sm:w-auto">
          <Button variant="default" size="sm" className="gap-1.5 text-xs w-full sm:w-auto justify-center">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Evidence Center</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Case Metadata Banner - Responsive 1 to 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card variant="elevated" className="p-3.5 space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Document Entity
          </span>
          <div className="text-xs font-semibold text-foreground">
            {document.type}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground block">
            {maskDocumentNumber(document.documentNumber)} ({document.issuingCountry})
          </span>
        </Card>

        <Card variant="elevated" className="p-3.5 space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Checkpoint Unit
          </span>
          <div className="text-xs font-semibold text-foreground truncate">
            {checkpointName}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground block">
            Terminal {verification.terminalId || "01"}
          </span>
        </Card>

        <Card variant="elevated" className="p-3.5 space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-400" />
            Submitting Officer
          </span>
          <div className="text-xs font-semibold text-foreground truncate">
            {officerName}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground block">
            Badge: {officerBadge}
          </span>
        </Card>

        <Card variant="elevated" className="p-3.5 space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Ingest Timestamp
          </span>
          <div className="text-xs font-semibold text-foreground font-mono truncate">
            {formatDateTime(verification.createdAt)}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono block">
            Status: {status.replace("_", " ")}
          </span>
        </Card>
      </div>

      {/* Risk Engine & Supervisory Action Section (Responsive 2-Col Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <VerificationRiskCard riskAssessment={riskAssessment} />
        </div>
        <div>
          <VerificationActionsPanel verificationId={id} currentStatus={status} />
        </div>
      </div>

      {/* Multi-Signal Evidence Signals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-foreground tracking-wider uppercase">
            Multi-Signal Verification Evidence
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">
            {evidence?.length || 0} signals analyzed
          </span>
        </div>
        <VerificationEvidenceGrid evidence={evidence || []} verificationId={id} />
      </div>

      {/* Structured Key Findings */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-foreground tracking-wider uppercase">
          Key Verification Findings & Checksum Results
        </h2>
        <VerificationFindingsList evidence={evidence || []} />
      </div>

      {/* Verification Lifecycle Audit Timeline */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-foreground tracking-wider uppercase">
          Verification Lifecycle & Operational Audit Trail
        </h2>
        <VerificationTimeline timeline={timeline || []} />
      </div>
    </div>
  );
}

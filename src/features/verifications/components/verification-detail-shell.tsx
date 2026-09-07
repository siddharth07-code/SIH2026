"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, FileText, User, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import { useVerification } from "../hooks/use-verifications";
import { VerificationRiskCard } from "./verification-risk-card";
import { VerificationEvidenceGrid } from "./verification-evidence-grid";
import { VerificationFindingsList } from "./verification-findings-list";
import { VerificationTimeline } from "./verification-timeline";
import { VerificationActionsPanel } from "./verification-actions-panel";
import { VerificationHeatmapCard } from "./verification-heatmap-card";

interface VerificationDetailShellProps {
  id: string;
}

export function VerificationDetailShell({ id }: VerificationDetailShellProps) {
  const { data: verification, isLoading, isError } = useVerification(id);

  if (isLoading) {
    return (
      <div className="jp-state-box">
        <p className="jp-state-desc font-mono animate-pulse m-0">
          Retrieving verification case record from backend...
        </p>
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

      {/* Case Metadata Banner */}
      <div className="jp-dossier-meta-grid">
        <div className="jp-dossier-meta-card">
          <span className="jp-dossier-meta-label">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Document Entity
          </span>
          <div className="jp-dossier-meta-val">
            {document.type}
          </div>
          <span className="jp-dossier-meta-sub">
            {maskDocumentNumber(document.documentNumber)} ({document.issuingCountry})
          </span>
        </div>

        <div className="jp-dossier-meta-card">
          <span className="jp-dossier-meta-label">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Checkpoint Unit
          </span>
          <div className="jp-dossier-meta-val truncate">
            {checkpointName}
          </div>
          <span className="jp-dossier-meta-sub">
            Terminal {verification.terminalId || "01"}
          </span>
        </div>

        <div className="jp-dossier-meta-card">
          <span className="jp-dossier-meta-label">
            <User className="w-3.5 h-3.5 text-sky-400" />
            Submitting Officer
          </span>
          <div className="jp-dossier-meta-val truncate">
            {officerName}
          </div>
          <span className="jp-dossier-meta-sub">
            Badge: {officerBadge}
          </span>
        </div>

        <div className="jp-dossier-meta-card">
          <span className="jp-dossier-meta-label">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Ingest Timestamp
          </span>
          <div className="jp-dossier-meta-val font-mono truncate">
            {formatDateTime(verification.createdAt)}
          </div>
          <span className="jp-dossier-meta-sub">
            Status: {status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Risk Engine & Supervisory Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VerificationRiskCard riskAssessment={riskAssessment} />
        </div>
        <div>
          <VerificationActionsPanel verificationId={id} currentStatus={status} />
        </div>
      </div>

      {/* Real Forensic Localization Heatmap & Optical Substrate */}
      <VerificationHeatmapCard
        verificationId={id}
        document={document}
        evidence={evidence}
      />

      {/* Multi-Signal Evidence Signals */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-foreground uppercase m-0">
            Multi-Signal Verification Evidence
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">
            {evidence?.length || 0} signals analyzed
          </span>
        </div>
        <VerificationEvidenceGrid evidence={evidence || []} verificationId={id} />
      </div>

      {/* Structured Key Findings */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-semibold text-foreground uppercase m-0">
          Key Verification Findings & Checksum Results
        </h2>
        <VerificationFindingsList evidence={evidence || []} />
      </div>

      {/* Verification Lifecycle Audit Timeline */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-semibold text-foreground uppercase m-0">
          Verification Lifecycle & Operational Audit Trail
        </h2>
        <VerificationTimeline timeline={timeline || []} />
      </div>
    </div>
  );
}

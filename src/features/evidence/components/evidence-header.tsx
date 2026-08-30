"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/shared/status-indicator";
import type { EvidenceDetail } from "@/types";

interface EvidenceHeaderProps {
  evidence: EvidenceDetail;
}

export function EvidenceHeader({ evidence }: EvidenceHeaderProps) {
  const { id, verificationId, trackingNumber, overallSeverity, summary } = evidence;

  return (
    <div className="space-y-4 pb-5 border-b border-white/[0.08] max-w-full overflow-x-hidden">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href={`/verifications/${verificationId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Case Dossier</span>
          </Button>
        </Link>
        <Badge variant="outline" className="text-[10px] font-mono">
          FORENSIC WORKSTATION
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
              Evidence Investigation: {trackingNumber || id}
            </h1>
            <StatusIndicator status={overallSeverity} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link href={`/verifications/${verificationId}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 sm:h-9 w-full sm:w-auto justify-center">
              <FileText className="w-3.5 h-3.5" />
              <span>Back to Case Dossier</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

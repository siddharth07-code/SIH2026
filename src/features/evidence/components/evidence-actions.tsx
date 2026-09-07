"use client";

import * as React from "react";
import { Flag, ShieldAlert, Lock, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { verificationsApi } from "@/lib/api/verifications";
import { useQueryClient } from "@tanstack/react-query";

interface EvidenceActionsProps {
  evidenceId: string;
  verificationId: string;
}

export function EvidenceActions({ verificationId }: EvidenceActionsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [feedbackNotice, setFeedbackNotice] = React.useState<string | null>(null);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);
  const [isActing, setIsActing] = React.useState(false);

  const isSupervisorOrAbove = user?.role === "SUPERVISOR" || user?.role === "ADMINISTRATOR";

  const handleReview = async () => {
    setFeedbackNotice(`Operational action "FLAG_FOR_SUPERVISOR_REVIEW" recorded for case ${verificationId}.`);
    setIsActing(true);
    setErrorNotice(null);

    try {
      const response = await verificationsApi.submitSupervisoryReview(
        verificationId,
        "MANUAL_VERIFICATION",
        `Evidence inspection flagged for manual forensic secondary audit by ${user?.badgeNumber || "On-Duty"}`
      );
      setFeedbackNotice(response.message || `Operational action "FLAG_FOR_SUPERVISOR_REVIEW" recorded for case ${verificationId}.`);
      await queryClient.invalidateQueries({ queryKey: ["evidence"] });
      await queryClient.invalidateQueries({ queryKey: ["verifications"] });
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Failed to record determination.");
    } finally {
      setIsActing(false);
    }
  };

  const handleEscalate = async () => {
    setFeedbackNotice(`Operational action "ESCALATE_TO_FORENSIC_LAB" recorded for case ${verificationId}.`);
    setIsActing(true);
    setErrorNotice(null);

    try {
      const response = await verificationsApi.escalateVerification(
        verificationId,
        `Evidence anomaly escalated to central fraud inspection by ${user?.badgeNumber || "On-Duty"}`
      );
      setFeedbackNotice(response.message || `Operational action "ESCALATE_TO_FORENSIC_LAB" recorded for case ${verificationId}.`);
      await queryClient.invalidateQueries({ queryKey: ["evidence"] });
      await queryClient.invalidateQueries({ queryKey: ["verifications"] });
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Failed to escalate case.");
    } finally {
      setIsActing(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Forensic Investigator Determinations
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-mono text-amber-300">
          SUPERVISOR+
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-3">
        <p className="text-xs text-muted-foreground leading-tight">
          Flag suspicious forensic regions or escalate case to secondary fraud investigation.
        </p>

        {feedbackNotice && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-xs text-emerald-300 space-y-0.5">
            <span className="font-semibold block text-[11px]">Operational Notice</span>
            <p className="text-[11px] leading-tight">{feedbackNotice}</p>
          </div>
        )}

        {errorNotice && (
          <div className="rounded-md border border-rose-500/30 bg-rose-950/20 p-2.5 text-xs text-rose-300 space-y-0.5">
            <span className="font-semibold block text-[11px]">Action Failed</span>
            <p className="text-[11px] leading-tight">{errorNotice}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={handleReview}
            disabled={!isSupervisorOrAbove || isActing}
            className="w-full sm:w-auto flex-1 justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
            <span>Flag for Review</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleEscalate}
            disabled={!isSupervisorOrAbove || isActing}
            className="w-full sm:w-auto flex-1 justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>Escalate Case</span>
          </Button>
        </div>

        {!isSupervisorOrAbove && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-white/[0.06]">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Supervisory role clearance required to execute determinations.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

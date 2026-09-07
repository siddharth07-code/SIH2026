"use client";

import * as React from "react";
import { CheckCircle2, ShieldAlert, Lock, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { verificationsApi } from "@/lib/api/verifications";
import { useQueryClient } from "@tanstack/react-query";
import type { VerificationStatus } from "@/types";

interface VerificationActionsPanelProps {
  verificationId: string;
  currentStatus: VerificationStatus;
}

export function VerificationActionsPanel({
  verificationId,
  currentStatus,
}: VerificationActionsPanelProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [feedbackNotice, setFeedbackNotice] = React.useState<string | null>(null);
  const [errorNotice, setErrorNotice] = React.useState<string | null>(null);
  const [isActing, setIsActing] = React.useState(false);

  const isSupervisorOrAbove = user?.role === "SUPERVISOR" || user?.role === "ADMINISTRATOR";

  const handleReview = async (decision: "CLEARED" | "ESCALATED" | "MANUAL_VERIFICATION") => {
    setFeedbackNotice(`Operational action "${decision}" recorded for case ${verificationId} (Current: ${currentStatus}).`);
    setIsActing(true);
    setErrorNotice(null);

    try {
      const response = await verificationsApi.submitSupervisoryReview(
        verificationId,
        decision,
        `Officer ${user?.badgeNumber || "On-Duty"} marked case ${decision}`
      );
      setFeedbackNotice(response.message || `Operational action "${decision}" recorded for case ${verificationId}.`);
      await queryClient.invalidateQueries({ queryKey: ["verifications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Failed to record supervisory determination.");
    } finally {
      setIsActing(false);
    }
  };

  const handleEscalate = async () => {
    setFeedbackNotice(`Operational action "ESCALATE_CASE" recorded for case ${verificationId} (Current: ${currentStatus}).`);
    setIsActing(true);
    setErrorNotice(null);

    try {
      const response = await verificationsApi.escalateVerification(
        verificationId,
        `Supervisory escalation to central fraud inspection by ${user?.badgeNumber || "On-Duty"}`
      );
      setFeedbackNotice(response.message || `Operational action "ESCALATE_CASE" recorded for case ${verificationId}.`);
      await queryClient.invalidateQueries({ queryKey: ["verifications"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Failed to execute case escalation.");
    } finally {
      setIsActing(false);
    }
  };

  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Supervisory Determinations
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-mono text-amber-300">
          SUPERVISOR+
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4 space-y-3">
        <p className="text-xs text-muted-foreground leading-tight">
          Execute authoritative clearance or escalate document case for physical secondary inspection.
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

        <div className="space-y-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleReview("CLEARED")}
            disabled={!isSupervisorOrAbove || isActing || currentStatus === "CLEARED"}
            className="w-full justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Clear / Review Document</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleEscalate}
            disabled={!isSupervisorOrAbove || isActing || currentStatus === "ESCALATED"}
            className="w-full justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>Escalate Case</span>
          </Button>
        </div>

        {!isSupervisorOrAbove && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-white/[0.06]">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Supervisory clearance required to execute determinations.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { CheckCircle2, ShieldAlert, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";
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
  const [feedbackNotice, setFeedbackNotice] = React.useState<string | null>(null);

  const isSupervisorOrAbove = user?.role === "SUPERVISOR" || user?.role === "ADMINISTRATOR";

  const handleAction = (actionName: string) => {
    setFeedbackNotice(`Operational action "${actionName}" recorded for case ${verificationId} (Current: ${currentStatus}).`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <Card className="h-full jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">
          Supervisory Actions
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-mono text-amber-300">
          SUPERVISOR+
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        <p className="text-xs text-muted-foreground leading-tight m-0">
          Authorize document clearance or escalate case for physical secondary inspection.
        </p>

        {feedbackNotice && (
          <div className="rounded-md border border-primary/30 p-2.5 text-xs space-y-0.5" style={{ backgroundColor: "var(--jp-primary-subtle)", color: "var(--jp-text-primary)" }}>
            <span className="font-semibold block text-[11px]">Operational Notice</span>
            <p className="text-[11px] leading-tight m-0">{feedbackNotice}</p>
          </div>
        )}

        <div className="space-y-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAction("CLEAR_CASE")}
            disabled={!isSupervisorOrAbove}
            className="w-full justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clear / Review Document</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAction("ESCALATE_CASE")}
            disabled={!isSupervisorOrAbove}
            className="w-full justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Escalate Case</span>
          </Button>
        </div>

        {!isSupervisorOrAbove && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Supervisory clearance required to execute determinations.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

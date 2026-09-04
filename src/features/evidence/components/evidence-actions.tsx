"use client";

import * as React from "react";
import { Flag, ShieldAlert, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface EvidenceActionsProps {
  evidenceId: string;
  verificationId: string;
}

export function EvidenceActions({ evidenceId, verificationId }: EvidenceActionsProps) {
  const { user } = useAuth();
  const [feedbackNotice, setFeedbackNotice] = React.useState<string | null>(null);

  const isSupervisorOrAbove = user?.role === "SUPERVISOR" || user?.role === "ADMINISTRATOR";

  const handleAction = (actionName: string) => {
    setFeedbackNotice(`Investigator determination "${actionName}" recorded for evidence artifact ${evidenceId} (Case ${verificationId}).`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">
          Forensic Investigator Determinations
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-mono text-amber-300">
          SUPERVISOR+
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        <p className="text-xs text-muted-foreground leading-tight m-0">
          Flag suspicious forensic regions or escalate case to secondary fraud investigation.
        </p>

        {feedbackNotice && (
          <div className="rounded-md border border-primary/30 p-2.5 text-xs space-y-0.5" style={{ backgroundColor: "var(--jp-primary-subtle)", color: "var(--jp-text-primary)" }}>
            <span className="font-semibold block text-[11px]">Operational Notice</span>
            <p className="text-[11px] leading-tight m-0">{feedbackNotice}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAction("FLAG_FOR_SUPERVISOR_REVIEW")}
            disabled={!isSupervisorOrAbove}
            className="w-full sm:w-auto flex-1 justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flag for Review</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAction("ESCALATE_TO_FORENSIC_LAB")}
            disabled={!isSupervisorOrAbove}
            className="w-full sm:w-auto flex-1 justify-center gap-1.5 text-xs h-9 sm:h-8"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Escalate Case</span>
          </Button>
        </div>

        {!isSupervisorOrAbove && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Supervisory role clearance required to execute determinations.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

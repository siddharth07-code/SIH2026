"use client";

import * as React from "react";
import { Clock, Shield, CheckCircle2, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/formatters";
import type { AuditEvent } from "@/types";

interface AuditTimelineProps {
  events?: AuditEvent[];
  selectedEventId?: string | null;
  onSelectEvent?: (event: AuditEvent) => void;
}

export function AuditTimeline({
  events = [],
  selectedEventId,
  onSelectEvent,
}: AuditTimelineProps) {
  if (events.length === 0) {
    return null;
  }

  const getActionIcon = (category: string) => {
    switch (category) {
      case "REVIEW":
        return CheckCircle2;
      case "ESCALATION":
        return ShieldAlert;
      case "AUTH":
        return KeyRound;
      default:
        return Shield;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "SUCCESS":
        return <Badge variant="success" className="text-[9px] font-mono">SUCCESS</Badge>;
      case "FAILURE":
      case "DENIED":
      case "BLOCKED":
        return <Badge variant="destructive" className="text-[9px] font-mono">{outcome}</Badge>;
      case "WARNING":
        return <Badge variant="warning" className="text-[9px] font-mono">WARNING</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] font-mono">{outcome}</Badge>;
    }
  };

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Chronological Governance Timeline
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {events.length} CHRONOLOGICAL NODES
        </span>
      </CardHeader>

      <CardContent className="p-3.5">
        <div className="jp-timeline-container">
          {events.map((evt) => {
            const Icon = getActionIcon(evt.category);
            const isSelected = selectedEventId === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent?.(evt)}
                className="jp-timeline-node group cursor-pointer"
              >
                {/* Timeline node icon */}
                <div
                  className={`jp-timeline-dot flex items-center justify-center ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                  style={{ width: "18px", height: "18px", left: "-18px" }}
                >
                  <Icon className="w-2.5 h-2.5" />
                </div>

                {/* Timeline entry body */}
                <div
                  className="p-3 rounded-md border border-border"
                  style={{
                    backgroundColor: isSelected ? "var(--jp-primary-subtle)" : "var(--jp-bg-root)",
                    borderColor: isSelected ? "var(--jp-primary-border)" : "var(--jp-border-default)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground font-mono">
                        {evt.action.replace(/_/g, " ")}
                      </span>
                      {getOutcomeBadge(evt.outcome)}
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {formatDateTime(evt.timestamp)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <span>
                      Actor: <strong className="text-foreground">{evt.actor.fullName}</strong> ({evt.actor.badgeNumber})
                    </span>
                    <span>•</span>
                    <span>
                      Target: <strong className="text-foreground">{evt.target.type}</strong> {evt.target.trackingNumber ? `(${evt.target.trackingNumber})` : evt.target.id}
                    </span>
                  </div>

                  {evt.reason && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 italic m-0">
                      &quot;{evt.reason}&quot;
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-end">
                    <span className="text-[10px] text-primary flex items-center gap-1 font-mono group-hover:underline">
                      View Event Dossier <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

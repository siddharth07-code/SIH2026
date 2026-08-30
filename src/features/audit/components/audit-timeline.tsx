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
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
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

      <CardContent className="p-3.5 sm:p-5">
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {events.map((evt) => {
            const Icon = getActionIcon(evt.category);
            const isSelected = selectedEventId === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent?.(evt)}
                className={`relative group cursor-pointer transition-all ${
                  isSelected ? "opacity-100" : "hover:opacity-100"
                }`}
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-110"
                      : "bg-slate-900 border-white/20 text-muted-foreground group-hover:border-primary/60 group-hover:text-primary"
                  }`}
                >
                  <Icon className="w-2.5 h-2.5" />
                </div>

                {/* Timeline entry body */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]"
                      : "border-white/[0.06] bg-slate-950/40 hover:border-white/20 hover:bg-slate-950/60"
                  }`}
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
                    <p className="text-[11px] text-muted-foreground/90 mt-1.5 italic">
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

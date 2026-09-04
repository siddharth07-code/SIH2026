"use client";

import * as React from "react";
import { Clock, PlayCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/formatters";
import type { EvidenceTimelineEvent } from "@/types";

interface EvidenceTimelineProps {
  timeline?: EvidenceTimelineEvent[];
}

export function EvidenceTimeline({ timeline = [] }: EvidenceTimelineProps) {
  const hasTimeline = timeline.length > 0;

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold text-foreground">
            Evidence Generation & Processing Lifecycle
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {timeline.length} AUDITED EVENTS
        </span>
      </CardHeader>

      <CardContent className="p-3.5">
        {hasTimeline ? (
          <div className="jp-timeline-container">
            {timeline.map((event) => (
              <div key={event.id} className="jp-timeline-node">
                <div
                  className={`jp-timeline-dot ${
                    event.status === "COMPLETED"
                      ? "border-emerald-400 bg-emerald-500"
                      : event.status === "FAILED"
                      ? "border-rose-400 bg-rose-500"
                      : event.status === "WARNING"
                      ? "border-amber-400 bg-amber-500"
                      : "border-primary bg-primary"
                  }`}
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs font-semibold text-foreground m-0">
                    {event.stage}
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatDateTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight m-0">
                  {event.description}
                </p>
                {event.actor && (
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Actor: {event.actor}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 text-center space-y-1.5 border border-dashed border-border rounded-md" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <PlayCircle className="w-5 h-5 text-muted-foreground mx-auto" />
            <h4 className="text-xs font-semibold text-foreground m-0">
              Evidence Timeline Unaudited / Offline
            </h4>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed m-0">
              As evidence extraction stages execute across OCR, forensics, and biometrics, chronological milestone events will stream into this audit trail.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

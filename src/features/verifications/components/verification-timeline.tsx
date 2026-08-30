"use client";

import * as React from "react";
import { Clock, PlayCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/formatters";
import type { VerificationTimelineEvent } from "@/types";

interface VerificationTimelineProps {
  timeline?: VerificationTimelineEvent[];
}

export function VerificationTimeline({ timeline = [] }: VerificationTimelineProps) {
  const hasTimeline = timeline.length > 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-4 pb-3 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold text-foreground">
            Pipeline Processing Timeline & Audit Trail
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {timeline.length} MILESTONE EVENTS
        </span>
      </CardHeader>

      <CardContent className="p-4">
        {hasTimeline ? (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
            {timeline.map((event) => (
              <div key={event.id} className="relative space-y-1">
                {/* Dot Indicator */}
                <div
                  className={`absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 bg-background ${
                    event.status === "COMPLETED"
                      ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : event.status === "FAILED"
                      ? "border-rose-400 bg-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                      : event.status === "WARNING"
                      ? "border-amber-400 bg-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      : "border-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  }`}
                />
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-foreground">
                    {event.title}
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatDateTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
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
          <div className="p-6 text-center space-y-2 border border-dashed border-white/[0.12] rounded-lg bg-slate-900/20 backdrop-blur-sm">
            <PlayCircle className="w-6 h-6 text-muted-foreground mx-auto" />
            <h4 className="text-xs font-semibold text-foreground">
              Processing Pipeline Telemetry Offline
            </h4>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
              As asynchronous stages (OCR, MRZ, digital forensics, and biometric matching) execute on the backend, milestone events will log here chronologically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

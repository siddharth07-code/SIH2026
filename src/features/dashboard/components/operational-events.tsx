"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, ArrowUpRight, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { formatDateTime } from "@/lib/utils/formatters";
import { useOperationalEvents } from "../hooks/use-dashboard-queries";

type EventCategoryFilter = "ALL" | "ESCALATIONS" | "REVIEWS" | "SYSTEM";

export function OperationalEvents() {
  const [filter, setFilter] = React.useState<EventCategoryFilter>("ALL");
  const { data: events } = useOperationalEvents(10);

  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    if (filter === "ALL") return events;
    if (filter === "ESCALATIONS") return events.filter((e) => e.type === "CASE_ESCALATED");
    if (filter === "REVIEWS") return events.filter((e) => e.type === "SUPERVISOR_REVIEW");
    if (filter === "SYSTEM") return events.filter((e) => e.type === "SYSTEM_ALERT");
    return events;
  }, [events, filter]);

  const hasEvents = filteredEvents.length > 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Live Operational & Audit Event Stream
          </CardTitle>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Filter Pills - Touch Friendly */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-md border border-white/[0.08] backdrop-blur-sm shrink-0">
            {(["ALL", "ESCALATIONS", "REVIEWS", "SYSTEM"] as EventCategoryFilter[]).map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(cat)}
                className="h-6 px-2 text-[10px] font-mono min-h-[26px]"
              >
                {cat}
              </Button>
            ))}
          </div>

          <Link href="/audit" className="text-xs text-primary hover:underline flex items-center gap-0.5 font-medium ml-1 shrink-0">
            <span>Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4">
        {hasEvents ? (
          <div className="divide-y divide-white/[0.06] space-y-2">
            {filteredEvents.map((event) => (
              <div key={event.id} className="pt-2 first:pt-0 flex flex-col xs:flex-row xs:items-start justify-between gap-1 xs:gap-3 text-xs">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusIndicator status={event.severity} size="sm" />
                    <span className="font-semibold text-foreground truncate">{event.title}</span>
                  </div>
                  <p className="text-muted-foreground leading-tight text-[11px] sm:text-xs">{event.description}</p>
                  {event.actorBadge && (
                    <span className="text-[10px] font-mono text-muted-foreground block truncate">
                      Actor: {event.actorBadge} • {event.checkpointName || "HQ Unit"}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0 self-end xs:self-start">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/[0.12] rounded-lg bg-slate-900/20 backdrop-blur-sm min-h-[130px] space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_12px_-2px_rgba(59,130,246,0.3)]">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 max-w-sm">
              <h3 className="text-xs font-semibold text-foreground">
                No Operational Events Logged
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Authentication records, AI processing events, and officer review decisions will stream here in real-time.
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground bg-slate-950/60 px-2 py-0.5 rounded border border-white/[0.08] truncate max-w-full">
              Filter: {filter} • Real-time audit telemetry
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Live Operational & Audit Event Stream
          </CardTitle>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-md border border-border shrink-0" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            {(["ALL", "ESCALATIONS", "REVIEWS", "SYSTEM"] as EventCategoryFilter[]).map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter(cat)}
                className="h-6 px-2 text-[10px] font-mono min-h-[24px]"
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

      <CardContent className="p-3.5">
        {hasEvents ? (
          <div className="divide-y divide-border space-y-2">
            {filteredEvents.map((event) => (
              <div key={event.id} className="jp-event-item">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusIndicator status={event.severity} size="sm" />
                    <span className="font-semibold text-foreground truncate">{event.title}</span>
                  </div>
                  <p className="text-muted-foreground leading-tight text-[11px] sm:text-xs m-0">{event.description}</p>
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
          <div className="jp-state-box min-h-[120px] p-4">
            <div className="jp-state-icon jp-state-icon-primary w-8 h-8 mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="jp-state-title text-xs">
              No Operational Events Logged
            </h3>
            <p className="jp-state-desc text-[11px] mb-2">
              Authentication records, AI processing events, and officer review decisions will stream here in real-time.
            </p>
            <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded border border-border truncate max-w-full" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              Filter: {filter} • Real-time audit telemetry
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

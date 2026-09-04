"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardActivity } from "../hooks/use-dashboard-queries";

type Timeframe = "1H" | "6H" | "24H" | "7D";

export function VerificationActivity() {
  const [timeframe, setTimeframe] = React.useState<Timeframe>("24H");
  const { data: activity } = useDashboardActivity(timeframe);

  const hasData = !!activity && activity.intervals.length > 0;

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary shrink-0" />
            <CardTitle className="text-sm font-semibold text-foreground truncate">
              Screening Throughput & Volume Activity
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground leading-tight m-0">
            Aggregated document screening volume categorized by risk severity.
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-1 p-0.5 rounded-md border border-border self-start sm:self-auto" style={{ backgroundColor: "var(--jp-bg-root)" }}>
          {(["1H", "6H", "24H", "7D"] as Timeframe[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="h-6 px-2 text-[10px] font-mono min-w-[28px]"
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-3.5">
        {hasData ? (
          <div className="jp-interval-grid">
            {activity.intervals.map((interval) => (
              <div key={interval.timestamp} className="jp-interval-card">
                <span className="text-[10px] font-mono text-muted-foreground block truncate">{interval.label}</span>
                <span className="text-base font-bold font-mono text-foreground">{interval.totalScreenings}</span>
                <div className="flex gap-2 text-[10px] font-mono text-muted-foreground pt-1 border-t border-border">
                  <span className="text-emerald-400">L:{interval.lowRiskCount}</span>
                  <span className="text-amber-400">M:{interval.mediumRiskCount}</span>
                  <span className="text-rose-400">H:{interval.highRiskCount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="jp-state-box min-h-[140px] p-4">
            <div className="jp-state-icon jp-state-icon-primary w-8 h-8 mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="jp-state-title text-xs">
              Screening Throughput Timeline ({timeframe})
            </h3>
            <p className="jp-state-desc text-[11px] mb-2">
              Visual activity metrics and hourly throughput histograms will render here once screening cases are processed through the backend pipeline.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-2.5 py-1 rounded border border-border font-mono max-w-full truncate" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">Window: {timeframe} • Real-time throughput telemetry</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

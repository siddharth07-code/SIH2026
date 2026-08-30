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
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary shrink-0" />
            <CardTitle className="text-sm font-semibold text-foreground truncate">
              Screening Throughput & Volume Activity
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground leading-tight">
            Aggregated document screening volume categorized by risk severity.
          </p>
        </div>

        {/* Timeframe Controls - Touch Targets */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-md border border-white/[0.08] self-start sm:self-auto backdrop-blur-sm">
          {(["1H", "6H", "24H", "7D"] as Timeframe[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="h-7 px-2.5 text-[11px] font-mono min-w-[32px]"
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-6">
        {hasData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {activity.intervals.map((interval) => (
                <div key={interval.timestamp} className="rounded-md border border-white/[0.08] bg-slate-900/50 p-2.5 sm:p-3 space-y-1 backdrop-blur-sm">
                  <span className="text-[11px] font-mono text-muted-foreground block truncate">{interval.label}</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-foreground">{interval.totalScreenings}</span>
                  <div className="flex gap-2 text-[10px] font-mono text-muted-foreground pt-1 border-t border-white/[0.08]">
                    <span className="text-emerald-400">L:{interval.lowRiskCount}</span>
                    <span className="text-amber-400">M:{interval.mediumRiskCount}</span>
                    <span className="text-rose-400">H:{interval.highRiskCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 border border-dashed border-white/[0.12] rounded-lg bg-slate-900/20 backdrop-blur-sm min-h-[160px] space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_12px_-2px_rgba(59,130,246,0.3)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                Screening Throughput Timeline ({timeframe})
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                Visual activity metrics and hourly throughput histograms will render here once screening cases are processed through the backend pipeline.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground bg-slate-950/60 px-2.5 py-1 rounded border border-white/[0.08] font-mono max-w-full truncate">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">Window: {timeframe} • Real-time throughput telemetry</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { FileCheck, ShieldAlert, AlertTriangle, Clock, Activity, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useDashboardSummary } from "../hooks/use-dashboard-queries";

interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  icon: React.ElementType;
  iconColorClass?: string;
  subtext: string;
  trendNotice?: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconColorClass = "text-muted-foreground",
  subtext,
  trendNotice,
}: MetricCardProps) {
  const displayValue = value !== null && value !== undefined ? String(value) : "—";

  return (
    <Card variant="elevated" className="hover:border-white/20 transition-all duration-200">
      <CardHeader className="p-3.5 sm:p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Icon className={`w-3.5 h-3.5 ${iconColorClass}`} aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="p-3.5 sm:p-4 pt-1 space-y-1">
        <div className="text-xl sm:text-2xl font-bold font-mono text-foreground tracking-tight">
          {displayValue}
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">{subtext}</p>
        {trendNotice && (
          <span className="text-[10px] font-mono text-muted-foreground/80 block pt-0.5 truncate">
            {trendNotice}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export function ScreeningOverview() {
  const { data: summary } = useDashboardSummary();

  return (
    <div className="space-y-3">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
        <h2 className="text-xs font-semibold text-foreground tracking-wider uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span>Operational Screening Metrics</span>
        </h2>
        <span className="text-[11px] text-muted-foreground font-mono">
          {summary ? `Updated: ${summary.lastUpdated}` : "Real-time Telemetry"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          title="Screenings Today"
          value={summary?.screeningsToday}
          icon={FileCheck}
          iconColorClass="text-primary"
          subtext="Total documents screened across units"
          trendNotice="Live screening throughput"
        />

        <MetricCard
          title="High-Risk Alerts"
          value={summary?.highRiskAlerts}
          icon={ShieldAlert}
          iconColorClass="text-rose-400"
          subtext="Severe forensic or MRZ mismatches"
          trendNotice="Requires immediate inspection"
        />

        <MetricCard
          title="Supervisory Reviews"
          value={summary?.pendingReviews}
          icon={AlertTriangle}
          iconColorClass="text-amber-400"
          subtext="Cases requiring human triage"
          trendNotice="Human-in-the-loop decisions"
        />

        <MetricCard
          title="Active Checkpoints"
          value={summary?.activeCheckpointsCount}
          icon={MapPin}
          iconColorClass="text-emerald-400"
          subtext="Mobile officer ingest nodes"
          trendNotice="Field terminals online"
        />

        <MetricCard
          title="Avg Pipeline Latency"
          value={
            summary?.avgProcessingSeconds !== null && summary?.avgProcessingSeconds !== undefined
              ? `${summary.avgProcessingSeconds}s`
              : null
          }
          icon={Clock}
          iconColorClass="text-sky-400"
          subtext="End-to-end OCR + AI processing"
          trendNotice="Target SLA < 2.5s"
        />
      </div>
    </div>
  );
}

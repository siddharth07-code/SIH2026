"use client";

import * as React from "react";
import { FileCheck, ShieldAlert, AlertTriangle, Clock, Activity, MapPin } from "lucide-react";
import { useDashboardSummary } from "../hooks/use-dashboard-queries";

interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  icon: React.ElementType;
  iconColorStyle?: string;
  subtext: string;
  trendNotice?: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconColorStyle = "var(--jp-text-muted)",
  subtext,
  trendNotice,
}: MetricCardProps) {
  const displayValue = value !== null && value !== undefined ? String(value) : "—";

  return (
    <div className="jp-metric-card">
      <div className="jp-metric-card-header">
        <span className="jp-metric-card-title">
          {title}
        </span>
        <div className="jp-metric-card-icon-wrap">
          <Icon className="w-4.5 h-4.5" style={{ color: iconColorStyle }} aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="jp-metric-card-value">
          {displayValue}
        </div>
        <p className="jp-metric-card-subtext m-0">{subtext}</p>
        {trendNotice && (
          <span className="jp-metric-card-notice block truncate">
            {trendNotice}
          </span>
        )}
      </div>
    </div>
  );
}

export function ScreeningOverview() {
  const { data: summary } = useDashboardSummary();

  return (
    <div className="space-y-3">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 m-0">
          <Activity className="w-4.5 h-4.5 text-primary" />
          <span>Screening Metrics</span>
        </h2>
        <span className="text-xs text-muted-foreground font-mono font-medium">
          {summary ? `Updated: ${summary.lastUpdated}` : "Live data"}
        </span>
      </div>

      <div className="jp-metric-grid">
        <MetricCard
          title="Screenings Today"
          value={summary?.screeningsToday}
          icon={FileCheck}
          iconColorStyle="var(--jp-primary)"
          subtext="Total documents screened across units"
          trendNotice="Live screening throughput"
        />

        <MetricCard
          title="High-Risk Alerts"
          value={summary?.highRiskAlerts}
          icon={ShieldAlert}
          iconColorStyle="var(--jp-status-high-text)"
          subtext="Severe forensic or MRZ mismatches"
          trendNotice="Requires immediate inspection"
        />

        <MetricCard
          title="Supervisory Reviews"
          value={summary?.pendingReviews}
          icon={AlertTriangle}
          iconColorStyle="var(--jp-status-medium-text)"
          subtext="Cases requiring human triage"
          trendNotice="Human-in-the-loop decisions"
        />

        <MetricCard
          title="Active Checkpoints"
          value={summary?.activeCheckpointsCount}
          icon={MapPin}
          iconColorStyle="var(--jp-status-low-text)"
          subtext="Operational checkpoint posts"
          trendNotice="Active Checkpoints"
        />

        <MetricCard
          title="Avg Pipeline Latency"
          value={
            summary?.avgProcessingSeconds !== null && summary?.avgProcessingSeconds !== undefined
              ? `${summary.avgProcessingSeconds}s`
              : null
          }
          icon={Clock}
          iconColorStyle="var(--jp-status-info-text)"
          subtext="End-to-end OCR + AI processing"
          trendNotice="Target SLA < 2.5s"
        />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Radio, ShieldCheck, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { CheckpointMatrix } from "@/features/dashboard/components/checkpoint-matrix";

export default function CheckpointsPage() {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <PageHeader
        title="Checkpoints & Terminal Ingest Nodes"
        description="Operational monitoring of airport terminal gates, land border crossings, and authorized mobile patrol units."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              INGEST NETWORK
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono">
              LIVE NODES
            </Badge>
          </div>
        }
      />

      {/* High-Level Network Telemetry Grid */}
      <div className="jp-metric-grid">
        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Active Ingest Nodes</span>
            <div className="jp-metric-card-icon-wrap">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <div className="jp-metric-card-value">18 Nodes</div>
          <span className="jp-metric-card-subtext truncate">Across 4 Ports & Border Sectors</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Mobile Terminals</span>
            <div className="jp-metric-card-icon-wrap">
              <Radio className="w-3.5 h-3.5" style={{ color: "var(--jp-status-low-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">32 Units</div>
          <span className="jp-metric-card-subtext truncate">Active Feeder Terminals</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Active Shift Officers</span>
            <div className="jp-metric-card-icon-wrap">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--jp-status-info-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">24 Officers</div>
          <span className="jp-metric-card-subtext truncate">Current Operational Shift</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Network Ingest SLA</span>
            <div className="jp-metric-card-icon-wrap">
              <Radio className="w-3.5 h-3.5" style={{ color: "var(--jp-status-low-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">99.8%</div>
          <span className="jp-metric-card-subtext truncate">Gateway Availability</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Anomaly Detection Rate</span>
            <div className="jp-metric-card-icon-wrap">
              <Radio className="w-3.5 h-3.5" style={{ color: "var(--jp-status-medium-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">1.6%</div>
          <span className="jp-metric-card-subtext truncate">Cases Flagged for Supervisory Review</span>
        </div>
      </div>

      {/* Main Checkpoints Table & Filter Matrix */}
      <CheckpointMatrix />
    </div>
  );
}

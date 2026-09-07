"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, BarChart3 } from "lucide-react";
import { DashboardHeader } from "./dashboard-header";
import { ScreeningOverview } from "./screening-overview";
import { AttentionQueue } from "./attention-queue";
import { VerificationActivity } from "./verification-activity";
import { RiskDistribution } from "./risk-distribution";
import { OperationalEvents } from "./operational-events";

type DashboardTab = "queue" | "telemetry";

export function DashboardShell() {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>("queue");

  return (
    <div className="jp-dashboard-shell space-y-6">
      {/* 1. Command Context Header & Live UTC Clock */}
      <DashboardHeader />

      {/* 2. Critical Screening Overview Metrics (High-Signal 4-KPI Grid) */}
      <ScreeningOverview />

      {/* 3. Operational Tab Switcher — Displays Essential Real-Time Information */}
      <div className="flex items-center gap-2 p-1.5 bg-subtle rounded-xl border border-border overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "queue"
              ? "bg-surface text-foreground shadow-xs border border-border font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
          <span>Priority Review Queue</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("telemetry")}
          className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "telemetry"
              ? "bg-surface text-foreground shadow-xs border border-border font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
          <span>Operational Analytics &amp; Events</span>
        </button>
      </div>

      {/* 4. Tab Content Area — Direct Operational Intelligence */}
      <div className="space-y-6">
        {activeTab === "queue" && (
          <AttentionQueue />
        )}

        {activeTab === "telemetry" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RiskDistribution />
              <VerificationActivity />
            </div>
            <OperationalEvents />
          </div>
        )}
      </div>

      {/* 5. Human-in-the-Loop Governance Notice */}
      <div
        className="rounded-md border border-border p-3.5 text-xs text-muted-foreground flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5"
        style={{ backgroundColor: "var(--jp-bg-surface)" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="leading-tight text-xs">
            <strong className="text-foreground font-semibold">Ministry of Home Affairs (SSB) — SIH26188:</strong> AI models generate risk signals; deterministic algorithms validate check digits; authorized human officers execute all operational decisions.
          </span>
        </div>
        <span className="font-mono text-xs text-muted-foreground shrink-0 self-end xs:self-auto">
          BUILD: 2026.09-PROD
        </span>
      </div>
    </div>
  );
}

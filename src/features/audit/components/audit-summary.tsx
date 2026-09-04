"use client";

import * as React from "react";
import { ShieldCheck, CheckCircle2, ShieldAlert, KeyRound, Cpu } from "lucide-react";
import type { AuditSummary as AuditSummaryType } from "@/types";

interface AuditSummaryProps {
  summary?: AuditSummaryType;
}

export function AuditSummary({ summary }: AuditSummaryProps) {
  const cards = [
    {
      title: "Total Audited Events",
      value: summary?.totalEvents !== undefined && summary.totalEvents !== null ? summary.totalEvents.toLocaleString() : "—",
      subtext: "Append-only journal entries",
      icon: ShieldCheck,
      color: "var(--jp-primary)",
    },
    {
      title: "Supervisor Reviews",
      value: summary?.reviewsCount !== undefined && summary.reviewsCount !== null ? summary.reviewsCount.toLocaleString() : "—",
      subtext: "Authorized adjudications",
      icon: CheckCircle2,
      color: "var(--jp-status-low-text)",
    },
    {
      title: "Case Escalations",
      value: summary?.escalationsCount !== undefined && summary.escalationsCount !== null ? summary.escalationsCount.toLocaleString() : "—",
      subtext: "Secondary fraud referrals",
      icon: ShieldAlert,
      color: "var(--jp-status-high-text)",
    },
    {
      title: "Auth & Sessions",
      value: summary?.authEventsCount !== undefined && summary.authEventsCount !== null ? summary.authEventsCount.toLocaleString() : "—",
      subtext: "Terminal login & tokens",
      icon: KeyRound,
      color: "var(--jp-status-medium-text)",
    },
    {
      title: "System & Policies",
      value: summary?.systemEventsCount !== undefined && summary.systemEventsCount !== null ? summary.systemEventsCount.toLocaleString() : "—",
      subtext: "Thresholds & pipeline",
      icon: Cpu,
      color: "var(--jp-status-info-text)",
    },
  ];

  return (
    <div className="jp-metric-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="jp-metric-card"
          >
            <div className="jp-metric-card-header">
              <span className="jp-metric-card-title truncate">
                {card.title}
              </span>
              <div className="jp-metric-card-icon-wrap">
                <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="jp-metric-card-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <p className="jp-metric-card-subtext truncate m-0">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

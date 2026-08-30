"use client";

import * as React from "react";
import { ShieldCheck, CheckCircle2, ShieldAlert, KeyRound, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      color: "text-primary",
      borderColor: "border-primary/20",
      bgGradient: "bg-primary/5",
    },
    {
      title: "Supervisor Reviews",
      value: summary?.reviewsCount !== undefined && summary.reviewsCount !== null ? summary.reviewsCount.toLocaleString() : "—",
      subtext: "Authorized adjudications",
      icon: CheckCircle2,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      bgGradient: "bg-emerald-500/5",
    },
    {
      title: "Case Escalations",
      value: summary?.escalationsCount !== undefined && summary.escalationsCount !== null ? summary.escalationsCount.toLocaleString() : "—",
      subtext: "Secondary fraud referrals",
      icon: ShieldAlert,
      color: "text-rose-400",
      borderColor: "border-rose-500/20",
      bgGradient: "bg-rose-500/5",
    },
    {
      title: "Auth & Sessions",
      value: summary?.authEventsCount !== undefined && summary.authEventsCount !== null ? summary.authEventsCount.toLocaleString() : "—",
      subtext: "Terminal login & tokens",
      icon: KeyRound,
      color: "text-amber-400",
      borderColor: "border-amber-500/20",
      bgGradient: "bg-amber-500/5",
    },
    {
      title: "System & Policies",
      value: summary?.systemEventsCount !== undefined && summary.systemEventsCount !== null ? summary.systemEventsCount.toLocaleString() : "—",
      subtext: "Thresholds & pipeline",
      icon: Cpu,
      color: "text-purple-400",
      borderColor: "border-purple-500/20",
      bgGradient: "bg-purple-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            variant="elevated"
            className={`p-3.5 sm:p-4 space-y-2 border ${card.borderColor} ${card.bgGradient} relative overflow-hidden transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`p-1 rounded-md bg-slate-900/60 ${card.color} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className={`text-xl sm:text-2xl font-bold font-mono ${card.color}`}>
                {card.value}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                {card.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { RefreshCw, Clock, FileCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRefreshDashboard } from "../hooks/use-dashboard-queries";

export function DashboardHeader() {
  const { user } = useAuth();
  const refreshDashboard = useRefreshDashboard();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [timeStr, setTimeStr] = React.useState<string>("");

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utc = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";
      setTimeStr(utc);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDashboard();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-white/[0.08]">
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_12px_-2px_rgba(59,130,246,0.3)]">
              <Shield className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
              Operational Command Center
            </h1>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[11px] px-2 py-0.5 font-mono">
              {user?.role ? `ROLE: ${user.role}` : "CLEARANCE: UNASSIGNED"}
            </Badge>
            <Badge variant="glass" className="text-[11px] px-2 py-0.5 flex items-center gap-1.5 font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>LIVE MONITORING</span>
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
          AI-assisted document screening intelligence, multi-signal evidence monitoring, and operational supervisory triage.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
        {timeStr && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/[0.08] bg-slate-900/50 backdrop-blur-sm text-xs font-mono text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{timeStr}</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-1.5 text-xs h-8 flex-1 sm:flex-initial justify-center"
          aria-label="Refresh dashboard operational queries"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
        </Button>

        <Link href="/verifications" className="flex-1 sm:flex-initial">
          <Button variant="default" size="sm" className="gap-1.5 text-xs h-8 w-full justify-center">
            <FileCheck className="w-4 h-4" />
            <span>Screening Queue</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

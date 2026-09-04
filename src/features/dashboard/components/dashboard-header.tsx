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
    <div className="jp-page-header">
      <div className="jp-page-header-info">
        <div className="jp-page-header-title-row">
          <div className="flex items-center gap-2">
            <div className="jp-sidebar-brand-icon">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="jp-page-header-title">
              Operational Command Center
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">
              {user?.role ? `ROLE: ${user.role}` : "ROLE: OFFICER"}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1.5 font-mono" style={{ color: "var(--jp-status-low-text)", borderColor: "var(--jp-status-low-border)", backgroundColor: "var(--jp-status-low-bg)" }}>
              <span>Live</span>
            </Badge>
          </div>
        </div>
        <p className="jp-page-header-desc">
          Review document signals, evidence, and cases that need human attention.
        </p>
      </div>

      <div className="jp-page-header-actions">
        {timeStr && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-xs font-mono text-muted-foreground" style={{ backgroundColor: "var(--jp-bg-surface)" }}>
            <Clock className="w-4 h-4 text-primary" />
            <span>{timeStr}</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 text-xs flex-1 sm:flex-initial justify-center font-medium h-9 px-3.5"
          aria-label="Refresh dashboard operational queries"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </Button>

        <Link href="/verifications" className="flex-1 sm:flex-initial">
          <Button variant="default" size="sm" className="gap-2 text-xs w-full justify-center font-semibold h-9 px-3.5">
            <FileCheck className="w-4 h-4" />
            <span>Open Queue</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

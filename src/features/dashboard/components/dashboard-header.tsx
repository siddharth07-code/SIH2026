"use client";

import * as React from "react";
import { RefreshCw, Clock, ShieldCheck } from "lucide-react";
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
            <div className="jp-sidebar-brand-icon jp-header-brand-icon">
              <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
            </div>
            <h1 className="jp-page-header-title">
              Operational Command Center
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono font-bold px-2.5 py-1">
              {user?.role ? `ROLE: ${user.role}` : "ROLE: OFFICER"}
            </Badge>
          </div>
        </div>
        <p className="jp-page-header-desc text-sm sm:text-base">
          Review document signals, evidence, and cases that need human attention.
        </p>
      </div>

      <div className="jp-page-header-actions">
        {timeStr && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-md border border-border text-xs font-mono font-medium text-muted-foreground" style={{ backgroundColor: "var(--jp-bg-surface)" }}>
            <Clock className="w-4 h-4 text-primary" />
            <span>{timeStr}</span>
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 text-sm flex-1 sm:flex-initial justify-center font-semibold h-10 px-4"
          aria-label="Refresh dashboard operational queries"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>
    </div>
  );
}

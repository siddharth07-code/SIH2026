"use client";

import * as React from "react";
import { ShieldCheck, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface AuditHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AuditHeader({ onRefresh, isRefreshing }: AuditHeaderProps) {
  const { user } = useAuth();
  const [timeString, setTimeString] = React.useState<string>("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 pb-5 border-b border-white/[0.08] max-w-full overflow-x-hidden">
      {/* Top Governance Badges & UTC Clock */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono tracking-wider bg-slate-950/60 border-primary/30 text-primary">
            APPEND-ONLY AUDIT LOG
          </Badge>
          {user?.role && (
            <Badge variant="outline" className="text-[10px] font-mono bg-slate-950/40">
              {user.role} CLEARANCE
            </Badge>
          )}
        </div>

        {timeString && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground self-start xs:self-auto">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{timeString}</span>
          </div>
        )}
      </div>

      {/* Main Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              Audit Trail & Operational Governance
            </h1>
          </div>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Immutable chronological record of identity screening submissions, AI forensic evaluations, supervisory reviews, and administrative determinations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-9 w-full sm:w-auto justify-center"
            aria-label="Refresh audit event log"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Log"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs h-9 opacity-50 cursor-not-allowed hidden sm:inline-flex"
            title="Export available when audit service is connected"
          >
            <span>Export (Service Offline)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

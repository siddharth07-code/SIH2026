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
    <div className="space-y-3 pb-4 border-b border-border max-w-full overflow-x-hidden">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono" style={{ color: "var(--jp-primary)", borderColor: "var(--jp-primary-border)" }}>
            APPEND-ONLY AUDIT LOG
          </Badge>
          {user?.role === "SUPERVISOR" ? (
            <Badge variant="outline" className="text-[10px] font-mono">
              SUPERVISOR CLEARANCE
            </Badge>
          ) : user?.role ? (
            <Badge variant="outline" className="text-[10px] font-mono">
              {user.role}
            </Badge>
          ) : null}
        </div>

        {timeString && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground self-start xs:self-auto">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{timeString}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="jp-sidebar-brand-icon">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-foreground truncate m-0">
              Audit Trail & Operational Governance
            </h1>
          </div>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed m-0">
            Chronological record of submissions, forensic evaluations, reviews, and determinations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-8 w-full sm:w-auto justify-center"
            aria-label="Refresh audit event log"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

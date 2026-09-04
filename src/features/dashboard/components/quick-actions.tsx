"use client";

import * as React from "react";
import Link from "next/link";
import { FileCheck, ShieldAlert, Users, Settings, ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function QuickActions() {
  const { user } = useAuth();
  const isSupervisorOrAbove = user?.role === "SUPERVISOR" || user?.role === "ADMINISTRATOR";
  const isAdmin = user?.role === "ADMINISTRATOR";

  const clearanceBadgeText =
    user?.role === "ADMINISTRATOR"
      ? "ADMINISTRATOR CLEARANCE"
      : user?.role === "SUPERVISOR"
      ? "SUPERVISOR CLEARANCE"
      : "OFFICER CLEARANCE";

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
        <h2 className="text-xs font-semibold text-foreground uppercase flex items-center gap-2 m-0">
          <span>Shortcuts</span>
        </h2>
        <Badge variant="outline" className="text-[10px] font-mono self-start xs:self-auto">
          {clearanceBadgeText}
        </Badge>
      </div>

      <div className="jp-action-grid">
        <Link href="/verifications" className="jp-action-card group">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-md bg-primary-subtle border border-primary-border flex items-center justify-center text-primary shrink-0" style={{ backgroundColor: "var(--jp-primary-subtle)", borderColor: "var(--jp-primary-border)" }}>
              <FileCheck className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              All
            </Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between m-0">
              <span>Screening Queue</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              Inspect live passport screenings, MRZ checksums, and forensic signals.
            </p>
          </div>
        </Link>

        <Link
          href={isSupervisorOrAbove ? "/audit" : "#"}
          className={`jp-action-card group ${!isSupervisorOrAbove ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-amber-400 shrink-0" style={{ backgroundColor: "var(--jp-status-medium-bg)", border: "1px solid var(--jp-status-medium-border)" }}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-amber-300">
              SUPERVISOR+
            </Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between m-0">
              <span>Audit Trail</span>
              {isSupervisorOrAbove ? (
                <span className="text-[11px] text-primary flex items-center gap-1 font-mono">
                  Audit Logs →
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              {isSupervisorOrAbove
                ? "Access immutable system logs and supervisor determination records."
                : "Requires supervisor clearance to review immutable operational logs."}
            </p>
          </div>
        </Link>

        <Link
          href={isSupervisorOrAbove ? "/officers" : "#"}
          className={`jp-action-card group ${!isSupervisorOrAbove ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-emerald-400 shrink-0" style={{ backgroundColor: "var(--jp-status-low-bg)", border: "1px solid var(--jp-status-low-border)" }}>
              <Users className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-emerald-300">
              SUPERVISOR+
            </Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between m-0">
              <span>Checkpoint Units</span>
              {isSupervisorOrAbove ? (
                <span className="text-[11px] text-primary flex items-center gap-1 font-mono">
                  Manage Units →
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              {isSupervisorOrAbove
                ? "Monitor officer roster and mobile terminal ingest status."
                : "Supervisory role required for officer terminal administration."}
            </p>
          </div>
        </Link>

        <Link
          href={isAdmin ? "/settings" : "#"}
          className={`jp-action-card group ${!isAdmin ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-sky-400 shrink-0" style={{ backgroundColor: "var(--jp-status-info-bg)", border: "1px solid var(--jp-status-info-border)" }}>
              <Settings className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono text-sky-300">
              {isAdmin ? "Admin" : "ADMIN ONLY"}
            </Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between m-0">
              <span>System Policy</span>
              {isAdmin ? (
                <span className="text-[11px] text-primary flex items-center gap-1 font-mono">
                  Admin Console →
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight m-0">
              {isAdmin
                ? "Manage risk thresholds, OCR policies, and model configuration."
                : "System parameters and API boundary policies restricted to administrators."}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

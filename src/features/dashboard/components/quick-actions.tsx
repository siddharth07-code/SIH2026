"use client";

import * as React from "react";
import Link from "next/link";
import { FileCheck, ShieldAlert, Users, Settings, ArrowRight, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function QuickActions() {
  const { user } = useAuth();
  const isSupervisorOrAbove = user?.role === "SUPERVISOR" || user?.role === "ADMINISTRATOR";
  const isAdmin = user?.role === "ADMINISTRATOR";

  return (
    <div className="space-y-3">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
        <h2 className="text-xs font-semibold text-foreground tracking-wider uppercase flex items-center gap-2">
          <span>Operational Command Shortcuts</span>
        </h2>
        {user?.role && (
          <Badge variant="outline" className="text-[10px] font-mono self-start xs:self-auto">
            {user.role} CLEARANCE
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Verification Queue - All Roles */}
        <Link href="/verifications" className="block group">
          <Card className="h-full hover:border-primary/50 transition-all duration-200 bg-card group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
            <CardHeader className="p-3.5 sm:p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                ALL ROLES
              </Badge>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 pt-1 space-y-1.5">
              <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Screening Queue</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Inspect live passport screenings, MRZ checksums, and forensic signals.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Audit Log - Supervisor+ */}
        <Link
          href={isSupervisorOrAbove ? "/audit" : "#"}
          className={`block group ${!isSupervisorOrAbove ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <Card className="h-full hover:border-white/20 transition-all duration-200 bg-card">
            <CardHeader className="p-3.5 sm:p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-amber-300">
                SUPERVISOR+
              </Badge>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 pt-1 space-y-1.5">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Audit Trail</span>
                {isSupervisorOrAbove ? (
                  <span className="text-[11px] text-primary flex items-center gap-1 font-mono">
                    Audit Logs →
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </CardTitle>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {isSupervisorOrAbove
                  ? "Access immutable system logs and supervisor determination records."
                  : "Requires supervisor clearance to review immutable operational logs."}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Checkpoint Management - Supervisor+ */}
        <Link
          href={isSupervisorOrAbove ? "/officers" : "#"}
          className={`block group ${!isSupervisorOrAbove ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <Card className="h-full hover:border-white/20 transition-all duration-200 bg-card">
            <CardHeader className="p-3.5 sm:p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-300">
                SUPERVISOR+
              </Badge>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 pt-1 space-y-1.5">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Checkpoint Units</span>
                {isSupervisorOrAbove ? (
                  <span className="text-[11px] text-primary flex items-center gap-1 font-mono">
                    Manage Units →
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </CardTitle>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {isSupervisorOrAbove
                  ? "Monitor officer roster and mobile terminal ingest status."
                  : "Supervisory role required for officer terminal administration."}
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* System Settings - Admin Only */}
        <Link
          href={isAdmin ? "/settings" : "#"}
          className={`block group ${!isAdmin ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <Card className="h-full hover:border-white/20 transition-all duration-200 bg-card">
            <CardHeader className="p-3.5 sm:p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-purple-300">
                ADMIN ONLY
              </Badge>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 pt-1 space-y-1.5">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>System Policy</span>
                {isAdmin ? (
                  <span className="text-[11px] text-primary flex items-center gap-1 font-mono">
                    Admin Console →
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </CardTitle>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {isAdmin
                  ? "Manage risk thresholds, OCR policies, and model configuration."
                  : "System parameters and API boundary policies restricted to administrators."}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

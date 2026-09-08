"use client";

import * as React from "react";
import {
  ShieldAlert,
  ArrowRight,
  User,
  Clock,
  ShieldCheck,
  KeyRound,
  FileText,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime } from "@/lib/utils/formatters";
import type { AuditEvent } from "@/types";

interface AuditEventTableProps {
  events: AuditEvent[];
  isLoading: boolean;
  isError: boolean;
  isFiltered: boolean;
  onResetFilters: () => void;
  selectedEventId?: string | null;
  onSelectEvent: (event: AuditEvent) => void;
}

export function AuditEventTable({
  events,
  isLoading,
  isError,
  isFiltered,
  onResetFilters,
  selectedEventId,
  onSelectEvent,
}: AuditEventTableProps) {
  if (isLoading) {
    return (
      <Card className="jp-card">
        <div className="p-8 sm:p-12 text-center text-xs font-mono text-muted-foreground animate-pulse space-y-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin" style={{ backgroundColor: "var(--jp-primary-subtle)", color: "var(--jp-primary)", border: "1px solid var(--jp-primary-border)" }}>
            <Clock className="w-4 h-4" />
          </div>
          <div>Querying immutable append-only governance log...</div>
        </div>
      </Card>
    );
  }

  // Backend offline / unavailable state
  if (isError) {
    return (
      <Card className="jp-card">
        <EmptyState
          icon={ShieldAlert}
          title="AUDIT LOG UNAVAILABLE"
          description="Unable to reach the audit governance gateway. Please verify network connectivity or retry."
          notice="Audit logs are cryptographically verified and recorded upon document screening and operator determinations."
          action={
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="gap-1 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </Button>
          }
        />
      </Card>
    );
  }

  // Filtered empty state
  if (events.length === 0 && isFiltered) {
    return (
      <Card className="jp-card">
        <EmptyState
          icon={ShieldAlert}
          title="NO MATCHING AUDIT EVENTS"
          description="No recorded audit events match the current filter criteria."
          notice="Try adjusting your keyword query, category filter, or date parameters."
          action={
            <Button variant="outline" size="sm" onClick={onResetFilters} className="gap-1 text-xs">
              <span>Clear Filter Scope</span>
            </Button>
          }
        />
      </Card>
    );
  }

  // Genuine connected empty state
  if (events.length === 0) {
    return (
      <Card className="jp-card">
        <EmptyState
          icon={ShieldCheck}
          title="NO AUDIT EVENTS"
          description="The audit log is connected, but no operational events have been recorded in the current scope."
          notice="Events will be automatically recorded as officers ingest documents, execute screening verifications, and submit reviews."
        />
      </Card>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AUTH":
        return KeyRound;
      case "VERIFICATION":
      case "EVIDENCE":
        return FileText;
      case "REVIEW":
      case "GOVERNANCE":
        return ShieldCheck;
      case "ESCALATION":
      case "SYSTEM":
        return ShieldAlert;
      default:
        return ShieldCheck;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "SUCCESS":
        return <Badge variant="success" className="text-[9px] font-mono">SUCCESS</Badge>;
      case "WARNING":
        return <Badge variant="warning" className="text-[9px] font-mono">WARNING</Badge>;
      case "FAILURE":
      case "DENIED":
      case "BLOCKED":
        return <Badge variant="destructive" className="text-[9px] font-mono">{outcome}</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] font-mono">{outcome}</Badge>;
    }
  };

  const getIntegrityBadge = (status?: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
        );
      case "UNVERIFIED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>PENDING</span>
          </span>
        );
      case "INVALID":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400">
            <ShieldAlert className="w-3 h-3" />
            <span>CORRUPT</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            <HelpCircle className="w-3 h-3" />
            <span>—</span>
          </span>
        );
    }
  };

  return (
    <Card className="jp-card overflow-hidden">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Audited Operational Events Journal
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          {events.length} EVENTS RECORDED
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-auto max-h-[calc(100dvh-20rem)] overscroll-contain">
          <table className="jp-table">
            <thead className="jp-table-thead">
              <tr>
                <th className="jp-table-th">Timestamp</th>
                <th className="jp-table-th">Event / Operation</th>
                <th className="jp-table-th hidden sm:table-cell">Actor</th>
                <th className="jp-table-th hidden md:table-cell">Target Resource</th>
                <th className="jp-table-th">Outcome</th>
                <th className="jp-table-th hidden lg:table-cell">Integrity</th>
                <th className="jp-table-th text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="jp-table-tbody">
              {events.map((evt) => {
                const Icon = getCategoryIcon(evt.category);
                const isSelected = selectedEventId === evt.id;

                return (
                  <tr
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="jp-table-tr cursor-pointer group"
                    style={isSelected ? { backgroundColor: "var(--jp-primary-subtle)" } : undefined}
                  >
                    {/* Timestamp */}
                    <td className="jp-table-td font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      <div className="text-foreground">{formatDateTime(evt.timestamp)}</div>
                      <span className="text-[10px] text-muted-foreground block sm:hidden">
                        {evt.actor.badgeNumber} • {evt.actor.role}
                      </span>
                    </td>

                    {/* Event & Category */}
                    <td className="jp-table-td">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded border border-border text-primary shrink-0 hidden xs:inline-flex" style={{ backgroundColor: "var(--jp-bg-root)" }}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-semibold text-foreground font-mono truncate">
                            {evt.action.replace(/_/g, " ")}
                          </div>
                          <Badge variant="outline" className="text-[9px] font-mono py-0">
                            {evt.category}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="jp-table-td hidden sm:table-cell">
                      <div className="space-y-0.5">
                        <div className="font-medium text-foreground truncate flex items-center gap-1.5">
                          <User className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span>{evt.actor.fullName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground block">
                          Badge: {evt.actor.badgeNumber} ({evt.actor.role})
                        </span>
                      </div>
                    </td>

                    {/* Target */}
                    <td className="jp-table-td hidden md:table-cell">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs text-foreground font-medium block truncate">
                          {evt.target.type}: {evt.target.trackingNumber || evt.target.id}
                        </span>
                        {evt.target.label && (
                          <span className="text-[10px] text-muted-foreground truncate block">
                            {evt.target.label}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Outcome */}
                    <td className="jp-table-td whitespace-nowrap">
                      {getOutcomeBadge(evt.outcome)}
                    </td>

                    {/* Integrity */}
                    <td className="jp-table-td hidden lg:table-cell whitespace-nowrap">
                      {getIntegrityBadge(evt.integrity?.status)}
                    </td>

                    {/* Action inspect */}
                    <td className="jp-table-td text-right">
                      <Button
                        variant={isSelected ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2 text-xs font-mono gap-1 group-hover:text-primary"
                        aria-label={`Inspect audit event ${evt.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt);
                        }}
                      >
                        <span className="hidden xs:inline">Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

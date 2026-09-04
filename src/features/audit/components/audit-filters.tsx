"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  AuditEventCategory,
  AuditActionType,
  AuditOutcome,
  AuditIntegrityStatus,
  UserRole,
} from "@/types";

export interface AuditFilterValues {
  q: string;
  category: AuditEventCategory | "ALL";
  action: AuditActionType | "ALL";
  role: UserRole | "ALL";
  outcome: AuditOutcome | "ALL";
  integrityStatus: AuditIntegrityStatus | "ALL";
}

interface AuditFiltersProps {
  filters: AuditFilterValues;
  onFilterChange: (newFilters: Partial<AuditFilterValues>) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export function AuditFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isFiltered,
}: AuditFiltersProps) {
  return (
    <div className="jp-filter-bar space-y-3">
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 sm:top-3 text-primary" />
          <Input
            placeholder="Search by event ID, actor badge, tracking number, or action..."
            value={filters.q}
            onChange={(e) => onFilterChange({ q: e.target.value })}
            className="pl-9 text-xs h-9 sm:h-10 w-full"
            aria-label="Search audit events"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[130px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Category:</span>
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange({ category: e.target.value as AuditEventCategory | "ALL" })
              }
              className="jp-select text-xs w-full"
              aria-label="Filter by event category"
            >
              <option value="ALL">All Categories</option>
              <option value="REVIEW">Review & Triage</option>
              <option value="ESCALATION">Escalation</option>
              <option value="VERIFICATION">Verification</option>
              <option value="EVIDENCE">Evidence Analysis</option>
              <option value="AUTH">Authentication</option>
              <option value="SYSTEM">System & Engine</option>
              <option value="GOVERNANCE">Governance</option>
              <option value="CONFIG">Configuration</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[130px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Action:</span>
            <select
              value={filters.action}
              onChange={(e) =>
                onFilterChange({ action: e.target.value as AuditActionType | "ALL" })
              }
              className="jp-select text-xs w-full"
              aria-label="Filter by audit action"
            >
              <option value="ALL">All Actions</option>
              <option value="CASE_REVIEWED">Case Reviewed</option>
              <option value="CASE_ESCALATED">Case Escalated</option>
              <option value="CASE_CLEARED">Case Cleared</option>
              <option value="RISK_EVALUATED">Risk Evaluated</option>
              <option value="VERIFICATION_SUBMITTED">Verification Submitted</option>
              <option value="VERIFICATION_PROCESSED">Verification Processed</option>
              <option value="EVIDENCE_ANALYZED">Evidence Analyzed</option>
              <option value="AUTH_LOGIN">Auth Login</option>
              <option value="AUTH_LOGOUT">Auth Logout</option>
              <option value="SETTINGS_UPDATED">Settings Updated</option>
              <option value="SYSTEM_ALERT">System Alert</option>
            </select>
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[120px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Outcome:</span>
            <select
              value={filters.outcome}
              onChange={(e) =>
                onFilterChange({ outcome: e.target.value as AuditOutcome | "ALL" })
              }
              className="jp-select text-xs w-full"
              aria-label="Filter by audit outcome"
            >
              <option value="ALL">All Outcomes</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="FAILURE">Failure</option>
              <option value="DENIED">Denied</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          {/* Integrity Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[120px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Integrity:</span>
            <select
              value={filters.integrityStatus}
              onChange={(e) =>
                onFilterChange({ integrityStatus: e.target.value as AuditIntegrityStatus | "ALL" })
              }
              className="jp-select text-xs w-full"
              aria-label="Filter by integrity status"
            >
              <option value="ALL">All States</option>
              <option value="VERIFIED">Verified Hash</option>
              <option value="UNVERIFIED">Unverified</option>
              <option value="INVALID">Invalid / Corrupt</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="gap-1 text-xs h-9 text-rose-400 border-rose-500/30 shrink-0 w-full sm:w-auto justify-center"
              aria-label="Clear all applied filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RiskLevel, VerificationStatus } from "@/types";

export interface VerificationFilterValues {
  q: string;
  risk: RiskLevel | "ALL";
  status: VerificationStatus | "ALL";
  documentType: string | "ALL";
}

interface VerificationFiltersProps {
  filters: VerificationFilterValues;
  onFilterChange: (newFilters: Partial<VerificationFilterValues>) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export function VerificationFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isFiltered,
}: VerificationFiltersProps) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-slate-900/60 backdrop-blur-xl p-3 sm:p-3.5 space-y-3 shadow-lg shadow-black/20 glass-highlight">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 sm:top-3 text-primary" />
          <Input
            placeholder="Search by tracking ID, officer badge, or document..."
            value={filters.q}
            onChange={(e) => onFilterChange({ q: e.target.value })}
            className="pl-9 text-xs h-9 sm:h-10 bg-slate-950/60 border-white/10 w-full"
            aria-label="Search verification cases"
          />
        </div>

        {/* Filter Controls Row / Wrap */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[130px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Risk:</span>
            <select
              value={filters.risk}
              onChange={(e) =>
                onFilterChange({ risk: e.target.value as RiskLevel | "ALL" })
              }
              className="h-9 rounded-md border border-white/10 bg-slate-950/70 px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary backdrop-blur-sm w-full"
              aria-label="Filter by risk tier"
            >
              <option value="ALL">All Tiers</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[140px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Status:</span>
            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({ status: e.target.value as VerificationStatus | "ALL" })
              }
              className="h-9 rounded-md border border-white/10 bg-slate-950/70 px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary backdrop-blur-sm w-full"
              aria-label="Filter by operational status"
            >
              <option value="ALL">All Statuses</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="PROCESSING">Processing</option>
              <option value="PENDING">Pending</option>
              <option value="ESCALATED">Escalated</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLEARED">Cleared</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Document Type Filter */}
          <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[120px]">
            <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Doc:</span>
            <select
              value={filters.documentType}
              onChange={(e) =>
                onFilterChange({ documentType: e.target.value })
              }
              className="h-9 rounded-md border border-white/10 bg-slate-950/70 px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary backdrop-blur-sm w-full"
              aria-label="Filter by document type"
            >
              <option value="ALL">All Documents</option>
              <option value="PASSPORT">Passport (MVP)</option>
              <option value="VISA" disabled>Visa (Future)</option>
              <option value="DRIVING_LICENCE" disabled>Driving Licence (Future)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="gap-1 text-xs h-9 text-rose-300 border-rose-500/30 hover:bg-rose-500/10 shrink-0 w-full sm:w-auto justify-center"
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

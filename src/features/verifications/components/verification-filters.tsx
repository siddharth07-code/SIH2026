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
    <div className="jp-filter-bar">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-primary pointer-events-none" />
        <Input
          placeholder="Search by tracking ID, officer badge, or document..."
          value={filters.q}
          onChange={(e) => onFilterChange({ q: e.target.value })}
          className="pl-8 text-xs h-9 w-full"
          aria-label="Search verification cases"
        />
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Risk Level Filter */}
        <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[120px]">
          <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Risk:</span>
          <select
            value={filters.risk}
            onChange={(e) =>
              onFilterChange({ risk: e.target.value as RiskLevel | "ALL" })
            }
            className="jp-select w-full"
            aria-label="Filter by risk tier"
          >
            <option value="ALL">All Tiers</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[130px]">
          <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Status:</span>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ status: e.target.value as VerificationStatus | "ALL" })
            }
            className="jp-select w-full"
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
        <div className="flex items-center gap-1.5 text-xs flex-1 sm:flex-initial min-w-[110px]">
          <span className="text-muted-foreground text-[11px] font-semibold uppercase shrink-0">Doc:</span>
          <select
            value={filters.documentType}
            onChange={(e) =>
              onFilterChange({ documentType: e.target.value })
            }
            className="jp-select w-full"
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
  );
}

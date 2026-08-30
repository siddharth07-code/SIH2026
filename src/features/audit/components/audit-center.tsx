"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuditHeader } from "./audit-header";
import { AuditSummary } from "./audit-summary";
import { AuditFilters, type AuditFilterValues } from "./audit-filters";
import { AuditEventTable } from "./audit-event-table";
import { AuditEventDetail } from "./audit-event-detail";
import { AuditIntegrityStatus } from "./audit-integrity-status";
import { AuditProvenanceCard } from "./audit-provenance";
import { AuditTimeline } from "./audit-timeline";
import { VerificationPagination } from "@/features/verifications/components/verification-pagination";
import { useAuditEvents, useAuditSummary, useRefreshAudit } from "../hooks/use-audit";
import type {
  AuditEvent,
  AuditEventCategory,
  AuditActionType,
  AuditOutcome,
  AuditIntegrityStatus as AuditIntegrityStatusType,
  AuditFilters as AuditFiltersType,
  UserRole,
} from "@/types";

export function AuditCenter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL search params
  const rawQ = searchParams?.get("q") || "";
  const rawCategory = (searchParams?.get("category") as AuditEventCategory | "ALL") || "ALL";
  const rawAction = (searchParams?.get("action") as AuditActionType | "ALL") || "ALL";
  const rawRole = (searchParams?.get("role") as UserRole | "ALL") || "ALL";
  const rawOutcome = (searchParams?.get("outcome") as AuditOutcome | "ALL") || "ALL";
  const rawIntegrity = (searchParams?.get("integrityStatus") as AuditIntegrityStatusType | "ALL") || "ALL";
  const rawPage = Number(searchParams?.get("page") || "1");
  const rawPageSize = Number(searchParams?.get("pageSize") || "20");
  const rawEventId = searchParams?.get("eventId") || null;

  const filters: AuditFilterValues = React.useMemo(
    () => ({
      q: rawQ,
      category: rawCategory,
      action: rawAction,
      role: rawRole,
      outcome: rawOutcome,
      integrityStatus: rawIntegrity,
    }),
    [rawQ, rawCategory, rawAction, rawRole, rawOutcome, rawIntegrity]
  );

  const queryFilters: AuditFiltersType = React.useMemo(
    () => ({
      q: rawQ || undefined,
      category: rawCategory !== "ALL" ? rawCategory : undefined,
      action: rawAction !== "ALL" ? rawAction : undefined,
      role: rawRole !== "ALL" ? rawRole : undefined,
      outcome: rawOutcome !== "ALL" ? rawOutcome : undefined,
      integrityStatus: rawIntegrity !== "ALL" ? rawIntegrity : undefined,
      page: rawPage,
      pageSize: rawPageSize,
    }),
    [rawQ, rawCategory, rawAction, rawRole, rawOutcome, rawIntegrity, rawPage, rawPageSize]
  );

  const isFiltered =
    rawQ !== "" ||
    rawCategory !== "ALL" ||
    rawAction !== "ALL" ||
    rawRole !== "ALL" ||
    rawOutcome !== "ALL" ||
    rawIntegrity !== "ALL";

  // Data queries
  const {
    data: listResponse,
    isLoading,
    isError,
  } = useAuditEvents(queryFilters);

  const { data: summaryData } = useAuditSummary();
  const refreshAudit = useRefreshAudit();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Selected event state for detail panel
  const [selectedEvent, setSelectedEvent] = React.useState<AuditEvent | null>(null);

  // URL state synchronization helper
  const updateUrlParams = React.useCallback(
    (paramsToUpdate: Record<string, string | number | undefined | null>) => {
      const current = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "ALL") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [searchParams, router, pathname]
  );

  const handleFilterChange = (newFilters: Partial<AuditFilterValues>) => {
    updateUrlParams({
      ...newFilters,
      page: 1, // Reset to page 1 on filter changes
    });
  };

  const handleResetFilters = () => {
    router.push(`${pathname}?page=1`);
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateUrlParams({ pageSize: newPageSize, page: 1 });
  };

  const handleSelectEvent = (event: AuditEvent) => {
    setSelectedEvent(event);
    updateUrlParams({ eventId: event.id });
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
    updateUrlParams({ eventId: null });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAudit();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const items = React.useMemo(() => listResponse?.items || [], [listResponse?.items]);
  const pagination = listResponse?.pagination;
  const summary = summaryData || listResponse?.summary;

  // If URL has eventId and items exist, auto-select if not already selected
  React.useEffect(() => {
    if (rawEventId && items.length > 0) {
      const found = items.find((i) => i.id === rawEventId);
      if (found) setSelectedEvent(found);
    }
  }, [rawEventId, items]);

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Header with Live UTC Clock & Clearance Badges */}
      <AuditHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* 2. 5-Card Glass Governance KPI Summary */}
      <AuditSummary summary={summary} />

      {/* 3. URL-Driven Search & Filter Toolbar */}
      <AuditFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 4. Main Event Table & Side-by-Side / Stacked Detail Surface */}
      <div className={`grid gap-6 ${selectedEvent ? "grid-cols-1 xl:grid-cols-3" : "grid-cols-1"}`}>
        <div className={selectedEvent ? "xl:col-span-2 space-y-4" : "space-y-4"}>
          <AuditEventTable
            events={items}
            isLoading={isLoading}
            isError={isError}
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            selectedEventId={selectedEvent?.id}
            onSelectEvent={handleSelectEvent}
          />

          {/* Pagination Controls */}
          {items.length > 0 && (
            <VerificationPagination
              pagination={pagination}
              currentPage={rawPage}
              pageSize={rawPageSize}
              totalRecords={pagination?.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>

        {/* Selected Event Dossier Panel */}
        {selectedEvent && (
          <div className="xl:col-span-1">
            <AuditEventDetail event={selectedEvent} onClose={handleCloseDetail} />
          </div>
        )}
      </div>

      {/* 5. Cryptographic Integrity & Hash Verification Section */}
      <AuditIntegrityStatus integrity={selectedEvent?.integrity} />

      {/* 6. Event Provenance & Request Trace Span */}
      <AuditProvenanceCard provenance={selectedEvent?.provenance} />

      {/* 7. Chronological Governance Timeline */}
      {items.length > 0 && (
        <AuditTimeline
          events={items}
          selectedEventId={selectedEvent?.id}
          onSelectEvent={handleSelectEvent}
        />
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RefreshCw, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import { useVerifications, useRefreshVerifications } from "../hooks/use-verifications";
import { VerificationFilters, type VerificationFilterValues } from "./verification-filters";
import { VerificationPagination } from "./verification-pagination";
import type { RiskLevel, VerificationStatus } from "@/types";

export function VerificationsListShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL search params
  const rawQ = searchParams.get("q") || "";
  const rawRisk = (searchParams.get("risk") as RiskLevel | "ALL") || "ALL";
  const rawStatus = (searchParams.get("status") as VerificationStatus | "ALL") || "ALL";
  const rawDocType = searchParams.get("documentType") || "ALL";
  const rawPage = Number(searchParams.get("page") || "1");
  const rawPageSize = Number(searchParams.get("pageSize") || "20");

  const filters: VerificationFilterValues = React.useMemo(
    () => ({
      q: rawQ,
      risk: rawRisk,
      status: rawStatus,
      documentType: rawDocType,
    }),
    [rawQ, rawRisk, rawStatus, rawDocType]
  );

  const isFiltered = rawQ !== "" || rawRisk !== "ALL" || rawStatus !== "ALL" || rawDocType !== "ALL";

  // Data fetching hook
  const {
    data: listResponse,
    isLoading,
    isError,
  } = useVerifications({
    q: rawQ || undefined,
    risk: rawRisk !== "ALL" ? rawRisk : undefined,
    status: rawStatus !== "ALL" ? rawStatus : undefined,
    documentType: rawDocType !== "ALL" ? rawDocType : undefined,
    page: rawPage,
    pageSize: rawPageSize,
  });

  const refreshVerifications = useRefreshVerifications();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // URL serialization handler
  const updateUrlParams = React.useCallback(
    (paramsToUpdate: Record<string, string | number | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "ALL") {
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

  const handleFilterChange = (newFilters: Partial<VerificationFilterValues>) => {
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshVerifications();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const items = listResponse?.items;
  const pagination = listResponse?.pagination;
  const isEmpty = !items || items.length === 0;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Page Header */}
      <PageHeader
        title="Verification Screening Management"
        description="Operational triage queue for identity verifications, MRZ checksum validations, and forensic inspection records."
        badge={
          <Badge variant="glass" className="text-xs font-mono text-primary">
            {pagination?.total ? `${pagination.total} CASES IN QUEUE` : "REAL-TIME QUEUE"}
          </Badge>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-1.5 text-xs h-8 sm:h-9 px-3 w-full sm:w-auto justify-center"
          aria-label="Refresh verification screening queue"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Queue"}</span>
        </Button>
      </PageHeader>

      {/* Filter and Search Architecture */}
      <VerificationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Queue Table with Controlled Responsive Scrolling and Adaptive Columns */}
      <div className="space-y-4 max-w-full overflow-x-hidden">
        <DataTableShell
          isLoading={isLoading}
          isError={isError}
          errorTitle="Backend Verification Service Unavailable"
          errorMessage="Backend verification service is not connected yet. Real screening records will populate in subsequent phases."
          isEmpty={isEmpty}
          emptyTitle={
            isFiltered
              ? "No verification cases match current filters"
              : "No verification records available in queue"
          }
          emptyDescription={
            isFiltered
              ? `No records found matching query "${rawQ || rawRisk || rawStatus}". Try adjusting or resetting your filter criteria.`
              : "When officers submit document captures from field mobile terminals, screening sessions will stream into this queue in real-time."
          }
          emptyNotice={
            isError
              ? "Backend verification service is not connected yet. Real screening records will populate in subsequent phases."
              : isFiltered
              ? undefined
              : "Screening sessions submitted from authorized checkpoint mobile terminals will appear in real-time."
          }
        >
          <thead className="border-b border-white/[0.08] bg-slate-950/60">
            <tr className="text-xs font-semibold text-muted-foreground uppercase text-left">
              <th className="p-3 pl-4">Risk Evaluation</th>
              <th className="p-3">Tracking ID</th>
              <th className="p-3">Document Info</th>
              <th className="p-3 hidden md:table-cell">Checkpoint / Unit</th>
              <th className="p-3 hidden lg:table-cell">Officer</th>
              <th className="p-3">Operational Status</th>
              <th className="p-3 hidden sm:table-cell">Submitted At</th>
              <th className="p-3 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                <td className="p-3 pl-4">
                  {item.riskLevel ? (
                    <StatusIndicator status={item.riskLevel} size="sm" />
                  ) : (
                    <span className="text-muted-foreground font-mono">—</span>
                  )}
                </td>
                <td className="p-3 font-mono font-semibold text-foreground">
                  <div className="space-y-0.5">
                    <span>{item.trackingNumber}</span>
                    <span className="text-[10px] text-muted-foreground font-sans block md:hidden">
                      {item.checkpointName}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-0.5">
                    <span className="font-medium text-foreground">{item.documentType}</span>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {maskDocumentNumber(item.maskedDocumentNumber)}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-foreground hidden md:table-cell">
                  {item.checkpointName}
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="space-y-0.5">
                    <span className="text-foreground">{item.officerName}</span>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {item.officerBadge}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-[10px] font-mono whitespace-nowrap">
                    {item.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground font-mono hidden sm:table-cell">
                  {formatDateTime(item.submittedAt)}
                </td>
                <td className="p-3 pr-4 text-right">
                  <Link href={`/verifications/${item.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 px-2.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>

        {/* Server Pagination */}
        <VerificationPagination
          pagination={pagination}
          currentPage={rawPage}
          pageSize={rawPageSize}
          totalRecords={pagination?.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

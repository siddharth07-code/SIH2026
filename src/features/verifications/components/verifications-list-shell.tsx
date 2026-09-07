"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RefreshCw, Eye, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import { useVerifications, useRefreshVerifications } from "../hooks/use-verifications";
import { VerificationFilters, type VerificationFilterValues } from "./verification-filters";
import { VerificationPagination } from "./verification-pagination";
import { DocumentUploadModal } from "./document-upload-modal";
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
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

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
          <Badge variant="outline" className="text-xs font-mono font-bold px-2.5 py-1" style={{ color: "var(--jp-primary)", borderColor: "var(--jp-primary-border)" }}>
            {pagination?.total ? `${pagination.total} CASES IN QUEUE` : "REAL-TIME QUEUE"}
          </Badge>
        }
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-8 sm:h-9 px-3 w-full sm:w-auto justify-center font-medium"
            aria-label="Refresh verification screening queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Queue"}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="gap-1.5 text-xs h-8 sm:h-9 px-3 w-full sm:w-auto justify-center font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
            aria-label="New document verification upload"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload &amp; Screen Document</span>
          </Button>
        </div>
      </PageHeader>

      {/* Filter and Search Architecture */}
      <VerificationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Queue Table */}
      <div className="space-y-4 max-w-full overflow-x-hidden">
        <DataTableShell
          isLoading={isLoading}
          isError={isError}
          errorTitle="Verification Service Unavailable"
          errorMessage="Unable to retrieve screening records. Please verify network connectivity or retry."
          isEmpty={isEmpty}
          emptyTitle={
            isFiltered
              ? "No verification cases match current filters"
              : "No verification records available in queue"
          }
          emptyDescription={
            isFiltered
              ? `No records found matching query "${rawQ || rawRisk || rawStatus}". Try adjusting or resetting your filter criteria.`
              : "When officers submit document captures from checkpoint terminals, screening sessions will stream into this queue in real-time."
          }
          emptyNotice={
            isError
              ? "Unable to retrieve screening records. Please verify network connectivity or retry."
              : isFiltered
              ? undefined
              : "Screening sessions submitted from authorized checkpoint terminals will appear in real-time."
          }
        >
          <thead className="jp-table-thead">
            <tr>
              <th className="jp-table-th">Risk Evaluation</th>
              <th className="jp-table-th">Tracking ID</th>
              <th className="jp-table-th">Document Info</th>
              <th className="jp-table-th hidden md:table-cell">Checkpoint / Unit</th>
              <th className="jp-table-th hidden lg:table-cell">Officer</th>
              <th className="jp-table-th">Operational Status</th>
              <th className="jp-table-th hidden sm:table-cell">Submitted At</th>
              <th className="jp-table-th text-right">Action</th>
            </tr>
          </thead>
          <tbody className="jp-table-tbody">
            {items?.map((item) => (
              <tr key={item.id} className="jp-table-tr">
                <td className="jp-table-td">
                  {item.riskLevel ? (
                    <StatusIndicator status={item.riskLevel} size="sm" />
                  ) : (
                    <span className="text-muted-foreground font-mono">—</span>
                  )}
                </td>
                <td className="jp-table-td font-mono font-semibold text-foreground">
                  <div className="space-y-0.5">
                    <span>{item.trackingNumber}</span>
                    <span className="text-[10px] text-muted-foreground font-sans block md:hidden">
                      {item.checkpointName}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td">
                  <div className="space-y-0.5">
                    <span className="font-medium text-foreground">{item.documentType}</span>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {maskDocumentNumber(item.maskedDocumentNumber)}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td text-foreground hidden md:table-cell">
                  {item.checkpointName}
                </td>
                <td className="jp-table-td hidden lg:table-cell">
                  <div className="space-y-0.5">
                    <span className="text-foreground">{item.officerName}</span>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {item.officerBadge}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td">
                  <StatusIndicator status={item.status} size="sm" showIcon={false} />
                </td>
                <td className="jp-table-td text-muted-foreground font-mono hidden sm:table-cell">
                  {formatDateTime(item.submittedAt)}
                </td>
                <td className="jp-table-td text-right">
                  <Link href={`/verifications/${item.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm h-8 px-3 font-semibold cursor-pointer">
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
      {/* Document Upload & Live ML Risk Screening Modal */}
      {isUploadOpen && (
        <DocumentUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VerificationPagination as PaginationData } from "@/types";

interface VerificationPaginationProps {
  pagination?: PaginationData;
  currentPage: number;
  pageSize: number;
  totalRecords?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function VerificationPagination({
  pagination,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}: VerificationPaginationProps) {
  const totalPages = pagination?.totalPages || 1;
  const hasNext = pagination?.hasNext || false;
  const hasPrevious = pagination?.hasPrevious || false;

  const startRecord = totalRecords && totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = totalRecords && totalRecords > 0 ? Math.min(currentPage * pageSize, totalRecords) : 0;

  return (
    <div className="rounded-lg border bg-card p-3 sm:p-3.5 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 text-xs">
      <div className="text-muted-foreground text-center xs:text-left">
        {totalRecords !== undefined ? (
          <span>
            Showing <strong className="text-foreground font-mono">{startRecord}</strong> to{" "}
            <strong className="text-foreground font-mono">{endRecord}</strong> of{" "}
            <strong className="text-foreground font-mono">{totalRecords}</strong> cases
          </span>
        ) : (
          <span>Screening Queue Ingestion</span>
        )}
      </div>

      <div className="flex items-center justify-between xs:justify-end gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-[11px] uppercase">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border bg-background px-2 py-0.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Records per page"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground font-mono text-[11px] mr-1 hidden sm:inline">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevious || currentPage <= 1}
            className="h-8 px-2.5 gap-1 text-xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext || currentPage >= totalPages}
            className="h-8 px-2.5 gap-1 text-xs"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

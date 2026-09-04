import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { LoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

interface DataTableShellProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorTitle?: string;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyNotice?: string;
  onRetry?: () => void;
  className?: string;
}

export function DataTableShell({
  children,
  isLoading,
  isError,
  errorTitle = "Failed to Load Table Data",
  errorMessage,
  isEmpty,
  emptyTitle = "No records found",
  emptyDescription = "There are currently no records matching the specified criteria.",
  emptyNotice,
  onRetry,
  className,
}: DataTableShellProps) {
  if (isLoading) {
    return <LoadingState message="Fetching operational records..." className={className} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage || "Unable to retrieve table data from API backend."}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        notice={emptyNotice}
        className={className}
      />
    );
  }

  return (
    <div className={cn("jp-table-wrapper", className)}>
      <table className="jp-table">
        {children}
      </table>
    </div>
  );
}

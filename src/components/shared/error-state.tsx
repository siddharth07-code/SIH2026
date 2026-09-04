import * as React from "react";
import { OctagonAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Application Error Encountered",
  message = "An unexpected error occurred while communicating with backend screening services.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("jp-state-box", className)}
    >
      <div className="jp-state-icon jp-state-icon-error">
        <OctagonAlert className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="jp-state-title">{title}</h3>
      <p className="jp-state-desc">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 mt-1">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </Button>
      )}
    </div>
  );
}

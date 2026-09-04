import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading operational telemetry...",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={cn("jp-state-box", className)}
    >
      <div className="jp-state-icon jp-state-icon-primary">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      </div>
      <p className="jp-state-desc" style={{ fontFamily: "var(--jp-font-mono)", letterSpacing: "0.025em" }}>
        {message}
      </p>
    </div>
  );
}

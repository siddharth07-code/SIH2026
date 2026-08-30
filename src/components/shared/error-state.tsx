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
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-lg border border-rose-500/25 bg-rose-950/15 backdrop-blur-xl shadow-lg shadow-black/20 min-h-[240px] glass-highlight",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]">
        <OctagonAlert className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-md mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 border-rose-500/30 hover:bg-rose-500/10">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </Button>
      )}
    </div>
  );
}

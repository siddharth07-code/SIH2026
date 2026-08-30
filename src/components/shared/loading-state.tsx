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
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-lg border border-white/[0.08] bg-slate-900/30 backdrop-blur-xl min-h-[220px] space-y-3 glass-highlight",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      </div>
      <p className="text-xs font-mono text-muted-foreground animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  );
}

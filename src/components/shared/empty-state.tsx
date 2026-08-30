import * as React from "react";
import { ShieldAlert, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  notice?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = ShieldAlert,
  actionLabel,
  onAction,
  action,
  notice,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl shadow-lg shadow-black/20 min-h-[260px] glass-highlight",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5 tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-md mb-4 leading-relaxed">{description}</p>
      {notice && (
        <div className="rounded-md border border-white/[0.08] bg-slate-950/40 px-3 py-1.5 text-[11px] text-muted-foreground/80 max-w-md font-mono mb-4">
          {notice}
        </div>
      )}
      {action ? (
        <div className="mt-1">{action}</div>
      ) : actionLabel && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

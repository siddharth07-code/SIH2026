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
      className={cn("jp-state-box", className)}
    >
      <div className="jp-state-icon jp-state-icon-primary">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="jp-state-title">{title}</h3>
      <p className="jp-state-desc">{description}</p>
      {notice && (
        <div className="jp-state-notice">
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

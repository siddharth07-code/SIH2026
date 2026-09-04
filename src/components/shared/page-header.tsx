import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("jp-page-header", className)}>
      <div className="jp-page-header-info">
        <div className="jp-page-header-title-row">
          <h1 className="jp-page-header-title">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {description && (
          <p className="jp-page-header-desc">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="jp-page-header-actions">
          {children}
        </div>
      )}
    </div>
  );
}

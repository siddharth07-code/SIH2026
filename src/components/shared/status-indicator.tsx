import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Info,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { RiskLevel } from "@/types";

export type SystemStatusType =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "INFO"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PASS"
  | "FAIL"
  | "REVIEW_REQUIRED"
  | "ESCALATED"
  | "CLEARED"
  | "SUBMITTED"
  | "PROCESSING"
  | "MISMATCH"
  | "MATCH"
  | "UNAVAILABLE";

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  variantClass: string;
}

const statusMap: Record<string, StatusConfig> = {
  LOW: {
    icon: ShieldCheck,
    label: "LOW RISK",
    variantClass: "jp-status-low",
  },
  PASS: {
    icon: CheckCircle2,
    label: "PASS",
    variantClass: "jp-status-pass",
  },
  MATCH: {
    icon: CheckCircle2,
    label: "MATCH",
    variantClass: "jp-status-pass",
  },
  CLEARED: {
    icon: CheckCircle2,
    label: "CLEARED",
    variantClass: "jp-status-pass",
  },
  MEDIUM: {
    icon: AlertTriangle,
    label: "MEDIUM RISK",
    variantClass: "jp-status-medium",
  },
  WARNING: {
    icon: AlertTriangle,
    label: "WARNING",
    variantClass: "jp-status-warning",
  },
  REVIEW_REQUIRED: {
    icon: AlertTriangle,
    label: "REVIEW REQUIRED",
    variantClass: "jp-status-warning",
  },
  HIGH: {
    icon: OctagonAlert,
    label: "HIGH RISK",
    variantClass: "jp-status-high",
  },
  FAIL: {
    icon: OctagonAlert,
    label: "FAIL",
    variantClass: "jp-status-fail",
  },
  MISMATCH: {
    icon: OctagonAlert,
    label: "MISMATCH",
    variantClass: "jp-status-fail",
  },
  ERROR: {
    icon: OctagonAlert,
    label: "ERROR",
    variantClass: "jp-status-error",
  },
  ESCALATED: {
    icon: OctagonAlert,
    label: "ESCALATED",
    variantClass: "jp-status-error",
  },
  SUCCESS: {
    icon: CheckCircle2,
    label: "SUCCESS",
    variantClass: "jp-status-success",
  },
  INFO: {
    icon: Info,
    label: "INFO",
    variantClass: "jp-status-info",
  },
  SUBMITTED: {
    icon: Info,
    label: "SUBMITTED",
    variantClass: "jp-status-info",
  },
  PROCESSING: {
    icon: Info,
    label: "PROCESSING",
    variantClass: "jp-status-info",
  },
  ACTIVE: {
    icon: CheckCircle2,
    label: "ACTIVE",
    variantClass: "jp-status-active",
  },
  INACTIVE: {
    icon: Info,
    label: "INACTIVE",
    variantClass: "jp-status-inactive",
  },
  SUSPENDED: {
    icon: OctagonAlert,
    label: "SUSPENDED",
    variantClass: "jp-status-suspended",
  },
  UNAVAILABLE: {
    icon: Info,
    label: "UNAVAILABLE",
    variantClass: "jp-status-inactive",
  },
};

interface StatusIndicatorProps {
  status: SystemStatusType | RiskLevel | string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function StatusIndicator({
  status,
  label,
  size = "md",
  className,
  showIcon = true,
}: StatusIndicatorProps) {
  const normalizedKey = status.toUpperCase();
  const config = statusMap[normalizedKey] || {
    icon: Info,
    label: status.replace(/_/g, " "),
    variantClass: "jp-status-inactive",
  };

  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeClass = `jp-status-${size}`;
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <div
      role="status"
      aria-label={`Status: ${displayLabel}`}
      className={cn(
        "jp-status-indicator",
        config.variantClass,
        sizeClass,
        className
      )}
    >
      {showIcon && <Icon className={cn("shrink-0", iconSizes[size])} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </div>
  );
}

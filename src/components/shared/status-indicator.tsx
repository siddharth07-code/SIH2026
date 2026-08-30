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
  | "FAIL";

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  className: string;
}

const statusMap: Record<string, StatusConfig> = {
  LOW: {
    icon: ShieldCheck,
    label: "LOW RISK",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]",
  },
  PASS: {
    icon: CheckCircle2,
    label: "PASS",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]",
  },
  MEDIUM: {
    icon: AlertTriangle,
    label: "MEDIUM RISK",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_-2px_rgba(245,158,11,0.25)]",
  },
  WARNING: {
    icon: AlertTriangle,
    label: "WARNING",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_-2px_rgba(245,158,11,0.25)]",
  },
  HIGH: {
    icon: OctagonAlert,
    label: "HIGH RISK",
    className:
      "border-rose-500/35 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_-2px_rgba(244,63,94,0.25)]",
  },
  FAIL: {
    icon: OctagonAlert,
    label: "FAIL",
    className:
      "border-rose-500/35 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_-2px_rgba(244,63,94,0.25)]",
  },
  ERROR: {
    icon: OctagonAlert,
    label: "ERROR",
    className:
      "border-rose-500/35 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_-2px_rgba(244,63,94,0.25)]",
  },
  SUCCESS: {
    icon: CheckCircle2,
    label: "SUCCESS",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]",
  },
  INFO: {
    icon: Info,
    label: "INFO",
    className:
      "border-sky-500/30 bg-sky-500/10 text-sky-300 shadow-[0_0_12px_-2px_rgba(14,165,233,0.25)]",
  },
  ACTIVE: {
    icon: CheckCircle2,
    label: "ACTIVE",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]",
  },
  INACTIVE: {
    icon: Info,
    label: "INACTIVE",
    className: "border-white/15 bg-white/5 text-muted-foreground",
  },
  SUSPENDED: {
    icon: OctagonAlert,
    label: "SUSPENDED",
    className: "border-rose-500/35 bg-rose-500/10 text-rose-300",
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
    label: status,
    className: "border-white/15 bg-white/5 text-muted-foreground",
  };

  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-sm gap-2",
  };

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
        "rounded-md border font-medium tracking-wide transition-all duration-200 select-none inline-flex items-center backdrop-blur-sm",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn("shrink-0", iconSizes[size])} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </div>
  );
}

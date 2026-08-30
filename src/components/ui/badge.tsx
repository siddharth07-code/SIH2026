import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "glass";
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default:
      "border-primary/40 bg-primary/20 text-primary-foreground shadow-[0_0_12px_-2px_rgba(59,130,246,0.35)]",
    secondary:
      "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
    destructive:
      "border-destructive/40 bg-destructive/20 text-rose-300 shadow-[0_0_12px_-2px_rgba(244,63,94,0.35)]",
    outline:
      "border-white/15 bg-slate-900/50 backdrop-blur-sm text-foreground",
    success:
      "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.35)]",
    warning:
      "border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_-2px_rgba(245,158,11,0.35)]",
    info:
      "border-sky-500/40 bg-sky-500/20 text-sky-300 shadow-[0_0_12px_-2px_rgba(14,165,233,0.35)]",
    glass:
      "border-white/10 bg-slate-800/40 backdrop-blur-md text-foreground shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

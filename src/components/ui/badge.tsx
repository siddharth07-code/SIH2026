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
  const variantClass = `jp-badge-${variant}`;

  return (
    <div
      className={cn("jp-badge", variantClass, className)}
      {...props}
    />
  );
}

export { Badge };

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default:
        "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] border border-primary/40",
      destructive:
        "bg-destructive/90 text-destructive-foreground shadow-md shadow-destructive/25 hover:bg-destructive active:scale-[0.98] border border-destructive/50",
      outline:
        "border border-white/12 bg-slate-900/40 backdrop-blur-sm text-foreground hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
      secondary:
        "bg-secondary/80 text-secondary-foreground border border-white/10 hover:bg-secondary active:scale-[0.98]",
      ghost:
        "text-muted-foreground hover:bg-white/10 hover:text-foreground active:scale-[0.98]",
      link: "text-primary underline-offset-4 hover:underline",
      glass:
        "bg-slate-800/50 backdrop-blur-md border border-white/15 text-foreground shadow-sm hover:bg-slate-800/80 hover:border-white/25 active:scale-[0.98]",
    };

    const sizeClasses = {
      default: "h-9 px-4 py-2 text-xs font-medium",
      sm: "h-8 rounded-md px-3 text-xs font-medium",
      lg: "h-11 rounded-md px-6 text-sm font-medium",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

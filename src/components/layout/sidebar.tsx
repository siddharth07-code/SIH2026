"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  ShieldAlert,
  Users,
  Settings,
  Shield,
  X,
  type LucideIcon,
} from "lucide-react";
import { getNavigationForRole } from "@/config/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileCheck,
  ShieldAlert,
  Users,
  Settings,
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const roleFilteredNavigation = React.useMemo(() => {
    return getNavigationForRole(user?.role);
  }, [user?.role]);

  // Lock body scroll on mobile drawer open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] sm:w-64 flex flex-col bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-2xl border-r border-white/[0.08] shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 glass-highlight",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* App Branding & Mobile Close Button */}
        <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wider text-foreground">SIH26188</span>
                <Badge variant="glass" className="text-[9px] px-1.5 py-0 font-mono text-primary">
                  SOC
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                Screening Command
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {roleFilteredNavigation.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                {section.title}
              </p>
              <ul className="space-y-1 mt-1">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between gap-3 px-3 py-2.5 sm:py-2 text-xs font-medium rounded-md transition-all duration-150 min-h-[40px] sm:min-h-0",
                          isActive
                            ? "bg-primary/20 text-foreground font-semibold border-l-2 border-primary shadow-[0_0_12px_-2px_rgba(59,130,246,0.25)]"
                            : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="glass" className="text-[10px] px-1.5 py-0">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Operational Security Clearance Display */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="rounded-md border border-white/[0.08] bg-slate-900/50 backdrop-blur-sm p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between font-mono mb-1">
              <span className="font-semibold text-foreground text-[11px]">ROLE CLEARANCE</span>
              <span className="text-[10px] text-primary font-bold uppercase">
                {user?.role || "UNASSIGNED"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {user
                ? `Authorized as ${user.role} for unit ${user.checkpointName}.`
                : "Unauthenticated session. Sign in to verify checkpoint clearance."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

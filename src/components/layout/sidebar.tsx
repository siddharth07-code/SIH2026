"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Briefcase,
  Radio,
  BarChart3,
  Binary,
  Layers,
  ShieldAlert,
  Users,
  Settings,
  Shield,
  Search,
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
  Briefcase,
  Radio,
  BarChart3,
  Binary,
  Layers,
  ShieldAlert,
  Users,
  Settings,
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Sidebar({ isOpen, onClose, onOpenCommandPalette }: SidebarProps) {
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
          className="jp-mobile-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={cn("jp-sidebar", isOpen && "jp-sidebar-open")}>
        <div className="jp-sidebar-header">
          <Link href="/dashboard" className="jp-sidebar-brand" onClick={onClose}>
            <div className="jp-sidebar-brand-icon">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="jp-sidebar-brand-title">JANPRAMAAN</span>
              </div>
              <span className="jp-sidebar-brand-desc block font-medium">
                Identity Intelligence
              </span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Search Palette Trigger in Sidebar */}
        <div className="px-3.5 pt-3">
          <button
            type="button"
            onClick={() => {
              if (onOpenCommandPalette) onOpenCommandPalette();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-subtle text-xs text-muted-foreground hover:text-foreground hover:border-strong transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-sans font-medium">Command Palette...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-surface text-muted-foreground font-semibold">
              ⌘K
            </kbd>
          </button>
        </div>

        <nav className="jp-sidebar-nav">
          {roleFilteredNavigation.map((section) => (
            <div key={section.title}>
              <p className="jp-sidebar-section-title">
                {section.title}
              </p>
              <ul className="jp-sidebar-list">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "jp-sidebar-item",
                          isActive && "jp-sidebar-item-active"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className="w-4.5 h-4.5 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono shrink-0 ml-1">
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

        <div className="jp-sidebar-footer">
          <div className="jp-sidebar-role-card">
            <div className="flex items-center justify-between font-mono mb-1">
              <span className="font-semibold text-foreground text-xs">Signed in as</span>
              <span className="text-xs font-bold uppercase" style={{ color: "var(--jp-primary)" }}>
                {user?.role || "UNASSIGNED"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-tight m-0 truncate">
              {user
                ? `${user.checkpointName || "Checkpoint Active"}`
                : "Sign in to access verification workflows."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

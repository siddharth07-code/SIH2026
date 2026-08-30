"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Activity, ChevronRight, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user, status, logout } = useAuth();

  const segments = pathname.split("/").filter(Boolean);
  const isAuthenticated = status === "AUTHENTICATED" && user !== null;

  return (
    <header className="h-16 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl px-3.5 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 glass-highlight shadow-sm w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Operational Breadcrumbs - Responsive Truncation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 truncate">
          <Link href="/dashboard" className="hover:text-foreground font-medium transition-colors shrink-0 hidden xs:inline">
            SOC
          </Link>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            return (
              <React.Fragment key={segment}>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 hidden xs:inline" />
                {isLast ? (
                  <span className="font-semibold text-foreground capitalize truncate max-w-[140px] sm:max-w-none">
                    {segment}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-foreground capitalize transition-colors truncate max-w-[100px] hidden sm:inline">
                    {segment}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Header Operational Actions & Auth Session Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-md border border-white/[0.08] bg-slate-900/60 backdrop-blur-sm text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-muted-foreground font-mono hidden md:inline">STATUS:</span>
          <span className="font-medium text-emerald-300 font-mono text-[11px] sm:text-xs">ACTIVE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>

        <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-white/[0.08]">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground flex items-center justify-end gap-1.5">
                  <span className="truncate max-w-[120px]">{user.fullName}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono shrink-0">
                    {user.role}
                  </Badge>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[160px]">
                  {user.badgeNumber} • {user.checkpointName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-1.5 text-xs text-muted-foreground hover:text-rose-400 h-8 px-2 sm:px-3"
                aria-label="Logout current session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground">Officer Portal</span>
                <span className="text-[10px] text-muted-foreground">Sign In Required</span>
              </div>
              <Link href="/login" aria-label="Authenticate officer portal">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 px-2.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Login Portal</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

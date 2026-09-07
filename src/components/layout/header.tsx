"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, User as UserIcon, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface HeaderProps {
  onMenuClick?: () => void;
  onOpenCommandPalette?: () => void;
}

export function Header({ onMenuClick, onOpenCommandPalette }: HeaderProps) {
  const pathname = usePathname();
  const { user, status, logout } = useAuth();

  const segments = pathname.split("/").filter(Boolean);
  const isAuthenticated = status === "AUTHENTICATED" && user !== null;

  return (
    <header className="jp-header">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <Menu className="w-4 h-4" />
        </Button>

        <nav aria-label="Breadcrumb" className="jp-breadcrumb min-w-0 truncate">
          <Link href="/dashboard" className="jp-breadcrumb-link font-medium shrink-0 hidden xs:inline">
            Home
          </Link>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            return (
              <React.Fragment key={segment}>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 hidden xs:inline" />
                {isLast ? (
                  <span className="jp-breadcrumb-current truncate max-w-[140px] sm:max-w-none">
                    {segment}
                  </span>
                ) : (
                  <Link href={href} className="jp-breadcrumb-link capitalize truncate max-w-[100px] hidden sm:inline">
                    {segment}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Quick Search trigger in Header */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-subtle text-xs text-muted-foreground hover:text-foreground hover:border-strong transition-all cursor-pointer"
          aria-label="Open Command Palette (Cmd+K)"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-sans font-medium">Quick search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-surface text-muted-foreground font-semibold ml-1">
            ⌘K
          </kbd>
        </button>

        {/* User / Session Area */}

        <div className="flex items-center gap-2 pl-2.5 border-l border-border">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-foreground flex items-center justify-end gap-1.5">
                  <span className="truncate max-w-[140px]">{user.fullName}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.2 font-mono shrink-0">
                    {user.role}
                  </Badge>
                </span>
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                  {user.badgeNumber} • {user.checkpointName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-xs text-muted-foreground hover:text-rose-400 h-9 px-3 font-medium cursor-pointer"
                aria-label="Logout current session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-foreground">Officer Portal</span>
                <span className="text-[10px] text-muted-foreground">Sign In Required</span>
              </div>
              <Link href="/login" aria-label="Authenticate officer portal">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 px-2.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Login</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

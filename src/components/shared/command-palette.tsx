"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FileCheck,
  Briefcase,
  BarChart3,
  ShieldAlert,
  Users,
  Settings,
  Binary,
  Layers,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Screening Tools" | "Quick Filters" | "System";
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  badge?: string;
  roles?: ("OFFICER" | "SUPERVISOR" | "ADMINISTRATOR")[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = React.useMemo(
    () => [
      // Navigation
      {
        id: "nav-dashboard",
        title: "Operational Dashboard",
        subtitle: "High-level screening HUD, live queues & risk telemetry",
        category: "Navigation",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        id: "nav-verifications",
        title: "Screening Queue",
        subtitle: "Active passport verifications & document dossiers",
        category: "Navigation",
        icon: FileCheck,
        href: "/verifications",
      },
      {
        id: "nav-cases",
        title: "Case Management & Triage",
        subtitle: "Assigned officer workflows, investigation notes & case states",
        category: "Navigation",
        icon: Briefcase,
        href: "/cases",
      },
      {
        id: "nav-analytics",
        title: "Screening Analytics & Fraud Trends",
        subtitle: "Inference latency, risk distribution & fraud category breakdown",
        category: "Navigation",
        icon: BarChart3,
        href: "/analytics",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        id: "nav-mrz",
        title: "ICAO 9303 MRZ Engine & Validator",
        subtitle: "Algorithmic check digit calculator (7-3-1 weights) & VIZ comparator",
        category: "Screening Tools",
        icon: Binary,
        href: "/mrz-validator",
        badge: "Tool",
      },
      {
        id: "nav-forensics",
        title: "Forensic Analysis Studio",
        subtitle: "Multi-spectral ELA heatmap & digital tampering inspector",
        category: "Screening Tools",
        icon: Layers,
        href: "/forensics",
        badge: "Studio",
      },
      {
        id: "nav-checkpoints",
        title: "Checkpoints & Gate Ingest",
        subtitle: "Active airport terminals, land borders & officer terminals",
        category: "Navigation",
        icon: Users,
        href: "/checkpoints",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        id: "nav-audit",
        title: "Audit Trail & Immutable Governance",
        subtitle: "Tamper-resistant SHA-256 event log & state diffs",
        category: "Navigation",
        icon: ShieldAlert,
        href: "/audit",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
        badge: "Append-Only",
      },
      {
        id: "nav-officers",
        title: "Authorized Officers & Terminals",
        subtitle: "Roster directory & mobile terminal device bindings",
        category: "Navigation",
        icon: Users,
        href: "/officers",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        id: "nav-settings",
        title: "System Settings & Policies",
        subtitle: "API boundaries, risk calibration & ISO/IEC 23894 policies",
        category: "System",
        icon: Settings,
        href: "/settings",
        roles: ["ADMINISTRATOR"],
      },
      // Quick Filters
      {
        id: "filter-high-risk",
        title: "View High-Risk Flagged Cases",
        subtitle: "Filter screening queue for immediate supervisory review",
        category: "Quick Filters",
        icon: ShieldAlert,
        href: "/verifications?risk=HIGH",
        badge: "Filter",
      },
      {
        id: "filter-pending-review",
        title: "View Pending Review Cases",
        subtitle: "Filter cases awaiting officer determination",
        category: "Quick Filters",
        icon: Sliders,
        href: "/verifications?status=REVIEW_REQUIRED",
        badge: "Filter",
      },
    ],
    []
  );

  // Filter items by search query and user role
  const filteredItems = React.useMemo(() => {
    const query = search.toLowerCase().trim();
    return commandItems.filter((item) => {
      // Role check
      if (item.roles && user?.role && !item.roles.includes(user.role)) {
        return false;
      }
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [commandItems, search, user?.role]);

  // Keyboard navigation & escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (item: CommandItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Command Center Quick Search"
    >
      <div
        className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "var(--jp-bg-surface)" }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, verification cases, checkpoints, or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
            aria-label="Quick Search Query"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-border/50">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No matching command, case, or tool found for &quot;{search}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-muted/70 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md border border-border bg-elevated flex items-center justify-center shrink-0 group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-primary/20 text-primary bg-primary/5">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <span className="text-[11px] text-muted-foreground truncate block">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Quick Hints */}
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-border bg-elevated text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span>JANPRAMAAN Operational Palette</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Navigate: ↑ ↓</span>
            <span>Select: ↵</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Users, Search, Smartphone, MapPin, ShieldCheck, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function OfficersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"PERSONNEL" | "TERMINALS" | "CHECKPOINTS">("PERSONNEL");

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Top Header */}
      <PageHeader
        title="Authorized Officers & Checkpoint Units"
        description="Authorized personnel, mobile terminals, and checkpoint assignments."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              DIRECTORY SYNC
            </Badge>
            {user?.role === "SUPERVISOR" ? (
              <Badge variant="outline" className="text-[10px] font-mono">
                SUPERVISOR CLEARANCE
              </Badge>
            ) : user?.role ? (
              <Badge variant="outline" className="text-[10px] font-mono">
                {user.role}
              </Badge>
            ) : null}
          </div>
        }
      >
        <Button
          variant="outline"
          size="sm"
          disabled
          className="text-xs h-8 opacity-60 cursor-not-allowed gap-1.5"
          title="Directory service offline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Directory (Offline)</span>
        </Button>
      </PageHeader>

      {/* Directory Metrics Summary */}
      <div className="jp-metric-grid">
        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Active Personnel</span>
            <div className="jp-metric-card-icon-wrap">
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <div className="jp-metric-card-value">—</div>
          <span className="jp-metric-card-subtext truncate">Central Directory Sync Pending</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Mobile Terminals</span>
            <div className="jp-metric-card-icon-wrap">
              <Smartphone className="w-3.5 h-3.5" style={{ color: "var(--jp-status-low-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">—</div>
          <span className="jp-metric-card-subtext truncate">Enrolled Flutter Ingest Units</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Checkpoint Posts</span>
            <div className="jp-metric-card-icon-wrap">
              <MapPin className="w-3.5 h-3.5" style={{ color: "var(--jp-status-info-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">—</div>
          <span className="jp-metric-card-subtext truncate">Border & Terminal Gates</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="jp-filter-bar space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-md border border-border w-full sm:w-auto" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <Button
              variant={activeTab === "PERSONNEL" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("PERSONNEL")}
              className="text-xs h-7 px-2.5 flex-1 sm:flex-initial"
            >
              Personnel Roster
            </Button>
            <Button
              variant={activeTab === "TERMINALS" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("TERMINALS")}
              className="text-xs h-7 px-2.5 flex-1 sm:flex-initial"
            >
              Mobile Terminals
            </Button>
            <Button
              variant={activeTab === "CHECKPOINTS" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("CHECKPOINTS")}
              className="text-xs h-7 px-2.5 flex-1 sm:flex-initial"
            >
              Checkpoints
            </Button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-primary" />
            <Input
              placeholder="Search officer badge or terminal ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 w-full"
              aria-label="Search officer directory"
            />
          </div>
        </div>
      </div>

      {/* Honest Empty / Offline State */}
      <Card className="jp-card">
        <EmptyState
          title="OFFICER ROSTER & TERMINAL DIRECTORY OFFLINE"
          description="Authorized officer accounts, mobile terminal device certificates, and operational post assignments are synchronized with the central identity directory service."
          icon={Users}
          notice="Backend directory service authorization is authoritative. Direct client-side roster modification is prohibited by security policy."
        />
      </Card>

      {/* Directory Governance Card */}
      <Card className="jp-card p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>Role-based access control and terminal device binding enforced by centralized IAM.</span>
          </div>
          <span className="font-mono text-[10px]">ISO/IEC 27001 DIRECTORY SPEC</span>
        </div>
      </Card>
    </div>
  );
}

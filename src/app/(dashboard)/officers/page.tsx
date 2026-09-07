"use client";

import * as React from "react";
import { Users, Search, Smartphone, MapPin, ShieldCheck, RefreshCw, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface OfficerRosterItem {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  role: "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR";
  checkpointName: string;
  terminalId: string;
  status: "ON_DUTY" | "ACTIVE" | "OFF_DUTY";
}

const defaultOfficers: OfficerRosterItem[] = [
  {
    id: "usr_sup_101",
    badgeNumber: "SSB-SUP-101",
    fullName: "Inspector Sunita Rawat",
    email: "supervisor@ssb.gov.in",
    role: "SUPERVISOR",
    checkpointName: "Sonauli Integrated Check Post",
    terminalId: "SC-001",
    status: "ON_DUTY",
  },
  {
    id: "usr_officer_201",
    badgeNumber: "SSB-OFF-201",
    fullName: "Sub-Inspector Deep Sharma",
    email: "officer.sharma@ssb.gov.in",
    role: "OFFICER",
    checkpointName: "Sonauli ICP • Station 02",
    terminalId: "SC-004",
    status: "ON_DUTY",
  },
  {
    id: "usr_officer_202",
    badgeNumber: "SSB-OFF-202",
    fullName: "Sub-Inspector Rajesh Verma",
    email: "officer.verma@ssb.gov.in",
    role: "OFFICER",
    checkpointName: "Raxaul Border Terminal",
    terminalId: "SC-007",
    status: "ON_DUTY",
  },
  {
    id: "usr_officer_203",
    badgeNumber: "SSB-OFF-203",
    fullName: "Assistant Sub-Inspector A. K. Singh",
    email: "officer.singh@ssb.gov.in",
    role: "OFFICER",
    checkpointName: "Panitanki Land Port",
    terminalId: "SC-009",
    status: "ACTIVE",
  },
  {
    id: "usr_army_301",
    badgeNumber: "ARMY-SEC-301",
    fullName: "Capt. Vikram Batra",
    email: "army.vikram@mod.gov.in",
    role: "OFFICER",
    checkpointName: "High Altitude Border Post",
    terminalId: "SC-011",
    status: "ON_DUTY",
  },
  {
    id: "usr_adm_001",
    badgeNumber: "SSB-ADM-001",
    fullName: "Administrator Amit Roy",
    email: "admin@ssb.gov.in",
    role: "ADMINISTRATOR",
    checkpointName: "Central Operations Command",
    terminalId: "CC-HEADQUARTERS",
    status: "ACTIVE",
  },
];

export default function OfficersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"PERSONNEL" | "TERMINALS" | "CHECKPOINTS">("PERSONNEL");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const filteredOfficers = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return defaultOfficers;
    return defaultOfficers.filter(
      (o) =>
        o.fullName.toLowerCase().includes(term) ||
        o.badgeNumber.toLowerCase().includes(term) ||
        o.checkpointName.toLowerCase().includes(term) ||
        o.terminalId.toLowerCase().includes(term) ||
        o.role.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Top Header */}
      <PageHeader
        title="Authorized Officers & Checkpoint Units"
        description="Roster of authorized screening personnel, feeder terminal bindings, and post assignments."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              AUTHORIZED ROSTER
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
          onClick={handleRefresh}
          className="text-xs h-8 gap-1.5 cursor-pointer"
          title="Refresh officer roster"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Roster</span>
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
          <div className="jp-metric-card-value">{defaultOfficers.length} Officers</div>
          <span className="jp-metric-card-subtext truncate">Authorized Border & Defense Personnel</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Screening Terminals</span>
            <div className="jp-metric-card-icon-wrap">
              <Smartphone className="w-3.5 h-3.5" style={{ color: "var(--jp-status-low-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">12 Terminals</div>
          <span className="jp-metric-card-subtext truncate">Enrolled Optical Scanner Feeder Nodes</span>
        </div>

        <div className="jp-metric-card">
          <div className="jp-metric-card-header">
            <span className="jp-metric-card-title truncate">Checkpoint Posts</span>
            <div className="jp-metric-card-icon-wrap">
              <MapPin className="w-3.5 h-3.5" style={{ color: "var(--jp-status-info-text)" }} />
            </div>
          </div>
          <div className="jp-metric-card-value">4 Posts</div>
          <span className="jp-metric-card-subtext truncate">Sonauli, Raxaul, Panitanki, Delhi T3</span>
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
              Feeder Terminals
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
              placeholder="Search officer badge, name, or terminal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 w-full"
              aria-label="Search officer directory"
            />
          </div>
        </div>
      </div>

      {/* Active Directory Table */}
      <Card className="jp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-subtle text-muted-foreground font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Officer Name &amp; Role</th>
                <th className="py-3 px-4">Badge Number</th>
                <th className="py-3 px-4">Assigned Checkpoint</th>
                <th className="py-3 px-4">Feeder Terminal</th>
                <th className="py-3 px-4">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                    No authorized officers match &quot;{searchTerm}&quot;
                  </td>
                </tr>
              ) : (
                filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <span>{officer.fullName}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block font-mono">
                        {officer.email}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {officer.badgeNumber}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {officer.checkpointName}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {officer.terminalId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {officer.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

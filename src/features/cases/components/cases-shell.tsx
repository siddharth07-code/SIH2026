"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Eye,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/shared/status-indicator";

export type CaseStatus = "ALL" | "OPEN" | "UNDER_REVIEW" | "CONFIRMED_FRAUD" | "CLEARED" | "CLOSED";
export type CasePriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface CaseItem {
  id: string;
  verificationId: string;
  trackingNumber: string;
  documentType: string;
  assignedOfficer: string;
  priority: CasePriority;
  status: "OPEN" | "UNDER_REVIEW" | "CONFIRMED_FRAUD" | "CLEARED" | "CLOSED";
  riskScore: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  primaryFinding: string;
  createdAt: string;
  updatedAt: string;
  notesCount: number;
}

const defaultCases: CaseItem[] = [
  {
    id: "CASE-2026-001",
    verificationId: "verif-101",
    trackingNumber: "TRK-9821",
    documentType: "PASSPORT",
    assignedOfficer: "OFF-7719 (S. Sharma)",
    priority: "CRITICAL",
    status: "OPEN",
    riskScore: 86,
    riskLevel: "HIGH",
    primaryFinding: "Calculated DOB check digit mismatch (ICAO 9303 Modulo 10 failure)",
    createdAt: "2026-09-04T10:15:00Z",
    updatedAt: "2026-09-04T11:20:00Z",
    notesCount: 3,
  },
  {
    id: "CASE-2026-002",
    verificationId: "verif-102",
    trackingNumber: "TRK-8842",
    documentType: "PASSPORT",
    assignedOfficer: "OFF-3412 (R. Verma)",
    priority: "HIGH",
    status: "UNDER_REVIEW",
    riskScore: 74,
    riskLevel: "HIGH",
    primaryFinding: "Localized ELA gradient anomaly detected around visual Date of Birth",
    createdAt: "2026-09-04T09:30:00Z",
    updatedAt: "2026-09-04T12:05:00Z",
    notesCount: 2,
  },
  {
    id: "CASE-2026-003",
    verificationId: "verif-103",
    trackingNumber: "TRK-7714",
    documentType: "PASSPORT",
    assignedOfficer: "OFF-5581 (A. Patel)",
    priority: "CRITICAL",
    status: "CONFIRMED_FRAUD",
    riskScore: 92,
    riskLevel: "CRITICAL",
    primaryFinding: "Document number visual splicing + Presentation attack spoof detected",
    createdAt: "2026-09-03T16:40:00Z",
    updatedAt: "2026-09-04T08:15:00Z",
    notesCount: 5,
  },
  {
    id: "CASE-2026-004",
    verificationId: "verif-104",
    trackingNumber: "TRK-6629",
    documentType: "PASSPORT",
    assignedOfficer: "OFF-7719 (S. Sharma)",
    priority: "MEDIUM",
    status: "CLEARED",
    riskScore: 28,
    riskLevel: "LOW",
    primaryFinding: "Specular glare resolved on second capture; all 4 check digits verified",
    createdAt: "2026-09-03T14:10:00Z",
    updatedAt: "2026-09-03T15:00:00Z",
    notesCount: 1,
  },
  {
    id: "CASE-2026-005",
    verificationId: "verif-105",
    trackingNumber: "TRK-5511",
    documentType: "PASSPORT",
    assignedOfficer: "OFF-1192 (K. Singh)",
    priority: "LOW",
    status: "CLOSED",
    riskScore: 15,
    riskLevel: "LOW",
    primaryFinding: "Routine checkpoint screening; manual verification complete",
    createdAt: "2026-09-02T11:00:00Z",
    updatedAt: "2026-09-02T12:30:00Z",
    notesCount: 1,
  },
];

export function CasesShell() {
  const [statusFilter, setStatusFilter] = React.useState<CaseStatus>("ALL");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCase, setSelectedCase] = React.useState<CaseItem | null>(null);
  const [notes, setNotes] = React.useState<Record<string, string[]>>({
    "CASE-2026-001": [
      "Initial MRZ optical extraction failed check digit 2 (read 3, calculated 7).",
      "Field officer requested secondary gate inspection.",
      "Awaiting physical ultraviolet substrate check.",
    ],
  });
  const [newNote, setNewNote] = React.useState("");

  const filteredCases = React.useMemo(() => {
    return defaultCases.filter((c) => {
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || c.priority === priorityFilter;
      const matchesQuery =
        !searchQuery ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.primaryFinding.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesQuery;
    });
  }, [statusFilter, priorityFilter, searchQuery]);

  const handleAddNote = () => {
    if (!selectedCase || !newNote.trim()) return;
    setNotes((prev) => ({
      ...prev,
      [selectedCase.id]: [...(prev[selectedCase.id] || []), newNote.trim()],
    }));
    setNewNote("");
  };

  const getPriorityBadge = (priority: CasePriority) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge variant="destructive" className="text-xs font-mono">CRITICAL</Badge>;
      case "HIGH":
        return <Badge variant="warning" className="text-xs font-mono">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="text-xs font-mono border-amber-400 text-amber-600">MEDIUM</Badge>;
      case "LOW":
        return <Badge variant="outline" className="text-xs font-mono">LOW</Badge>;
    }
  };

  const getStatusBadge = (status: CaseItem["status"]) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded border border-rose-500/30 text-rose-600 bg-rose-50 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> OPEN
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded border border-amber-500/30 text-amber-600 bg-amber-50 font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> UNDER REVIEW
          </span>
        );
      case "CONFIRMED_FRAUD":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded border border-red-600/40 text-red-700 bg-red-100 font-bold">
            <XCircle className="w-3.5 h-3.5" /> CONFIRMED FRAUD
          </span>
        );
      case "CLEARED":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded border border-emerald-500/30 text-emerald-600 bg-emerald-50 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded border border-border text-muted-foreground bg-subtle">
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Status Filter Tabs (Matching Section 25) */}
      <div className="flex items-center gap-1.5 p-1 bg-subtle rounded-lg border border-border overflow-x-auto">
        {(["ALL", "OPEN", "UNDER_REVIEW", "CONFIRMED_FRAUD", "CLEARED", "CLOSED"] as CaseStatus[]).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === st
                ? "bg-surface text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* 2. Search & Priority Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cases by ID, tracking #, officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Priority:</span>
          <div className="flex items-center gap-1 bg-subtle p-0.5 rounded-md border border-border">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((pr) => (
              <button
                key={pr}
                onClick={() => setPriorityFilter(pr)}
                className={`px-2 py-1 rounded text-xs font-mono cursor-pointer transition-all ${
                  priorityFilter === pr
                    ? "bg-surface text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Uncluttered Cases Table */}
      <Card className="jp-card overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="jp-table-thead">
              <tr>
                <th className="jp-table-th">Case Reference</th>
                <th className="jp-table-th">Priority</th>
                <th className="jp-table-th">Status</th>
                <th className="jp-table-th">Risk Assessment</th>
                <th className="jp-table-th hidden md:table-cell">Assigned Officer</th>
                <th className="jp-table-th">Primary Finding</th>
                <th className="jp-table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="jp-table-tbody">
              {filteredCases.map((c) => (
                <tr key={c.id} className="jp-table-tr hover:bg-muted/30 transition-colors">
                  <td className="jp-table-td">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-sm text-foreground block">
                        {c.id}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground block">
                        {c.trackingNumber} • {c.documentType}
                      </span>
                    </div>
                  </td>
                  <td className="jp-table-td">
                    {getPriorityBadge(c.priority)}
                  </td>
                  <td className="jp-table-td">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="jp-table-td">
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={c.riskLevel} size="sm" />
                      <span className="font-mono text-xs font-bold text-foreground">
                        {c.riskScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="jp-table-td hidden md:table-cell">
                    <span className="font-mono text-xs text-foreground block">
                      {c.assignedOfficer}
                    </span>
                  </td>
                  <td className="jp-table-td text-xs text-muted-foreground max-w-xs truncate">
                    {c.primaryFinding}
                  </td>
                  <td className="jp-table-td text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCase(c)}
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Investigation Notes"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline ml-1">Notes</span>
                      </Button>
                      <Link href={`/evidence/${c.verificationId}`}>
                        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs cursor-pointer font-medium">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Lab</span>
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 4. Investigation Notes Drawer (Section 25: POST /api/v1/cases/:id/notes) */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedCase(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "var(--jp-bg-surface)" }}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground m-0 flex items-center gap-2">
                  <Briefcase className="w-4.5 h-4.5 text-primary" />
                  <span>Case Investigation Notes</span>
                </h3>
                <span className="text-xs font-mono text-muted-foreground block mt-0.5">
                  {selectedCase.id} • Assigned to {selectedCase.assignedOfficer}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCase(null)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="p-3 rounded-lg border border-border bg-subtle space-y-1">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Primary Allegation / Anomaly Finding
                </span>
                <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                  {selectedCase.primaryFinding}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block font-mono">
                  Recorded Officer Notes
                </span>
                <div className="space-y-2">
                  {(notes[selectedCase.id] || []).map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded border border-border bg-elevated text-xs space-y-1">
                      <p className="text-foreground m-0">{note}</p>
                      <span className="text-[10px] font-mono text-muted-foreground block">
                        Logged by Authorized Officer
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-elevated space-y-2">
              <textarea
                placeholder="Append formal investigation note or supervisor action..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="w-full p-2 rounded-md border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Append-only immutable audit trail
                </span>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Send className="w-3 h-3" />
                  <span>Record Note</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

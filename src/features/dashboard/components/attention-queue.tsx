"use client";

import * as React from "react";
import Link from "next/link";
import { Layers, ArrowUpRight, Eye } from "lucide-react";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Button } from "@/components/ui/button";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import { useAttentionQueue } from "../hooks/use-dashboard-queries";

export function AttentionQueue() {
  const { data: queueItems, isLoading, isError } = useAttentionQueue();

  const isEmpty = !queueItems || queueItems.length === 0;

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Layers className="w-4 h-4 text-rose-400 shrink-0" />
          <h2 className="text-xs font-semibold text-foreground tracking-wider uppercase truncate">
            Priority Attention Queue
          </h2>
        </div>
        <Link
          href="/verifications"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium shrink-0"
        >
          <span>All Cases</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="max-w-full overflow-x-hidden">
        <DataTableShell
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          emptyTitle="No verification cases in review queue"
          emptyDescription="When field officers submit documents from mobile terminals, cases flagged with anomalies, MRZ checksum failures, or biometric mismatches will stream directly into this queue."
          emptyNotice="Live screening sessions flagged for supervisory review will stream directly into this triage queue."
        >
          <thead className="border-b border-white/[0.08] bg-slate-950/60">
            <tr className="text-xs font-semibold text-muted-foreground uppercase text-left">
              <th className="p-3 pl-4">Risk Evaluation</th>
              <th className="p-3">Tracking ID</th>
              <th className="p-3">Document</th>
              <th className="p-3 hidden md:table-cell">Checkpoint / Officer</th>
              <th className="p-3">Primary Evidence Finding</th>
              <th className="p-3 hidden sm:table-cell">Submitted At</th>
              <th className="p-3 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs">
            {queueItems?.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                <td className="p-3 pl-4">
                  <StatusIndicator status={item.riskLevel} size="sm" />
                </td>
                <td className="p-3 font-mono font-semibold text-foreground">
                  <div className="space-y-0.5">
                    <span>{item.trackingNumber}</span>
                    <span className="text-[10px] text-muted-foreground font-sans block md:hidden">
                      {item.checkpointName}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-0.5">
                    <span className="font-medium text-foreground">{item.documentType}</span>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {maskDocumentNumber(item.maskedDocumentNumber)}
                    </span>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="space-y-0.5">
                    <span className="text-foreground">{item.checkpointName}</span>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {item.officerBadge}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground max-w-xs truncate">
                  {item.primaryFinding}
                </td>
                <td className="p-3 text-muted-foreground font-mono hidden sm:table-cell">
                  {formatDateTime(item.submittedAt)}
                </td>
                <td className="p-3 pr-4 text-right">
                  <Link href={`/verifications/${item.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-7 px-2.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      </div>
    </div>
  );
}

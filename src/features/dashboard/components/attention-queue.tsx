"use client";

import * as React from "react";
import Link from "next/link";
import { Layers, ArrowUpRight, Eye, SlidersHorizontal } from "lucide-react";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Button } from "@/components/ui/button";
import { maskDocumentNumber, formatDateTime } from "@/lib/utils/formatters";
import { useAttentionQueue } from "../hooks/use-dashboard-queries";
import { QuickPeekDrawer } from "./quick-peek-drawer";
import type { AttentionQueueItem } from "@/types";

export function AttentionQueue() {
  const { data: queueItems, isLoading, isError } = useAttentionQueue();
  const [selectedItem, setSelectedItem] = React.useState<AttentionQueueItem | null>(null);

  const isEmpty = !queueItems || queueItems.length === 0;

  return (
    <div className="space-y-2.5 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Layers className="w-4.5 h-4.5 text-rose-400 shrink-0" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide truncate m-0">
            Priority Attention Queue
          </h2>
        </div>
        <Link
          href="/verifications"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold shrink-0"
        >
          <span>All Cases</span>
          <ArrowUpRight className="w-4 h-4" />
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
          <thead className="jp-table-thead">
            <tr>
              <th className="jp-table-th">Risk Evaluation</th>
              <th className="jp-table-th">Tracking ID</th>
              <th className="jp-table-th">Document</th>
              <th className="jp-table-th hidden md:table-cell">Checkpoint / Officer</th>
              <th className="jp-table-th">Primary Evidence Finding</th>
              <th className="jp-table-th hidden sm:table-cell">Submitted At</th>
              <th className="jp-table-th text-right">Action</th>
            </tr>
          </thead>
          <tbody className="jp-table-tbody">
            {queueItems?.map((item) => (
              <tr key={item.id} className="jp-table-tr hover:bg-muted/30 transition-colors">
                <td className="jp-table-td">
                  <StatusIndicator status={item.riskLevel} size="sm" />
                </td>
                <td className="jp-table-td font-mono font-semibold text-foreground">
                  <div className="space-y-0.5">
                    <span className="text-sm">{item.trackingNumber}</span>
                    <span className="text-xs text-muted-foreground font-sans block md:hidden">
                      {item.checkpointName}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td">
                  <div className="space-y-0.5">
                    <span className="font-medium text-foreground text-sm">{item.documentType}</span>
                    <span className="text-xs font-mono text-muted-foreground block">
                      {maskDocumentNumber(item.maskedDocumentNumber)}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td hidden md:table-cell">
                  <div className="space-y-0.5">
                    <span className="text-foreground text-sm">{item.checkpointName}</span>
                    <span className="text-xs font-mono text-muted-foreground block">
                      {item.officerBadge}
                    </span>
                  </div>
                </td>
                <td className="jp-table-td text-muted-foreground text-sm max-w-xs truncate">
                  {item.primaryFinding}
                </td>
                <td className="jp-table-td text-muted-foreground font-mono text-xs hidden sm:table-cell">
                  {formatDateTime(item.submittedAt)}
                </td>
                <td className="jp-table-td text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                      className="hidden sm:inline-flex gap-1.5 text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer font-medium"
                      title="Quick peek drawer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Peek</span>
                    </Button>
                    <Link href={`/verifications/${item.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 px-2.5 cursor-pointer font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTableShell>
      </div>

      {/* Quick Peek Slide-Out Drawer */}
      <QuickPeekDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

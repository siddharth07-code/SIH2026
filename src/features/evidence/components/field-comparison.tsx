"use client";

import * as React from "react";
import { Check, X, FileCheck, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FieldComparisonItem } from "@/types";

interface FieldComparisonProps {
  comparisons?: FieldComparisonItem[];
}

export function FieldComparison({ comparisons = [] }: FieldComparisonProps) {
  const hasItems = comparisons.length > 0;
  const mismatchCount = comparisons.filter((c) => c.status === "MISMATCH").length;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-white/[0.08] flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileCheck className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Visual OCR ↔ MRZ Field Parity Comparator
          </CardTitle>
        </div>
        {hasItems && (
          <div className="flex items-center gap-2 self-start xs:self-auto">
            {mismatchCount > 0 ? (
              <Badge variant="destructive" className="text-[10px] font-mono gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>{mismatchCount} INCONSISTENCIES</span>
              </Badge>
            ) : (
              <Badge variant="success" className="text-[10px] font-mono gap-1">
                <Check className="w-3 h-3" />
                <span>100% FIELD PARITY</span>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {hasItems ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[540px] sm:min-w-0">
              <thead className="border-b border-white/[0.08] bg-slate-950/60 text-muted-foreground uppercase text-[11px] font-semibold">
                <tr>
                  <th className="p-3 pl-4">Document Field</th>
                  <th className="p-3">Visual OCR Value</th>
                  <th className="p-3">MRZ Extracted Value</th>
                  <th className="p-3">Parity Status</th>
                  <th className="p-3 pr-4 hidden sm:table-cell">Forensic Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {comparisons.map((item) => {
                  const isMismatch = item.status === "MISMATCH";
                  return (
                    <tr
                      key={item.field}
                      className={`transition-colors ${
                        isMismatch ? "bg-rose-950/15 hover:bg-rose-950/25" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <td className="p-3 pl-4 font-semibold text-foreground">
                        <div>
                          <span>{item.field}</span>
                          {item.details && (
                            <span className="text-[10px] font-normal text-muted-foreground block sm:hidden pt-0.5 leading-tight">
                              {item.details}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-foreground font-medium">
                        {item.visualValue || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="p-3 font-mono text-foreground font-medium">
                        {item.mrzValue || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="p-3">
                        {isMismatch ? (
                          <Badge variant="destructive" className="text-[10px] font-mono gap-1 whitespace-nowrap">
                            <X className="w-3 h-3" />
                            <span>MISMATCH DETECTED</span>
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px] font-mono gap-1 whitespace-nowrap">
                            <Check className="w-3 h-3" />
                            <span>EXACT MATCH</span>
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 pr-4 text-muted-foreground text-[11px] max-w-xs leading-tight hidden sm:table-cell">
                        {item.details || "Consistent check digit parity."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center text-xs font-mono text-muted-foreground">
            No OCR ↔ MRZ field parity records loaded.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

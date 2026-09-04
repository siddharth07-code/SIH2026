"use client";

import * as React from "react";
import { Sparkles, Sliders, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForensicLegend } from "./forensic-legend";
import type { ForensicSignal } from "@/types";

interface ForensicInspectorProps {
  signals?: ForensicSignal[];
  onSelectSignal?: (signal: ForensicSignal | null) => void;
}

type VisualizationMode = "ORIGINAL" | "ENHANCED" | "ANOMALY_MAP" | "HEATMAP" | "DIFFERENCE_MAP";

export function ForensicInspector({ signals = [], onSelectSignal }: ForensicInspectorProps) {
  const [mode, setMode] = React.useState<VisualizationMode>("ANOMALY_MAP");
  const [opacity, setOpacity] = React.useState<number>(80);

  const hasSignals = signals.length > 0;

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Forensic Digital Manipulation Inspector
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          {signals.length} ANOMALY SIGNALS
        </span>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        {/* Mode Selector & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 p-2.5 rounded-md border border-border" style={{ backgroundColor: "var(--jp-bg-root)" }}>
          {/* Visualization Modes Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                "ORIGINAL",
                "ENHANCED",
                "ANOMALY_MAP",
                "HEATMAP",
                "DIFFERENCE_MAP",
              ] as VisualizationMode[]
            ).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMode(m)}
                className="h-6 px-2 text-[10px] font-mono min-h-[24px]"
              >
                {m.replace("_", " ")}
              </Button>
            ))}
          </div>

          {/* Opacity Slider Control */}
          <div className="flex items-center gap-2 min-w-[120px] self-end sm:self-auto">
            <Sliders className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase shrink-0">
              Opacity: {opacity}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-16 h-1.5 rounded-lg appearance-none cursor-pointer accent-primary"
              style={{ backgroundColor: "var(--jp-border-default)" }}
              aria-label="Forensic overlay opacity"
            />
          </div>
        </div>

        {/* Forensic Signals Stream / Table */}
        {hasSignals ? (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
              Logged Anomaly Telemetry
            </span>
            <div className="space-y-2">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  onClick={() => onSelectSignal?.(sig)}
                  className="rounded-md border border-rose-500/30 p-2.5 space-y-1 cursor-pointer transition-all"
                  style={{ backgroundColor: "var(--jp-status-high-bg)" }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-mono text-xs font-bold text-rose-300">
                        {sig.anomalyType}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-[10px] font-mono">
                      CONFIDENCE: {Math.round(sig.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-0.5 m-0">
                    {sig.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 text-center text-xs font-mono text-muted-foreground border border-dashed border-border rounded-md">
            No Digital Manipulation Signals Logged
          </div>
        )}

        {/* Forensic Spectral Legend */}
        <ForensicLegend />
      </CardContent>
    </Card>
  );
}

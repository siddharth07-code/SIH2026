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
    <Card className="border-border bg-card">
      <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-white/[0.08] flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 space-y-0">
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

      <CardContent className="p-3.5 sm:p-5 space-y-4">
        {/* Mode Selector & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm">
          {/* Visualization Modes Pills - Touch Friendly */}
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
                className="h-7 px-2 sm:px-2.5 text-[10px] sm:text-[11px] font-mono min-h-[28px]"
              >
                {m.replace("_", " ")}
              </Button>
            ))}
          </div>

          {/* Opacity Slider Control */}
          <div className="flex items-center gap-2 min-w-[130px] self-end sm:self-auto">
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
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Forensic overlay opacity"
            />
          </div>
        </div>

        {/* Forensic Signals Stream / Table */}
        {hasSignals ? (
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Logged Anomaly Telemetry
            </span>
            <div className="space-y-2">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  onClick={() => onSelectSignal?.(sig)}
                  className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 space-y-1 cursor-pointer hover:border-rose-500/50 hover:bg-rose-950/30 transition-all shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)]"
                >
                  <div className="flex items-center justify-between gap-2">
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
                  <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                    {sig.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs font-mono text-muted-foreground border border-dashed border-white/[0.08] rounded-lg">
            No Digital Manipulation Signals Logged
          </div>
        )}

        {/* Forensic Spectral Legend */}
        <ForensicLegend />
      </CardContent>
    </Card>
  );
}

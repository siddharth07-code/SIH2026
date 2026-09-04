"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvidenceToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showOverlays: boolean;
  onToggleOverlays: () => void;
}

export function EvidenceToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showOverlays,
  onToggleOverlays,
}: EvidenceToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-lg border bg-card w-full">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className="h-8 w-8 sm:h-7 sm:w-7 p-0"
          aria-label="Zoom out document capture"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>

        <span className="font-mono text-[11px] text-muted-foreground w-12 text-center select-none">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= 3.0}
          className="h-8 w-8 sm:h-7 sm:w-7 p-0"
          aria-label="Zoom in document capture"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetZoom}
          className="h-8 px-2 sm:h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
          aria-label="Reset zoom scale to 100%"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden xs:inline">Reset</span>
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant={showOverlays ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleOverlays}
          className="h-8 px-2.5 sm:h-7 text-xs gap-1.5"
          aria-label={showOverlays ? "Hide localized anomaly overlays" : "Show localized anomaly overlays"}
        >
          {showOverlays ? <Eye className="w-3.5 h-3.5 text-primary" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
          <span>Overlays</span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import type { EvidenceRegion } from "@/types";

interface EvidenceRegionOverlayProps {
  regions?: EvidenceRegion[];
  visible: boolean;
  selectedRegionId?: string | null;
  onSelectRegion?: (regionId: string) => void;
}

export function EvidenceRegionOverlay({
  regions = [],
  visible,
  selectedRegionId,
  onSelectRegion,
}: EvidenceRegionOverlayProps) {
  if (!visible || regions.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-label="Forensic Anomaly Region Overlays">
      {regions.map((region) => {
        const { x, y, width, height } = region.boundingBox;
        const isSelected = selectedRegionId === region.id;

        const borderColorClass =
          region.severity === "CRITICAL" || region.severity === "HIGH"
            ? "border-rose-500 bg-rose-500/15"
            : region.severity === "MEDIUM"
            ? "border-amber-500 bg-amber-500/15"
            : "border-sky-500 bg-sky-500/15";

        const badgeColorClass =
          region.severity === "CRITICAL" || region.severity === "HIGH"
            ? "bg-rose-600 text-white"
            : region.severity === "MEDIUM"
            ? "bg-amber-600 text-white"
            : "bg-sky-600 text-white";

        return (
          <div
            key={region.id}
            onClick={() => onSelectRegion?.(region.id)}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
            className={`absolute border-2 rounded transition-all cursor-pointer pointer-events-auto ${borderColorClass} ${
              isSelected ? "ring-2 ring-primary ring-offset-1 scale-[1.02] z-20" : "z-10"
            }`}
            title={`${region.label}: ${region.description || "Localized forensic anomaly"}`}
          >
            <span
              className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-sm ${badgeColorClass}`}
            >
              {region.label} {region.confidence ? `(${(region.confidence * 100).toFixed(0)}%)` : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { ImageOff, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EvidenceToolbar } from "./evidence-toolbar";
import { EvidenceRegionOverlay } from "./evidence-region-overlay";
import type { EvidenceAsset, EvidenceRegion } from "@/types";

interface DocumentInspectorProps {
  assets?: EvidenceAsset[];
  regions?: EvidenceRegion[];
  selectedRegionId?: string | null;
  onSelectRegion?: (regionId: string | null) => void;
}

export function DocumentInspector({
  assets,
  regions = [],
  selectedRegionId,
  onSelectRegion,
}: DocumentInspectorProps) {
  const [zoom, setZoom] = React.useState<number>(1.0);
  const [showOverlays, setShowOverlays] = React.useState<boolean>(true);

  const documentAsset = assets?.find(
    (a) => a.type === "ORIGINAL_DOCUMENT" || a.type === "PROCESSED_DOCUMENT"
  );

  const handleZoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  const handleResetZoom = () => setZoom(1.0);

  return (
    <Card className="border-border bg-card overflow-hidden flex flex-col">
      <CardHeader className="p-3.5 sm:p-4 pb-2 border-b border-white/[0.08] flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Document Capture Inspection Canvas
          </CardTitle>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          {regions.length} REGIONS DETECTED
        </span>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-3 flex-1 flex flex-col min-h-0">
        {/* Floating Responsive Toolbar */}
        <EvidenceToolbar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          showOverlays={showOverlays}
          onToggleOverlays={() => setShowOverlays(!showOverlays)}
        />

        {/* Viewport Canvas */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[360px] md:min-h-[440px] rounded-lg border border-white/[0.08] bg-slate-950 flex items-center justify-center overflow-auto p-2 sm:p-4 shadow-inner">
          {documentAsset?.url ? (
            <div
              className="relative transition-transform duration-150 ease-out origin-center select-none"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              {/* Document Image Element */}
              <div className="relative rounded shadow-2xl border border-white/10 max-w-[85vw] max-h-[60vh] sm:max-w-md md:max-w-lg">
                <img
                  src={documentAsset.url}
                  alt="Document capture for forensic analysis"
                  className="w-full h-auto object-contain rounded"
                />

                {/* Overlaid Anomaly Regions */}
                <EvidenceRegionOverlay
                  regions={regions}
                  selectedRegionId={selectedRegionId}
                  onSelectRegion={onSelectRegion}
                  visible={showOverlays}
                />
              </div>
            </div>
          ) : (
            <div className="text-center p-6 space-y-2 max-w-sm">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-muted-foreground mx-auto">
                <ImageOff className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-foreground">
                Document Capture Image Unavailable
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Raw capture asset storage key is recorded but image asset has not been synchronized from mobile ingest storage.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

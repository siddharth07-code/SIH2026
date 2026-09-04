"use client";

import * as React from "react";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SpectrumMode = "VISIBLE" | "ELA" | "NOISE" | "SPLICING";

interface AnomalyRegion {
  id: string;
  name: string;
  category: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  coordinates: string;
  finding: string;
  algorithm: string;
  confidence: number;
}

const anomalyRegions: AnomalyRegion[] = [
  {
    id: "reg-01",
    name: "Date of Birth Visual Field",
    category: "COMPRESSION_INCONSISTENCY",
    severity: "HIGH",
    coordinates: "[Y: 184-218, X: 412-490]",
    finding: "High-contrast ELA gradient spike indicates secondary JPEG re-saving over existing text surface.",
    algorithm: "PyTorch ELA-ResNet / Quantization Matrix Delta",
    confidence: 0.94,
  },
  {
    id: "reg-02",
    name: "Portrait Perimeter & Splicing Boundary",
    category: "BOUNDARY_DISCONTINUITY",
    severity: "LOW",
    coordinates: "[Y: 72-240, X: 40-160]",
    finding: "Continuous edge gradients with natural sensor noise continuity. No photo replacement detected.",
    algorithm: "Laplacian Boundary Continuity Invariant",
    confidence: 0.98,
  },
  {
    id: "reg-03",
    name: "Guilloche Micro-pattern & Hologram",
    category: "TEXTURE_ANOMALY",
    severity: "MEDIUM",
    coordinates: "[Y: 120-210, X: 260-380]",
    finding: "Fine micro-line periodicity shows 12% frequency attenuation compared to standard passport substrate.",
    algorithm: "Fourier Transform Substrate Periodicity",
    confidence: 0.78,
  },
];

export function ForensicStudio() {
  const [spectrumMode, setSpectrumMode] = React.useState<SpectrumMode>("VISIBLE");
  const [selectedRegionId, setSelectedRegionId] = React.useState<string>("reg-01");
  const [zoom, setZoom] = React.useState<number>(1.0);
  const [showOverlay, setShowOverlay] = React.useState<boolean>(true);

  const selectedRegion =
    anomalyRegions.find((r) => r.id === selectedRegionId) || anomalyRegions[0];

  const handleZoomIn = () => setZoom((z) => Math.min(Number((z + 0.25).toFixed(2)), 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.75));
  const handleResetZoom = () => setZoom(1.0);

  return (
    <div className="space-y-6">
      {/* Studio Toolbar & Spectrum Selector */}
      <Card className="jp-card">
        <div className="p-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="jp-sidebar-brand-icon">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground m-0 flex items-center gap-2">
                <span>Multi-Spectral Forensic Inspection Canvas</span>
                <Badge variant="outline" className="text-[9px] font-mono">
                  RESIDUAL ANALYSIS
                </Badge>
              </h3>
              <p className="text-[11px] text-muted-foreground m-0">
                Switch spectral analysis layers to detect digital compression anomalies and boundary splicing.
              </p>
            </div>
          </div>

          {/* Spectrum Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-subtle p-1 rounded-md border border-border self-start sm:self-auto">
            <button
              onClick={() => setSpectrumMode("VISIBLE")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                spectrumMode === "VISIBLE"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Visible Light (RGB)
            </button>
            <button
              onClick={() => setSpectrumMode("ELA")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                spectrumMode === "ELA"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ELA Heatmap
            </button>
            <button
              onClick={() => setSpectrumMode("NOISE")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                spectrumMode === "NOISE"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Noise Residual
            </button>
            <button
              onClick={() => setSpectrumMode("SPLICING")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                spectrumMode === "SPLICING"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Copy-Move Splicing
            </button>
          </div>
        </div>

        {/* Studio Viewport */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Inspection Canvas Viewport */}
          <div className="lg:col-span-2 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-muted-foreground">
                VIEWPORT MODE: <strong className="text-foreground uppercase">{spectrumMode}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-8 w-8 p-0 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs font-mono px-2 font-semibold">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-8 w-8 p-0 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="h-8 px-2.5 text-xs text-muted-foreground cursor-pointer font-medium"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Interactive Canvas Simulation Frame */}
            <div className="relative min-h-[420px] sm:min-h-[480px] rounded-lg border border-border bg-black/90 flex items-center justify-center p-4 overflow-hidden select-none">
              <div
                className="relative rounded border border-border/80 max-w-full transition-transform duration-150 ease-out"
                style={{ transform: `scale(${zoom})` }}
              >
                {/* Synthetic Passport Canvas Representation */}
                <div
                  className={`w-[540px] h-[350px] rounded-sm p-4 relative overflow-hidden transition-all duration-300 ${
                    spectrumMode === "VISIBLE"
                      ? "bg-slate-100 text-slate-900 border-2 border-slate-300 shadow-md"
                      : spectrumMode === "ELA"
                      ? "bg-indigo-950 text-indigo-200 border-2 border-indigo-500"
                      : spectrumMode === "NOISE"
                      ? "bg-zinc-900 text-zinc-300 border-2 border-zinc-700"
                      : "bg-neutral-900 text-neutral-200 border-2 border-amber-600"
                  }`}
                >
                  {/* Passport Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs">REPUBLIC OF INDIA</span>
                      <span className="text-[9px] font-mono opacity-70">PASSPORT / PASSEPORT</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold">TYPE P &lt; IND</span>
                  </div>

                  {/* Photo & Bio Layout */}
                  <div className="mt-3 flex gap-4">
                    {/* Photo Area */}
                    <div
                      className={`w-28 h-36 rounded border flex flex-col items-center justify-center p-1 relative ${
                        spectrumMode === "VISIBLE"
                          ? "bg-slate-300 border-slate-400"
                          : spectrumMode === "ELA"
                          ? "bg-indigo-900/60 border-indigo-400"
                          : "bg-zinc-800 border-zinc-600"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-center opacity-70 block mb-1">
                        PHOTO HOLDER
                      </span>
                      <div className="w-14 h-14 rounded-full bg-slate-400/50 mb-1" />
                      <span className="text-[8px] font-mono opacity-50">SHARMA, DEEP</span>
                    </div>

                    {/* Bio Data Fields */}
                    <div className="flex-1 space-y-1.5 text-[10px] font-mono">
                      <div>
                        <span className="opacity-60 block text-[8px]">SURNAME / NOM</span>
                        <span className="font-bold text-xs">SHARMA</span>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[8px]">GIVEN NAMES / PRENOMS</span>
                        <span className="font-bold">DEEP</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="opacity-60 block text-[8px]">NATIONALITY</span>
                          <span className="font-bold">INDIAN</span>
                        </div>
                        <div>
                          <span className="opacity-60 block text-[8px]">SEX</span>
                          <span className="font-bold">M</span>
                        </div>
                      </div>

                      {/* Targeted Date of Birth Field (with ELA highlight) */}
                      <div
                        className={`p-1 rounded transition-all ${
                          spectrumMode === "ELA"
                            ? "bg-rose-500/30 border border-rose-400 text-rose-200 animate-pulse"
                            : spectrumMode === "SPLICING"
                            ? "border border-amber-400 bg-amber-500/20"
                            : ""
                        }`}
                      >
                        <span className="opacity-60 block text-[8px]">DATE OF BIRTH / DATE DE NAISSANCE</span>
                        <span className="font-bold text-xs tracking-wider">12/04/2000</span>
                      </div>
                    </div>
                  </div>

                  {/* MRZ Bottom Strip */}
                  <div className="absolute bottom-2 left-4 right-4 pt-1 border-t border-border/40 font-mono text-[9px] tracking-wider opacity-85 select-all">
                    <div>P&lt;INDSHARMA&lt;&lt;DEEP&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                    <div>Z1234567&lt;8IND9804123M2809015&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
                  </div>

                  {/* Overlay Anomaly Pin Markers */}
                  {showOverlay && (
                    <div
                      onClick={() => setSelectedRegionId("reg-01")}
                      className="absolute top-[125px] right-[100px] w-6 h-6 rounded-full border-2 border-rose-500 bg-rose-500/30 flex items-center justify-center cursor-pointer animate-ping"
                      title="Region 1: DOB Manipulation Flag"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Localized Anomaly Inspector Sidebar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Detected Regions ({anomalyRegions.length})
              </span>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="text-[10px] font-mono text-primary hover:underline cursor-pointer"
              >
                {showOverlay ? "Hide Overlay Pins" : "Show Overlay Pins"}
              </button>
            </div>

            <div className="space-y-2">
              {anomalyRegions.map((region) => {
                const isSelected = region.id === selectedRegionId;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border bg-elevated hover:border-strong hover:bg-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {region.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-mono ${
                          region.severity === "HIGH"
                            ? "text-rose-500 border-rose-500/30 bg-rose-500/10"
                            : region.severity === "MEDIUM"
                            ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
                            : "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                        }`}
                      >
                        {region.severity} RISK
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block truncate">
                      {region.coordinates}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Deep-Dive Card for Selected Region */}
            <div className="p-3 rounded-lg border border-border bg-subtle space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {selectedRegion.name}
                </span>
                <span className="text-[10px] font-mono text-primary font-semibold">
                  Confidence: {Math.round(selectedRegion.confidence * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed m-0">
                {selectedRegion.finding}
              </p>
              <div className="pt-2 border-t border-border/70 text-[10px] font-mono text-muted-foreground space-y-1">
                <div>Algorithm: {selectedRegion.algorithm}</div>
                <div>Category: {selectedRegion.category}</div>
              </div>
            </div>

            {/* Architecture Invariant Note */}
            <div className="p-2.5 rounded border border-border bg-elevated text-[11px] text-muted-foreground flex items-start gap-2">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Forensic models run strictly within the isolated backend pipeline; the command center receives structured coordinates and heatmaps.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

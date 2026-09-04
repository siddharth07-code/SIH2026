"use client";

import * as React from "react";
import {
  Camera,
  ScanText,
  Binary,
  Layers,
  ScanFace,
  Cpu,
  UserCheck,
  ShieldCheck,
  Activity,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PipelineStage {
  id: string;
  step: number;
  name: string;
  category: "INGEST" | "VALIDATION" | "FORENSICS" | "BIOMETRICS" | "EVALUATION" | "DECISION";
  engine: string;
  description: string;
  principles: string;
  status: "ONLINE" | "STANDBY" | "ACTIVE";
  latencyMs: number;
  icon: React.ElementType;
}

const pipelineStages: PipelineStage[] = [
  {
    id: "stage-capture",
    step: 1,
    name: "Capture & Quality Check",
    category: "INGEST",
    engine: "Mobile Flutter Camera & Client-Side Quality Guidance",
    description: "Evaluates lighting glare, border alignment, DPI resolution, and optical blur before submission.",
    principles: "Prevents degraded captures from polluting downstream forensic analysis.",
    status: "ONLINE",
    latencyMs: 140,
    icon: Camera,
  },
  {
    id: "stage-ocr-mrz",
    step: 2,
    name: "VIZ OCR & MRZ Extraction",
    category: "INGEST",
    engine: "Optical Character Recognition & TD3 2-Line Parser",
    description: "Extracts Visual Inspection Zone (name, DOB, nationality) and detects the 44-character passport MRZ strings.",
    principles: "OCR extracts candidate text; it is never treated as authoritative truth without cross-checking.",
    status: "ONLINE",
    latencyMs: 380,
    icon: ScanText,
  },
  {
    id: "stage-checksum",
    step: 3,
    name: "ICAO 9303 MRZ Validation",
    category: "VALIDATION",
    engine: "Deterministic Check Digit Engine (7-3-1 Weighting)",
    description: "Mathematically verifies modulo-10 check digits on document number, date of birth, expiry date, and composite.",
    principles: "Deterministic algorithms validate check digits. Zero AI hallucination in checksum validation.",
    status: "ACTIVE",
    latencyMs: 25,
    icon: Binary,
  },
  {
    id: "stage-forensics",
    step: 4,
    name: "Digital Image Forensics",
    category: "FORENSICS",
    engine: "Error Level Analysis (ELA) & Frequency Noise Analysis",
    description: "Detects compression inconsistencies, copy-move manipulation, boundary splicing, and typography anomalies.",
    principles: "Produces both document-level risk and pixel-level localized suspicious bounding regions.",
    status: "ONLINE",
    latencyMs: 620,
    icon: Layers,
  },
  {
    id: "stage-biometrics",
    step: 5,
    name: "Face Verification & Liveness",
    category: "BIOMETRICS",
    engine: "Dedicated Biometric Embedding & Presentation Attack Detection",
    description: "Computes cosine similarity between document face photo and live officer selfie; verifies 3D liveness.",
    principles: "Dedicated biometric computer vision models; never delegates facial matching to an LLM.",
    status: "ONLINE",
    latencyMs: 410,
    icon: ScanFace,
  },
  {
    id: "stage-risk-engine",
    step: 6,
    name: "Deterministic Risk Engine",
    category: "EVALUATION",
    engine: "Evidence Aggregator & Rule-Based Calibrator",
    description: "Synthesizes multi-source evidence into standardized risk score (0-100) and recommendation: CLEAR / REVIEW / ESCALATE.",
    principles: "Deterministic, explainable, testable, and completely independent of UI or LLM influence.",
    status: "ACTIVE",
    latencyMs: 35,
    icon: Cpu,
  },
  {
    id: "stage-llm-human",
    step: 7,
    name: "LLM Explanation & Officer Sign-off",
    category: "DECISION",
    engine: "Structured LLM Reasoner + Authorized Human Officer",
    description: "LLM produces plain-English evidence synthesis from structured JSON. Authorized human officer makes the legal decision.",
    principles: "The LLM explains; a certified officer makes the operational determination. Human-in-the-loop.",
    status: "ONLINE",
    latencyMs: 820,
    icon: UserCheck,
  },
];

export function PipelineVisualizer() {
  const [selectedStageId, setSelectedStageId] = React.useState<string>("stage-checksum");

  const selectedStage =
    pipelineStages.find((s) => s.id === selectedStageId) || pipelineStages[2];

  return (
    <Card className="jp-card overflow-hidden">
      <CardHeader className="p-4 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="jp-sidebar-brand-icon">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 m-0">
              <span>Defense-in-Depth Verification Pipeline</span>
              <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
                ISO/IEC 23894
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground m-0 mt-0.5">
              7-stage explainable identity screening architecture from ingest to officer determination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">ALL ENGINES ONLINE</span>
          </span>
          <span>•</span>
          <span>E2E LATENCY: 2.43s</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Horizontal Pipeline Steps Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = stage.id === selectedStageId;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`relative flex flex-col items-start p-3 rounded-lg border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-elevated hover:border-strong hover:bg-subtle"
                }`}
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span
                    className={`w-5 h-5 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    {stage.step}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {stage.latencyMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? "text-primary font-bold" : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                  <span className="text-xs font-semibold text-foreground truncate leading-snug">
                    {stage.name}
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate w-full">
                  {stage.category}
                </span>

                {isSelected && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Deep Dive Panel for Selected Stage */}
        <div
          className="p-4 rounded-lg border border-border bg-subtle/60 space-y-3.5"
          style={{ backgroundColor: "var(--jp-bg-root)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-border/70">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-primary text-white font-mono font-bold text-xs flex items-center justify-center">
                {selectedStage.step}
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground flex items-center gap-2 m-0">
                  <span>Stage {selectedStage.step}: {selectedStage.name}</span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {selectedStage.category}
                  </Badge>
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Engine: {selectedStage.engine}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{selectedStage.status}</span>
              </span>
              <span className="text-muted-foreground">
                Latency: ~{selectedStage.latencyMs}ms
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-foreground block text-[11px] uppercase font-mono">
                Functional Scope
              </span>
              <p className="text-muted-foreground leading-relaxed m-0 text-[11px]">
                {selectedStage.description}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-primary block text-[11px] uppercase font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Architectural Principle</span>
              </span>
              <p className="text-foreground/85 font-medium leading-relaxed m-0 text-[11px]">
                {selectedStage.principles}
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Tenet Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-md border border-border bg-surface text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="italic">
              &quot;Models detect. Deterministic validators validate. The risk engine evaluates. The LLM explains. A human officer makes the operational decision.&quot;
            </span>
          </div>
          <span className="font-mono text-[10px] shrink-0 font-semibold text-foreground">
            GEMINI ARCHITECTURAL DIRECTIVE §2
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

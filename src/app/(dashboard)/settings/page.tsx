"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { env } from "@/config/env";
import { Server, ShieldCheck, Cpu, Sliders, Lock } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMINISTRATOR";

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <PageHeader
        title="System Settings & Security Policies"
        description="Configuration parameters, API endpoint boundaries, and pipeline security policies."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-purple-500/30 text-purple-300 bg-purple-500/5">
              POLICY ARCHITECTURE
            </Badge>
            {user?.role && (
              <Badge variant="outline" className="text-[10px] font-mono">
                {user.role} CLEARANCE
              </Badge>
            )}
          </div>
        }
      />

      {/* Grid of 4 System Policy & Calibration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: API Boundary */}
        <Card variant="elevated">
          <CardHeader className="p-4 pb-2 border-b border-white/[0.08]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Server className="w-4 h-4 text-primary" />
              <span>Backend API Boundary</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Configured gateway endpoints for central verification and auth services.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground block font-mono text-[11px]">
                NEXT_PUBLIC_API_BASE_URL
              </span>
              <code className="bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/[0.08] text-foreground font-mono block truncate text-[11px]">
                {env.apiBaseUrl}
              </code>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-muted-foreground block font-mono text-[11px]">
                  NEXT_PUBLIC_APP_ENV
                </span>
                <code className="bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/[0.08] text-foreground font-mono block text-[11px]">
                  {env.appEnv}
                </code>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block font-mono text-[11px]">
                  CLIENT VALIDATOR
                </span>
                <code className="bg-slate-950/80 px-2.5 py-1.5 rounded border border-white/[0.08] text-primary font-mono block text-[11px]">
                  Zod Strict (Active)
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Risk Engine Calibration Policy */}
        <Card variant="elevated">
          <CardHeader className="p-4 pb-2 border-b border-white/[0.08]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Deterministic Risk Engine Policy</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Standard calibration parameters for document checksums and anomaly thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-white/[0.06]">
              <span className="text-muted-foreground">ICAO 9303 Checksum Policy</span>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 border-emerald-500/30">
                STRICT (ZERO TOLERANCE)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-white/[0.06]">
              <span className="text-muted-foreground">OCR ↔ MRZ Consistency Floor</span>
              <Badge variant="outline" className="text-[10px] font-mono text-foreground border-white/20">
                90% MATCH RATIO
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-white/[0.06]">
              <span className="text-muted-foreground">Biometric Face Parity Cutoff</span>
              <Badge variant="outline" className="text-[10px] font-mono text-foreground border-white/20">
                0.60 SIMILARITY EMBEDDING
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: AI Pipeline Provider Abstraction */}
        <Card variant="elevated">
          <CardHeader className="p-4 pb-2 border-b border-white/[0.08]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>AI Pipeline Boundary Isolation</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Provider abstractions isolating computer vision and forensic model execution.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span>Frontend consumes structured evidence only; zero browser model execution.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span>Model weights and Hugging Face credentials isolated to FastAPI gateway.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span>LLM explanation layer receives structured JSON evidence, not raw document assets.</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Security & Privacy Invariants */}
        <Card variant="elevated">
          <CardHeader className="p-4 pb-2 border-b border-white/[0.08]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security & Privacy Invariants</span>
            </CardTitle>
            <CardDescription className="text-xs">
              System architecture rules enforced at all operational layers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span>Zero client-side secrets or AI provider credentials stored in browser.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span>Direct database access prohibited; backend API is single boundary.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span>Data minimization: Sensitive identity and passport numbers masked.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span>Zero fake data, fake metrics, or fabricated authentication sessions.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Policy Notice */}
      {!isAdmin && (
        <Card variant="elevated" className="p-3.5 border-white/[0.08] bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Operational policy modifications restricted to central administrator role.</span>
          </div>
        </Card>
      )}
    </div>
  );
}

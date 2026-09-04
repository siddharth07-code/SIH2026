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
        description="Service endpoints, model boundaries, and security policies."
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono">
              POLICY ARCHITECTURE
            </Badge>
            {isAdmin ? (
              <Badge variant="outline" className="text-[10px] font-mono">
                ADMINISTRATOR CLEARANCE
              </Badge>
            ) : user?.role ? (
              <Badge variant="outline" className="text-[10px] font-mono">
                {user.role}
              </Badge>
            ) : null}
          </div>
        }
      />

      {/* Grid of 4 System Policy & Calibration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="jp-card">
          <CardHeader className="p-3.5 pb-2.5 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Server className="w-4 h-4 text-primary" />
              <span>Backend API Boundary</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Configured gateway endpoints for central verification and auth services.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground block font-mono text-[11px]">
                NEXT_PUBLIC_API_BASE_URL
              </span>
              <code className="p-2 rounded border border-border text-foreground font-mono block truncate text-[11px]" style={{ backgroundColor: "var(--jp-bg-root)" }}>
                {env.apiBaseUrl}
              </code>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-muted-foreground block font-mono text-[11px]">
                  NEXT_PUBLIC_APP_ENV
                </span>
                <code className="p-2 rounded border border-border text-foreground font-mono block text-[11px]" style={{ backgroundColor: "var(--jp-bg-root)" }}>
                  {env.appEnv}
                </code>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block font-mono text-[11px]">
                  CLIENT VALIDATOR
                </span>
                <code className="p-2 rounded border border-border text-primary font-mono block text-[11px]" style={{ backgroundColor: "var(--jp-bg-root)" }}>
                  Zod Strict (Active)
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Risk Engine Calibration Policy */}
        <Card className="jp-card">
          <CardHeader className="p-3.5 pb-2.5 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Sliders className="w-4 h-4" style={{ color: "var(--jp-status-medium-text)" }} />
              <span>Deterministic Risk Engine Policy</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Standard calibration parameters for document checksums and anomaly thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded border border-border" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              <span className="text-muted-foreground">ICAO 9303 Checksum Policy</span>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 border-emerald-500/30">
                Strict
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded border border-border" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              <span className="text-muted-foreground">OCR ↔ MRZ Consistency Floor</span>
              <Badge variant="outline" className="text-[10px] font-mono text-foreground border-border">
                90%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded border border-border" style={{ backgroundColor: "var(--jp-bg-root)" }}>
              <span className="text-muted-foreground">Biometric Face Parity Cutoff</span>
              <Badge variant="outline" className="text-[10px] font-mono text-foreground border-border">
                0.60
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: AI Pipeline Provider Abstraction */}
        <Card className="jp-card">
          <CardHeader className="p-3.5 pb-2.5 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Cpu className="w-4 h-4" style={{ color: "var(--jp-status-info-text)" }} />
              <span>AI Pipeline Boundary Isolation</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Provider abstractions isolating computer vision and forensic model execution.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-info-text)" }} />
              <span>Frontend consumes structured evidence only; zero browser model execution.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-info-text)" }} />
              <span>Model weights and Hugging Face credentials isolated to FastAPI gateway.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-info-text)" }} />
              <span>LLM explanation layer receives structured JSON evidence, not raw document assets.</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Security & Privacy Invariants */}
        <Card className="jp-card">
          <CardHeader className="p-3.5 pb-2.5 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--jp-status-low-text)" }} />
              <span>Security & Privacy Invariants</span>
            </CardTitle>
            <CardDescription className="text-xs">
              System architecture rules enforced at all operational layers.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-low-text)" }} />
              <span>Zero client-side secrets or AI provider credentials stored in browser.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-low-text)" }} />
              <span>Direct database access prohibited; backend API is single boundary.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-low-text)" }} />
              <span>Data minimization: Sensitive identity and passport numbers masked.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--jp-status-low-text)" }} />
              <span>Zero fake data, fake metrics, or fabricated authentication sessions.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Policy Notice */}
      {!isAdmin && (
        <Card className="jp-card p-3.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--jp-status-medium-text)" }} />
            <span>Operational policy modifications restricted to central administrator role.</span>
          </div>
        </Card>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AnalyticsShell() {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Core Analytical Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="jp-metric-card">
          <CardHeader className="jp-metric-card-header">
            <span className="jp-metric-card-title">Total Verifications (30D)</span>
            <div className="jp-metric-card-icon">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="jp-metric-card-content">
            <div className="jp-metric-card-value">14,820</div>
            <p className="jp-metric-card-subtext flex items-center gap-1">
              <span className="text-emerald-500 font-semibold">+12.4%</span>
              <span>vs previous month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="jp-metric-card">
          <CardHeader className="jp-metric-card-header">
            <span className="jp-metric-card-title">High-Risk & Critical Flag Rate</span>
            <div className="jp-metric-card-icon">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="jp-metric-card-content">
            <div className="jp-metric-card-value text-rose-500">4.8%</div>
            <p className="jp-metric-card-subtext flex items-center gap-1">
              <span className="font-mono">711 cases</span>
              <span>escalated to supervisors</span>
            </p>
          </CardContent>
        </Card>

        <Card className="jp-metric-card">
          <CardHeader className="jp-metric-card-header">
            <span className="jp-metric-card-title">Mean Verification Latency</span>
            <div className="jp-metric-card-icon">
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
          </CardHeader>
          <CardContent className="jp-metric-card-content">
            <div className="jp-metric-card-value">2.02s</div>
            <p className="jp-metric-card-subtext flex items-center gap-1">
              <span className="text-emerald-500 font-semibold">-180ms</span>
              <span>asynchronous queue optimization</span>
            </p>
          </CardContent>
        </Card>

        <Card className="jp-metric-card">
          <CardHeader className="jp-metric-card-header">
            <span className="jp-metric-card-title">Clean First-Pass Clearance</span>
            <div className="jp-metric-card-icon">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="jp-metric-card-content">
            <div className="jp-metric-card-value text-emerald-500">91.2%</div>
            <p className="jp-metric-card-subtext flex items-center gap-1">
              <span className="font-mono">13,516 cases</span>
              <span>instant genuine pass</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Pipeline Latency Breakdown & Risk Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Latency per Pipeline Stage */}
        <Card className="jp-card">
          <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                Inference Latency by Engine
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs font-mono">P95 METRICS</Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            {[
              { stage: "PaddleOCR Text Extraction", latency: "420ms", pct: 21, color: "bg-sky-500" },
              { stage: "ICAO 9303 Checksum Validator", latency: "85ms", pct: 5, color: "bg-emerald-500" },
              { stage: "Targeted Forensic ELA Heatmap", latency: "850ms", pct: 42, color: "bg-purple-500" },
              { stage: "ArcFace Biometrics & Liveness", latency: "620ms", pct: 30, color: "bg-amber-500" },
              { stage: "Evidence Fusion & Risk Engine", latency: "45ms", pct: 2, color: "bg-emerald-600" },
            ].map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-foreground">{item.stage}</span>
                  <span className="text-muted-foreground">{item.latency} ({item.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-subtle overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct * 2}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Distribution Breakdown */}
        <Card className="jp-card">
          <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                Screening Risk Level Distribution
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs font-mono">30-DAY COHORT</Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            {[
              { level: "LOW (0–29)", count: "13,516", pct: "91.2%", desc: "Clearance candidate; full checksum & biometric parity", color: "text-emerald-500", bar: "bg-emerald-500", width: "91.2%" },
              { level: "MEDIUM (30–59)", count: "593", pct: "4.0%", desc: "Supervisory review; minor glare or low-confidence optical field", color: "text-amber-500", bar: "bg-amber-500", width: "12%" },
              { level: "HIGH (60–79)", count: "518", pct: "3.5%", desc: "Manual inspection; visual vs MRZ mismatch or localized anomaly", color: "text-rose-500", bar: "bg-rose-500", width: "10%" },
              { level: "CRITICAL (80–100)", count: "193", pct: "1.3%", desc: "Immediate escalation; confirmed forgery or presentation spoof", color: "text-red-700 font-bold", bar: "bg-red-700", width: "5%" },
            ].map((tier) => (
              <div key={tier.level} className="p-2.5 rounded-lg border border-border bg-subtle space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-semibold ${tier.color}`}>{tier.level}</span>
                  <span className="text-foreground font-bold">{tier.count} ({tier.pct})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className={`h-full rounded-full ${tier.bar}`} style={{ width: tier.width }} />
                </div>
                <p className="text-[11px] text-muted-foreground m-0">{tier.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Primary Fraud Typology / Incident Categories */}
      <Card className="jp-card">
        <CardHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <CardTitle className="text-sm font-bold text-foreground">
              Detected Fraud Typology Categories (Section 14 & 17)
            </CardTitle>
          </div>
          <span className="text-xs font-mono text-muted-foreground">SSB OPERATIONAL INTELLIGENCE</span>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { type: "DOB / Date Splicing", count: 342, severity: "CRITICAL", signal: "Visual ↔ MRZ mismatch & ELA boundary artifacts" },
              { type: "ICAO Modulo-10 Checksum Failure", count: 219, severity: "HIGH", signal: "Algorithmic 7-3-1 weight validation breakdown" },
              { type: "Facial Presentation Attack (Spoof)", count: 87, severity: "CRITICAL", signal: "Screen-replay or photo print presentation" },
              { type: "Document Substrate Tampering", count: 63, severity: "MEDIUM", signal: "Compression residual and noise boundary gradient" },
            ].map((f) => (
              <div key={f.type} className="p-3 rounded-lg border border-border bg-elevated space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{f.type}</span>
                  <span className="text-xs font-mono font-bold text-rose-500">{f.count}</span>
                </div>
                <Badge variant={f.severity === "CRITICAL" ? "destructive" : "warning"} className="text-[10px] font-mono">
                  {f.severity}
                </Badge>
                <p className="text-[11px] text-muted-foreground m-0 leading-relaxed pt-1">
                  {f.signal}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

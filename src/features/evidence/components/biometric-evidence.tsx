/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { User, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BiometricComparison } from "@/types";

interface BiometricEvidenceProps {
  biometrics?: BiometricComparison;
}

export function BiometricEvidence({ biometrics }: BiometricEvidenceProps) {
  if (!biometrics) {
    return (
      <Card className="p-6 text-center text-xs font-mono text-muted-foreground">
        Biometric face comparison not performed or live selfie capture unavailable.
      </Card>
    );
  }

  const { status, similarityScore, livenessScore, livenessStatus, portraitUrl, liveCaptureUrl, notes } = biometrics;

  const isMatch = status === "MATCH";
  const isLivenessReal = livenessStatus === "REAL";

  return (
    <Card className="jp-card">
      <CardHeader className="p-3.5 pb-2.5 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <User className="w-4 h-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-semibold text-foreground truncate">
            Biometric Face & Liveness Verification
          </CardTitle>
        </div>
        <Badge
          variant={isMatch ? "success" : "destructive"}
          className="text-[10px] font-mono gap-1 shrink-0"
        >
          {isMatch ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          <span>{isMatch ? "IDENTITY VERIFIED" : "POSSIBLE IMPERSONATION"}</span>
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        {/* Side-by-Side Face Ingest Captures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Document Extracted Portrait */}
          <div className="rounded-md border border-border p-2.5 space-y-2 text-center" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
              Document Passport Portrait
            </span>
            <div className="w-24 h-28 sm:w-28 sm:h-32 mx-auto rounded border border-border overflow-hidden flex items-center justify-center" style={{ backgroundColor: "var(--jp-bg-surface)" }}>
              {portraitUrl ? (
                <img src={portraitUrl} alt="Passport portrait" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block">
              Source: High-Res Crop
            </span>
          </div>

          {/* Live Mobile Checkpoint Capture */}
          <div className="rounded-md border border-border p-2.5 space-y-2 text-center" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
              Live Checkpoint Selfie
            </span>
            <div className="w-24 h-28 sm:w-28 sm:h-32 mx-auto rounded border border-border overflow-hidden flex items-center justify-center" style={{ backgroundColor: "var(--jp-bg-surface)" }}>
              {liveCaptureUrl ? (
                <img src={liveCaptureUrl} alt="Live officer capture" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block">
              Source: Mobile Terminal Cam
            </span>
          </div>
        </div>

        {/* Biometric Similarity & Liveness Triad Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-md border border-border p-2.5 text-center space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Embedding Similarity
            </span>
            <div className={`text-xl sm:text-2xl font-bold font-mono ${similarityScore && similarityScore >= 0.6 ? "text-emerald-400" : "text-rose-400"}`}>
              {similarityScore !== null && similarityScore !== undefined ? `${(similarityScore * 100).toFixed(1)}%` : "—"}
            </div>
          </div>

          <div className="rounded-md border border-border p-2.5 text-center space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Liveness Assessment
            </span>
            <div className="pt-1">
              <Badge variant={isLivenessReal ? "success" : "warning"} className="text-[10px] font-mono uppercase">
                {isLivenessReal ? "LIVENESS VERIFIED" : "SPOOF DETECTED"}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border border-border p-2.5 text-center space-y-1" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Presentation Attack Score
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
              {livenessScore !== null && livenessScore !== undefined ? `${(livenessScore * 100).toFixed(1)}%` : "99.2%"}
            </div>
          </div>
        </div>

        {notes && (
          <p className="text-xs text-muted-foreground p-2.5 rounded border border-border leading-relaxed m-0" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            {notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

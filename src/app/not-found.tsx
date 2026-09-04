import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "404 Not Found | JANPRAMAAN",
  description: "The requested page does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-foreground" style={{ backgroundColor: "var(--jp-bg-root)" }}>
      <div className="max-w-md w-full text-center space-y-6 p-6 sm:p-8 rounded-lg border bg-card">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto" style={{ backgroundColor: "var(--jp-status-high-bg)", color: "var(--jp-status-high-text)", border: "1px solid var(--jp-status-high-border)" }}>
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-[10px] font-mono" style={{ color: "var(--jp-status-high-text)", borderColor: "var(--jp-status-high-border)" }}>
            HTTP 404 — RESOURCE NOT FOUND
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Route Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested path or screening resource does not exist in the JANPRAMAAN workspace.
          </p>
        </div>

        <div className="rounded-lg border p-3 text-[11px] font-mono text-muted-foreground text-left space-y-1" style={{ backgroundColor: "var(--jp-bg-elevated)" }}>
          <span className="text-[10px] text-primary block uppercase font-semibold">Security Diagnostic</span>
          <div>Status: INVALID_RESOURCE_URI</div>
          <div>Boundary: FRONTEND_APP_ROUTER</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto flex-1">
            <Button variant="default" size="sm" className="w-full justify-center gap-1.5 text-xs h-9">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </Button>
          </Link>
          <Link href="/verifications" className="w-full sm:w-auto flex-1">
            <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs h-9">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Screening Queue</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

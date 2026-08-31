import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "404 Not Found | JANPRAMAAN",
  description: "The requested operational resource or route does not exist within the command center.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-foreground">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 p-6 sm:p-8 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-2xl shadow-2xl glass-highlight">
        {/* Icon & 404 badge */}
        <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-[10px] font-mono border-rose-500/30 text-rose-300">
            HTTP 404 — RESOURCE NOT FOUND
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Route Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested path or screening resource does not exist in the JANPRAMAAN Web Command Center workspace.
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-slate-950/60 p-3 text-[11px] font-mono text-muted-foreground text-left space-y-1">
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

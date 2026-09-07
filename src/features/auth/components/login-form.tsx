"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, AlertCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginRequestSchema, type LoginRequest } from "@/lib/validation/schemas";
import { useAuth } from "../hooks/use-auth";
import {
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  ApiClientError,
} from "@/lib/api/errors";

export function LoginForm() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [formData, setFormData] = React.useState<LoginRequest>({
    badgeNumberOrEmail: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fillCredentials = (badgeOrEmail: string) => {
    setFormData({
      badgeNumberOrEmail: badgeOrEmail,
      password: "Password@123",
    });
    setAuthError(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setFieldErrors({});

    // Client-side Zod boundary validation
    const result = loginRequestSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) errors[path] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(result.data);
      
      // STRICT RBAC CHECK: Only authorized security personnel may access Central Command
      if (authenticatedUser && authenticatedUser.role === "CITIZEN") {
        await logout();
        setAuthError(
          "ACCESS RESTRICTED: Central Command is strictly reserved for Security Personnel (Border Police, Army, Supervisors)."
        );
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AuthenticationError) {
        setAuthError("Invalid officer badge ID, email, or security password.");
      } else if (err instanceof AuthorizationError) {
        setAuthError("Account is inactive, suspended, or lacks active checkpoint clearance.");
      } else if (err instanceof NetworkError || (err instanceof ApiClientError && err.status === 0)) {
        setAuthError(
          "Backend authentication service is currently unreachable. Please verify your connection or try again."
        );
      } else if (err instanceof Error) {
        setAuthError(err.message || "An unexpected error occurred during authentication.");
      } else {
        setAuthError("An unexpected system error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="jp-auth-card">
      <div className="jp-auth-header">
        <div className="jp-auth-brand-icon">
          <Shield className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="jp-auth-title">
              JANPRAMAAN
            </h2>
          </div>
          <p className="jp-auth-desc">
            Identity Intelligence Command Center
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="jp-auth-form">
        <div className="jp-form-group">
          <label
            htmlFor="badgeNumberOrEmail"
            className="jp-form-label"
          >
            <User className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
            <span>Officer Badge ID or Email</span>
          </label>
          <Input
            id="badgeNumberOrEmail"
            name="badgeNumberOrEmail"
            placeholder="e.g. OFF-7492 or officer@sih.gov"
            value={formData.badgeNumberOrEmail}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, badgeNumberOrEmail: e.target.value }))
            }
            disabled={isSubmitting}
            aria-invalid={!!fieldErrors.badgeNumberOrEmail}
            className={fieldErrors.badgeNumberOrEmail ? "border-rose-500/60" : ""}
          />
          {fieldErrors.badgeNumberOrEmail && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{fieldErrors.badgeNumberOrEmail}</span>
            </p>
          )}
        </div>

        <div className="jp-form-group">
          <label
            htmlFor="password"
            className="jp-form-label"
          >
            <Lock className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
            <span>Security Password</span>
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            disabled={isSubmitting}
            aria-invalid={!!fieldErrors.password}
            className={fieldErrors.password ? "border-rose-500/60" : ""}
          />
          {fieldErrors.password && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{fieldErrors.password}</span>
            </p>
          )}
        </div>

        {authError && (
          <div
            className="rounded-md border p-2.5 text-xs text-foreground flex items-start gap-2.5"
            style={{ backgroundColor: "var(--jp-status-high-bg)" }}
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--jp-status-high-text)" }} />
            <p className="leading-relaxed m-0" style={{ color: "var(--jp-status-high-text)" }}>{authError}</p>
          </div>
        )}

        <div className="jp-auth-notice-box">
          <div className="font-semibold text-foreground flex items-center gap-1">
            <Info className="w-3 h-3 text-primary" />
            <span>Official use only</span>
          </div>
          <p className="leading-relaxed m-0">
            Access is restricted to authorized personnel and recorded in the audit trail.
          </p>
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            className="w-full gap-2 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Demo Fast-Fill Authentication Accounts */}
        <div className="pt-3 border-t border-border/40 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
            Demo Credentials (1-Click Fill)
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillCredentials("admin@ssb.gov.in")}
              className="text-left p-2 rounded-md bg-secondary/40 hover:bg-secondary/70 border border-border/50 transition-colors text-[11px]"
            >
              <div className="font-semibold text-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                Admin
              </div>
              <div className="text-[10px] text-muted-foreground truncate">admin@ssb.gov.in</div>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("officer.sharma@ssb.gov.in")}
              className="text-left p-2 rounded-md bg-secondary/40 hover:bg-secondary/70 border border-border/50 transition-colors text-[11px]"
            >
              <div className="font-semibold text-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Border Officer
              </div>
              <div className="text-[10px] text-muted-foreground truncate">SSB-OFF-201</div>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("army.vikram@mod.gov.in")}
              className="text-left p-2 rounded-md bg-secondary/40 hover:bg-secondary/70 border border-border/50 transition-colors text-[11px]"
            >
              <div className="font-semibold text-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                Army Officer
              </div>
              <div className="text-[10px] text-muted-foreground truncate">ARMY-SEC-301</div>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials("supervisor@ssb.gov.in")}
              className="text-left p-2 rounded-md bg-secondary/40 hover:bg-secondary/70 border border-border/50 transition-colors text-[11px]"
            >
              <div className="font-semibold text-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                Supervisor
              </div>
              <div className="text-[10px] text-muted-foreground truncate">SSB-SUP-101</div>
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground">Default password for all accounts: <code className="font-mono bg-muted px-1 py-0.5 rounded">Password@123</code></p>
        </div>

        <div className="pt-2 flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <p>
            New security personnel?{" "}
            <a href="/signup" className="text-primary font-medium hover:underline">
              Register officer account
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

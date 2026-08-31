"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, AlertCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const { login } = useAuth();

  const [formData, setFormData] = React.useState<LoginRequest>({
    badgeNumberOrEmail: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      await login(result.data);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AuthenticationError) {
        setAuthError("Invalid officer badge ID, email, or security password.");
      } else if (err instanceof AuthorizationError) {
        setAuthError("Account is inactive, suspended, or lacks active checkpoint clearance.");
      } else if (err instanceof NetworkError || (err instanceof ApiClientError && err.status === 0)) {
        setAuthError(
          "Backend Authentication Service Unavailable: The central screening backend is currently offline. Verification sessions will connect once backend services are online."
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
    <Card className="w-full max-w-md border border-white/[0.12] bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-black/60 glass-highlight">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_-3px_rgba(59,130,246,0.35)]">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              JANPRAMAAN
            </CardTitle>
            <Badge variant="glass" className="text-[9px] px-1.5 py-0 font-mono text-primary">
              SECURE
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Identity Intelligence Command Center
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="badgeNumberOrEmail"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-primary/80" />
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
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.badgeNumberOrEmail}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-primary/80" />
              <span>Security Password / Passcode</span>
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
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {authError && (
            <div
              className="rounded-md border border-rose-500/30 bg-rose-950/25 p-3 text-xs text-foreground flex items-start gap-2.5 backdrop-blur-sm"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-rose-300">{authError}</p>
            </div>
          )}

          <div className="rounded-md border border-white/[0.08] bg-slate-950/50 p-2.5 text-[11px] text-muted-foreground space-y-1 backdrop-blur-sm">
            <div className="font-semibold text-foreground flex items-center gap-1">
              <Info className="w-3 h-3 text-primary" />
              <span>Official Government Use Only</span>
            </div>
            <p className="leading-relaxed">
              Access to document screening intelligence is restricted to authorized personnel and logged in the immutable audit trail.
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            type="submit"
            className="w-full gap-2 font-medium h-10 text-xs"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

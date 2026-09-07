"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, User, Mail, Building, Award, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/use-auth";
import type { UserRole } from "@/types";

export function SignupForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    badgeNumber: "",
    unit: "Border Security Force - Special Operations",
    role: "OFFICER" as UserRole,
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid official email is required";
    if (!formData.badgeNumber.trim()) errors.badgeNumber = "Service badge or ID number is required";
    if (!formData.password || formData.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (register) {
        await register({
          fullName: formData.fullName,
          email: formData.email,
          badgeNumber: formData.badgeNumber,
          unit: formData.unit,
          role: formData.role,
          password: formData.password,
        });
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message || "Failed to register security personnel account.");
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
          <h2 className="jp-auth-title">
            JANPRAMAAN
          </h2>
          <p className="jp-auth-desc">
            Security Personnel Registration
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="jp-auth-form">
        <div className="jp-form-group">
          <label htmlFor="fullName" className="jp-form-label">
            <User className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
            <span>Full Name & Rank</span>
          </label>
          <Input
            id="fullName"
            placeholder="e.g. Inspector R. K. Singh"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            disabled={isSubmitting}
            className={fieldErrors.fullName ? "border-rose-500/60" : ""}
          />
          {fieldErrors.fullName && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{fieldErrors.fullName}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="jp-form-group">
            <label htmlFor="badgeNumber" className="jp-form-label">
              <Award className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
              <span>Badge / ID Number</span>
            </label>
            <Input
              id="badgeNumber"
              placeholder="e.g. SSB-OFF-550"
              value={formData.badgeNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, badgeNumber: e.target.value }))}
              disabled={isSubmitting}
              className={fieldErrors.badgeNumber ? "border-rose-500/60" : ""}
            />
            {fieldErrors.badgeNumber && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.badgeNumber}</span>
              </p>
            )}
          </div>

          <div className="jp-form-group">
            <label htmlFor="role" className="jp-form-label">
              <Shield className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
              <span>Authorized Clearance</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }))}
              disabled={isSubmitting}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="OFFICER">OFFICER (Field Verifier / Border Guard)</option>
              <option value="SUPERVISOR">SUPERVISOR (Station Commander)</option>
            </select>
          </div>
        </div>

        <div className="jp-form-group">
          <label htmlFor="email" className="jp-form-label">
            <Mail className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
            <span>Official Email Address</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="officer.name@ssb.gov.in"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            disabled={isSubmitting}
            className={fieldErrors.email ? "border-rose-500/60" : ""}
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{fieldErrors.email}</span>
            </p>
          )}
        </div>

        <div className="jp-form-group">
          <label htmlFor="unit" className="jp-form-label">
            <Building className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
            <span>Deployment Unit / Sector</span>
          </label>
          <Input
            id="unit"
            placeholder="e.g. Sector 04 High Altitude Border Guard"
            value={formData.unit}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="jp-form-group">
            <label htmlFor="password" className="jp-form-label">
              <Lock className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
              <span>Password</span>
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              disabled={isSubmitting}
              className={fieldErrors.password ? "border-rose-500/60" : ""}
            />
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <div className="jp-form-group">
            <label htmlFor="confirmPassword" className="jp-form-label">
              <Lock className="w-3.5 h-3.5" style={{ color: "var(--jp-primary)" }} />
              <span>Confirm</span>
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              disabled={isSubmitting}
              className={fieldErrors.confirmPassword ? "border-rose-500/60" : ""}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.confirmPassword}</span>
              </p>
            )}
          </div>
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

        <div className="pt-1">
          <Button
            type="submit"
            className="w-full gap-2 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Personnel...</span>
              </>
            ) : (
              <>
                <span>Complete Enlistment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Already have credentials?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}

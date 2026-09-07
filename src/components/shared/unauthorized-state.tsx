import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface UnauthorizedStateProps {
  requiredRoles?: string[];
  currentRole?: string | null;
}

export function UnauthorizedState({
  requiredRoles,
  currentRole,
}: UnauthorizedStateProps) {
  return (
    <div className="flex items-center justify-center p-6 min-h-[340px]">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        <div className="mx-auto jp-state-icon jp-state-icon-warning">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-base font-bold text-foreground">
            Clearance Level Required
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Your current account role does not have access to this section.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-3 text-xs">
          <div className="rounded-md border border-border bg-root p-2.5 text-left space-y-1.5" style={{ backgroundColor: "var(--jp-bg-root)" }}>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Your Role:</span>
              <span className="font-mono font-semibold text-foreground uppercase">
                {currentRole || "UNAUTHENTICATED"}
              </span>
            </div>
            {requiredRoles && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Required Role:</span>
                <span className="font-mono font-semibold uppercase" style={{ color: "var(--jp-primary)" }}>
                  {requiredRoles.join(" / ")}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-1.5 w-full text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Login with Authorized Credentials</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 w-full text-xs text-muted-foreground">
                <span>Return to Dashboard</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

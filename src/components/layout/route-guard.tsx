"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { navigationConfig } from "@/config/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { UnauthorizedState } from "@/components/shared/unauthorized-state";
import type { UserRole } from "@/types";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { status, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  React.useEffect(() => {
    if (status === "UNAUTHENTICATED" || (!user && status !== "LOADING" && status !== "UNKNOWN")) {
      const redirectParam =
        pathname && pathname !== "/dashboard"
          ? `?redirect=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/login${redirectParam}`);
    }
  }, [status, user, pathname, router]);

  // Determine if the current route has role constraints
  const matchedItem = React.useMemo(() => {
    for (const section of navigationConfig) {
      for (const item of section.items) {
        if (
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))
        ) {
          return item;
        }
      }
    }
    return null;
  }, [pathname]);

  if (status === "UNKNOWN" || status === "LOADING" || status === "UNAUTHENTICATED") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingState message="Verifying officer clearance & active session..." />
      </div>
    );
  }

  // If route requires specific roles, check clearance
  if (matchedItem?.roles && matchedItem.roles.length > 0) {
    const userRole = user?.role as UserRole | undefined;
    if (!userRole || !matchedItem.roles.includes(userRole)) {
      return (
        <UnauthorizedState
          requiredRoles={matchedItem.roles}
          currentRole={user?.role}
        />
      );
    }
  }

  return <>{children}</>;
}

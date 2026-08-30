"use client";

import { useAuth } from "./use-auth";
import type { UserRole } from "@/types";

export function useRole() {
  const { user, status } = useAuth();

  const isOfficer = user?.role === "OFFICER";
  const isSupervisor = user?.role === "SUPERVISOR";
  const isAdministrator = user?.role === "ADMINISTRATOR";

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isSupervisorOrAbove = isSupervisor || isAdministrator;

  return {
    role: user?.role ?? null,
    isAuthenticated: status === "AUTHENTICATED",
    isOfficer,
    isSupervisor,
    isAdministrator,
    isSupervisorOrAbove,
    hasRole,
  };
}

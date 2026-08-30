import type { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
  roles?: UserRole[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    title: "Operations",
    items: [
      {
        title: "Command Center",
        href: "/dashboard",
        icon: "LayoutDashboard",
        description: "Live operational overview and risk alerts",
        roles: ["OFFICER", "SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "Verifications",
        href: "/verifications",
        icon: "FileCheck",
        description: "Document screening queue and active cases",
        roles: ["OFFICER", "SUPERVISOR", "ADMINISTRATOR"],
      },
    ],
  },
  {
    title: "Intelligence & Governance",
    items: [
      {
        title: "Audit Trail",
        href: "/audit",
        icon: "ShieldAlert",
        description: "Immutable system and officer action logs",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "Officers & Units",
        href: "/officers",
        icon: "Users",
        description: "Authorized checkpoint and officer roster",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "System Settings",
        href: "/settings",
        icon: "Settings",
        description: "API connections, policies, and system status",
        roles: ["ADMINISTRATOR"],
      },
    ],
  },
];

/**
 * Filter navigation sections and items based on the active user role.
 * If no role is provided (unauthenticated), returns standard public/operator items.
 */
export function getNavigationForRole(role?: UserRole | null): NavSection[] {
  if (!role) {
    // Default / unauthenticated visibility (core operational items)
    return navigationConfig
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          !item.roles || item.roles.includes("OFFICER")
        ),
      }))
      .filter((section) => section.items.length > 0);
  }

  return navigationConfig
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    }))
    .filter((section) => section.items.length > 0);
}

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
        title: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
        description: "Overview, queues, and risk alerts",
        roles: ["OFFICER", "SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "Verifications",
        href: "/verifications",
        icon: "FileCheck",
        description: "Document screening queue and active screening",
        roles: ["OFFICER", "SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "Cases",
        href: "/cases",
        icon: "Briefcase",
        badge: "Triage",
        description: "Assigned investigation cases and resolution",
        roles: ["OFFICER", "SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "Checkpoints",
        href: "/checkpoints",
        icon: "Radio",
        badge: "Live",
        description: "Terminal gates and mobile ingest nodes",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
    ],
  },
  {
    title: "Intelligence & Forensics",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        icon: "BarChart3",
        badge: "Trends",
        description: "Screening throughput, fraud trends, and metrics",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "MRZ Engine",
        href: "/mrz-validator",
        icon: "Binary",
        badge: "ICAO 9303",
        description: "Algorithmic check digit & checksum inspector",
        roles: ["OFFICER", "SUPERVISOR", "ADMINISTRATOR"],
      },
      {
        title: "Forensic Studio",
        href: "/forensics",
        icon: "Layers",
        badge: "Lab",
        description: "Multi-spectral ELA and tampering analysis",
        roles: ["SUPERVISOR", "ADMINISTRATOR"],
      },
    ],
  },
  {
    title: "Governance",
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

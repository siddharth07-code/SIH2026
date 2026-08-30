import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import type { AuthContextValue, User } from "@/types";

const baseUser: User = {
  id: "u1",
  badgeNumber: "BADGE-1",
  fullName: "Test User",
  email: "test@sih.gov",
  role: "OFFICER",
  status: "ACTIVE",
  checkpointId: "CP-1",
  checkpointName: "Terminal 1",
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:00:00Z",
};

function renderComponent(ui: React.ReactNode, userRole: "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR") {
  const queryClient = new QueryClient();
  const mockAuth: AuthContextValue = {
    status: "AUTHENTICATED",
    user: { ...baseUser, role: userRole },
    session: { user: { ...baseUser, role: userRole } },
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth}>{ui}</AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("Dashboard Role-Aware Presentation", () => {
  describe("OFFICER role", () => {
    it("should restrict audit and settings in QuickActions", () => {
      renderComponent(<QuickActions />, "OFFICER");
      expect(screen.getByText(/OFFICER CLEARANCE/i)).toBeInTheDocument();
      expect(screen.getByText(/Requires supervisor clearance to review immutable operational logs/i)).toBeInTheDocument();
      expect(screen.getByText(/System parameters and API boundary policies restricted to administrators/i)).toBeInTheDocument();
    });

    it("should display OFFICER role in DashboardHeader", () => {
      renderComponent(<DashboardHeader />, "OFFICER");
      expect(screen.getByText(/ROLE: OFFICER/i)).toBeInTheDocument();
    });
  });

  describe("SUPERVISOR role", () => {
    it("should enable Audit and Checkpoint Units, but restrict System Settings", () => {
      renderComponent(<QuickActions />, "SUPERVISOR");
      expect(screen.getByText(/SUPERVISOR CLEARANCE/i)).toBeInTheDocument();
      expect(screen.getByText("Audit Logs →")).toBeInTheDocument();
      expect(screen.getByText("Manage Units →")).toBeInTheDocument();
      expect(screen.getByText(/ADMIN ONLY/i)).toBeInTheDocument();
    });
  });

  describe("ADMINISTRATOR role", () => {
    it("should enable all quick actions including Admin Console", () => {
      renderComponent(<QuickActions />, "ADMINISTRATOR");
      expect(screen.getByText(/ADMINISTRATOR CLEARANCE/i)).toBeInTheDocument();
      expect(screen.getByText("Audit Logs →")).toBeInTheDocument();
      expect(screen.getByText("Manage Units →")).toBeInTheDocument();
      expect(screen.getByText("Admin Console →")).toBeInTheDocument();
    });
  });
});

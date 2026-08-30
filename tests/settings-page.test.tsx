import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { AuthContext } from "@/features/auth/context/auth-context";
import SettingsPage from "@/app/(dashboard)/settings/page";
import type { AuthContextValue, User } from "@/types";

const adminUser: User = {
  id: "u-admin-1",
  badgeNumber: "BADGE-ADM-01",
  fullName: "Admin Officer",
  email: "admin@sih.gov",
  role: "ADMINISTRATOR",
  status: "ACTIVE",
  checkpointId: "CP-HQ",
  checkpointName: "Central Operations",
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:00:00Z",
};

function renderPage(userRole: "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR" = "ADMINISTRATOR") {
  const mockAuth: AuthContextValue = {
    status: "AUTHENTICATED",
    user: { ...adminUser, role: userRole },
    session: { user: { ...adminUser, role: userRole } },
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={mockAuth}>
      <SettingsPage />
    </AuthContext.Provider>
  );
}

describe("System Settings & Policies Page", () => {
  it("should render 4 policy cards and administrator clearance", () => {
    renderPage("ADMINISTRATOR");

    expect(screen.getByText("System Settings & Security Policies")).toBeInTheDocument();
    expect(screen.getByText("POLICY ARCHITECTURE")).toBeInTheDocument();
    expect(screen.getByText("ADMINISTRATOR CLEARANCE")).toBeInTheDocument();
    expect(screen.getByText("Backend API Boundary")).toBeInTheDocument();
    expect(screen.getByText("Deterministic Risk Engine Policy")).toBeInTheDocument();
    expect(screen.getByText("AI Pipeline Boundary Isolation")).toBeInTheDocument();
    expect(screen.getByText("Security & Privacy Invariants")).toBeInTheDocument();
  });

  it("should show policy modification notice for non-admin roles", () => {
    renderPage("OFFICER");

    expect(screen.getByText(/Operational policy modifications restricted to central administrator role/i)).toBeInTheDocument();
  });
});

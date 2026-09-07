import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { AuthContext } from "@/features/auth/context/auth-context";
import OfficersPage from "@/app/(dashboard)/officers/page";
import type { AuthContextValue, User } from "@/types";

const baseUser: User = {
  id: "u-sup-1",
  badgeNumber: "BADGE-SUP-01",
  fullName: "Supervisor Sarah Jenkins",
  email: "sarah@sih.gov",
  role: "SUPERVISOR",
  status: "ACTIVE",
  checkpointId: "CP-1",
  checkpointName: "Terminal 2",
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:00:00Z",
};

function renderPage(userRole: "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR" = "SUPERVISOR") {
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
    <AuthContext.Provider value={mockAuth}>
      <OfficersPage />
    </AuthContext.Provider>
  );
}

describe("Officers & Checkpoint Units Page", () => {
  it("should render page header, directory metrics, and active officer roster", () => {
    renderPage("SUPERVISOR");

    expect(screen.getByText("Authorized Officers & Checkpoint Units")).toBeInTheDocument();
    expect(screen.getByText("AUTHORIZED ROSTER")).toBeInTheDocument();
    expect(screen.getByText("SUPERVISOR CLEARANCE")).toBeInTheDocument();
    expect(screen.getByText("Active Personnel")).toBeInTheDocument();
    expect(screen.getByText("Screening Terminals")).toBeInTheDocument();
    expect(screen.getAllByText("Checkpoints").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Inspector Sunita Rawat")).toBeInTheDocument();
    expect(screen.getByText("Sub-Inspector Deep Sharma")).toBeInTheDocument();
  });
});

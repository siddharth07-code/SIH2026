import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { RouteGuard } from "@/components/layout/route-guard";
import { AuthContext } from "@/features/auth/context/auth-context";
import type { AuthContextValue, User } from "@/types";

// Mock next/navigation
let currentPath = "/dashboard";
const mockReplace = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => currentPath,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

const mockOfficerUser: User = {
  id: "usr_officer_201",
  badgeNumber: "SSB-OFF-201",
  fullName: "Sub-Inspector Deep Sharma",
  email: "officer.sharma@ssb.gov.in",
  role: "OFFICER",
  status: "ACTIVE",
  checkpointId: "chk_sonauli_01",
  checkpointName: "Sonauli Integrated Check Post",
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

const mockAdminUser: User = {
  ...mockOfficerUser,
  id: "usr_admin_001",
  badgeNumber: "SSB-ADM-001",
  fullName: "Commandant R. K. Mishra",
  role: "ADMINISTRATOR",
};

function renderWithAuth(
  ui: React.ReactNode,
  authValues: Partial<AuthContextValue>
) {
  const defaultValues: AuthContextValue = {
    status: "AUTHENTICATED",
    user: mockOfficerUser,
    session: { user: mockOfficerUser },
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    ...authValues,
  };

  return render(
    <AuthContext.Provider value={defaultValues}>{ui}</AuthContext.Provider>
  );
}

describe("RouteGuard", () => {
  beforeEach(() => {
    currentPath = "/dashboard";
    mockReplace.mockReset();
    mockPush.mockReset();
    vi.restoreAllMocks();
  });

  it("should display loading state when auth status is LOADING or UNKNOWN", () => {
    renderWithAuth(
      <RouteGuard>
        <div>Protected Content</div>
      </RouteGuard>,
      { status: "LOADING" }
    );

    expect(
      screen.getByText(/Verifying officer clearance & active session.../i)
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect unauthenticated users on /dashboard to /login", () => {
    currentPath = "/dashboard";
    renderWithAuth(
      <RouteGuard>
        <div>Protected Content</div>
      </RouteGuard>,
      { status: "UNAUTHENTICATED", user: null, session: null }
    );

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect unauthenticated users on deep protected route to /login?redirect=...", () => {
    currentPath = "/audit";
    renderWithAuth(
      <RouteGuard>
        <div>Audit Center Content</div>
      </RouteGuard>,
      { status: "UNAUTHENTICATED", user: null, session: null }
    );

    expect(mockReplace).toHaveBeenCalledWith("/login?redirect=%2Faudit");
    expect(screen.queryByText("Audit Center Content")).not.toBeInTheDocument();
  });

  it("should render content when user has appropriate role for the route", () => {
    currentPath = "/dashboard";
    renderWithAuth(
      <RouteGuard>
        <div>Dashboard Protected Content</div>
      </RouteGuard>,
      { status: "AUTHENTICATED", user: mockOfficerUser }
    );

    expect(screen.getByText("Dashboard Protected Content")).toBeInTheDocument();
  });

  it("should display UnauthorizedState when user lacks clearance for restricted route", () => {
    currentPath = "/settings"; // Requires ADMINISTRATOR
    renderWithAuth(
      <RouteGuard>
        <div>Settings Protected Content</div>
      </RouteGuard>,
      { status: "AUTHENTICATED", user: mockOfficerUser } // OFFICER
    );

    expect(
      screen.getByText(/Clearance Level Required/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/ADMINISTRATOR/i)).toBeInTheDocument();
    expect(screen.queryByText("Settings Protected Content")).not.toBeInTheDocument();
  });

  it("should allow ADMINISTRATOR into /settings", () => {
    currentPath = "/settings";
    renderWithAuth(
      <RouteGuard>
        <div>Admin Settings Content</div>
      </RouteGuard>,
      { status: "AUTHENTICATED", user: mockAdminUser }
    );

    expect(screen.getByText("Admin Settings Content")).toBeInTheDocument();
  });
});

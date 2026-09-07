import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { RouteGuard } from "@/components/layout/route-guard";
import { AuthContext } from "@/features/auth/context/auth-context";
import type { AuthContextValue, User } from "@/types";

// Mock next/navigation
let currentPath = "/dashboard";
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => currentPath,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

const mockOfficerUser: User = {
  id: "u1",
  badgeNumber: "OFF-101",
  fullName: "Officer 101",
  email: "off101@sih.gov",
  role: "OFFICER",
  status: "ACTIVE",
  checkpointId: "CP-1",
  checkpointName: "Terminal 1",
  createdAt: "2026-08-30T10:00:00.000Z",
  updatedAt: "2026-08-30T10:00:00.000Z",
};

const mockAdminUser: User = {
  ...mockOfficerUser,
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

  it("should display UnauthorizedState and block access when user is UNAUTHENTICATED", () => {
    currentPath = "/dashboard";
    renderWithAuth(
      <RouteGuard>
        <div>Dashboard Protected Content</div>
      </RouteGuard>,
      { status: "UNAUTHENTICATED", user: null, session: null }
    );

    expect(screen.getByText(/Clearance Level Required/i)).toBeInTheDocument();
    expect(screen.getByText(/UNAUTHENTICATED/i)).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Protected Content")).not.toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith("/login?from=%2Fdashboard");
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

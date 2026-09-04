import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { CasesShell } from "@/features/cases/components/cases-shell";
import type { AuthContextValue, User } from "@/types";

const mockOfficerUser: User = {
  id: "u1",
  badgeNumber: "OFF-7719",
  fullName: "Officer John Doe",
  email: "john@sih.gov",
  role: "OFFICER",
  status: "ACTIVE",
  checkpointId: "CP-1",
  checkpointName: "Terminal 2",
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:00:00Z",
};

function renderCasesWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  const mockAuth: AuthContextValue = {
    status: "AUTHENTICATED",
    user: mockOfficerUser,
    session: { user: mockOfficerUser },
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

describe("Cases Workspace & Triage Management (Section 25)", () => {
  it("should render case statuses matching specification and filter by status", () => {
    renderCasesWithProviders(<CasesShell />);

    // Check status tabs from Section 25
    expect(screen.getAllByRole("button", { name: "ALL" }).length).toBe(2);
    expect(screen.getByRole("button", { name: "OPEN" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "UNDER REVIEW" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CONFIRMED FRAUD" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CLEARED" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CLOSED" })).toBeInTheDocument();

    // Verify initial cases render
    expect(screen.getByText("CASE-2026-001")).toBeInTheDocument();
    expect(screen.getByText("CASE-2026-003")).toBeInTheDocument();

    // Filter by CONFIRMED_FRAUD
    fireEvent.click(screen.getByRole("button", { name: "CONFIRMED FRAUD" }));
    expect(screen.getByText("CASE-2026-003")).toBeInTheDocument();
    expect(screen.queryByText("CASE-2026-001")).not.toBeInTheDocument();
  });

  it("should open investigation notes drawer and allow appending notes", () => {
    renderCasesWithProviders(<CasesShell />);

    const notesButtons = screen.getAllByRole("button", { name: /Notes/i });
    expect(notesButtons.length).toBeGreaterThanOrEqual(1);

    // Click notes on first case
    fireEvent.click(notesButtons[0]);

    expect(screen.getByText("Case Investigation Notes")).toBeInTheDocument();
    expect(screen.getByText(/Recorded Officer Notes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Record Note/i })).toBeInTheDocument();
  });
});

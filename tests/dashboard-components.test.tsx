import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { ScreeningOverview } from "@/features/dashboard/components/screening-overview";
import { AttentionQueue } from "@/features/dashboard/components/attention-queue";
import { VerificationActivity } from "@/features/dashboard/components/verification-activity";
import { RiskDistribution } from "@/features/dashboard/components/risk-distribution";
import { OperationalEvents } from "@/features/dashboard/components/operational-events";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { dashboardApi } from "@/lib/api/dashboard";
import type { AuthContextValue, User, AttentionQueueItem } from "@/types";

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

function renderWithProviders(
  ui: React.ReactNode,
  authValues: Partial<AuthContextValue> = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const defaultAuth: AuthContextValue = {
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
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={defaultAuth}>{ui}</AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("Dashboard Modular Components", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("DashboardHeader", () => {
    it("should render title, role badge, and refresh button", () => {
      renderWithProviders(<DashboardHeader />);
      expect(screen.getByText(/Operational Command Center/i)).toBeInTheDocument();
      expect(screen.getByText(/ROLE: OFFICER/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Refresh dashboard operational queries/i })).toBeInTheDocument();
    });
  });

  describe("ScreeningOverview", () => {
    it("should display dash '—' for unavailable metrics without inventing fake numbers", () => {
      vi.spyOn(dashboardApi, "getSummary").mockRejectedValue(new Error("Offline"));
      renderWithProviders(<ScreeningOverview />);

      expect(screen.getByText(/Screenings Today/i)).toBeInTheDocument();
      expect(screen.getByText(/High-Risk Alerts/i)).toBeInTheDocument();
      expect(screen.getByText(/Supervisory Reviews/i)).toBeInTheDocument();
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("AttentionQueue", () => {
    it("should display honest empty state when queue is empty", async () => {
      vi.spyOn(dashboardApi, "getAttentionQueue").mockResolvedValue([]);
      renderWithProviders(<AttentionQueue />);

      await waitFor(() => {
        expect(screen.getByText(/No verification cases in review queue/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/Live screening sessions flagged/i)).toBeInTheDocument();
    });

    it("should render table rows and mask document numbers when data is returned", async () => {
      const mockItems: AttentionQueueItem[] = [
        {
          id: "case-01",
          trackingNumber: "TRK-9821",
          documentType: "PASSPORT",
          maskedDocumentNumber: "P89012345",
          checkpointName: "Terminal 1",
          officerBadge: "OFF-1122",
          status: "REVIEW_REQUIRED",
          riskLevel: "HIGH",
          riskScore: 86,
          primaryFinding: "Calculated DOB check digit mismatch",
          submittedAt: "2026-08-30T10:00:00Z",
        },
      ];

      vi.spyOn(dashboardApi, "getAttentionQueue").mockResolvedValue(mockItems);
      renderWithProviders(<AttentionQueue />);

      await waitFor(() => {
        expect(screen.getByText("TRK-9821")).toBeInTheDocument();
      });
      expect(screen.getByText("P8***345")).toBeInTheDocument();
      expect(screen.getByText("Calculated DOB check digit mismatch")).toBeInTheDocument();
      expect(screen.getByText("HIGH RISK")).toBeInTheDocument();
    });
  });

  describe("VerificationActivity", () => {
    it("should render timeframe selectors and informative visualization placeholder", () => {
      vi.spyOn(dashboardApi, "getActivity").mockRejectedValue(new Error("Offline"));
      renderWithProviders(<VerificationActivity />);

      expect(screen.getByText(/Screening Throughput & Volume Activity/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "1H" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "24H" })).toBeInTheDocument();
      expect(screen.getByText(/Real-time throughput telemetry/i)).toBeInTheDocument();
    });
  });

  describe("RiskDistribution", () => {
    it("should render LOW, MEDIUM, and HIGH risk tier descriptions", () => {
      vi.spyOn(dashboardApi, "getRiskDistribution").mockRejectedValue(new Error("Offline"));
      renderWithProviders(<RiskDistribution />);

      expect(screen.getByText(/Clearance Candidate/i)).toBeInTheDocument();
      expect(screen.getByText(/Supervisory Review/i)).toBeInTheDocument();
      expect(screen.getByText(/Manual Inspection \/ Escalation/i)).toBeInTheDocument();
    });
  });

  describe("OperationalEvents", () => {
    it("should render event stream shell and filter buttons", () => {
      vi.spyOn(dashboardApi, "getOperationalEvents").mockResolvedValue([]);
      renderWithProviders(<OperationalEvents />);

      expect(screen.getByText(/Live Operational & Audit Event Stream/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "ALL" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "ESCALATIONS" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "REVIEWS" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "SYSTEM" })).toBeInTheDocument();
    });
  });

  describe("QuickActions", () => {
    it("should render Screening Queue for all roles and gate Audit Trail for officers", () => {
      renderWithProviders(<QuickActions />);

      expect(screen.getByText(/Screening Queue/i)).toBeInTheDocument();
      expect(screen.getAllByText(/SUPERVISOR\+/i).length).toBeGreaterThanOrEqual(1);
    });

    it("should unlock Audit Trail for supervisors", () => {
      const supervisorUser: User = {
        ...mockOfficerUser,
        role: "SUPERVISOR",
      };
      renderWithProviders(<QuickActions />, {
        user: supervisorUser,
        session: { user: supervisorUser },
      });

      expect(screen.getByText(/Audit Logs →/i)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { AuditCenter } from "@/features/audit/components/audit-center";
import { AuditEventDetail } from "@/features/audit/components/audit-event-detail";
import { auditApi } from "@/lib/api/audit";
import { mockAuditEventListResponse, mockAuditEvents, mockAuditSummary } from "./fixtures/audit";
import type { AuthContextValue, User } from "@/types";

let mockSearchParams = new URLSearchParams();
const mockPush = vi.fn((url: string) => {
  const query = url.split("?")[1];
  mockSearchParams = new URLSearchParams(query || "");
});

// Mock next/navigation with dynamic search params
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/audit",
  useSearchParams: () => mockSearchParams,
}));

const baseUser: User = {
  id: "u-sup-1",
  badgeNumber: "BADGE-SUP-01",
  fullName: "Supervisor Sarah Jenkins",
  email: "sarah.jenkins@sih.gov",
  role: "SUPERVISOR",
  status: "ACTIVE",
  checkpointId: "CP-2",
  checkpointName: "Terminal 2",
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:00:00Z",
};

function renderAuditCenter(userRole: "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR" = "SUPERVISOR") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

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
      <AuthContext.Provider value={mockAuth}>
        <AuditCenter />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("Audit Center Governance UX", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe("AuditEventDetail Component", () => {
    it("should render full event dossier with links and diffs", () => {
      render(<AuditEventDetail event={mockAuditEvents[0]} onClose={vi.fn()} />);

      expect(screen.getByText("Audit Event Dossier")).toBeInTheDocument();
      expect(screen.getByText("evt-001")).toBeInTheDocument();
      expect(screen.getByText(/Visual comparison confirms holder portrait parity/i)).toBeInTheDocument();
      expect(screen.getByText("State Transition (Before → After)")).toBeInTheDocument();
      expect(screen.getByText(/Open Verification Case \(TRK-2026-001\)/i)).toBeInTheDocument();
    });
  });

  describe("Header & Governance Badges", () => {
    it("should render audit header, append-only badge, and user clearance", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue(mockAuditEventListResponse);
      vi.spyOn(auditApi, "getSummary").mockResolvedValue(mockAuditSummary);

      renderAuditCenter("SUPERVISOR");

      expect(screen.getByText("Audit Trail & Operational Governance")).toBeInTheDocument();
      expect(screen.getByText("APPEND-ONLY AUDIT LOG")).toBeInTheDocument();
      expect(screen.getByText("SUPERVISOR CLEARANCE")).toBeInTheDocument();
    });
  });

  describe("Audit Summary KPIs", () => {
    it("should render 5 summary KPI cards with values when available", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue(mockAuditEventListResponse);
      vi.spyOn(auditApi, "getSummary").mockResolvedValue(mockAuditSummary);

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getByText("Total Audited Events")).toBeInTheDocument();
        expect(screen.getByText("1,420")).toBeInTheDocument();
        expect(screen.getByText("Supervisor Reviews")).toBeInTheDocument();
        expect(screen.getByText("38")).toBeInTheDocument();
        expect(screen.getByText("Case Escalations")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("Auth & Sessions")).toBeInTheDocument();
        expect(screen.getByText("156")).toBeInTheDocument();
        expect(screen.getByText("System & Policies")).toBeInTheDocument();
        expect(screen.getByText("24")).toBeInTheDocument();
      });
    });

    it("should render neutral dashes when summary data is unavailable", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue({
        items: [],
        pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0, hasNext: false, hasPrevious: false },
      });
      vi.spyOn(auditApi, "getSummary").mockRejectedValue(new Error("Service Offline"));

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getByText("Total Audited Events")).toBeInTheDocument();
        const dashes = screen.getAllByText("—");
        expect(dashes.length).toBeGreaterThanOrEqual(5);
      });
    });
  });

  describe("Audit Event Table & Interaction", () => {
    it("should render events in the table with timestamps, actions, and actors", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue(mockAuditEventListResponse);
      vi.spyOn(auditApi, "getSummary").mockResolvedValue(mockAuditSummary);

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getAllByText("CASE REVIEWED").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("CASE ESCALATED").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("VERIFICATION SUBMITTED").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("AUTH LOGIN").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("EVIDENCE ANALYZED").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Supervisor Sarah Jenkins").length).toBeGreaterThanOrEqual(1);
      });
    });

    it("should open event dossier detail panel when a row or inspect button is clicked", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue(mockAuditEventListResponse);
      vi.spyOn(auditApi, "getSummary").mockResolvedValue(mockAuditSummary);

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getAllByText("CASE REVIEWED").length).toBeGreaterThanOrEqual(1);
      });

      const inspectButtons = screen.getAllByRole("button", { name: /Inspect audit event evt-001/i });
      fireEvent.click(inspectButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Audit Event Dossier")).toBeInTheDocument();
        expect(screen.getByText("evt-001")).toBeInTheDocument();
      });
    });
  });

  describe("Integrity & Provenance Sections", () => {
    it("should display integrity and provenance sections", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue(mockAuditEventListResponse);
      vi.spyOn(auditApi, "getSummary").mockResolvedValue(mockAuditSummary);

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getByText("Cryptographic Integrity & Chain Validation")).toBeInTheDocument();
        expect(screen.getByText("Audit Event Provenance & Correlation")).toBeInTheDocument();
        expect(screen.getByText("Chronological Governance Timeline")).toBeInTheDocument();
      });
    });
  });

  describe("Backend Offline & Empty States", () => {
    it("should display backend unavailable state when API call fails", async () => {
      vi.spyOn(auditApi, "getEvents").mockRejectedValue(new Error("Connection refused"));
      vi.spyOn(auditApi, "getSummary").mockRejectedValue(new Error("Connection refused"));

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getByText("AUDIT SERVICE NOT CONNECTED")).toBeInTheDocument();
        expect(
          screen.getByText(/The governance service is currently offline or unreachable/i)
        ).toBeInTheDocument();
      });
    });

    it("should display genuine empty state when connected with 0 events", async () => {
      vi.spyOn(auditApi, "getEvents").mockResolvedValue({
        items: [],
        pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0, hasNext: false, hasPrevious: false },
      });
      vi.spyOn(auditApi, "getSummary").mockResolvedValue({
        totalEvents: 0,
        reviewsCount: 0,
        escalationsCount: 0,
        authEventsCount: 0,
        systemEventsCount: 0,
      });

      renderAuditCenter();

      await waitFor(() => {
        expect(screen.getByText("NO AUDIT EVENTS")).toBeInTheDocument();
        expect(screen.getByText(/The audit log is connected, but no operational events have been recorded/i)).toBeInTheDocument();
      });
    });
  });
});

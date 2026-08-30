import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { VerificationDetailShell } from "@/features/verifications/components/verification-detail-shell";
import { verificationsApi } from "@/lib/api/verifications";
import type { AuthContextValue, User, VerificationDetail } from "@/types";

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

const mockSupervisorUser: User = {
  ...mockOfficerUser,
  role: "SUPERVISOR",
};

function renderDetailWithProviders(
  ui: React.ReactNode,
  user: User = mockOfficerUser
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const defaultAuth: AuthContextValue = {
    status: "AUTHENTICATED",
    user,
    session: { user },
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={defaultAuth}>{ui}</AuthContext.Provider>
    </QueryClientProvider>
  );
}

const mockDetailData: VerificationDetail = {
  id: "case-9901",
  trackingNumber: "TRK-2026-9901",
  checkpointId: "CP-1",
  checkpointName: "Terminal 1",
  terminalId: "TERM-04",
  officerId: "u1",
  officerBadge: "OFF-1144",
  officerName: "Officer Alice",
  status: "REVIEW_REQUIRED",
  document: {
    id: "doc-01",
    type: "PASSPORT",
    issuingCountry: "IND",
    documentNumber: "P89012345",
  },
  riskAssessment: {
    id: "risk-01",
    verificationId: "case-9901",
    level: "HIGH",
    score: 84,
    recommendedAction: "MANUAL_VERIFICATION",
    contributingEvidenceIds: ["ev-01"],
    explanationSummary: "ICAO 9303 check digit calculation mismatch on date of birth field.",
    evaluatedAt: "2026-08-30T10:01:00Z",
    engineVersion: "2.1.0",
  },
  evidence: [
    {
      id: "ev-01",
      verificationId: "case-9901",
      category: "MRZ",
      source: "mrz_checksum_validator",
      status: "FAIL",
      severity: "HIGH",
      confidence: 0.99,
      title: "Date of Birth Checksum Failure",
      finding: "Calculated check digit '7' does not match MRZ digit '2'.",
      createdAt: "2026-08-30T10:00:30Z",
    },
    {
      id: "ev-02",
      verificationId: "case-9901",
      category: "FORENSICS",
      source: "splicing_localization_model",
      status: "PASS",
      severity: "LOW",
      confidence: 0.94,
      title: "Digital Splicing Analysis",
      finding: "No suspicious boundaries or noise inconsistencies detected.",
      createdAt: "2026-08-30T10:00:45Z",
    },
  ],
  timeline: [
    {
      id: "tl-01",
      type: "CASE_CREATED",
      title: "Document Ingested",
      description: "Passport document capture submitted by Officer Alice.",
      status: "COMPLETED",
      actor: "OFF-1144",
      timestamp: "2026-08-30T10:00:00Z",
    },
    {
      id: "tl-02",
      type: "RISK_EVALUATED",
      title: "Risk Evaluated (HIGH)",
      description: "Deterministic risk score 84/100 generated.",
      status: "WARNING",
      timestamp: "2026-08-30T10:01:00Z",
    },
  ],
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:01:00Z",
};

describe("Verification Detail Investigation Experience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should display 404 / unavailable empty state when case is not found", async () => {
    vi.spyOn(verificationsApi, "getVerification").mockRejectedValue(new Error("Case not found"));

    renderDetailWithProviders(<VerificationDetailShell id="nonexistent-id" />);

    await waitFor(() => {
      expect(screen.getByText(/Verification Case nonexistent-id Not Found/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/The requested screening case record does not exist/i)).toBeInTheDocument();
  });

  it("should render full case investigation details when record is returned", async () => {
    vi.spyOn(verificationsApi, "getVerification").mockResolvedValue(mockDetailData);

    renderDetailWithProviders(<VerificationDetailShell id="case-9901" />);

    await waitFor(() => {
      expect(screen.getByText(/Verification Case: TRK-2026-9901/i)).toBeInTheDocument();
    });

    // Privacy masking on document number
    expect(screen.getByText("P8***345 (IND)")).toBeInTheDocument();
    expect(screen.queryByText("P89012345 (IND)")).not.toBeInTheDocument();

    // Risk card assertions
    expect(screen.getByText("84")).toBeInTheDocument();
    expect(screen.getByText("MANUAL VERIFICATION")).toBeInTheDocument();
    expect(screen.getByText(/ICAO 9303 check digit calculation mismatch/i)).toBeInTheDocument();

    // Findings assertions
    expect(screen.getByText("Date of Birth Checksum Failure")).toBeInTheDocument();
    expect(screen.getByText(/Calculated check digit '7' does not match/i)).toBeInTheDocument();

    // Timeline assertions
    expect(screen.getByText("Document Ingested")).toBeInTheDocument();
    expect(screen.getByText("Risk Evaluated (HIGH)")).toBeInTheDocument();
  });

  it("should enforce role clearance on supervisory actions (disabled for Officer, enabled for Supervisor)", async () => {
    vi.spyOn(verificationsApi, "getVerification").mockResolvedValue(mockDetailData);

    // Render as Officer
    const { unmount } = renderDetailWithProviders(<VerificationDetailShell id="case-9901" />, mockOfficerUser);

    await waitFor(() => {
      expect(screen.getByText(/Verification Case: TRK-2026-9901/i)).toBeInTheDocument();
    });

    const clearButtonOfficer = screen.getByRole("button", { name: /Clear \/ Review/i });
    const escalateButtonOfficer = screen.getByRole("button", { name: /Escalate Case/i });

    expect(clearButtonOfficer).toBeDisabled();
    expect(escalateButtonOfficer).toBeDisabled();

    unmount();

    // Render as Supervisor
    renderDetailWithProviders(<VerificationDetailShell id="case-9901" />, mockSupervisorUser);

    await waitFor(() => {
      expect(screen.getByText(/Verification Case: TRK-2026-9901/i)).toBeInTheDocument();
    });

    const clearButtonSupervisor = screen.getByRole("button", { name: /Clear \/ Review/i });
    const escalateButtonSupervisor = screen.getByRole("button", { name: /Escalate Case/i });

    expect(clearButtonSupervisor).not.toBeDisabled();
    expect(escalateButtonSupervisor).not.toBeDisabled();

    // Test provisional action notice
    fireEvent.click(clearButtonSupervisor);
    expect(screen.getByText(/Operational Notice/i)).toBeInTheDocument();
  });
});

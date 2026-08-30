import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { EvidenceDetailShell } from "@/features/evidence/components/evidence-detail-shell";
import { evidenceApi } from "@/lib/api/evidence";
import type { AuthContextValue, User, EvidenceDetail } from "@/types";

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

function renderEvidenceWithProviders(
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

const mockHighRiskEvidenceDetail: EvidenceDetail = {
  id: "ev-art-9901",
  verificationId: "case-9901",
  trackingNumber: "TRK-2026-9901",
  status: "FAIL",
  overallSeverity: "HIGH",
  summary: "Forensic and MRZ inconsistencies detected during passport inspection.",
  assets: [
    {
      id: "ast-01",
      type: "ORIGINAL_DOCUMENT",
      storageKey: "documents/case-9901-front.jpg",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60",
      mimeType: "image/jpeg",
    },
  ],
  fieldComparisons: [
    {
      field: "Date of Birth",
      visualValue: "12/04/2000",
      mrzValue: "12/04/1998",
      status: "MISMATCH",
      details: "High-severity fraud signal: Visual year 2000 does not match MRZ year 1998.",
    },
    {
      field: "Document Number",
      visualValue: "P89012345",
      mrzValue: "P89012345",
      status: "MATCH",
      details: "Check digit verified.",
    },
  ],
  forensicSignals: [
    {
      id: "sig-01",
      anomalyType: "DIGITAL_SPLICING",
      severity: "HIGH",
      confidence: 0.94,
      description: "Localized noise variance and edge artifacts detected near photo boundary.",
    },
  ],
  regions: [
    {
      id: "reg-01",
      label: "Photo Boundary Splicing",
      category: "FORENSICS",
      boundingBox: { x: 10, y: 15, width: 30, height: 40 },
      severity: "HIGH",
      confidence: 0.94,
      description: "High probability of headshot replacement / inpainting.",
    },
  ],
  biometrics: {
    similarityScore: 0.42,
    livenessStatus: "REAL",
    status: "MISMATCH",
    notes: "Face embedding similarity below 60% threshold.",
  },
  provenance: {
    sourceService: "Forensic-Pipeline-Worker",
    modelIdentifier: "SplicingNet-v2.1",
    modelVersion: "2.1.0",
    integrityHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    generatedTimestamp: "2026-08-30T10:01:00Z",
    evidenceVersion: "1.0",
    parentVerificationId: "case-9901",
  },
  timeline: [
    {
      id: "ev-tl-01",
      stage: "Document Capture Ingestion",
      description: "Original front passport capture ingested and hashed.",
      status: "COMPLETED",
      timestamp: "2026-08-30T10:00:05Z",
      actor: "Mobile Terminal 04",
    },
  ],
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:01:00Z",
};

const mockLowRiskEvidenceDetail: EvidenceDetail = {
  id: "ev-art-1002",
  verificationId: "case-1002",
  trackingNumber: "TRK-2026-1002",
  status: "PASS",
  overallSeverity: "LOW",
  summary: "All deterministic check digits verified with zero digital manipulation detected.",
  assets: [],
  fieldComparisons: [],
  forensicSignals: [],
  regions: [],
  biometrics: undefined,
  provenance: undefined,
  timeline: [],
  createdAt: "2026-08-30T10:00:00Z",
  updatedAt: "2026-08-30T10:01:00Z",
};

describe("Evidence Center Investigation Workspace", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should display 404 / unavailable empty state when evidence record does not exist", async () => {
    vi.spyOn(evidenceApi, "getEvidence").mockRejectedValue(new Error("Evidence artifact not found"));

    renderEvidenceWithProviders(<EvidenceDetailShell id="ev-nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText(/Evidence Artifact ev-nonexistent Unavailable/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/The requested evidence record does not exist/i)).toBeInTheDocument();
  });

  it("should render full evidence workspace with multi-signal forensic inspection", async () => {
    vi.spyOn(evidenceApi, "getEvidence").mockResolvedValue(mockHighRiskEvidenceDetail);

    renderEvidenceWithProviders(<EvidenceDetailShell id="ev-art-9901" />);

    await waitFor(() => {
      expect(screen.getByText(/Evidence Investigation: TRK-2026-9901/i)).toBeInTheDocument();
    });

    // Evidence summary matrix cards
    expect(screen.getByText("Visual OCR")).toBeInTheDocument();
    expect(screen.getByText("MRZ Validator")).toBeInTheDocument();
    expect(screen.getByText("Forensic Signals")).toBeInTheDocument();
    expect(screen.getByText("Face Biometrics")).toBeInTheDocument();

    // OCR ↔ MRZ Comparison table
    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("12/04/2000")).toBeInTheDocument();
    expect(screen.getByText("12/04/1998")).toBeInTheDocument();
    expect(screen.getByText("MISMATCH DETECTED")).toBeInTheDocument();
    expect(screen.getByText("EXACT MATCH")).toBeInTheDocument();

    // Forensic signals
    expect(screen.getByText("DIGITAL_SPLICING")).toBeInTheDocument();
    expect(screen.getByText(/CONFIDENCE: 94%/i)).toBeInTheDocument();

    // Biometrics
    expect(screen.getByText("42.0%")).toBeInTheDocument();
    expect(screen.getByText("POSSIBLE IMPERSONATION")).toBeInTheDocument();
    expect(screen.getByText(/LIVENESS VERIFIED/i)).toBeInTheDocument();

    // Provenance
    expect(screen.getByText("Forensic-Pipeline-Worker")).toBeInTheDocument();
    expect(screen.getByText("SplicingNet-v2.1")).toBeInTheDocument();
  });

  it("should enforce role clearance on investigator review and escalation actions", async () => {
    vi.spyOn(evidenceApi, "getEvidence").mockResolvedValue(mockHighRiskEvidenceDetail);

    // Render as Officer
    const { unmount } = renderEvidenceWithProviders(
      <EvidenceDetailShell id="ev-art-9901" />,
      mockOfficerUser
    );

    await waitFor(() => {
      expect(screen.getByText(/Evidence Investigation: TRK-2026-9901/i)).toBeInTheDocument();
    });

    const flagBtnOfficer = screen.getByRole("button", { name: /Flag for Review/i });
    const escalateBtnOfficer = screen.getByRole("button", { name: /Escalate Case/i });

    expect(flagBtnOfficer).toBeDisabled();
    expect(escalateBtnOfficer).toBeDisabled();

    unmount();

    // Render as Supervisor
    renderEvidenceWithProviders(
      <EvidenceDetailShell id="ev-art-9901" />,
      mockSupervisorUser
    );

    await waitFor(() => {
      expect(screen.getByText(/Evidence Investigation: TRK-2026-9901/i)).toBeInTheDocument();
    });

    const flagBtnSupervisor = screen.getByRole("button", { name: /Flag for Review/i });
    const escalateBtnSupervisor = screen.getByRole("button", { name: /Escalate Case/i });

    expect(flagBtnSupervisor).not.toBeDisabled();
    expect(escalateBtnSupervisor).not.toBeDisabled();

    fireEvent.click(flagBtnSupervisor);
    expect(screen.getByText(/Operational Notice/i)).toBeInTheDocument();
  });

  it("should render clean neutral unavailable states when assets or comparisons are absent", async () => {
    vi.spyOn(evidenceApi, "getEvidence").mockResolvedValue(mockLowRiskEvidenceDetail);

    renderEvidenceWithProviders(<EvidenceDetailShell id="ev-art-1002" />);

    await waitFor(() => {
      expect(screen.getByText(/Evidence Investigation: TRK-2026-1002/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Document Capture Image Unavailable")).toBeInTheDocument();
    expect(screen.getByText("No Digital Manipulation Signals Logged")).toBeInTheDocument();
    expect(screen.getByText("Evidence Timeline Unaudited / Offline")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/features/auth/context/auth-context";
import { VerificationsListShell } from "@/features/verifications/components/verifications-list-shell";
import { verificationsApi } from "@/lib/api/verifications";
import type { AuthContextValue, User, VerificationListResponse } from "@/types";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/verifications",
  useSearchParams: () => mockSearchParams,
}));

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

function renderWithProviders(ui: React.ReactNode) {
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
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={defaultAuth}>{ui}</AuthContext.Provider>
    </QueryClientProvider>
  );
}

describe("Verifications Queue Experience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("should render page header, search input, and filter selectors", () => {
    vi.spyOn(verificationsApi, "getVerifications").mockResolvedValue({
      items: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1, hasNext: false, hasPrevious: false },
    });

    renderWithProviders(<VerificationsListShell />);

    expect(screen.getByText(/Verification Screening Management/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by tracking ID, officer badge, or document/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by risk tier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by operational status/i)).toBeInTheDocument();
  });

  it("should display honest unavailable notice when backend is offline", async () => {
    vi.spyOn(verificationsApi, "getVerifications").mockRejectedValue(new Error("Network Error"));

    renderWithProviders(<VerificationsListShell />);

    await waitFor(() => {
      expect(screen.getByText(/Backend verification service is not connected yet/i)).toBeInTheDocument();
    });
  });

  it("should display honest empty state when queue has zero records", async () => {
    vi.spyOn(verificationsApi, "getVerifications").mockResolvedValue({
      items: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1, hasNext: false, hasPrevious: false },
    });

    renderWithProviders(<VerificationsListShell />);

    await waitFor(() => {
      expect(screen.getByText(/No verification records available in queue/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/When officers submit document captures from field mobile terminals/i)).toBeInTheDocument();
  });

  it("should display filtered-empty state when filters produce zero matches", async () => {
    mockSearchParams = new URLSearchParams("q=NONEXISTENT&risk=HIGH");
    vi.spyOn(verificationsApi, "getVerifications").mockResolvedValue({
      items: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1, hasNext: false, hasPrevious: false },
    });

    renderWithProviders(<VerificationsListShell />);

    await waitFor(() => {
      expect(screen.getByText(/No verification cases match current filters/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Clear all applied filters/i })).toBeInTheDocument();
  });

  it("should render table rows and mask sensitive document numbers", async () => {
    const mockResponse: VerificationListResponse = {
      items: [
        {
          id: "case-001",
          trackingNumber: "TRK-2026-9901",
          checkpointId: "CP-1",
          checkpointName: "Terminal 1",
          officerBadge: "OFF-1144",
          officerName: "Officer Alice",
          documentType: "PASSPORT",
          maskedDocumentNumber: "P89012345",
          status: "REVIEW_REQUIRED",
          riskLevel: "HIGH",
          riskScore: 84,
          primaryFinding: "ICAO 9303 Checksum Mismatch",
          submittedAt: "2026-08-30T10:00:00Z",
          updatedAt: "2026-08-30T10:00:00Z",
        },
      ],
      pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1, hasNext: false, hasPrevious: false },
    };

    vi.spyOn(verificationsApi, "getVerifications").mockResolvedValue(mockResponse);

    renderWithProviders(<VerificationsListShell />);

    await waitFor(() => {
      expect(screen.getByText("TRK-2026-9901")).toBeInTheDocument();
    });

    // Verify privacy masking
    expect(screen.getByText("P8***345")).toBeInTheDocument();
    expect(screen.queryByText("P89012345")).not.toBeInTheDocument();

    // Verify accessible risk indicator
    expect(screen.getByText("HIGH RISK")).toBeInTheDocument();
    expect(screen.getByText("REVIEW REQUIRED")).toBeInTheDocument();
    expect(screen.getByText("Inspect")).toBeInTheDocument();
  });

  it("should update URL when search input or filter selection changes", () => {
    vi.spyOn(verificationsApi, "getVerifications").mockResolvedValue({
      items: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1, hasNext: false, hasPrevious: false },
    });

    renderWithProviders(<VerificationsListShell />);

    const searchInput = screen.getByPlaceholderText(/Search by tracking ID/i);
    fireEvent.change(searchInput, { target: { value: "PASSPORT-77" } });

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("q=PASSPORT-77"));
  });

  it("should clear filters and reset query parameters when Clear Filters is clicked", () => {
    mockSearchParams = new URLSearchParams("q=QUERY&risk=HIGH");
    vi.spyOn(verificationsApi, "getVerifications").mockResolvedValue({
      items: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1, hasNext: false, hasPrevious: false },
    });

    renderWithProviders(<VerificationsListShell />);

    const clearButton = screen.getByRole("button", { name: /Clear all applied filters/i });
    fireEvent.click(clearButton);

    expect(mockPush).toHaveBeenCalledWith("/verifications?page=1");
  });
});

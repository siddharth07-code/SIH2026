import { describe, it, expect, vi, beforeEach } from "vitest";
import { VerificationsApi } from "@/lib/api/verifications";
import { ApiClient } from "@/lib/api/client";

describe("VerificationsApi Module", () => {
  let apiClient: ApiClient;
  let verificationsApi: VerificationsApi;

  beforeEach(() => {
    apiClient = new ApiClient("https://api.screening.sih.gov/api/v1", 5000);
    verificationsApi = new VerificationsApi(apiClient);
    vi.restoreAllMocks();
  });

  it("should fetch verifications list with default parameters", async () => {
    const mockListResponse = {
      items: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockListResponse),
    });

    const result = await verificationsApi.getVerifications();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications",
      expect.anything()
    );
    expect(result.items).toEqual([]);
    expect(result.pagination.page).toBe(1);
  });

  it("should serialize filter parameters into query string", async () => {
    const mockListResponse = {
      items: [],
      pagination: {
        page: 2,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: true,
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockListResponse),
    });

    await verificationsApi.getVerifications({
      q: "TRK-100",
      risk: "HIGH",
      status: "REVIEW_REQUIRED",
      documentType: "PASSPORT",
      page: 2,
      pageSize: 10,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=TRK-100"),
      expect.anything()
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("risk=HIGH"),
      expect.anything()
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("status=REVIEW_REQUIRED"),
      expect.anything()
    );
  });

  it("should fetch verification detail by ID", async () => {
    const mockDetail = {
      id: "a0000000-0000-0000-0000-000000000001",
      trackingNumber: "TRK-7789",
      checkpointId: "CP-1",
      checkpointName: "Terminal 2",
      officerId: "u1",
      officerBadge: "OFF-11",
      officerName: "Officer Smith",
      status: "REVIEW_REQUIRED",
      document: {
        id: "d0000000-0000-0000-0000-000000000001",
        type: "PASSPORT",
        issuingCountry: "IND",
        documentNumber: "P89012345",
      },
      evidence: [],
      createdAt: "2026-08-30T10:00:00Z",
      updatedAt: "2026-08-30T10:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockDetail),
    });

    const result = await verificationsApi.getVerification("a0000000-0000-0000-0000-000000000001");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications/a0000000-0000-0000-0000-000000000001",
      expect.anything()
    );
    expect(result.trackingNumber).toBe("TRK-7789");
  });

  it("should post case escalation request", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true, message: "Case escalated to HQ" }),
    });

    const result = await verificationsApi.escalateVerification("case-123", "Suspected forgery");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications/case-123/escalate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ reason: "Suspected forgery" }),
      })
    );
    expect(result.success).toBe(true);
  });

  it("should post supervisory review decision", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true, message: "Review recorded" }),
    });

    const result = await verificationsApi.submitSupervisoryReview(
      "case-123",
      "CLEARED",
      "Physical document inspection verified genuine"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications/case-123/review",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          decision: "CLEARED",
          notes: "Physical document inspection verified genuine",
        }),
      })
    );
    expect(result.success).toBe(true);
  });
});

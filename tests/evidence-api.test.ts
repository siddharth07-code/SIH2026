import { describe, it, expect, vi, beforeEach } from "vitest";
import { EvidenceApi } from "@/lib/api/evidence";
import { ApiClient } from "@/lib/api/client";
import { mockHighRiskEvidenceDetail } from "./fixtures/evidence";

describe("EvidenceApi Module", () => {
  let apiClient: ApiClient;
  let evidenceApi: EvidenceApi;

  beforeEach(() => {
    apiClient = new ApiClient("https://api.screening.sih.gov/api/v1", 5000);
    evidenceApi = new EvidenceApi(apiClient);
    vi.restoreAllMocks();
  });

  it("should fetch evidence detail by ID", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockHighRiskEvidenceDetail),
    });

    const result = await evidenceApi.getEvidence("ev-art-9901");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/evidence/ev-art-9901",
      expect.anything()
    );
    expect(result.id).toBe("ev-art-9901");
    expect(result.overallSeverity).toBe("HIGH");
    expect(result.fieldComparisons?.length).toBe(4);
  });

  it("should fetch evidence items by parent verification ID", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([mockHighRiskEvidenceDetail]),
    });

    const results = await evidenceApi.getEvidenceByVerification("case-9901");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications/case-9901/evidence",
      expect.anything()
    );
    expect(results.length).toBe(1);
    expect(results[0].verificationId).toBe("case-9901");
  });
});

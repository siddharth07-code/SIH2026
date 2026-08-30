import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditApi } from "@/lib/api/audit";
import type { ApiClient } from "@/lib/api/client";
import { mockAuditEventListResponse, mockAuditEvents, mockAuditSummary } from "./fixtures/audit";

describe("AuditApi Client", () => {
  let mockClient: ApiClient;
  let auditApi: AuditApi;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as ApiClient;

    auditApi = new AuditApi(mockClient);
  });

  describe("getEvents", () => {
    it("should fetch audit events with correct default params", async () => {
      vi.mocked(mockClient.get).mockResolvedValueOnce(mockAuditEventListResponse);

      const result = await auditApi.getEvents();

      expect(mockClient.get).toHaveBeenCalledWith("/audit/events", { params: {} });
      expect(result.items).toHaveLength(5);
      expect(result.items[0].id).toBe("evt-001");
    });

    it("should serialize filters into query params", async () => {
      vi.mocked(mockClient.get).mockResolvedValueOnce(mockAuditEventListResponse);

      await auditApi.getEvents({
        q: "TRK-2026",
        category: "REVIEW",
        action: "CASE_REVIEWED",
        role: "SUPERVISOR",
        outcome: "SUCCESS",
        integrityStatus: "VERIFIED",
        page: 2,
        pageSize: 10,
      });

      expect(mockClient.get).toHaveBeenCalledWith("/audit/events", {
        params: {
          q: "TRK-2026",
          category: "REVIEW",
          action: "CASE_REVIEWED",
          role: "SUPERVISOR",
          outcome: "SUCCESS",
          integrityStatus: "VERIFIED",
          page: 2,
          pageSize: 10,
        },
      });
    });

    it("should ignore ALL filter values and empty strings", async () => {
      vi.mocked(mockClient.get).mockResolvedValueOnce(mockAuditEventListResponse);

      await auditApi.getEvents({
        q: "  ",
        category: "ALL",
        action: "ALL",
        role: "ALL",
        outcome: "ALL",
        integrityStatus: "ALL",
      });

      expect(mockClient.get).toHaveBeenCalledWith("/audit/events", { params: {} });
    });
  });

  describe("getEventById", () => {
    it("should fetch single audit event by ID", async () => {
      vi.mocked(mockClient.get).mockResolvedValueOnce(mockAuditEvents[0]);

      const result = await auditApi.getEventById("evt-001");

      expect(mockClient.get).toHaveBeenCalledWith("/audit/events/evt-001");
      expect(result.id).toBe("evt-001");
      expect(result.action).toBe("CASE_REVIEWED");
    });
  });

  describe("getSummary", () => {
    it("should fetch audit summary KPIs", async () => {
      vi.mocked(mockClient.get).mockResolvedValueOnce(mockAuditSummary);

      const result = await auditApi.getSummary();

      expect(mockClient.get).toHaveBeenCalledWith("/audit/summary");
      expect(result.totalEvents).toBe(1420);
      expect(result.reviewsCount).toBe(38);
    });
  });
});

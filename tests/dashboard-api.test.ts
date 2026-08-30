import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardApi } from "@/lib/api/dashboard";
import { ApiClient } from "@/lib/api/client";

describe("DashboardApi Module", () => {
  let apiClient: ApiClient;
  let dashboardApi: DashboardApi;

  beforeEach(() => {
    apiClient = new ApiClient("https://api.screening.sih.gov/api/v1", 5000);
    dashboardApi = new DashboardApi(apiClient);
    vi.restoreAllMocks();
  });

  it("should fetch dashboard summary KPIs", async () => {
    const mockSummary = {
      screeningsToday: 142,
      pendingReviews: 3,
      highRiskAlerts: 1,
      completedVerifications: 138,
      avgProcessingSeconds: 1.8,
      activeCheckpointsCount: 8,
      lastUpdated: "2026-08-30T10:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockSummary),
    });

    const result = await dashboardApi.getSummary();
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/dashboard/summary",
      expect.anything()
    );
    expect(result.screeningsToday).toBe(142);
    expect(result.highRiskAlerts).toBe(1);
  });

  it("should fetch activity breakdown with timeframe param", async () => {
    const mockActivity = {
      timeframe: "24H",
      intervals: [],
      lastUpdated: "2026-08-30T10:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockActivity),
    });

    const result = await dashboardApi.getActivity("6H");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/dashboard/activity?timeframe=6H",
      expect.anything()
    );
    expect(result.timeframe).toBe("24H");
  });

  it("should fetch risk distribution", async () => {
    const mockDistribution = {
      low: { level: "LOW", count: 120, percentage: 84.5, description: "Clear", recommendedAction: "Clear" },
      medium: { level: "MEDIUM", count: 18, percentage: 12.7, description: "Review", recommendedAction: "Review" },
      high: { level: "HIGH", count: 4, percentage: 2.8, description: "Alert", recommendedAction: "Manual" },
      totalEvaluated: 142,
      lastUpdated: "2026-08-30T10:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockDistribution),
    });

    const result = await dashboardApi.getRiskDistribution();
    expect(result.low.level).toBe("LOW");
    expect(result.totalEvaluated).toBe(142);
  });

  it("should fetch operational events with limit param", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    });

    await dashboardApi.getOperationalEvents(25);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/dashboard/events?limit=25",
      expect.anything()
    );
  });

  it("should fetch system health status", async () => {
    const mockHealth = {
      overallStatus: "HEALTHY",
      services: [],
      lastChecked: "2026-08-30T10:00:00Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockHealth),
    });

    const result = await dashboardApi.getSystemHealth();
    expect(result.overallStatus).toBe("HEALTHY");
  });
});

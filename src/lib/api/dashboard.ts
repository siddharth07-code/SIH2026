import { apiClient, type ApiClient } from "./client";
import type {
  DashboardSummary,
  DashboardActivity,
  RiskDistribution,
  OperationalEvent,
  SystemHealth,
  AttentionQueueItem,
} from "@/types";

export class DashboardApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Retrieve high-level operational screening KPIs for the Command Center.
   */
  async getSummary(): Promise<DashboardSummary> {
    return this.client.get<DashboardSummary>("/dashboard/summary");
  }

  /**
   * Retrieve screening volume and risk breakdown over a specified timeframe.
   */
  async getActivity(timeframe: "1H" | "6H" | "24H" | "7D" = "24H"): Promise<DashboardActivity> {
    return this.client.get<DashboardActivity>("/dashboard/activity", {
      params: { timeframe },
    });
  }

  /**
   * Retrieve aggregated risk level distribution and recommended action categories.
   */
  async getRiskDistribution(): Promise<RiskDistribution> {
    return this.client.get<DashboardDistributionResponse>("/dashboard/risk-distribution") as unknown as Promise<RiskDistribution>;
  }

  /**
   * Retrieve live operational and security screening audit events.
   */
  async getOperationalEvents(limit = 10): Promise<OperationalEvent[]> {
    return this.client.get<OperationalEvent[]>("/dashboard/events", {
      params: { limit },
    });
  }

  /**
   * Retrieve system and AI pipeline service health statuses.
   */
  async getSystemHealth(): Promise<SystemHealth> {
    return this.client.get<SystemHealth>("/system/health");
  }

  /**
   * Retrieve high-priority screening cases requiring officer attention / supervisory review.
   */
  async getAttentionQueue(): Promise<AttentionQueueItem[]> {
    return this.client.get<AttentionQueueItem[]>("/dashboard/attention-queue");
  }
}

type DashboardDistributionResponse = RiskDistribution;

export const dashboardApi = new DashboardApi();

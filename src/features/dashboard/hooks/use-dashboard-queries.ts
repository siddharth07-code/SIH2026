"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import type {
  DashboardSummary,
  DashboardActivity,
  RiskDistribution,
  OperationalEvent,
  SystemHealth,
  AttentionQueueItem,
} from "@/types";

export const DASHBOARD_QUERY_KEYS = {
  summary: ["dashboard", "summary"] as const,
  activity: (timeframe: string) => ["dashboard", "activity", timeframe] as const,
  riskDistribution: ["dashboard", "risk-distribution"] as const,
  events: (limit: number) => ["dashboard", "events", limit] as const,
  systemHealth: ["system", "health"] as const,
  attentionQueue: ["dashboard", "attention-queue"] as const,
};

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: DASHBOARD_QUERY_KEYS.summary,
    queryFn: () => dashboardApi.getSummary(),
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useDashboardActivity(timeframe: "1H" | "6H" | "24H" | "7D" = "24H") {
  return useQuery<DashboardActivity>({
    queryKey: DASHBOARD_QUERY_KEYS.activity(timeframe),
    queryFn: () => dashboardApi.getActivity(timeframe),
    retry: false,
    staleTime: 1000 * 60,
  });
}

export function useRiskDistribution() {
  return useQuery<RiskDistribution>({
    queryKey: DASHBOARD_QUERY_KEYS.riskDistribution,
    queryFn: () => dashboardApi.getRiskDistribution(),
    retry: false,
    staleTime: 1000 * 60,
  });
}

export function useOperationalEvents(limit = 10) {
  return useQuery<OperationalEvent[]>({
    queryKey: DASHBOARD_QUERY_KEYS.events(limit),
    queryFn: () => dashboardApi.getOperationalEvents(limit),
    retry: false,
    staleTime: 1000 * 30,
  });
}

export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: DASHBOARD_QUERY_KEYS.systemHealth,
    queryFn: () => dashboardApi.getSystemHealth(),
    retry: false,
    staleTime: 1000 * 30,
  });
}

export function useAttentionQueue() {
  return useQuery<AttentionQueueItem[]>({
    queryKey: DASHBOARD_QUERY_KEYS.attentionQueue,
    queryFn: () => dashboardApi.getAttentionQueue(),
    retry: false,
    staleTime: 1000 * 30,
  });
}

export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    await queryClient.invalidateQueries({ queryKey: ["system"] });
  };
}

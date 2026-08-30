"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auditApi } from "@/lib/api/audit";
import type { AuditFilters, AuditEventListResponse, AuditEvent, AuditSummary } from "@/types";

export const auditKeys = {
  all: ["audit"] as const,
  events: (filters?: AuditFilters) => ["audit", "events", filters] as const,
  event: (id: string) => ["audit", "event", id] as const,
  summary: () => ["audit", "summary"] as const,
};

/**
 * Hook to retrieve a paginated and filtered list of audit trail events.
 */
export function useAuditEvents(filters?: AuditFilters) {
  return useQuery<AuditEventListResponse>({
    queryKey: auditKeys.events(filters),
    queryFn: () => auditApi.getEvents(filters),
    staleTime: 1000 * 30,
    retry: false,
  });
}

/**
 * Hook to retrieve inspection details for a single audit event.
 */
export function useAuditEvent(id?: string | null) {
  return useQuery<AuditEvent>({
    queryKey: auditKeys.event(id || ""),
    queryFn: () => auditApi.getEventById(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
    retry: false,
  });
}

/**
 * Hook to retrieve aggregated audit governance KPIs.
 */
export function useAuditSummary() {
  return useQuery<AuditSummary>({
    queryKey: auditKeys.summary(),
    queryFn: () => auditApi.getSummary(),
    staleTime: 1000 * 30,
    retry: false,
  });
}

/**
 * Hook to invalidate and refresh audit queries.
 */
export function useRefreshAudit() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries({ queryKey: auditKeys.all });
  };
}

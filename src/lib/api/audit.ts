import { apiClient, type ApiClient } from "./client";
import {
  auditEventListResponseSchema,
  auditEventSchema,
  auditSummarySchema,
} from "@/lib/validation/schemas";
import type {
  AuditFilters,
  AuditEventListResponse,
  AuditEvent,
  AuditSummary,
} from "@/types";

export class AuditApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Retrieve a paginated list of audit trail events matching the given filters.
   */
  async getEvents(filters: AuditFilters = {}): Promise<AuditEventListResponse> {
    const params: Record<string, string | number | undefined> = {};

    if (filters.q && filters.q.trim()) params.q = filters.q.trim();
    if (filters.category && filters.category !== "ALL") params.category = filters.category;
    if (filters.action && filters.action !== "ALL") params.action = filters.action;
    if (filters.role && filters.role !== "ALL") params.role = filters.role;
    if (filters.actorBadge && filters.actorBadge.trim()) params.actorBadge = filters.actorBadge.trim();
    if (filters.verificationId && filters.verificationId.trim()) params.verificationId = filters.verificationId.trim();
    if (filters.outcome && filters.outcome !== "ALL") params.outcome = filters.outcome;
    if (filters.integrityStatus && filters.integrityStatus !== "ALL") params.integrityStatus = filters.integrityStatus;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;

    const data = await this.client.get<unknown>("/audit/events", { params });
    const parsed = auditEventListResponseSchema.safeParse(data);

    if (!parsed.success) {
      return data as AuditEventListResponse;
    }

    return parsed.data as AuditEventListResponse;
  }

  /**
   * Retrieve detailed inspection record for a specific audit event by ID.
   */
  async getEventById(id: string): Promise<AuditEvent> {
    const data = await this.client.get<unknown>(`/audit/events/${encodeURIComponent(id)}`);
    const parsed = auditEventSchema.safeParse(data);

    if (!parsed.success) {
      return data as AuditEvent;
    }

    return parsed.data as AuditEvent;
  }

  /**
   * Retrieve aggregated audit governance KPI summary metrics.
   */
  async getSummary(): Promise<AuditSummary> {
    const data = await this.client.get<unknown>("/audit/summary");
    const parsed = auditSummarySchema.safeParse(data);

    if (!parsed.success) {
      return data as AuditSummary;
    }

    return parsed.data as AuditSummary;
  }
}

export const auditApi = new AuditApi();

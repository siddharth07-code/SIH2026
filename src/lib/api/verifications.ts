import { apiClient, type ApiClient } from "./client";
import {
  verificationListResponseSchema,
  verificationDetailSchema,
} from "@/lib/validation/schemas";
import type {
  VerificationFilters,
  VerificationListResponse,
  VerificationDetail,
} from "@/types";

export class VerificationsApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Retrieve a paginated list of verification screening sessions matching the given filters.
   */
  async getVerifications(filters: VerificationFilters = {}): Promise<VerificationListResponse> {
    const params: Record<string, string | number | undefined> = {};

    if (filters.q && filters.q.trim()) params.q = filters.q.trim();
    if (filters.risk && filters.risk !== "ALL") params.risk = filters.risk;
    if (filters.status && filters.status !== "ALL") params.status = filters.status;
    if (filters.documentType && filters.documentType !== "ALL") params.documentType = filters.documentType;
    if (filters.checkpoint) params.checkpoint = filters.checkpoint;
    if (filters.officer) params.officer = filters.officer;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.sort) params.sort = filters.sort;
    if (filters.order) params.order = filters.order;

    const data = await this.client.get<unknown>("/verifications", { params });
    const parsed = verificationListResponseSchema.safeParse(data);

    if (!parsed.success) {
      // In development/strict mode, return parsed fallback or propagate
      return data as VerificationListResponse;
    }

    return parsed.data as VerificationListResponse;
  }

  /**
   * Retrieve full case investigation details, evidence items, and operational timeline for a specific verification.
   */
  async getVerification(id: string): Promise<VerificationDetail> {
    const data = await this.client.get<unknown>(`/verifications/${encodeURIComponent(id)}`);
    const parsed = verificationDetailSchema.safeParse(data);

    if (!parsed.success) {
      return data as VerificationDetail;
    }

    return parsed.data as unknown as VerificationDetail;
  }

  /**
   * Escalate a high-risk case to supervisory investigation.
   */
  async escalateVerification(
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    return this.client.post<{ success: boolean; message: string }>(
      `/verifications/${encodeURIComponent(id)}/escalate`,
      { reason }
    );
  }

  /**
   * Submit an authorized supervisory review decision.
   */
  async submitSupervisoryReview(
    id: string,
    decision: "CLEARED" | "ESCALATED" | "MANUAL_VERIFICATION",
    notes: string
  ): Promise<{ success: boolean; message: string }> {
    return this.client.post<{ success: boolean; message: string }>(
      `/verifications/${encodeURIComponent(id)}/review`,
      { decision, notes }
    );
  }

  /**
   * Submit a new document image capture & metadata for ML screening and risk evaluation.
   */
  async uploadVerification(formData: FormData): Promise<VerificationDetail> {
    const data = await this.client.post<unknown>("/verifications", formData);
    const parsed = verificationDetailSchema.safeParse(data);

    if (!parsed.success) {
      return data as VerificationDetail;
    }

    return parsed.data as unknown as VerificationDetail;
  }
}

export const verificationsApi = new VerificationsApi();

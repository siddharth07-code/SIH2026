import { apiClient, type ApiClient } from "./client";
import { evidenceDetailSchema } from "@/lib/validation/schemas";
import type { EvidenceDetail } from "@/types";

export class EvidenceApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Retrieve structured multi-signal evidence, visual assets, and anomaly regions for a specific evidence ID.
   */
  async getEvidence(id: string): Promise<EvidenceDetail> {
    const data = await this.client.get<unknown>(`/evidence/${encodeURIComponent(id)}`);
    const parsed = evidenceDetailSchema.safeParse(data);

    if (!parsed.success) {
      return data as EvidenceDetail;
    }

    return parsed.data as unknown as EvidenceDetail;
  }

  /**
   * Retrieve all aggregated evidence records associated with a parent verification session.
   */
  async getEvidenceByVerification(verificationId: string): Promise<EvidenceDetail[]> {
    const data = await this.client.get<unknown[]>(
      `/verifications/${encodeURIComponent(verificationId)}/evidence`
    );

    return data as EvidenceDetail[];
  }
}

export const evidenceApi = new EvidenceApi();

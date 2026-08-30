"use client";

import { useQuery } from "@tanstack/react-query";
import { evidenceApi } from "@/lib/api/evidence";
import type { EvidenceDetail } from "@/types";

export const EVIDENCE_QUERY_KEYS = {
  detail: (id: string) => ["evidence", "detail", id] as const,
  byVerification: (verificationId: string) => ["evidence", "verification", verificationId] as const,
};

export function useEvidence(id: string) {
  return useQuery<EvidenceDetail>({
    queryKey: EVIDENCE_QUERY_KEYS.detail(id),
    queryFn: () => evidenceApi.getEvidence(id),
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!id,
  });
}

export function useEvidenceByVerification(verificationId: string) {
  return useQuery<EvidenceDetail[]>({
    queryKey: EVIDENCE_QUERY_KEYS.byVerification(verificationId),
    queryFn: () => evidenceApi.getEvidenceByVerification(verificationId),
    retry: false,
    staleTime: 1000 * 30,
    enabled: !!verificationId,
  });
}

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { verificationsApi } from "@/lib/api/verifications";
import type {
  VerificationFilters,
  VerificationListResponse,
  VerificationDetail,
} from "@/types";

export const VERIFICATION_QUERY_KEYS = {
  list: (filters?: VerificationFilters) => ["verifications", "list", filters] as const,
  detail: (id: string) => ["verifications", "detail", id] as const,
};

export function useVerifications(filters?: VerificationFilters) {
  return useQuery<VerificationListResponse>({
    queryKey: VERIFICATION_QUERY_KEYS.list(filters),
    queryFn: () => verificationsApi.getVerifications(filters),
    retry: false,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useVerification(id: string) {
  return useQuery<VerificationDetail>({
    queryKey: VERIFICATION_QUERY_KEYS.detail(id),
    queryFn: () => verificationsApi.getVerification(id),
    retry: false,
    staleTime: 1000 * 30,
    enabled: !!id,
  });
}

export function useRefreshVerifications() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: ["verifications"] });
  };
}

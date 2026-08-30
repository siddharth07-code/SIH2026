export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RecommendedAction =
  | "CLEAR"
  | "REVIEW"
  | "MANUAL_VERIFICATION"
  | "ESCALATE";

export interface RiskAssessment {
  id: string;
  verificationId: string;
  level: RiskLevel;
  score: number; // 0 - 100
  recommendedAction: RecommendedAction;
  contributingEvidenceIds: string[];
  explanationSummary?: string;
  evaluatedAt: string;
  engineVersion: string;
}

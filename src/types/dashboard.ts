import type { RiskLevel, VerificationStatus } from "./index";

export interface DashboardSummary {
  screeningsToday: number | null;
  pendingReviews: number | null;
  highRiskAlerts: number | null;
  completedVerifications: number | null;
  avgProcessingSeconds: number | null;
  activeCheckpointsCount: number | null;
  lastUpdated: string;
}

export interface RiskDistributionCategory {
  level: RiskLevel;
  count: number | null;
  percentage: number | null;
  description: string;
  recommendedAction: string;
}

export interface RiskDistribution {
  low: RiskDistributionCategory;
  medium: RiskDistributionCategory;
  high: RiskDistributionCategory;
  totalEvaluated: number | null;
  lastUpdated: string;
}

export interface ActivityInterval {
  timestamp: string;
  label: string;
  totalScreenings: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
}

export interface DashboardActivity {
  timeframe: "1H" | "6H" | "24H" | "7D";
  intervals: ActivityInterval[];
  lastUpdated: string;
}

export type OperationalEventType =
  | "CASE_SUBMITTED"
  | "RISK_EVALUATED"
  | "SUPERVISOR_REVIEW"
  | "CASE_ESCALATED"
  | "CASE_CLEARED"
  | "SYSTEM_ALERT";

export interface OperationalEvent {
  id: string;
  type: OperationalEventType;
  severity: "LOW" | "MEDIUM" | "HIGH" | "INFO";
  title: string;
  description: string;
  actorBadge?: string;
  actorName?: string;
  checkpointName?: string;
  verificationId?: string;
  timestamp: string;
}

export type ServiceHealthStatus = "ONLINE" | "DEGRADED" | "OFFLINE" | "NOT_CONNECTED";

export interface ServiceHealthItem {
  id: string;
  name: string;
  category: "GATEWAY" | "CORE" | "AI_INFERENCE" | "STORAGE" | "GOVERNANCE";
  status: ServiceHealthStatus;
  latencyMs?: number | null;
  message?: string;
}

export interface SystemHealth {
  overallStatus: "HEALTHY" | "DEGRADED" | "UNAVAILABLE" | "NOT_CONNECTED";
  services: ServiceHealthItem[];
  lastChecked: string;
}

export interface AttentionQueueItem {
  id: string;
  trackingNumber: string;
  documentType: string;
  maskedDocumentNumber: string;
  checkpointName: string;
  officerBadge: string;
  status: VerificationStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  primaryFinding: string;
  submittedAt: string;
}

import type { UserRole } from "./auth";
import type { VerificationPagination } from "./verification";

export type AuditEventCategory =
  | "AUTH"
  | "VERIFICATION"
  | "EVIDENCE"
  | "REVIEW"
  | "ESCALATION"
  | "SYSTEM"
  | "GOVERNANCE"
  | "CONFIG";

export type AuditActionType =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "VERIFICATION_SUBMITTED"
  | "VERIFICATION_PROCESSED"
  | "RISK_EVALUATED"
  | "CASE_REVIEWED"
  | "CASE_ESCALATED"
  | "CASE_CLEARED"
  | "EVIDENCE_ANALYZED"
  | "SETTINGS_UPDATED"
  | "SYSTEM_ALERT";

export type AuditOutcome = "SUCCESS" | "FAILURE" | "WARNING" | "DENIED" | "BLOCKED";
export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface AuditActor {
  id: string;
  badgeNumber: string;
  fullName: string;
  role: UserRole;
  unit?: string;
  ipAddress?: string;
}

export type AuditTargetType = "VERIFICATION" | "EVIDENCE" | "USER" | "SYSTEM" | "CONFIG";

export interface AuditTarget {
  type: AuditTargetType;
  id: string;
  label?: string;
  trackingNumber?: string;
}

export type AuditIntegrityStatus = "VERIFIED" | "UNVERIFIED" | "INVALID" | "UNAVAILABLE";

export interface AuditIntegrity {
  status: AuditIntegrityStatus;
  hash?: string;
  previousHash?: string;
  sequenceNumber?: number;
  verifiedAt?: string;
}

export interface AuditProvenance {
  sourceService: string;
  host?: string;
  correlationId?: string;
  requestId?: string;
  schemaVersion: string;
}

export interface AuditEventStateChange {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  category: AuditEventCategory;
  action: AuditActionType;
  severity: AuditSeverity;
  outcome: AuditOutcome;
  actor: AuditActor;
  target: AuditTarget;
  details?: Record<string, unknown>;
  reason?: string;
  stateChange?: AuditEventStateChange;
  integrity?: AuditIntegrity;
  provenance?: AuditProvenance;
}

export interface AuditSummary {
  totalEvents: number;
  reviewsCount: number;
  escalationsCount: number;
  authEventsCount: number;
  systemEventsCount: number;
  lastEventTimestamp?: string;
}

export interface AuditFilters {
  q?: string;
  category?: AuditEventCategory | "ALL";
  action?: AuditActionType | "ALL";
  role?: UserRole | "ALL";
  actorBadge?: string;
  verificationId?: string;
  outcome?: AuditOutcome | "ALL";
  integrityStatus?: AuditIntegrityStatus | "ALL";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditEventListResponse {
  items: AuditEvent[];
  pagination: VerificationPagination;
  summary?: AuditSummary;
}

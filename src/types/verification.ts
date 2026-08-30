import type { DocumentInfo } from "./document";
import type { EvidenceItem } from "./evidence";
import type { RiskAssessment, RiskLevel } from "./risk";

export type VerificationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "REVIEW_REQUIRED"
  | "ESCALATED"
  | "CLEARED"
  | "FAILED";

export interface VerificationFilters {
  q?: string;
  risk?: RiskLevel | "ALL";
  status?: VerificationStatus | "ALL";
  documentType?: string | "ALL";
  checkpoint?: string;
  officer?: string;
  page?: number;
  pageSize?: number;
  sort?: "submittedAt" | "riskScore" | "status";
  order?: "asc" | "desc";
}

export interface VerificationPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface VerificationSummaryItem {
  id: string;
  trackingNumber: string;
  checkpointId: string;
  checkpointName: string;
  officerId?: string;
  officerBadge: string;
  officerName: string;
  documentType: string;
  maskedDocumentNumber: string;
  status: VerificationStatus;
  riskLevel?: RiskLevel;
  riskScore?: number;
  primaryFinding?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface VerificationListResponse {
  items: VerificationSummaryItem[];
  pagination: VerificationPagination;
}

export type VerificationTimelineEventType =
  | "CASE_CREATED"
  | "DOCUMENT_CAPTURED"
  | "PROCESSING_STARTED"
  | "OCR_COMPLETED"
  | "MRZ_VALIDATED"
  | "FORENSICS_COMPLETED"
  | "FACE_VERIFIED"
  | "LIVENESS_CHECKED"
  | "RISK_EVALUATED"
  | "SUPERVISOR_REVIEW"
  | "CASE_ESCALATED"
  | "CASE_CLEARED"
  | "CASE_COMPLETED";

export interface VerificationTimelineEvent {
  id: string;
  type: VerificationTimelineEventType;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "WARNING";
  actor?: string;
  timestamp: string;
}

export interface VerificationDetail {
  id: string;
  trackingNumber: string;
  checkpointId: string;
  checkpointName: string;
  terminalId?: string;
  officerId: string;
  officerBadge: string;
  officerName: string;
  status: VerificationStatus;
  document: DocumentInfo;
  evidence: EvidenceItem[];
  riskAssessment?: RiskAssessment;
  timeline?: VerificationTimelineEvent[];
  supervisorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type Verification = VerificationDetail;

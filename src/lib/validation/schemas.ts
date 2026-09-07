import { z } from "zod";

export const loginRequestSchema = z.object({
  badgeNumberOrEmail: z
    .string()
    .min(3, "Badge number or email must be at least 3 characters")
    .max(100, "Badge number or email is too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const userRoleSchema = z.enum(["OFFICER", "SUPERVISOR", "ADMINISTRATOR", "CITIZEN"]);
export const userAccountStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const userSchema = z.object({
  id: z.string().uuid(),
  badgeNumber: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  status: userAccountStatusSchema,
  checkpointId: z.string().optional(),
  checkpointName: z.string().optional(),
  unit: z.string().optional(),
  lastActiveAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserDTO = z.infer<typeof userSchema>;

export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string().optional(),
  expiresIn: z.number().int().positive().optional(),
  message: z.string().optional(),
});

export type LoginResponseDTO = z.infer<typeof loginResponseSchema>;

export const officerSchema = userSchema;

export const riskAssessmentSchema = z.object({
  id: z.string().uuid(),
  verificationId: z.string().uuid(),
  level: z.enum(["LOW", "MEDIUM", "HIGH"]),
  score: z.number().min(0).max(100),
  recommendedAction: z.enum(["CLEAR", "REVIEW", "MANUAL_VERIFICATION", "ESCALATE"]),
  contributingEvidenceIds: z.array(z.string()),
  explanationSummary: z.string().optional(),
  evaluatedAt: z.string().datetime(),
  engineVersion: z.string(),
});

export const evidenceItemSchema = z.object({
  id: z.string(),
  verificationId: z.string().uuid(),
  category: z.enum(["OCR", "MRZ", "CONSISTENCY", "FORENSICS", "BIOMETRICS", "METADATA"]),
  source: z.string(),
  status: z.enum(["PASS", "FAIL", "WARNING", "UNAVAILABLE", "PROCESSING", "SUPERSEDED"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  confidence: z.number().min(0).max(1).optional(),
  title: z.string(),
  finding: z.string(),
  details: z.record(z.unknown()).optional(),
  modelVersion: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const boundingBoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const evidenceAssetSchema = z.object({
  id: z.string(),
  type: z.enum([
    "ORIGINAL_DOCUMENT",
    "PROCESSED_DOCUMENT",
    "ANOMALY_HEATMAP",
    "DIFFERENCE_MAP",
    "DOCUMENT_PORTRAIT",
    "LIVE_FACE_CAPTURE",
  ]),
  url: z.string().optional(),
  storageKey: z.string(),
  mimeType: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  sha256: z.string().optional(),
});

export const evidenceRegionSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.enum(["OCR", "MRZ", "CONSISTENCY", "FORENSICS", "BIOMETRICS", "METADATA"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  confidence: z.number().min(0).max(1).optional(),
  boundingBox: boundingBoxSchema,
  description: z.string().optional(),
});

export const fieldComparisonItemSchema = z.object({
  field: z.string(),
  visualValue: z.string().nullable(),
  mrzValue: z.string().nullable(),
  status: z.enum(["MATCH", "MISMATCH", "UNAVAILABLE", "NOT_CHECKED"]),
  details: z.string().optional(),
});

export const forensicSignalSchema = z.object({
  id: z.string(),
  anomalyType: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  confidence: z.number().min(0).max(1),
  description: z.string(),
  heatmapAssetKey: z.string().optional(),
  regions: z.array(evidenceRegionSchema).optional(),
});

export const biometricComparisonSchema = z.object({
  status: z.enum(["MATCH", "MISMATCH", "BORDERLINE", "UNAVAILABLE"]),
  similarityScore: z.number().min(0).max(1).nullable().optional(),
  livenessScore: z.number().min(0).max(1).nullable().optional(),
  livenessStatus: z.enum(["REAL", "SPOOF_DETECTED", "UNAVAILABLE"]).optional(),
  portraitAssetKey: z.string().optional(),
  portraitUrl: z.string().optional(),
  liveCaptureAssetKey: z.string().optional(),
  liveCaptureUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const evidenceProvenanceSchema = z.object({
  sourceService: z.string(),
  modelIdentifier: z.string().optional(),
  modelVersion: z.string().optional(),
  integrityHash: z.string().optional(),
  generatedTimestamp: z.string().datetime(),
  evidenceVersion: z.string(),
  parentVerificationId: z.string(),
});

export const evidenceTimelineEventSchema = z.object({
  id: z.string(),
  stage: z.string(),
  status: z.enum(["COMPLETED", "FAILED", "IN_PROGRESS", "WARNING"]),
  description: z.string(),
  timestamp: z.string().datetime(),
  actor: z.string().optional(),
});

export const evidenceDetailSchema = z.object({
  id: z.string().uuid(),
  verificationId: z.string().uuid(),
  trackingNumber: z.string().optional(),
  status: z.enum(["PASS", "FAIL", "WARNING", "UNAVAILABLE", "PROCESSING", "SUPERSEDED"]),
  overallSeverity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  summary: z.string(),
  items: z.array(evidenceItemSchema).optional(),
  assets: z.array(evidenceAssetSchema).optional(),
  regions: z.array(evidenceRegionSchema).optional(),
  fieldComparisons: z.array(fieldComparisonItemSchema).optional(),
  forensicSignals: z.array(forensicSignalSchema).optional(),
  biometrics: biometricComparisonSchema.optional(),
  provenance: evidenceProvenanceSchema.optional(),
  timeline: z.array(evidenceTimelineEventSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const documentInfoSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["PASSPORT", "VISA", "DRIVING_LICENCE", "NATIONAL_ID", "OTHER"]),
  issuingCountry: z.string().optional(),
  documentNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  dateOfBirth: z.string().optional(),
  holderFullName: z.string().optional(),
  nationality: z.string().optional(),
  captureQualityScore: z.number().min(0).max(1).optional(),
});

export const verificationSummarySchema = z.object({
  id: z.string().uuid(),
  trackingNumber: z.string(),
  checkpointId: z.string(),
  checkpointName: z.string(),
  officerId: z.string().optional(),
  officerBadge: z.string(),
  officerName: z.string(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "REVIEW_REQUIRED",
    "ESCALATED",
    "CLEARED",
    "FAILED",
  ]),
  documentType: z.enum(["PASSPORT", "VISA", "DRIVING_LICENCE", "NATIONAL_ID", "OTHER"]),
  maskedDocumentNumber: z.string(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  riskScore: z.number().min(0).max(100).optional(),
  primaryFinding: z.string().optional(),
  submittedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const verificationPaginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const verificationListResponseSchema = z.object({
  items: z.array(verificationSummarySchema),
  pagination: verificationPaginationSchema,
});

export const verificationTimelineEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    "CASE_CREATED",
    "DOCUMENT_CAPTURED",
    "PROCESSING_STARTED",
    "OCR_COMPLETED",
    "MRZ_VALIDATED",
    "FORENSICS_COMPLETED",
    "FACE_VERIFIED",
    "LIVENESS_CHECKED",
    "RISK_EVALUATED",
    "SUPERVISOR_REVIEW",
    "CASE_ESCALATED",
    "CASE_CLEARED",
    "CASE_COMPLETED",
  ]),
  title: z.string(),
  description: z.string(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "WARNING"]),
  actor: z.string().optional(),
  timestamp: z.string().datetime(),
});

export const verificationDetailSchema = z.object({
  id: z.string().uuid(),
  trackingNumber: z.string(),
  checkpointId: z.string(),
  checkpointName: z.string(),
  terminalId: z.string().optional(),
  officerId: z.string(),
  officerBadge: z.string(),
  officerName: z.string(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "REVIEW_REQUIRED",
    "ESCALATED",
    "CLEARED",
    "FAILED",
  ]),
  document: documentInfoSchema,
  evidence: z.array(evidenceItemSchema),
  riskAssessment: riskAssessmentSchema.optional(),
  timeline: z.array(verificationTimelineEventSchema).optional(),
  supervisorNotes: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const systemHealthSchema = z.object({
  status: z.enum(["HEALTHY", "DEGRADED", "UNAVAILABLE"]),
  version: z.string(),
  uptimeSeconds: z.number().nonnegative(),
  services: z.record(
    z.object({
      status: z.enum(["UP", "DOWN", "DEGRADED"]),
      latencyMs: z.number().optional(),
    })
  ).optional(),
});

// ============================================================
// Phase W5: Audit & Governance Schemas
// ============================================================

export const auditEventCategorySchema = z.enum([
  "AUTH",
  "VERIFICATION",
  "EVIDENCE",
  "REVIEW",
  "ESCALATION",
  "SYSTEM",
  "GOVERNANCE",
  "CONFIG",
]);

export const auditActionTypeSchema = z.enum([
  "AUTH_LOGIN",
  "AUTH_LOGOUT",
  "VERIFICATION_SUBMITTED",
  "VERIFICATION_PROCESSED",
  "RISK_EVALUATED",
  "CASE_REVIEWED",
  "CASE_ESCALATED",
  "CASE_CLEARED",
  "EVIDENCE_ANALYZED",
  "SETTINGS_UPDATED",
  "SYSTEM_ALERT",
]);

export const auditOutcomeSchema = z.enum(["SUCCESS", "FAILURE", "WARNING", "DENIED", "BLOCKED"]);
export const auditSeveritySchema = z.enum(["INFO", "WARNING", "CRITICAL"]);

export const auditActorSchema = z.object({
  id: z.string(),
  badgeNumber: z.string(),
  fullName: z.string(),
  role: userRoleSchema,
  unit: z.string().optional(),
  ipAddress: z.string().optional(),
});

export const auditTargetTypeSchema = z.enum(["VERIFICATION", "EVIDENCE", "USER", "SYSTEM", "CONFIG"]);

export const auditTargetSchema = z.object({
  type: auditTargetTypeSchema,
  id: z.string(),
  label: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export const auditIntegrityStatusSchema = z.enum(["VERIFIED", "UNVERIFIED", "INVALID", "UNAVAILABLE"]);

export const auditIntegritySchema = z.object({
  status: auditIntegrityStatusSchema,
  hash: z.string().optional(),
  previousHash: z.string().optional(),
  sequenceNumber: z.number().int().nonnegative().optional(),
  verifiedAt: z.string().datetime().optional(),
});

export const auditProvenanceSchema = z.object({
  sourceService: z.string(),
  host: z.string().optional(),
  correlationId: z.string().optional(),
  requestId: z.string().optional(),
  schemaVersion: z.string(),
});

export const auditEventStateChangeSchema = z.object({
  before: z.record(z.unknown()).optional(),
  after: z.record(z.unknown()).optional(),
});

export const auditEventSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  category: auditEventCategorySchema,
  action: auditActionTypeSchema,
  severity: auditSeveritySchema,
  outcome: auditOutcomeSchema,
  actor: auditActorSchema,
  target: auditTargetSchema,
  details: z.record(z.unknown()).optional(),
  reason: z.string().optional(),
  stateChange: auditEventStateChangeSchema.optional(),
  integrity: auditIntegritySchema.optional(),
  provenance: auditProvenanceSchema.optional(),
});

export const auditSummarySchema = z.object({
  totalEvents: z.number().int().nonnegative(),
  reviewsCount: z.number().int().nonnegative(),
  escalationsCount: z.number().int().nonnegative(),
  authEventsCount: z.number().int().nonnegative(),
  systemEventsCount: z.number().int().nonnegative(),
  lastEventTimestamp: z.string().datetime().optional(),
});

export const auditEventListResponseSchema = z.object({
  items: z.array(auditEventSchema),
  pagination: verificationPaginationSchema,
  summary: auditSummarySchema.optional(),
});


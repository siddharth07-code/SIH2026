export type EvidenceCategory =
  | "OCR"
  | "MRZ"
  | "CONSISTENCY"
  | "FORENSICS"
  | "BIOMETRICS"
  | "METADATA";

export type EvidenceStatus = "PASS" | "FAIL" | "WARNING" | "UNAVAILABLE" | "PROCESSING" | "SUPERSEDED";
export type EvidenceSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ForensicLocalization {
  anomalyType: string;
  confidence: number;
  boundingBox: BoundingBox;
  maskStorageKey?: string;
}

export interface EvidenceItem {
  id: string;
  verificationId: string;
  category: EvidenceCategory;
  source: string;
  status: EvidenceStatus;
  severity: EvidenceSeverity;
  confidence?: number;
  title: string;
  finding: string;
  details?: Record<string, unknown>;
  localization?: ForensicLocalization[];
  modelVersion?: string;
  createdAt: string;
}

export type EvidenceAssetType =
  | "ORIGINAL_DOCUMENT"
  | "PROCESSED_DOCUMENT"
  | "ANOMALY_HEATMAP"
  | "DIFFERENCE_MAP"
  | "DOCUMENT_PORTRAIT"
  | "LIVE_FACE_CAPTURE";

export interface EvidenceAsset {
  id: string;
  type: EvidenceAssetType;
  url?: string;
  storageKey: string;
  mimeType: string;
  width?: number;
  height?: number;
  sha256?: string;
}

export interface EvidenceRegion {
  id: string;
  label: string;
  category: EvidenceCategory;
  severity: EvidenceSeverity;
  confidence?: number;
  boundingBox: BoundingBox;
  description?: string;
}

export interface FieldComparisonItem {
  field: string;
  visualValue: string | null;
  mrzValue: string | null;
  status: "MATCH" | "MISMATCH" | "UNAVAILABLE" | "NOT_CHECKED";
  details?: string;
}

export interface ForensicSignal {
  id: string;
  anomalyType: string;
  severity: EvidenceSeverity;
  confidence: number;
  description: string;
  heatmapAssetKey?: string;
  regions?: EvidenceRegion[];
}

export interface BiometricComparison {
  status: "MATCH" | "MISMATCH" | "BORDERLINE" | "UNAVAILABLE";
  similarityScore?: number | null; // 0.00 to 1.00
  livenessScore?: number | null; // 0.00 to 1.00
  livenessStatus?: "REAL" | "SPOOF_DETECTED" | "UNAVAILABLE";
  portraitAssetKey?: string;
  portraitUrl?: string;
  liveCaptureAssetKey?: string;
  liveCaptureUrl?: string;
  notes?: string;
}

export interface EvidenceProvenance {
  sourceService: string;
  modelIdentifier?: string;
  modelVersion?: string;
  integrityHash?: string;
  generatedTimestamp: string;
  evidenceVersion: string;
  parentVerificationId: string;
}

export interface EvidenceTimelineEvent {
  id: string;
  stage: string;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS" | "WARNING";
  description: string;
  timestamp: string;
  actor?: string;
}

export interface EvidenceDetail {
  id: string;
  verificationId: string;
  trackingNumber?: string;
  status: EvidenceStatus;
  overallSeverity: EvidenceSeverity;
  summary: string;
  items?: EvidenceItem[];
  assets?: EvidenceAsset[];
  regions?: EvidenceRegion[];
  fieldComparisons?: FieldComparisonItem[];
  forensicSignals?: ForensicSignal[];
  biometrics?: BiometricComparison;
  provenance?: EvidenceProvenance;
  timeline?: EvidenceTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

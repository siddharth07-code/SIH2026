import type { RiskLevel, RecommendedAction, EvidenceSeverity } from "@/types";

/**
 * Format ISO date string into operational readable format
 */
export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "—";
  }
}

/**
 * Mask sensitive identity document numbers (Data minimization principle)
 * Example: "A1234567" -> "A1***567"
 */
export function maskDocumentNumber(docNum?: string | null): string {
  if (!docNum) return "—";
  if (docNum.length <= 4) return "****";
  const start = docNum.slice(0, 2);
  const end = docNum.slice(-3);
  return `${start}***${end}`;
}

/**
 * Returns human-readable label and description for risk levels
 */
export function getRiskLevelMeta(level: RiskLevel): {
  label: string;
  description: string;
} {
  switch (level) {
    case "LOW":
      return {
        label: "Low Risk",
        description: "No significant manipulation or inconsistency detected.",
      };
    case "MEDIUM":
      return {
        label: "Medium Risk",
        description: "Potential anomalies detected. Supervisory review recommended.",
      };
    case "HIGH":
      return {
        label: "High Risk",
        description: "Severe inconsistencies or manipulation detected. Immediate action required.",
      };
    default:
      return {
        label: "Unknown Risk",
        description: "Risk assessment pending or unavailable.",
      };
  }
}

/**
 * Returns human-readable label for recommended actions
 */
export function getRecommendedActionLabel(action: RecommendedAction): string {
  switch (action) {
    case "CLEAR":
      return "Clear Document";
    case "REVIEW":
      return "Supervisory Review";
    case "MANUAL_VERIFICATION":
      return "Manual Physical Inspection";
    case "ESCALATE":
      return "Escalate to Security Operations";
    default:
      return action;
  }
}

/**
 * Returns readable label for evidence severities
 */
export function getSeverityLabel(severity: EvidenceSeverity): string {
  switch (severity) {
    case "LOW":
      return "Low Severity";
    case "MEDIUM":
      return "Medium Severity";
    case "HIGH":
      return "High Severity";
    case "CRITICAL":
      return "Critical Severity";
    default:
      return severity;
  }
}

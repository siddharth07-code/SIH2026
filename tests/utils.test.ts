import { describe, it, expect } from "vitest";
import {
  maskDocumentNumber,
  formatDateTime,
  getRiskLevelMeta,
  getRecommendedActionLabel,
  getSeverityLabel,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

describe("Formatting & Masking Utilities", () => {
  describe("cn", () => {
    it("should merge tailwind classes properly", () => {
      const merged = cn("p-4 bg-black", false && "hidden", "p-2");
      expect(merged).toBe("bg-black p-2");
    });
  });

  describe("maskDocumentNumber", () => {
    it("should mask middle characters of document numbers for privacy", () => {
      expect(maskDocumentNumber("A1234567")).toBe("A1***567");
      expect(maskDocumentNumber("P89012345")).toBe("P8***345");
    });

    it("should handle short or empty inputs gracefully", () => {
      expect(maskDocumentNumber("123")).toBe("****");
      expect(maskDocumentNumber("")).toBe("—");
      expect(maskDocumentNumber(null)).toBe("—");
      expect(maskDocumentNumber(undefined)).toBe("—");
    });
  });

  describe("formatDateTime", () => {
    it("should format valid ISO strings", () => {
      const formatted = formatDateTime("2026-08-30T10:00:00.000Z");
      expect(formatted).not.toBe("—");
      expect(typeof formatted).toBe("string");
    });

    it("should return fallback for invalid or empty dates", () => {
      expect(formatDateTime("invalid-date")).toBe("—");
      expect(formatDateTime("")).toBe("—");
      expect(formatDateTime(null)).toBe("—");
    });
  });

  describe("Domain Label Resolvers", () => {
    it("should return correct risk metadata", () => {
      expect(getRiskLevelMeta("LOW").label).toBe("Low Risk");
      expect(getRiskLevelMeta("HIGH").label).toBe("High Risk");
      expect(getRiskLevelMeta("MEDIUM").label).toBe("Medium Risk");
    });

    it("should return correct recommended action labels", () => {
      expect(getRecommendedActionLabel("CLEAR")).toBe("Clear Document");
      expect(getRecommendedActionLabel("ESCALATE")).toBe("Escalate to Security Operations");
    });

    it("should return correct severity labels", () => {
      expect(getSeverityLabel("CRITICAL")).toBe("Critical Severity");
      expect(getSeverityLabel("LOW")).toBe("Low Severity");
    });
  });
});

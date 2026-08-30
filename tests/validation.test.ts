import { describe, it, expect } from "vitest";
import {
  loginRequestSchema,
  officerSchema,
  riskAssessmentSchema,
  evidenceItemSchema,
  systemHealthSchema,
} from "@/lib/validation/schemas";

describe("Zod Boundary Schemas", () => {
  describe("loginRequestSchema", () => {
    it("should accept valid badge/email and password", () => {
      const validPayload = {
        badgeNumberOrEmail: "OFF-7719",
        password: "securepassword123",
      };
      const result = loginRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject inputs that are too short", () => {
      const invalidPayload = {
        badgeNumberOrEmail: "ab",
        password: "123",
      };
      const result = loginRequestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("riskAssessmentSchema", () => {
    it("should validate a proper risk engine evaluation contract", () => {
      const validAssessment = {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        verificationId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        level: "HIGH",
        score: 88,
        recommendedAction: "MANUAL_VERIFICATION",
        contributingEvidenceIds: ["EV-001", "EV-004"],
        explanationSummary: "DOB check digit mismatch and localized font anomaly detected in visual zone.",
        evaluatedAt: "2026-08-30T10:00:00.000Z",
        engineVersion: "v1.2.0",
      };

      const result = riskAssessmentSchema.safeParse(validAssessment);
      expect(result.success).toBe(true);
    });

    it("should reject invalid score out of bounds", () => {
      const invalidAssessment = {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        verificationId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        level: "HIGH",
        score: 150, // Invalid: max 100
        recommendedAction: "MANUAL_VERIFICATION",
        contributingEvidenceIds: [],
        evaluatedAt: "2026-08-30T10:00:00.000Z",
        engineVersion: "v1.0.0",
      };

      const result = riskAssessmentSchema.safeParse(invalidAssessment);
      expect(result.success).toBe(false);
    });
  });

  describe("evidenceItemSchema", () => {
    it("should validate a structured evidence item", () => {
      const validEvidence = {
        id: "EV-001",
        verificationId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        category: "MRZ",
        source: "mrz_validator",
        status: "FAIL",
        severity: "HIGH",
        confidence: 0.99,
        title: "MRZ Date of Birth Check Digit Mismatch",
        finding: "Calculated check digit 4 does not match MRZ check digit 7.",
        createdAt: "2026-08-30T10:00:00.000Z",
      };

      const result = evidenceItemSchema.safeParse(validEvidence);
      expect(result.success).toBe(true);
    });
  });

  describe("systemHealthSchema", () => {
    it("should validate system health response", () => {
      const validHealth = {
        status: "HEALTHY",
        version: "0.1.0",
        uptimeSeconds: 3600,
        services: {
          database: { status: "UP", latencyMs: 4 },
          forensics_worker: { status: "UP", latencyMs: 12 },
        },
      };

      const result = systemHealthSchema.safeParse(validHealth);
      expect(result.success).toBe(true);
    });
  });
});

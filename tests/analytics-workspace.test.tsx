import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { AnalyticsShell } from "@/features/analytics/components/analytics-shell";

describe("Analytics Workspace & Fraud Intelligence (Section 32)", () => {
  it("should render throughput telemetry, latency breakdown, and risk distribution", () => {
    render(<AnalyticsShell />);

    // Core KPIs
    expect(screen.getByText(/Total Verifications/i)).toBeInTheDocument();
    expect(screen.getByText("14,820")).toBeInTheDocument();
    expect(screen.getByText(/Mean Verification Latency/i)).toBeInTheDocument();
    expect(screen.getByText("2.02s")).toBeInTheDocument();

    // Engine latency breakdown
    expect(screen.getByText("PaddleOCR Text Extraction")).toBeInTheDocument();
    expect(screen.getByText("ICAO 9303 Checksum Validator")).toBeInTheDocument();
    expect(screen.getByText("Targeted Forensic ELA Heatmap")).toBeInTheDocument();
    expect(screen.getByText("ArcFace Biometrics & Liveness")).toBeInTheDocument();

    // Fraud typology
    expect(screen.getByText("DOB / Date Splicing")).toBeInTheDocument();
    expect(screen.getByText("Facial Presentation Attack (Spoof)")).toBeInTheDocument();
  });
});

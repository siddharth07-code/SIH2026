import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { PipelineVisualizer } from "@/features/dashboard/components/pipeline-visualizer";

describe("PipelineVisualizer Component", () => {
  it("should render all 7 defense-in-depth pipeline stages", () => {
    render(<PipelineVisualizer />);

    expect(screen.getByText(/Defense-in-Depth Verification Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/ISO\/IEC 23894/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Capture & Quality Check/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/VIZ OCR & MRZ Extraction/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/ICAO 9303 MRZ Validation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Digital Image Forensics/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Face Verification & Liveness/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Deterministic Risk Engine/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/LLM Explanation & Officer Sign-off/i).length).toBeGreaterThanOrEqual(1);
  });

  it("should allow switching stages and displaying stage principles", () => {
    render(<PipelineVisualizer />);

    const forensicsButtons = screen.getAllByText(/Digital Image Forensics/i);
    fireEvent.click(forensicsButtons[0]);

    expect(screen.getByText(/Error Level Analysis \(ELA\) & Frequency Noise Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Produces both document-level risk and pixel-level localized suspicious bounding regions/i)).toBeInTheDocument();
  });
});

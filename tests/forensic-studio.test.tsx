import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { ForensicStudio } from "@/features/forensics/forensic-studio";

describe("ForensicStudio Component", () => {
  it("should render spectrum mode selector, viewport, and detected anomaly regions", () => {
    render(<ForensicStudio />);

    expect(screen.getByText(/Multi-Spectral Forensic Inspection Canvas/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Visible Light \(RGB\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ELA Heatmap/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Noise Residual/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy-Move Splicing/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Date of Birth Visual Field/i).length).toBeGreaterThanOrEqual(1);
  });

  it("should allow switching to ELA mode and zooming viewport", () => {
    render(<ForensicStudio />);

    const elaBtn = screen.getByRole("button", { name: /ELA Heatmap/i });
    fireEvent.click(elaBtn);

    expect(screen.getByText(/VIEWPORT MODE:/i)).toBeInTheDocument();
    expect(screen.getByText("ELA")).toBeInTheDocument();

    const zoomInBtn = screen.getByTitle("Zoom In");
    fireEvent.click(zoomInBtn);
    expect(screen.getByText("125%")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { MrzValidatorTool } from "@/features/mrz/mrz-validator-tool";

describe("ICAO 9303 MRZ Engine & Validator Tool", () => {
  it("should render scenarios, raw MRZ stream editor, and all 4 check digits", () => {
    render(<MrzValidatorTool />);

    expect(screen.getByText(/Load Operational Test Scenarios/i)).toBeInTheDocument();
    expect(screen.getByText(/TD3 Machine Readable Zone \(MRZ\) Optical Stream/i)).toBeInTheDocument();
    expect(screen.getByText("Document Number")).toBeInTheDocument();
    expect(screen.getByText("Date of Birth (DOB)")).toBeInTheDocument();
    expect(screen.getByText("Date of Expiry")).toBeInTheDocument();
    expect(screen.getByText("Composite Invariant")).toBeInTheDocument();
    expect(screen.getByText(/Optical VIZ ↔ Algorithmic MRZ Cross-Consistency Check/i)).toBeInTheDocument();
  });

  it("should switch to DOB tampered scenario and detect check digit mismatch", () => {
    render(<MrzValidatorTool />);

    const tamperedBtn = screen.getByText(/Manipulated Date of Birth/i);
    fireEvent.click(tamperedBtn);

    expect(screen.getByText("TAMPERING FLAG")).toBeInTheDocument();
    expect(screen.getByText(/Read: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Calc: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/HIGH RISK \/ MANUAL INSPECTION/i)).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import NotFound from "@/app/not-found";

describe("Custom 404 NotFound Component", () => {
  it("should render 404 header, security diagnostic, and navigation buttons", () => {
    render(<NotFound />);

    expect(screen.getByText("HTTP 404 — RESOURCE NOT FOUND")).toBeInTheDocument();
    expect(screen.getByText("Route Not Found")).toBeInTheDocument();
    expect(screen.getByText(/The requested path or screening resource does not exist/i)).toBeInTheDocument();
    expect(screen.getByText("Security Diagnostic")).toBeInTheDocument();
    expect(screen.getByText("Command Center")).toBeInTheDocument();
    expect(screen.getByText("Screening Queue")).toBeInTheDocument();
  });
});

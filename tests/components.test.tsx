import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

describe("Shared UI Components", () => {
  describe("StatusIndicator", () => {
    it("should render accessible status with text label and icon", () => {
      render(<StatusIndicator status="HIGH" />);
      const element = screen.getByRole("status");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("HIGH RISK");
      expect(element).toHaveAttribute("aria-label", "Status: HIGH RISK");
    });

    it("should render custom label when provided", () => {
      render(<StatusIndicator status="LOW" label="DOCUMENT VERIFIED" />);
      const element = screen.getByRole("status");
      expect(element).toHaveTextContent("DOCUMENT VERIFIED");
    });
  });

  describe("EmptyState", () => {
    it("should render honest empty state with title, description, and notice", () => {
      render(
        <EmptyState
          title="No records found"
          description="There are currently no records available."
          notice="Data connects in Phase W3."
        />
      );

      expect(screen.getByText("No records found")).toBeInTheDocument();
      expect(
        screen.getByText("There are currently no records available.")
      ).toBeInTheDocument();
      expect(screen.getByText("Data connects in Phase W3.")).toBeInTheDocument();
    });
  });

  describe("Button", () => {
    it("should render button and respond to click events", () => {
      let clicked = false;
      render(
        <Button onClick={() => (clicked = true)}>
          Perform Action
        </Button>
      );

      const btn = screen.getByRole("button", { name: "Perform Action" });
      fireEvent.click(btn);
      expect(clicked).toBe(true);
    });
  });

  describe("Sidebar", () => {
    it("should display JANPRAMAAN and Identity Intelligence branding", async () => {
      const { Sidebar } = await import("@/components/layout/sidebar");
      const { AuthContext } = await import("@/features/auth/context/auth-context");
      const mockAuth = {
        status: "AUTHENTICATED" as const,
        user: null,
        session: null,
        error: null,
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        refreshUser: () => Promise.resolve(),
      };
      render(
        <AuthContext.Provider value={mockAuth}>
          <Sidebar isOpen={true} />
        </AuthContext.Provider>
      );
      expect(screen.getByText("JANPRAMAAN")).toBeInTheDocument();
      expect(screen.getByText("Identity Intelligence")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { AuthContext } from "@/features/auth/context/auth-context";
import { AuthenticationError, NetworkError } from "@/lib/api/errors";
import type { AuthContextValue } from "@/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

function renderLoginForm(authValues: Partial<AuthContextValue> = {}) {
  const defaultValues: AuthContextValue = {
    status: "UNAUTHENTICATED",
    user: null,
    session: null,
    error: null,
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    refreshUser: vi.fn().mockResolvedValue(undefined),
    ...authValues,
  };

  return render(
    <AuthContext.Provider value={defaultValues}>
      <LoginForm />
    </AuthContext.Provider>
  );
}

describe("LoginForm Component", () => {
  beforeEach(() => {
    mockPush.mockReset();
    vi.restoreAllMocks();
  });

  it("should display JANPRAMAAN branding and descriptor", () => {
    renderLoginForm();
    expect(screen.getByText("JANPRAMAAN")).toBeInTheDocument();
    expect(screen.getByText("Identity Intelligence Command Center")).toBeInTheDocument();
  });

  it("should show Zod validation errors on empty submission and prevent API call", async () => {
    const mockLogin = vi.fn();
    renderLoginForm({ login: mockLogin });

    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Badge number or email must be at least 3 characters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should call login and redirect on successful submission", async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "OFF-7719" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        badgeNumberOrEmail: "OFF-7719",
        password: "secret123",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should display invalid credentials error on 401 AuthenticationError", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new AuthenticationError("Invalid creds"));
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "OFF-7719" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Invalid officer badge ID, email, or security password./i)
    ).toBeInTheDocument();
  });

  it("should display backend unavailable error on NetworkError", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new NetworkError("Failed to fetch"));
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "OFF-7719" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Backend authentication service is currently unreachable/i)
    ).toBeInTheDocument();
  });
});

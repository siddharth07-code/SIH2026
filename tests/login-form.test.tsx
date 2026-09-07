import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { AuthContext } from "@/features/auth/context/auth-context";
import { AuthenticationError, AuthorizationError, ApiClientError, NetworkError } from "@/lib/api/errors";
import type { AuthContextValue, User } from "@/types";

const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

const mockOfficerUser: User = {
  id: "usr_officer_201",
  badgeNumber: "SSB-OFF-201",
  fullName: "Sub-Inspector Deep Sharma",
  email: "officer.sharma@ssb.gov.in",
  role: "OFFICER",
  status: "ACTIVE",
  checkpointId: "chk_sonauli_01",
  checkpointName: "Sonauli Integrated Check Post",
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

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
    mockReplace.mockReset();
    vi.restoreAllMocks();
    Object.defineProperty(window, "location", {
      value: { search: "" },
      writable: true,
      configurable: true,
    });
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

  it("should call login and redirect to /dashboard on successful submission", async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "SSB-OFF-201" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        badgeNumberOrEmail: "SSB-OFF-201",
        password: "Password@123",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should respect safe redirect query parameter on successful login", async () => {
    Object.defineProperty(window, "location", {
      value: { search: "?redirect=%2Faudit" },
      writable: true,
      configurable: true,
    });
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "SSB-OFF-201" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/audit");
    });
  });

  it("should redirect immediately if user is already authenticated", () => {
    renderLoginForm({ status: "AUTHENTICATED", user: mockOfficerUser });
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("should display invalid credentials error on 401 AuthenticationError", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new AuthenticationError("Invalid creds"));
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "SSB-OFF-201" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Invalid officer badge ID, email, or security password./i)
    ).toBeInTheDocument();
  });

  it("should display account suspended/inactive error on 403 AuthorizationError", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new AuthorizationError("Account inactive"));
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "SSB-OFF-SUSPENDED" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Account is inactive, suspended, or lacks active checkpoint clearance./i)
    ).toBeInTheDocument();
  });

  it("should display backend validation error on 400 ApiClientError", async () => {
    const mockLogin = vi.fn().mockRejectedValue(
      new ApiClientError("Badge number/email and password are required", 400)
    );
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "SSB-OFF-201" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Badge number\/email and password are required/i)
    ).toBeInTheDocument();
  });

  it("should display backend unavailable error on NetworkError", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new NetworkError("Failed to fetch"));
    renderLoginForm({ login: mockLogin });

    const badgeInput = screen.getByLabelText(/Officer Badge ID or Email/i);
    const passwordInput = screen.getByLabelText(/Security Password/i);
    const submitBtn = screen.getByRole("button", { name: /Authenticate Session/i });

    fireEvent.change(badgeInput, { target: { value: "SSB-OFF-201" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Backend Authentication Service Unavailable/i)
    ).toBeInTheDocument();
  });
});

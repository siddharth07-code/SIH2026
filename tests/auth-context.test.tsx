import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import * as React from "react";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authApi } from "@/lib/api/auth";
import type { User, LoginResponse } from "@/types";

const mockUser: User = {
  id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  badgeNumber: "SUP-1002",
  fullName: "Supervisor John Smith",
  email: "john.smith@screening.sih.gov",
  role: "SUPERVISOR",
  status: "ACTIVE",
  checkpointId: "CP-01",
  checkpointName: "Terminal 1 Operations",
  createdAt: "2026-08-30T10:00:00.000Z",
  updatedAt: "2026-08-30T10:00:00.000Z",
};

function TestAuthConsumer() {
  const { status, user, login, logout, error } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="user">{user ? user.fullName : "none"}</span>
      <span data-testid="role">{user ? user.role : "none"}</span>
      <span data-testid="error">{error || "none"}</span>
      <button
        onClick={() =>
          login({
            badgeNumberOrEmail: "SUP-1002",
            password: "password123",
          })
        }
      >
        Trigger Login
      </button>
      <button onClick={() => logout()}>Trigger Logout</button>
    </div>
  );
}

describe("AuthContext & useAuth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize as UNAUTHENTICATED when getCurrentUser fails (no active session)", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockRejectedValue(new Error("No session"));

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("should initialize as AUTHENTICATED when valid backend session exists", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("Supervisor John Smith");
    expect(screen.getByTestId("role")).toHaveTextContent("SUPERVISOR");
  });

  it("should update state to AUTHENTICATED on successful login", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockRejectedValue(new Error("No session"));
    const loginResponse: LoginResponse = {
      user: mockUser,
      token: "valid-jwt",
    };
    vi.spyOn(authApi, "login").mockResolvedValue(loginResponse);

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED");
    });

    const loginBtn = screen.getByRole("button", { name: /Trigger Login/i });
    await act(async () => {
      loginBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("Supervisor John Smith");
  });

  it("should clear local state on logout", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(mockUser);
    vi.spyOn(authApi, "logout").mockResolvedValue();

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED");
    });

    const logoutBtn = screen.getByRole("button", { name: /Trigger Logout/i });
    await act(async () => {
      logoutBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });
});

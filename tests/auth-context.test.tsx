import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";
import type { User, LoginResponse } from "@/types";

const mockUser: User = {
  id: "usr_supervisor_101",
  badgeNumber: "SSB-SUP-101",
  fullName: "Inspector Sunita Rawat",
  email: "supervisor@ssb.gov.in",
  role: "SUPERVISOR",
  status: "ACTIVE",
  checkpointId: "chk_sonauli_01",
  checkpointName: "Sonauli Integrated Check Post",
  createdAt: "2026-01-10T09:00:00Z",
  updatedAt: "2026-01-10T09:00:00Z",
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
            badgeNumberOrEmail: "SSB-SUP-101",
            password: "Password@123",
          })
        }
      >
        Trigger Login
      </button>
      <button onClick={() => logout()}>Trigger Logout</button>
    </div>
  );
}

function renderWithProviders(queryClient = new QueryClient()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe("AuthContext & useAuth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiClient.setToken(null);
  });

  it("should initialize as UNAUTHENTICATED when getCurrentUser fails (no active session)", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockRejectedValue(new Error("No session"));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("should initialize as AUTHENTICATED when valid backend session exists", async () => {
    apiClient.setToken("valid-active-jwt");
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(mockUser);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("Inspector Sunita Rawat");
    expect(screen.getByTestId("role")).toHaveTextContent("SUPERVISOR");
    expect(apiClient.getToken()).toBe("valid-active-jwt");
  });

  it("should update state to AUTHENTICATED and store token on successful login", async () => {
    vi.spyOn(authApi, "getCurrentUser").mockRejectedValue(new Error("No session"));
    const loginResponse: LoginResponse = {
      user: mockUser,
      token: "newly-issued-jwt-token",
    };
    const loginSpy = vi.spyOn(authApi, "login").mockResolvedValue(loginResponse);

    renderWithProviders();

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
    expect(loginSpy).toHaveBeenCalledWith({
      badgeNumberOrEmail: "SSB-SUP-101",
      password: "Password@123",
    });
    expect(screen.getByTestId("user")).toHaveTextContent("Inspector Sunita Rawat");
    expect(apiClient.getToken()).toBe("newly-issued-jwt-token");
  });

  it("should clear local state, token, and React Query cache on logout", async () => {
    apiClient.setToken("session-token-to-clear");
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(mockUser);
    const logoutSpy = vi.spyOn(authApi, "logout").mockResolvedValue();

    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, "clear");

    renderWithProviders(queryClient);

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
    expect(logoutSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
    expect(apiClient.getToken()).toBeNull();
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("should handle 401 unauthorized listener by clearing state and cache", async () => {
    apiClient.setToken("active-token");
    vi.spyOn(authApi, "getCurrentUser").mockResolvedValue(mockUser);

    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, "clear");

    renderWithProviders(queryClient);

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("AUTHENTICATED");
    });

    // Simulate 401 response from an API call
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: vi.fn().mockResolvedValue({ detail: "Session token expired" }),
    });

    await act(async () => {
      try {
        await apiClient.get("/verifications");
      } catch {
        // Expected 401 AuthenticationError
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("UNAUTHENTICATED");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(screen.getByTestId("error")).toHaveTextContent(/Session expired/i);
    expect(apiClient.getToken()).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
  });
});

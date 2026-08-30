import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthApi } from "@/lib/api/auth";
import { ApiClient } from "@/lib/api/client";
import { AuthenticationError, AuthorizationError, NetworkError, ValidationError } from "@/lib/api/errors";
import type { User } from "@/types";

describe("AuthApi Module", () => {
  let apiClient: ApiClient;
  let authApi: AuthApi;

  const mockUser: User = {
    id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    badgeNumber: "OFF-7719",
    fullName: "Officer Jane Doe",
    email: "jane.doe@screening.sih.gov",
    role: "OFFICER",
    status: "ACTIVE",
    checkpointId: "CP-04",
    checkpointName: "Terminal 2 Immigration",
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-08-30T10:00:00.000Z",
  };

  beforeEach(() => {
    apiClient = new ApiClient("https://api.screening.sih.gov/api/v1", 5000);
    authApi = new AuthApi(apiClient);
    vi.restoreAllMocks();
  });

  describe("login()", () => {
    it("should submit credentials and return validated user response", async () => {
      const mockResponse = {
        user: mockUser,
        token: "mock-jwt-token-xyz",
        expiresIn: 3600,
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const response = await authApi.login({
        badgeNumberOrEmail: "OFF-7719",
        password: "securePassword123!",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.screening.sih.gov/api/v1/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            badgeNumberOrEmail: "OFF-7719",
            password: "securePassword123!",
          }),
        })
      );
      expect(response.user.badgeNumber).toBe("OFF-7719");
      expect(response.token).toBe("mock-jwt-token-xyz");
    });

    it("should propagate AuthenticationError on 401 response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: vi.fn().mockResolvedValue({ detail: "Invalid officer credentials" }),
      });

      await expect(
        authApi.login({
          badgeNumberOrEmail: "OFF-0000",
          password: "wrongPassword",
        })
      ).rejects.toThrow(AuthenticationError);
    });

    it("should propagate AuthorizationError on 403 response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: vi.fn().mockResolvedValue({ detail: "Officer account is suspended" }),
      });

      await expect(
        authApi.login({
          badgeNumberOrEmail: "OFF-SUSPENDED",
          password: "password123",
        })
      ).rejects.toThrow(AuthorizationError);
    });

    it("should throw ValidationError if backend returns invalid user schema", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          user: { invalid: "data" }, // Missing required fields
        }),
      });

      await expect(
        authApi.login({
          badgeNumberOrEmail: "OFF-7719",
          password: "password123",
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getCurrentUser()", () => {
    it("should fetch current authenticated user profile", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockUser),
      });

      const user = await authApi.getCurrentUser("session-token");
      expect(user.fullName).toBe("Officer Jane Doe");
      expect(user.role).toBe("OFFICER");
    });
  });

  describe("logout()", () => {
    it("should send logout request to backend", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: vi.fn().mockResolvedValue({}),
      });

      await authApi.logout("session-token");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.screening.sih.gov/api/v1/auth/logout",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  describe("refreshSession()", () => {
    it("should return null gracefully if refresh endpoint fails", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network down"));

      const session = await authApi.refreshSession();
      expect(session).toBeNull();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient } from "@/lib/api/client";
import {
  ApiClientError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  TimeoutError,
  ValidationError,
} from "@/lib/api/errors";
import { z } from "zod";

describe("ApiClient", () => {
  let client: ApiClient;
  const baseUrl = "https://api.screening.sih.gov/api/v1";

  beforeEach(() => {
    client = new ApiClient(baseUrl, 5000);
    vi.restoreAllMocks();
  });

  it("should successfully execute a GET request and parse JSON response", async () => {
    const mockData = { status: "HEALTHY", version: "1.0.0" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const result = await client.get("/health");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/health",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it("should successfully execute a POST request with JSON body", async () => {
    const mockPayload = { badgeNumberOrEmail: "OFFICER1", password: "secret" };
    const mockResponse = { token: "jwt-xyz", expiresIn: 86400 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await client.post("/auth/login", mockPayload);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(mockPayload),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle multipart/form-data POST without setting Content-Type header", async () => {
    const formData = new FormData();
    formData.append("checkpointId", "chk_101");
    const mockResponse = { id: "ver_123", status: "PROCESSING" };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await client.post("/verifications", formData);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications",
      expect.objectContaining({
        method: "POST",
        body: formData,
      })
    );

    const callHeaders = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers as Record<string, string>;
    expect(callHeaders["Content-Type"]).toBeUndefined();
    expect(result).toEqual(mockResponse);
  });

  it("should include Bearer token when provided in options or client instance", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    await client.get("/me", { token: "secure-auth-token-xyz" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer secure-auth-token-xyz",
        }),
      })
    );

    client.setToken("session-token-abc");
    await client.get("/profile");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/profile",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer session-token-abc",
        }),
      })
    );
  });

  it("should append query parameters correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ items: [] }),
    });

    await client.get("/verifications", {
      params: { page: 1, limit: 20, status: "PENDING" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.screening.sih.gov/api/v1/verifications?page=1&limit=20&status=PENDING",
      expect.anything()
    );
  });

  it("should throw AuthenticationError on 401 response and trigger unauthorized listeners", async () => {
    client.setToken("expired-token");
    expect(client.getToken()).toBe("expired-token");

    const unauthorizedHandler = vi.fn();
    const unsubscribe = client.onUnauthorized(unauthorizedHandler);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: vi.fn().mockResolvedValue({ detail: "Token has expired" }),
    });

    await expect(client.get("/protected")).rejects.toThrow(AuthenticationError);
    expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
    expect(client.getToken()).toBeNull();

    unsubscribe();
  });

  it("should throw AuthorizationError on 403 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: vi.fn().mockResolvedValue({ detail: "Insufficient clearance level" }),
    });

    await expect(client.get("/admin/logs")).rejects.toThrow(AuthorizationError);
  });

  it("should throw NotFoundError on 404 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: vi.fn().mockResolvedValue({ detail: "Case not found" }),
    });

    await expect(client.get("/verifications/missing-id")).rejects.toThrow(NotFoundError);
  });

  it("should throw ApiClientError on generic HTTP error response (e.g. 500)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: vi.fn().mockResolvedValue({ detail: "Database connection failed" }),
    });

    await expect(client.get("/server-error")).rejects.toThrow(ApiClientError);
  });

  it("should throw TimeoutError when request aborts due to timeout", async () => {
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    global.fetch = vi.fn().mockRejectedValue(abortError);

    await expect(client.get("/slow-endpoint")).rejects.toThrow(TimeoutError);
  });

  it("should throw NetworkError when fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    await expect(client.get("/network-fail")).rejects.toThrow(NetworkError);
  });

  it("should validate response data using Zod schema", async () => {
    const testSchema = z.object({
      id: z.string(),
      score: z.number(),
    });

    // Valid data
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "CASE-101", score: 95 }),
    });

    const validResult = await client.get("/test", { schema: testSchema });
    expect(validResult).toEqual({ id: "CASE-101", score: 95 });

    // Invalid data - should throw ValidationError
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "CASE-101", score: "not-a-number" }),
    });

    await expect(client.get("/test", { schema: testSchema })).rejects.toThrow(
      ValidationError
    );
  });

  it("should successfully retrieve a binary Blob via getBlob", async () => {
    const mockBlob = new Blob(["fake-image-bytes"], { type: "image/png" });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      blob: vi.fn().mockResolvedValue(mockBlob),
    });

    const result = await client.getBlob("/verifications/123/heatmap");
    expect(result).toBe(mockBlob);
  });
});

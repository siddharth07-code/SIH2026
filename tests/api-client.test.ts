import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient } from "@/lib/api/client";
import {
  ApiClientError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
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

  it("should include Bearer token when provided in options", async () => {
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

  it("should throw AuthenticationError on 401 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: vi.fn().mockResolvedValue({ detail: "Token has expired" }),
    });

    await expect(client.get("/protected")).rejects.toThrow(AuthenticationError);
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
});

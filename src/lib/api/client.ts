import { env } from "@/config/env";
import {
  ApiClientError,
  NetworkError,
  TimeoutError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./errors";
import type { ZodType } from "zod";

export interface RequestOptions<TResponse = unknown> extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  token?: string | null;
  schema?: ZodType<TResponse>;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeoutMs: number;

  constructor(baseUrl: string = env.apiBaseUrl, defaultTimeoutMs = 15000) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<TResponse>(
    endpoint: string,
    options: RequestOptions<TResponse> = {}
  ): Promise<TResponse> {
    const {
      method = "GET",
      headers: customHeaders = {},
      body,
      params,
      timeoutMs = this.defaultTimeoutMs,
      token,
      schema,
      ...restOptions
    } = options;

    const url = this.buildUrl(endpoint, params);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(customHeaders as Record<string, string>),
    };

    const activeToken =
      token !== undefined
        ? token
        : typeof window !== "undefined"
        ? localStorage.getItem("janpramaan_token")
        : null;

    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }

    let response: Response;

    try {
      response = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...restOptions,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          throw new TimeoutError(`Request to ${endpoint} timed out after ${timeoutMs}ms`);
        }
        throw new NetworkError(`Network request failed: ${err.message}`);
      }
      throw new NetworkError("An unknown network error occurred");
    } finally {
      clearTimeout(timer);
    }

    // Handle HTTP status errors
    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }

      const errorMessage =
        typeof errorBody === "object" && errorBody !== null && "detail" in errorBody
          ? String((errorBody as { detail: unknown }).detail)
          : response.statusText || `HTTP ${response.status}`;

      switch (response.status) {
        case 401:
          throw new AuthenticationError(errorMessage);
        case 403:
          throw new AuthorizationError(errorMessage);
        case 404:
          throw new NotFoundError(errorMessage);
        case 408:
          throw new TimeoutError(errorMessage);
        default:
          throw new ApiClientError(errorMessage, response.status, "API_HTTP_ERROR", errorBody);
      }
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as TResponse;
    }

    let rawData: unknown;
    try {
      rawData = await response.json();
    } catch (parseErr) {
      throw new ValidationError(
        `Failed to parse JSON response from server: ${(parseErr as Error).message}`
      );
    }

    // Validate with Zod schema if provided
    if (schema) {
      const validationResult = schema.safeParse(rawData);
      if (!validationResult.success) {
        throw new ValidationError(
          `API response validation failed for ${endpoint}: ${validationResult.error.message}`,
          validationResult.error.format()
        );
      }
      return validationResult.data;
    }

    return rawData as TResponse;
  }

  get<TResponse>(endpoint: string, options?: Omit<RequestOptions<TResponse>, "method" | "body">) {
    return this.request<TResponse>(endpoint, { ...options, method: "GET" });
  }

  post<TResponse>(endpoint: string, body?: unknown, options?: Omit<RequestOptions<TResponse>, "method" | "body">) {
    return this.request<TResponse>(endpoint, { ...options, method: "POST", body });
  }

  put<TResponse>(endpoint: string, body?: unknown, options?: Omit<RequestOptions<TResponse>, "method" | "body">) {
    return this.request<TResponse>(endpoint, { ...options, method: "PUT", body });
  }

  delete<TResponse>(endpoint: string, options?: Omit<RequestOptions<TResponse>, "method" | "body">) {
    return this.request<TResponse>(endpoint, { ...options, method: "DELETE" });
  }
}

// Global API Client Singleton instance
export const apiClient = new ApiClient();

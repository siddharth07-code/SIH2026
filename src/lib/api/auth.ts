import { apiClient, type ApiClient } from "./client";
import { loginResponseSchema, userSchema, type LoginRequest } from "@/lib/validation/schemas";
import type { User, LoginResponse, AuthSession } from "@/types";

export class AuthApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Submit officer authentication credentials to the central backend.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.client.post<LoginResponse>("/auth/login", credentials, {
      schema: loginResponseSchema,
    });
  }

  /**
   * Retrieve the currently authenticated officer/user profile from the backend.
   */
  async getCurrentUser(token?: string): Promise<User> {
    return this.client.get<User>("/me", {
      token,
      schema: userSchema,
    });
  }

  /**
   * Terminate the authenticated session on the backend.
   */
  async logout(token?: string): Promise<void> {
    await this.client.post<void>("/auth/logout", undefined, {
      token,
    });
  }

  /**
   * Refresh session tokens or validate active cookie session on the backend.
   */
  async refreshSession(token?: string): Promise<AuthSession | null> {
    try {
      const response = await this.client.post<LoginResponse>("/auth/refresh", undefined, {
        token,
        schema: loginResponseSchema,
      });
      return {
        user: response.user,
        token: response.token,
        sessionType: response.token ? "BEARER" : "COOKIE",
      };
    } catch {
      return null;
    }
  }
}

// Global AuthApi singleton instance
export const authApi = new AuthApi();

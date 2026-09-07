"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";
import type { AuthState, LoginRequest, AuthContextValue } from "@/types";

export type { AuthContextValue };

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const [state, setState] = React.useState<AuthState>({
    status: "UNKNOWN",
    user: null,
    session: null,
    error: null,
  });

  const refreshUser = React.useCallback(async () => {
    const activeToken = apiClient.getToken();
    setState((prev) => ({ ...prev, status: "LOADING", error: null }));
    try {
      const user = await authApi.getCurrentUser(activeToken || undefined);
      setState({
        status: "AUTHENTICATED",
        user,
        session: {
          user,
          token: activeToken || undefined,
          sessionType: activeToken ? "BEARER" : "COOKIE",
        },
        error: null,
      });
    } catch {
      apiClient.setToken(null);
      queryClient.clear();
      setState({
        status: "UNAUTHENTICATED",
        user: null,
        session: null,
        error: null,
      });
    }
  }, [queryClient]);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Handle centralized 401 token invalidation across all API requests
  React.useEffect(() => {
    const unsubscribe = apiClient.onUnauthorized(() => {
      queryClient.clear();
      setState({
        status: "UNAUTHENTICATED",
        user: null,
        session: null,
        error: "Session expired. Please authenticate again.",
      });
    });
    return unsubscribe;
  }, [queryClient]);

  const login = React.useCallback(
    async (credentials: LoginRequest) => {
      setState((prev) => ({ ...prev, status: "LOADING", error: null }));
      try {
        const response = await authApi.login(credentials);
        if (response.token) {
          apiClient.setToken(response.token);
        }
        setState({
          status: "AUTHENTICATED",
          user: response.user,
          session: {
            user: response.user,
            token: response.token,
            sessionType: response.token ? "BEARER" : "COOKIE",
          },
          error: null,
        });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Authentication request failed";
        setState({
          status: "UNAUTHENTICATED",
          user: null,
          session: null,
          error: errorMessage,
        });
        throw err;
      }
    },
    []
  );

  const logout = React.useCallback(async () => {
    try {
      await authApi.logout(state.session?.token);
    } catch {
      // Unconditionally clear state even if remote call fails
    } finally {
      apiClient.setToken(null);
      queryClient.clear();
      setState({
        status: "UNAUTHENTICATED",
        user: null,
        session: null,
        error: null,
      });
    }
  }, [state.session?.token, queryClient]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refreshUser,
    }),
    [state, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

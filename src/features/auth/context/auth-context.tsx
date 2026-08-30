"use client";

import * as React from "react";
import { authApi } from "@/lib/api/auth";
import type { AuthState, LoginRequest, AuthContextValue } from "@/types";

export type { AuthContextValue };

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    status: "UNKNOWN",
    user: null,
    session: null,
    error: null,
  });

  const refreshUser = React.useCallback(async () => {
    setState((prev) => ({ ...prev, status: "LOADING", error: null }));
    try {
      const user = await authApi.getCurrentUser();
      setState({
        status: "AUTHENTICATED",
        user,
        session: { user, sessionType: "COOKIE" },
        error: null,
      });
    } catch {
      // If backend has no active session or is unavailable, state is UNAUTHENTICATED
      setState({
        status: "UNAUTHENTICATED",
        user: null,
        session: null,
        error: null,
      });
    }
  }, []);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = React.useCallback(
    async (credentials: LoginRequest) => {
      setState((prev) => ({ ...prev, status: "LOADING", error: null }));
      try {
        const response = await authApi.login(credentials);
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
      // Even if network request fails, clear local auth state unconditionally
    } finally {
      setState({
        status: "UNAUTHENTICATED",
        user: null,
        session: null,
        error: null,
      });
    }
  }, [state.session?.token]);

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

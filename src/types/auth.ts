import type { LoginRequest } from "@/lib/validation/schemas";

export type UserRole = "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR";
export type UserAccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserAccountStatus;
  checkpointId: string;
  checkpointName: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token?: string;
  expiresAt?: string;
  sessionType?: "COOKIE" | "BEARER";
}

export type AuthStatus =
  | "UNKNOWN"
  | "LOADING"
  | "AUTHENTICATED"
  | "UNAUTHENTICATED"
  | "ERROR";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  session: AuthSession | null;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token?: string;
  expiresIn?: number;
  message?: string;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export type { LoginRequest };

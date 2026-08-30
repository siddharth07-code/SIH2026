import { z } from "zod";

const envSchema = z.object({
  apiBaseUrl: z
    .string()
    .url("NEXT_PUBLIC_API_BASE_URL must be a valid URL")
    .default("http://localhost:8000/api/v1"),
  appEnv: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const rawEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development") as
    | "development"
    | "test"
    | "production",
};

export const env = envSchema.parse(rawEnv);

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Operational / Security Status Tokens
        status: {
          low: {
            bg: "hsl(var(--status-low-bg))",
            text: "hsl(var(--status-low-text))",
            border: "hsl(var(--status-low-border))",
          },
          medium: {
            bg: "hsl(var(--status-medium-bg))",
            text: "hsl(var(--status-medium-text))",
            border: "hsl(var(--status-medium-border))",
          },
          high: {
            bg: "hsl(var(--status-high-bg))",
            text: "hsl(var(--status-high-text))",
            border: "hsl(var(--status-high-border))",
          },
          info: {
            bg: "hsl(var(--status-info-bg))",
            text: "hsl(var(--status-info-text))",
            border: "hsl(var(--status-info-border))",
          },
          success: {
            bg: "hsl(var(--status-success-bg))",
            text: "hsl(var(--status-success-text))",
            border: "hsl(var(--status-success-border))",
          },
          warning: {
            bg: "hsl(var(--status-warning-bg))",
            text: "hsl(var(--status-warning-text))",
            border: "hsl(var(--status-warning-border))",
          },
          error: {
            bg: "hsl(var(--status-error-bg))",
            text: "hsl(var(--status-error-text))",
            border: "hsl(var(--status-error-border))",
          },
        },
        // Glassmorphic Surface Tokens
        glass: {
          base: "var(--glass-base)",
          surface: "var(--glass-surface)",
          elevated: "var(--glass-elevated)",
          highlight: "var(--glass-highlight)",
          border: "var(--glass-border)",
          glow: "var(--glass-glow)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "glass-md": "0 8px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "glass-lg": "0 16px 40px -8px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
        "glow-primary": "0 0 20px -4px rgba(59, 130, 246, 0.35)",
        "glow-danger": "0 0 20px -4px rgba(244, 63, 94, 0.35)",
        "glow-success": "0 0 20px -4px rgba(16, 185, 129, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

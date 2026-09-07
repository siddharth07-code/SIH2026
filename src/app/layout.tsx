import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { WebSocketProvider } from "@/providers/websocket-provider";
import { AuthProvider } from "@/features/auth/context/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "JANPRAMAAN — Identity Intelligence",
  description:
    "AI-Based Fake Identity & Document Screening Platform. Evidence-based, explainable multi-signal risk assessment for authorized officers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <QueryProvider>
          <WebSocketProvider>
            <AuthProvider>{children}</AuthProvider>
          </WebSocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

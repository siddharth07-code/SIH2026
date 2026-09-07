"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          // Connected
        };

        ws.onmessage = () => {
          // Invalidate verifications and dashboard queries on incoming events
          queryClient.invalidateQueries({ queryKey: ["verifications"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch {
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      }
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [queryClient]);

  return <>{children}</>;
}

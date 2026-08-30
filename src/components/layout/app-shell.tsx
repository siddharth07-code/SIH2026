"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground bg-ambient-mesh relative overflow-x-hidden">
      {/* Fixed Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Sidebar & Mobile Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

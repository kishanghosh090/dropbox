"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";
import Sidebar, { type DashboardView } from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

interface DashboardShellProps {
  children: (props: {
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
  }) => ReactNode;
  starredCount: number;
  trashCount: number;
  usedBytes: number;
  title?: string;
  subtitle?: string;
  onUploadClick: () => void;
}

export default function DashboardShell({
  children,
  starredCount,
  trashCount,
  usedBytes,
  title,
  subtitle,
  onUploadClick,
}: DashboardShellProps) {
  const [activeView, setActiveView] = useState<DashboardView>("all");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {/* Subtle background glow */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-1/3 top-0 h-[400px] w-[600px] rounded-full bg-orange-500/[0.04] blur-[140px]" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <Sidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            starredCount={starredCount}
            trashCount={trashCount}
            usedBytes={usedBytes}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar
              title={title || ""}
              subtitle={subtitle}
              onMenuClick={() => setIsMobileSidebarOpen(true)}
              onUploadClick={onUploadClick}
              activeView={activeView}
            />

            <motion.main
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 overflow-y-auto dash-scrollbar"
            >
              <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
                {children({ activeView, setActiveView: handleViewChange })}
              </div>
            </motion.main>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
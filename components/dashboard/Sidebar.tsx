"use client";

import Link from "next/link";
import { CloudUpload, LayoutGrid, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import StorageIndicator from "@/components/dashboard/StorageIndicator";
import UserMenu from "@/components/dashboard/UserMenu";
import type { FileTab } from "@/types/dashboard";

interface SidebarProps {
  activeView: FileTab;
  onViewChange: (view: FileTab) => void;
  starredCount: number;
  trashCount: number;
  usedBytes: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: Array<{
  key: FileTab;
  label: string;
  icon: typeof LayoutGrid;
}> = [
  { key: "all", label: "All Files", icon: LayoutGrid },
  { key: "starred", label: "Starred", icon: Star },
];

const secondaryItems: Array<{
  key: FileTab;
  label: string;
  icon: typeof LayoutGrid;
}> = [
  { key: "trash", label: "Trash", icon: Trash2 },
];

export default function Sidebar({
  activeView,
  onViewChange,
  starredCount,
  trashCount,
  usedBytes,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/[0.06] bg-[#0d0d0f] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.06] px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
              <CloudUpload className="h-4 w-4 text-orange-400" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Venthen Space
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto dash-scrollbar px-3 py-4">
          <p className="mb-2 px-2.5 text-[11px] font-medium uppercase tracking-wider text-white/25">
            Workspace
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                  activeView === item.key
                    ? "text-orange-300"
                    : "text-white/50 hover:bg-white/[0.03] hover:text-white/80"
                }`}
              >
                {activeView === item.key && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-orange-500/10 border border-orange-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon className="relative h-4 w-4" />
                <span className="relative">{item.label}</span>
                {item.key === "starred" && starredCount > 0 && (
                  <span className="relative ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/40">
                    {starredCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-6 px-2.5 text-[11px] font-medium uppercase tracking-wider text-white/25">
            Manage
          </p>
          <div className="space-y-0.5">
            {secondaryItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onViewChange(item.key)}
                className={`relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                  activeView === item.key
                    ? "text-orange-300"
                    : "text-white/50 hover:bg-white/[0.03] hover:text-white/80"
                }`}
              >
                {activeView === item.key && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-orange-500/10 border border-orange-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon className="relative h-4 w-4" />
                <span className="relative">{item.label}</span>
                {item.key === "trash" && trashCount > 0 && (
                  <span className="relative ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/40">
                    {trashCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Storage + User */}
        <div className="space-y-3 border-t border-white/[0.06] p-4">
          <StorageIndicator usedBytes={usedBytes} />
          <UserMenu />
        </div>
      </aside>
    </>
  );
}
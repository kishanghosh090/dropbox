"use client";

import { Search, Menu, Plus } from "lucide-react";
import { useState } from "react";
import type { DashboardView } from "@/components/dashboard/Sidebar";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onSearchChange?: (query: string) => void;
  onUploadClick: () => void;
  activeView: DashboardView;
}

const viewTitles: Record<DashboardView, { title: string; subtitle: string }> = {
  all: { title: "Your Files", subtitle: "Private workspace" },
  starred: { title: "Starred", subtitle: "Files you've marked for quick access." },
  trash: { title: "Trash", subtitle: "Deleted files are kept here for recovery." },
  developers: {
    title: "Developers",
    subtitle: "API keys to embed your media store.",
  },
};

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
  onSearchChange,
  onUploadClick,
  activeView,
}: TopbarProps) {
  const [query, setQuery] = useState("");

  const displayTitle = title || viewTitles[activeView].title;
  const displaySubtitle = subtitle || viewTitles[activeView].subtitle;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#0a0a0a]/80 px-5 backdrop-blur-xl sm:px-8">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden -ml-2 rounded-md p-2 text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="hidden min-w-0 sm:block">
        <h1 className="truncate text-[15px] font-semibold text-white/90">
          {displayTitle}
        </h1>
        <p className="truncate text-xs text-white/35">{displaySubtitle}</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            placeholder="Search files..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2 pl-10 pr-16 text-[13px] text-white/80 placeholder:text-white/25 outline-none transition-colors focus:border-orange-500/30 focus:bg-white/[0.03]"
            aria-label="Search files"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-white/30">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Upload button */}
      <button
        onClick={onUploadClick}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all hover:bg-orange-400 hover:shadow-[0_0_28px_rgba(249,115,22,0.3)]"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Upload</span>
      </button>
    </header>
  );
}
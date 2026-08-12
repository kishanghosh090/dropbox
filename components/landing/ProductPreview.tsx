"use client";

import {
  CloudUpload,
  Folder,
  Star,
  Trash,
  FileText,
  Download,
  MoreHorizontal,
  Search,
  Plus,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Music,
  Video,
  File as FileIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { icon: LayoutGrid, label: "All Files", active: true },
  { icon: Star, label: "Starred" },
  { icon: Folder, label: "Folders" },
  { icon: Trash, label: "Trash" },
];

const files = [
  {
    name: "mountain-sunset.jpg",
    type: "image",
    size: "2.4 MB",
    date: "2 days ago",
    color: "from-orange-500/40 to-amber-600/30",
    icon: ImageIcon,
    starred: true,
  },
  {
    name: "product-launch.png",
    type: "image",
    size: "1.8 MB",
    date: "4 days ago",
    color: "from-sky-500/40 to-indigo-600/30",
    icon: ImageIcon,
    starred: true,
  },
  {
    name: "design-mockups",
    type: "folder",
    size: "12 items",
    date: "1 week ago",
    color: "from-violet-500/40 to-purple-600/30",
    icon: Folder,
    starred: false,
  },
  {
    name: "brand-assets",
    type: "folder",
    size: "8 items",
    date: "2 weeks ago",
    color: "from-emerald-500/40 to-teal-600/30",
    icon: Folder,
    starred: false,
  },
  {
    name: "presentation-feb.pptx",
    type: "document",
    size: "4.2 MB",
    date: "3 weeks ago",
    color: "from-rose-500/40 to-pink-600/30",
    icon: FileText,
    starred: false,
  },
  {
    name: "behind-the-scenes.mp4",
    type: "video",
    size: "18.6 MB",
    date: "1 month ago",
    color: "from-cyan-500/40 to-blue-600/30",
    icon: Video,
    starred: true,
  },
  {
    name: "summer-trip-audio.mp3",
    type: "audio",
    size: "5.1 MB",
    date: "1 month ago",
    color: "from-amber-500/40 to-yellow-600/30",
    icon: Music,
    starred: false,
  },
  {
    name: "logo-final.svg",
    type: "image",
    size: "240 KB",
    date: "2 months ago",
    color: "from-fuchsia-500/40 to-pink-600/30",
    icon: FileIcon,
    starred: false,
  },
];

export default function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-5xl"
    >
      {/* Glow */}
      <div className="absolute -inset-x-8 -top-12 -bottom-16 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.13] blur-[120px]" />
        <div className="absolute right-8 top-0 h-[300px] w-[300px] rounded-full bg-amber-400/[0.07] blur-[100px]" />
      </div>

      {/* Window chrome */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0f]/90 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex h-7 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-white/[0.04] px-3 text-xs text-white/40">
            <Search className="h-3.5 w-3.5" />
            <span>venthen.space/dashboard</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/30">
            <Plus className="h-4 w-4" />
            <span className="text-xs">Upload</span>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden sm:flex w-48 flex-col border-r border-white/[0.06] bg-white/[0.01] p-3">
            <div className="mb-4 flex items-center gap-2 px-2 pt-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/20 border border-orange-500/20">
                <CloudUpload className="h-3.5 w-3.5 text-orange-400" />
              </div>
              <span className="text-xs font-semibold text-white/80">
                Venthen Space
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    item.active
                      ? "bg-orange-500/10 text-orange-300"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[11px] font-medium text-white/60">Storage</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
              </div>
              <p className="mt-2 text-[11px] text-white/40">4.2 GB of 10 GB</p>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 sm:p-5">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white/90">
                  Your Files
                </h3>
                <p className="text-xs text-white/40">8 items · Private</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
                  <button className="rounded-md bg-white/[0.06] p-1.5 text-white/70">
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-md p-1.5 text-white/40">
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button className="hidden md:flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-400 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Upload
                </button>
              </div>
            </div>

            {/* File grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {files.map((file, i) => (
                <a
                  key={file.name}
                  href="#features"
                  className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-all hover:border-orange-500/30 hover:bg-white/[0.04] ${
                    i % 2 === 0 ? "animate-float" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div className={`relative mb-2 flex h-16 sm:h-20 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${file.color}`}>
                    <file.icon className="h-7 w-7 text-white/80" />
                    {file.starred && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
                        <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-white/80">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-white/35">
                        {file.size} · {file.date}
                      </p>
                    </div>
                    <button className="shrink-0 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </a>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Download className="h-3.5 w-3.5" />
                <span>Files are private to your account</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Synced
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
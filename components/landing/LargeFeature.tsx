"use client";

import {
  Folder,
  Star,
  Image as ImageIcon,
  Download,
  Trash2,
  FileText,
  Video,
  MoreHorizontal,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { fadeUp, viewport } from "@/components/landing/motion";

const mockFiles = [
  {
    name: "mountain-sunset.jpg",
    type: "Image",
    size: "2.4 MB",
    added: "2 days ago",
    icon: ImageIcon,
    color: "bg-orange-500/20 text-orange-300",
    starred: true,
  },
  {
    name: "design-mockups",
    type: "Folder",
    size: "12 items",
    added: "1 week ago",
    icon: Folder,
    color: "bg-violet-500/20 text-violet-300",
    starred: false,
  },
  {
    name: "product-launch.png",
    type: "Image",
    size: "1.8 MB",
    added: "4 days ago",
    icon: ImageIcon,
    color: "bg-sky-500/20 text-sky-300",
    starred: true,
  },
  {
    name: "brand-assets",
    type: "Folder",
    size: "8 items",
    added: "2 weeks ago",
    icon: Folder,
    color: "bg-emerald-500/20 text-emerald-300",
    starred: false,
  },
  {
    name: "presentation-feb.pdf",
    type: "Document",
    size: "4.2 MB",
    added: "3 weeks ago",
    icon: FileText,
    color: "bg-rose-500/20 text-rose-300",
    starred: false,
  },
  {
    name: "behind-the-scenes.mp4",
    type: "Video",
    size: "18.6 MB",
    added: "1 month ago",
    icon: Video,
    color: "bg-cyan-500/20 text-cyan-300",
    starred: false,
  },
];

export default function LargeFeature() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative py-24 sm:py-32">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-orange-500/[0.05] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-orange-400">
              The workspace
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              A workspace that stays out of your way.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/50">
              Everything you need to manage your files — without the noise.
            </p>
          </motion.div>

          {/* Large UI mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewport}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative mt-16"
          >
            <div className="absolute -inset-x-10 -top-10 -bottom-10 -z-10">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.08] blur-[100px]" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0f]/90 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-xs text-white/40">
                    Venthen Space · Files
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    All files private
                  </span>
                  <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-400 transition-colors">
                    <UploadCloud className="h-3.5 w-3.5" />
                    Upload
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-white/[0.06] px-5 pt-3">
                {["All Files", "Starred", "Trash"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-3.5 py-2.5 text-[13px] transition-colors ${
                      i === 0
                        ? "border-b-2 border-orange-500 text-white font-medium"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Name", "Type", "Size", "Added", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className={`px-5 py-3 text-xs font-medium uppercase tracking-wider text-white/30 ${
                              header === "Actions" ? "text-right" : ""
                            }`}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {mockFiles.map((file) => (
                      <tr
                        key={file.name}
                        className="group border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${file.color}`}
                            >
                              <file.icon className="h-4 w-4" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white/80">
                                {file.name}
                              </span>
                              {file.starred && (
                                <Star
                                  className="h-3.5 w-3.5 text-amber-400"
                                  fill="currentColor"
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-white/40">
                          {file.type}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-white/40">
                          {file.size}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-white/40">
                          {file.added}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button className="rounded-md p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors">
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button className="rounded-md p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-rose-400 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button className="rounded-md p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer stats */}
              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-5 py-3">
                <p className="text-[11px] text-white/30">
                  Showing 6 of 48 files
                </p>
                <p className="text-[11px] text-white/30">
                  4.2 GB of 10 GB used
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
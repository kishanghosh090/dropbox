"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Download,
  Star,
  Trash2,
  ArrowUpFromLine,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsMenuProps {
  file: FileType;
  onDownload?: (file: FileType) => void;
  onToggleStar?: (file: FileType) => void;
  onTrash?: (file: FileType) => void;
  onDelete?: (file: FileType) => void;
  onOpen?: (file: FileType) => void;
  align?: "left" | "right";
}

export default function FileActionsMenu({
  file,
  onDownload,
  onToggleStar,
  onTrash,
  onDelete,
  onOpen,
  align = "right",
}: FileActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="File actions"
        aria-expanded={isOpen}
        className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-1 ${align === "right" ? "right-0" : "left-0"} w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0f] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl`}
          >
            <div className="py-1.5">
              {/* Open */}
              {onOpen && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpen(file);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </button>
              )}

              {/* Download */}
              {!file.isFolder && !file.isTrash && onDownload && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onDownload(file);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              )}

              {/* Star/Unstar */}
              {!file.isTrash && onToggleStar && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onToggleStar(file);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-amber-400"
                >
                  <Star
                    className="h-3.5 w-3.5"
                    fill={file.isStarred ? "currentColor" : "none"}
                  />
                  {file.isStarred ? "Unstar" : "Star"}
                </button>
              )}

              {/* Divider */}
              {((!file.isFolder && !file.isTrash && onDownload) ||
                (!file.isTrash && onToggleStar)) && (
                <div className="my-1.5 border-t border-white/[0.06]" />
              )}

              {/* Trash/Restore */}
              {onTrash && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onTrash(file);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2 text-[13px] transition-colors hover:bg-white/[0.04] ${
                    file.isTrash
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-rose-400 hover:text-rose-300"
                  }`}
                >
                  {file.isTrash ? (
                    <>
                      <ArrowUpFromLine className="h-3.5 w-3.5" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Move to Trash
                    </>
                  )}
                </button>
              )}

              {/* Delete permanently */}
              {file.isTrash && onDelete && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onDelete(file);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-rose-400 transition-colors hover:bg-rose-500/[0.06] hover:text-rose-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Delete Permanently
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { Star, Download, Trash2, MoreHorizontal, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import FileTypeIcon from "@/components/dashboard/FileTypeIcon";

interface FileCardProps {
  file: FileType;
  onOpen?: (file: FileType) => void;
  onDownload?: (file: FileType) => void;
  onToggleStar?: (file: FileType) => void;
  onTrash?: (file: FileType) => void;
  onDelete?: (file: FileType) => void;
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function FileCard({
  file,
  onOpen,
  onDownload,
  onToggleStar,
  onTrash,
  onDelete,
}: FileCardProps) {
  const isFolder = file.isFolder;

  return (
    <div
      onClick={() => onOpen?.(file)}
      className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-all hover:border-orange-500/25 hover:bg-white/[0.04] ${
        onOpen ? "cursor-pointer" : ""
      }`}
    >
      {/* Preview area */}
      <div className="relative mb-2.5 flex h-24 sm:h-28 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-white/[0.04] to-transparent">
        <FileTypeIcon file={file} size="lg" />

        {/* Star indicator */}
        {file.isStarred && (
          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
          </span>
        )}

        {/* Hover actions */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!file.isTrash && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar?.(file);
              }}
              aria-label={file.isStarred ? "Unstar file" : "Star file"}
              className="rounded-md bg-black/50 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-amber-400"
            >
              <Star
                className="h-3.5 w-3.5"
                fill={file.isStarred ? "currentColor" : "none"}
              />
            </button>
          )}
          {!file.isFolder && !file.isTrash && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(file);
              }}
              aria-label="Download file"
              className="rounded-md bg-black/50 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
          {file.isTrash ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrash?.(file);
                }}
                aria-label="Restore file"
                className="rounded-md bg-black/50 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-emerald-400"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(file);
                }}
                aria-label="Delete permanently"
                className="rounded-md bg-black/50 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrash?.(file);
              }}
              aria-label="Move to trash"
              className="rounded-md bg-black/50 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* File info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[13px] font-medium text-white/80">
              {file.name}
            </p>
            {isFolder ? (
              <span className="hidden sm:inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">
                Folder
              </span>
            ) : (
              <ExternalLink className="h-3 w-3 shrink-0 text-white/25" />
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-white/35">
            {isFolder ? "—" : formatSize(file.size)} ·{" "}
            {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(file);
          }}
          aria-label="Open file menu"
          className="shrink-0 text-white/25 opacity-0 transition-all group-hover:opacity-100 hover:text-white/70"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
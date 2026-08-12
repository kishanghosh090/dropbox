"use client";

import { Star, Download, Trash2, MoreHorizontal, ExternalLink, Folder } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { File as FileType } from "@/lib/db/schema";
import FileTypeIcon from "@/components/dashboard/FileTypeIcon";

interface FileRowProps {
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

export default function FileRow({
  file,
  onOpen,
  onDownload,
  onToggleStar,
  onTrash,
  onDelete,
}: FileRowProps) {
  const isFolder = file.isFolder;

  return (
    <tr
      onClick={() => onOpen?.(file)}
      className={`group border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${
        onOpen ? "cursor-pointer" : ""
      }`}
    >
      {/* Name */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <FileTypeIcon file={file} size="sm" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate max-w-[150px] sm:max-w-[240px] font-medium text-white/80">
              {file.name}
            </span>
            {file.isStarred && (
              <Star className="h-3.5 w-3.5 shrink-0 text-amber-400" fill="currentColor" />
            )}
            {isFolder ? (
              <Folder className="h-3 w-3 shrink-0 text-white/25" />
            ) : (
              <ExternalLink className="h-3 w-3 shrink-0 text-white/25" />
            )}
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-white/40">
        {isFolder ? "Folder" : file.type}
      </td>

      {/* Size */}
      <td className="hidden md:table-cell px-5 py-3.5 text-xs text-white/40">
        {isFolder ? "—" : formatSize(file.size)}
      </td>

      {/* Added */}
      <td className="hidden sm:table-cell px-5 py-3.5">
        <div className="text-xs text-white/40">
          {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
        </div>
        <div className="text-[10px] text-white/25 mt-0.5">
          {format(new Date(file.createdAt), "MMM d, yyyy")}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!file.isTrash && (
            <button
              onClick={() => onToggleStar?.(file)}
              aria-label={file.isStarred ? "Unstar file" : "Star file"}
              className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-amber-400"
            >
              <Star
                className="h-3.5 w-3.5"
                fill={file.isStarred ? "currentColor" : "none"}
              />
            </button>
          )}
          {!file.isFolder && !file.isTrash && (
            <button
              onClick={() => onDownload?.(file)}
              aria-label="Download file"
              className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
          {file.isTrash ? (
            <>
              <button
                onClick={() => onTrash?.(file)}
                aria-label="Restore file"
                className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-emerald-400"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete?.(file)}
                aria-label="Delete permanently"
                className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onTrash?.(file)}
              aria-label="Move to trash"
              className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
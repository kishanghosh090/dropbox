"use client";

import type { File as FileType } from "@/lib/db/schema";
import FileCard from "@/components/dashboard/FileCard";

interface FileGridProps {
  files: FileType[];
  onOpen?: (file: FileType) => void;
  onDownload?: (file: FileType) => void;
  onToggleStar?: (file: FileType) => void;
  onTrash?: (file: FileType) => void;
  onDelete?: (file: FileType) => void;
}

export default function FileGrid({
  files,
  onOpen,
  onDownload,
  onToggleStar,
  onTrash,
  onDelete,
}: FileGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onOpen={onOpen}
          onDownload={onDownload}
          onToggleStar={onToggleStar}
          onTrash={onTrash}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
"use client";

import type { File as FileType } from "@/lib/db/schema";
import FileRow from "@/components/dashboard/FileRow";

interface FileTableProps {
  files: FileType[];
  onOpen?: (file: FileType) => void;
  onDownload?: (file: FileType) => void;
  onToggleStar?: (file: FileType) => void;
  onTrash?: (file: FileType) => void;
  onDelete?: (file: FileType) => void;
}

export default function FileTable({
  files,
  onOpen,
  onDownload,
  onToggleStar,
  onTrash,
  onDelete,
}: FileTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.01]">
      <div className="overflow-x-auto dash-scrollbar">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Name", "Type", "Size", "Added", "Actions"].map((header) => (
                <th
                  key={header}
                  className={`px-5 py-3 text-xs font-medium uppercase tracking-wider text-white/30 ${
                    header === "Actions" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onOpen={onOpen}
                onDownload={onDownload}
                onToggleStar={onToggleStar}
                onTrash={onTrash}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
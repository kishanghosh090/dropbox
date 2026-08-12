"use client";

import {
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  File as FileIcon,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";
import { IKImage } from "imagekitio-next";
import type { File as FileType } from "@/lib/db/schema";

interface FileTypeIconProps {
  file: FileType;
  size?: "sm" | "md" | "lg";
  showPreview?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-lg",
  lg: "h-12 w-12 rounded-xl",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function getFileIcon(file: FileType) {
  if (file.isFolder) return { icon: Folder, color: "text-violet-400 bg-violet-500/10" };

  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) {
    return { icon: ImageIcon, color: "text-orange-400 bg-orange-500/10" };
  }
  if (type.startsWith("video/")) {
    return { icon: Video, color: "text-cyan-400 bg-cyan-500/10" };
  }
  if (type.startsWith("audio/")) {
    return { icon: Music, color: "text-amber-400 bg-amber-500/10" };
  }
  if (type.includes("pdf")) {
    return { icon: FileText, color: "text-rose-400 bg-rose-500/10" };
  }
  if (type.includes("zip") || type.includes("rar") || type.includes("tar")) {
    return { icon: FileArchive, color: "text-yellow-400 bg-yellow-500/10" };
  }
  if (type.includes("json") || type.includes("js") || type.includes("ts") || type.includes("html") || type.includes("css")) {
    return { icon: FileCode, color: "text-emerald-400 bg-emerald-500/10" };
  }
  if (type.includes("csv") || type.includes("xls") || type.includes("xlsx")) {
    return { icon: FileSpreadsheet, color: "text-green-400 bg-green-500/10" };
  }
  if (type.includes("ppt") || type.includes("pptx")) {
    return { icon: Presentation, color: "text-pink-400 bg-pink-500/10" };
  }
  return { icon: FileIcon, color: "text-gray-400 bg-gray-500/10" };
}

export default function FileTypeIcon({
  file,
  size = "md",
  showPreview = true,
}: FileTypeIconProps) {
  // For image files, show the actual preview
  if (showPreview && !file.isFolder && file.type.startsWith("image/") && file.path) {
    return (
      <div className={`${sizeClasses[size]} relative overflow-hidden shrink-0`}>
        <IKImage
          path={file.path}
          transformation={[
            {
              height: size === "lg" ? 96 : size === "md" ? 80 : 64,
              width: size === "lg" ? 96 : size === "md" ? 80 : 64,
              focus: "auto",
              quality: 80,
              dpr: 2,
            },
          ]}
          loading="lazy"
          lqip={{ active: true }}
          alt={file.name}
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        />
      </div>
    );
  }

  const { icon: Icon, color } = getFileIcon(file);

  return (
    <div
      className={`${sizeClasses[size]} ${color} flex items-center justify-center shrink-0`}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}
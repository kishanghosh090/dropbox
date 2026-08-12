import type { File as FileType } from "@/lib/db/schema";

export type FileView = "grid" | "list";

export type FileTab = "all" | "starred" | "trash";

export interface DashboardProps {
  userId: string;
  userName: string;
}

export interface FileActionsHandlers {
  onOpen?: (file: FileType) => void;
  onDownload?: (file: FileType) => void;
  onToggleStar?: (file: FileType) => void;
  onTrash?: (file: FileType) => void;
  onRestore?: (file: FileType) => void;
  onDelete?: (file: FileType) => void;
}
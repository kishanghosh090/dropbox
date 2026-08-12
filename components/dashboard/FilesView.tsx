"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, RefreshCw, Trash2, FileText, Star, UploadCloud, FolderPlus } from "lucide-react";
import axios from "axios";
import { addToast } from "@heroui/toast";
import type { File as FileType } from "@/lib/db/schema";
import type { FileTab, FileView } from "@/types/dashboard";
import FileGrid from "@/components/dashboard/FileGrid";
import FileTable from "@/components/dashboard/FileTable";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import { FileCardSkeleton, FileRowSkeleton } from "@/components/dashboard/Skeletons";
import FolderCreateModal from "@/components/dashboard/FolderCreateModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface FilesViewProps {
  userId: string;
  activeView: FileTab;
  currentFolder: string | null;
  onCurrentFolderChange: (folderId: string | null) => void;
  onCountsChange: (counts: { starred: number; trash: number; usedBytes: number }) => void;
  onUploadClick: () => void;
}

export default function FilesView({
  userId,
  activeView,
  currentFolder,
  onCurrentFolderChange,
  onCountsChange,
  onUploadClick,
}: FilesViewProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<FileView>("grid");
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [folderCreateOpen, setFolderCreateOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }
      const response = await axios.get(url);
      setFiles(response.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("We couldn't load your files. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId, currentFolder]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshTrigger]);

  // Report counts and usage to parent (sidebar)
  useEffect(() => {
    const allFiles = files;
    const starred = allFiles.filter((f) => f.isStarred && !f.isTrash).length;
    const trash = allFiles.filter((f) => f.isTrash).length;
    const usedBytes = allFiles
      .filter((f) => !f.isTrash)
      .reduce((sum, f) => sum + (f.size || 0), 0);
    onCountsChange({ starred, trash, usedBytes });
  }, [files, onCountsChange]);

  // Filter files based on active tab + search
  const filteredFiles = useMemo(() => {
    let result = files;
    
    if (activeView === "starred") {
      result = files.filter((f) => f.isStarred && !f.isTrash);
    } else if (activeView === "trash") {
      result = files.filter((f) => f.isTrash);
    } else {
      result = files.filter((f) => !f.isTrash);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }
    
    return result;
  }, [files, activeView, searchQuery]);

  const handleRefresh = useCallback(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleStar = async (file: FileType) => {
    try {
      await axios.patch(`/api/files/${file.id}/star`);
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, isStarred: !f.isStarred } : f))
      );
      addToast({
        title: file.isStarred ? "Removed from Starred" : "Added to Starred",
        description: `"${file.name}" has been ${
          file.isStarred ? "removed from" : "added to"
        } your starred files`,
        color: "success",
      });
    } catch (err) {
      console.error("Error starring file:", err);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the star status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleTrash = async (file: FileType) => {
    try {
      const response = await axios.patch(`/api/files/${file.id}/trash`);
      const responseData = response.data;
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, isTrash: !f.isTrash } : f))
      );
      addToast({
        title: responseData.isTrash ? "Moved to Trash" : "Restored from Trash",
        description: `"${file.name}" has been ${
          responseData.isTrash ? "moved to trash" : "restored"
        }`,
        color: "success",
      });
    } catch (err) {
      console.error("Error trashing file:", err);
      addToast({
        title: "Action Failed",
        description: "We couldn't update the file status. Please try again.",
        color: "danger",
      });
    }
  };

  const handleDelete = async (file: FileType) => {
    try {
      const response = await axios.delete(`/api/files/${file.id}/delete`);
      if (response.data.success) {
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        addToast({
          title: "File Permanently Deleted",
          description: `"${file.name}" has been permanently removed`,
          color: "success",
        });
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      addToast({
        title: "Deletion Failed",
        description: "We couldn't delete the file. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const response = await axios.delete(`/api/files/empty-trash`);
      if (response.data.success) {
        setFiles((prev) => prev.filter((f) => !f.isTrash));
        addToast({
          title: "Trash Emptied",
          description: "All items have been permanently removed",
          color: "success",
        });
      }
      setEmptyTrashModalOpen(false);
      handleRefresh();
    } catch (err) {
      console.error("Error emptying trash:", err);
      addToast({
        title: "Action Failed",
        description: "We couldn't empty the trash. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleDownload = async (file: FileType) => {
    try {
      addToast({
        title: "Preparing Download",
        description: `Getting "${file.name}" ready for download...`,
        color: "primary",
      });

      if (file.type.startsWith("image/") && file.path) {
        // Use ImageKit URL for images
        const downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Failed to download image");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const response = await fetch(file.fileUrl);
        if (!response.ok) throw new Error("Failed to download file");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      addToast({
        title: "Download Ready",
        description: `"${file.name}" is ready to download.`,
        color: "success",
      });
    } catch (err) {
      console.error("Error downloading file:", err);
      addToast({
        title: "Download Failed",
        description: "We couldn't download the file. Please try again later.",
        color: "danger",
      });
    }
  };

  const handleOpenImage = (file: FileType) => {
    if (file.isFolder) {
      onCurrentFolderChange(file.id);
      setFolderPath((prev) => [...prev, { id: file.id, name: file.name }]);
    } else if (file.type.startsWith("image/") && file.path) {
      const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(optimizedUrl, "_blank");
    }
  };

  const handleFolderCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    handleRefresh();
  }, [handleRefresh]);

  const getTitle = () => {
    if (activeView === "all") {
      return folderPath.length > 0 ? folderPath[folderPath.length - 1].name : "Your Files";
    }
    if (activeView === "starred") return "Starred";
    return "Trash";
  };

  const getSubtitle = () => {
    if (activeView === "all") {
      return `${filteredFiles.length} item${filteredFiles.length === 1 ? "" : "s"} · Private`;
    }
    if (activeView === "starred") return "Files you've marked for quick access.";
    return "Deleted files are kept here for recovery.";
  };

  const getEmptyState = () => {
    if (searchQuery.trim()) {
      return {
        icon: FileText,
        title: "No results found",
        description: `No files match "${searchQuery}". Try a different search.`,
      };
    }
    if (activeView === "starred") {
      return {
        icon: Star,
        title: "No starred files",
        description: "Mark files with a star to find them quickly when you need them.",
      };
    }
    if (activeView === "trash") {
      return {
        icon: Trash2,
        title: "Trash is empty",
        description: "Files you delete will appear here for 30 days before being permanently removed.",
      };
    }
    return {
      icon: UploadCloud,
      title: "No files yet",
      description: "Upload your first file to get started with your personal cloud storage.",
    };
  };

  const emptyState = getEmptyState();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">{getTitle()}</h2>
          <p className="mt-1 text-sm text-white/40">{getSubtitle()}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`rounded-md p-1.5 transition-colors ${
                view === "grid" ? "bg-white/[0.06] text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`rounded-md p-1.5 transition-colors ${
                view === "list" ? "bg-white/[0.06] text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Upload button */}
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-orange-400"
          >
            <UploadCloud className="h-4 w-4" />
            Upload
          </button>

          {/* New folder button */}
          <button
            onClick={() => setFolderCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            aria-label="Refresh files"
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Empty trash */}
          {activeView === "trash" && filteredFiles.length > 0 && (
            <button
              onClick={() => setEmptyTrashModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3.5 py-2 text-[13px] font-medium text-rose-400 transition-colors hover:bg-rose-500/[0.1]"
            >
              <Trash2 className="h-4 w-4" />
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Folder breadcrumbs */}
      {folderPath.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm flex-wrap">
          <button
            onClick={() => {
              onCurrentFolderChange(null);
              setFolderPath([]);
            }}
            className={`rounded-md px-2 py-1 text-[13px] transition-colors hover:bg-white/[0.04] ${
              currentFolder ? "text-white/50 hover:text-white" : "text-white"
            }`}
          >
            Home
          </button>
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <span className="mx-1 text-white/20">/</span>
              <button
                onClick={() => {
                  const newPath = folderPath.slice(0, index + 1);
                  setFolderPath(newPath);
                  onCurrentFolderChange(folder.id);
                }}
                className={`rounded-md px-2 py-1 text-[13px] transition-colors hover:bg-white/[0.04] ${
                  index === folderPath.length - 1
                    ? "text-white font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {error ? (
        <ErrorState message={error} onRetry={fetchFiles} />
      ) : loading ? (
        view === "grid" ? (
          <FileGridSkeleton />
        ) : (
          <FileTableSkeleton />
        )
      ) : filteredFiles.length === 0 ? (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={
            activeView === "all" ? (
              <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-400"
              >
                <UploadCloud className="h-4 w-4" />
                Upload your first file
              </button>
            ) : undefined
          }
        />
      ) : view === "grid" ? (
        <FileGrid
          files={filteredFiles}
          onOpen={handleOpenImage}
          onDownload={handleDownload}
          onToggleStar={handleStar}
          onTrash={handleTrash}
          onDelete={(file) => {
            setSelectedFile(file);
            setDeleteModalOpen(true);
          }}
        />
      ) : (
        <FileTable
          files={filteredFiles}
          onOpen={handleOpenImage}
          onDownload={handleDownload}
          onToggleStar={handleStar}
          onTrash={handleTrash}
          onDelete={(file) => {
            setSelectedFile(file);
            setDeleteModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <FolderCreateModal
        isOpen={folderCreateOpen}
        onClose={() => setFolderCreateOpen(false)}
        userId={userId}
        parentId={currentFolder}
        onFolderCreated={handleFolderCreated}
      />
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Permanent Deletion"
        description={`Are you sure you want to permanently delete "${
          selectedFile?.name || "this file"
        }"? This cannot be undone.`}
        icon={Trash2}
        iconColor="text-rose-400"
        confirmText="Delete Forever"
        confirmColor="danger"
        isDangerous
        warningMessage="Files deleted from trash cannot be recovered."
        onConfirm={() => {
          if (selectedFile) {
            handleDelete(selectedFile);
          }
        }}
      />
      <ConfirmationModal
        isOpen={emptyTrashModalOpen}
        onOpenChange={setEmptyTrashModalOpen}
        title="Empty Trash"
        description="Are you sure you want to permanently delete all files in your trash?"
        icon={Trash2}
        iconColor="text-rose-400"
        confirmText="Empty Trash"
        confirmColor="danger"
        isDangerous
        warningMessage="All files in your trash will be permanently deleted and cannot be recovered."
        onConfirm={handleEmptyTrash}
      />
    </div>
  );
}

function FileGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <FileCardSkeleton key={i} />
      ))}
    </div>
  );
}

function FileTableSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="overflow-x-auto">
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
            {Array.from({ length: 5 }).map((_, i) => (
              <FileRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
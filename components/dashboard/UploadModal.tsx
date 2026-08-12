"use client";

import { useRef, useState } from "react";
import {
  FileUp,
  X,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { addToast } from "@heroui/toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentFolder?: string | null;
  onUploadSuccess?: () => void;
}

interface QueuedFile {
  id: string;
  name: string;
  size: number;
  file: File;
  progress: number;
  status: "queued" | "uploading" | "success" | "error";
  error?: string;
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadModal({
  isOpen,
  onClose,
  userId,
  currentFolder,
  onUploadSuccess,
}: UploadModalProps) {
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearAll = () => setQueuedFiles([]);

  const handleClose = () => {
    clearAll();
    onClose();
  };

  const addFiles = (files: FileList | File[]) => {
    const newFiles: QueuedFile[] = Array.from(files)
      .filter((f) => f.size <= 5 * 1024 * 1024)
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        file,
        progress: 0,
        status: "queued" as const,
      }));

    if (newFiles.length > 0) {
      setQueuedFiles((prev) => [...prev, ...newFiles]);
      // Auto-start upload
      newFiles.forEach((f) => uploadFile(f.id, f.file));
    }
  };

  const uploadFile = async (fileId: string, file: File) => {
    // Mark as uploading
    setQueuedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    try {
      await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setQueuedFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: percent } : f
              )
            );
          }
        },
      });

      setQueuedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "success", progress: 100 } : f
        )
      );

      onUploadSuccess?.();
    } catch (error) {
      setQueuedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error: "Upload failed. Please try again.",
              }
            : f
        )
      );
      addToast({
        title: "Upload Failed",
        description: `"${file.name}" couldn't be uploaded.`,
        color: "danger",
      });
    }
  };

  const removeFile = (fileId: string) => {
    setQueuedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            role="dialog"
            aria-modal="true"
            aria-label="Upload files"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0f] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <UploadCloud className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white/90">
                    Upload files
                  </h2>
                  <p className="text-[11px] text-white/35">
                    Images up to 5MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close upload dialog"
                className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging
                    ? "border-orange-500/40 bg-orange-500/[0.04]"
                    : "border-white/[0.08] bg-white/[0.01] hover:border-orange-500/25 hover:bg-white/[0.02]"
                }`}
              >
                <FileUp className="mb-3 h-8 w-8 text-orange-400/70" />
                <p className="text-sm text-white/70">
                  Drag and drop your images here, or{" "}
                  <span className="font-medium text-orange-400">browse</span>
                </p>
                <p className="mt-1 text-xs text-white/30">
                  JPG, PNG, GIF, WebP · Max 5MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* File list */}
              {queuedFiles.length > 0 && (
                <div className="space-y-2">
                  {queuedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.01] px-3.5 py-3"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          file.status === "success"
                            ? "bg-emerald-500/10"
                            : file.status === "error"
                              ? "bg-rose-500/10"
                              : "bg-orange-500/10"
                        }`}
                      >
                        {file.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : file.status === "error" ? (
                          <AlertTriangle className="h-4 w-4 text-rose-400" />
                        ) : (
                          <FileUp className="h-4 w-4 text-orange-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-medium text-white/80">
                            {file.name}
                          </p>
                          <span className="shrink-0 text-[11px] text-white/35">
                            {formatSize(file.size)}
                          </span>
                        </div>
                        {file.status === "uploading" && (
                          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-200"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                        {file.status === "error" && (
                          <p className="mt-1 text-[11px] text-rose-400">
                            {file.error}
                          </p>
                        )}
                      </div>
                      {(file.status === "queued" ||
                        file.status === "error") && (
                        <button
                          onClick={() => removeFile(file.id)}
                          aria-label={`Remove ${file.name}`}
                          className="shrink-0 rounded-md p-1 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {queuedFiles.length > 0 && (
              <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5">
                <p className="text-[11px] text-white/35">
                  {queuedFiles.filter((f) => f.status === "success").length} of{" "}
                  {queuedFiles.length} uploaded
                </p>
                {queuedFiles.every(
                  (f) =>
                    f.status === "success" ||
                    f.status === "error"
                ) && (
                  <button
                    onClick={handleClose}
                    className="rounded-lg bg-orange-500 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-orange-400"
                  >
                    Done
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
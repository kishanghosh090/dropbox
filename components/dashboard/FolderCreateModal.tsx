"use client";

import { useState } from "react";
import { FolderPlus, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { addToast } from "@heroui/toast";

interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  parentId?: string | null;
  onFolderCreated?: () => void;
}

export default function FolderCreateModal({
  isOpen,
  onClose,
  userId,
  parentId,
  onFolderCreated,
}: FolderCreateModalProps) {
  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleClose = () => {
    setFolderName("");
    onClose();
  };

  const handleCreate = async () => {
    if (!folderName.trim()) {
      addToast({
        title: "Invalid Folder Name",
        description: "Please enter a valid folder name.",
        color: "danger",
      });
      return;
    }

    setCreating(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId,
        parentId: parentId || null,
      });

      addToast({
        title: "Folder Created",
        description: `Folder "${folderName.trim()}" has been created successfully.`,
        color: "success",
      });

      setFolderName("");
      onClose();
      onFolderCreated?.();
    } catch (error) {
      console.error("Error creating folder:", error);
      addToast({
        title: "Folder Creation Failed",
        description: "We couldn't create the folder. Please try again.",
        color: "danger",
      });
    } finally {
      setCreating(false);
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
            aria-label="Create folder"
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0f] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <FolderPlus className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white/90">
                    New Folder
                  </h2>
                  <p className="text-[11px] text-white/35">
                    Organize your files
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              <p className="text-[13px] text-white/50">
                Enter a name for your folder:
              </p>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
                placeholder="My Images"
                autoFocus
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none transition-colors focus:border-orange-500/30 focus:bg-white/[0.03]"
                aria-label="Folder name"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] px-5 py-3.5">
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!folderName.trim() || creating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create
                {!creating && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Code2,
  ExternalLink,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import EmptyState from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { CustomApi } from "@/lib/db/schema";

interface DeveloperViewProps {
  userId: string;
}

const codeSnippet = `// Upload an image to Venthen Space
const formData = new FormData();
formData.append("file", imageFile);
formData.append("apiKey", "YOUR_API_KEY");

const res = await fetch("https://venthen.space/api/upload", {
  method: "POST",
  body: formData,
});

const data = await res.json();
// data.url contains your hosted image`;

const codeSnippet2 = `// Fetch your uploaded media
const res = await fetch(
  "https://venthen.space/api/media?apiKey=YOUR_API_KEY"
);
const images = await res.json();`;

export default function DeveloperView({ userId }: DeveloperViewProps) {
  const [apiKeys, setApiKeys] = useState<CustomApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [apiName, setApiName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<CustomApi | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomApi | null>(null);
  const [showCode, setShowCode] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/api?userId=${userId}`);
      setApiKeys(response.data.data || []);
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setError("We couldn't load your API keys. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    if (!apiName.trim()) return;
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", apiName.trim());
      formData.append("userId", userId);
      const response = await axios.post("/api/api/create", formData);
      const created = response.data[0];
      setNewKey(created);
      setApiKeys((prev) => [created, ...prev]);
      setApiName("");
      addToast({
        title: "API Key Created",
        description: `"${created.name}" API key has been created.`,
        color: "success",
      });
    } catch (err) {
      console.error("Error creating API key:", err);
      addToast({
        title: "Creation Failed",
        description: "We couldn't create the API key. Please try again.",
        color: "danger",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (apiKey: string, id: string) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      addToast({
        title: "Copied to Clipboard",
        description: "API key has been copied.",
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Copy Failed",
        description: "Unable to copy the API key.",
        color: "danger",
      });
    }
  };

  const handleDelete = async (key: CustomApi) => {
    try {
      const formData = new FormData();
      formData.append("apiKeyId", key.id);
      formData.append("userId", userId);
      await axios.post("/api/api/delete", formData);
      setApiKeys((prev) => prev.filter((k) => k.id !== key.id));
      addToast({
        title: "API Key Deleted",
        description: `"${key.name}" API key has been deleted.`,
        color: "success",
      });
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting API key:", err);
      addToast({
        title: "Deletion Failed",
        description: "We couldn't delete the API key. Please try again.",
        color: "danger",
      });
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}••••••••••${key.slice(-4)}`;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Developer APIs
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Build apps that use Venthen Space as your media store.
            </p>
          </div>
          <button
            onClick={() => {
              setCreateOpen(true);
              setNewKey(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-orange-400"
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </button>
        </div>

        {/* Create modal */}
        <AnimatePresence>
          {createOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => {
                  if (!creating && !newKey) setCreateOpen(false);
                }}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                aria-label="Create API key"
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d0f] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
              >
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <KeyRound className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white/90">
                        {newKey ? "API Key Created" : "Create API Key"}
                      </h3>
                      <p className="text-[11px] text-white/35">
                        {newKey
                          ? "Copy this key now — it won't be shown again."
                          : "Give your key a name to identify it."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {newKey ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                        <div className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white/80">
                              {newKey.name}
                            </p>
                            <p className="mt-2 break-all font-mono text-xs text-emerald-300/90">
                              {newKey.apiKey}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(newKey.apiKey, newKey.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-400"
                      >
                        {copiedId === newKey.id ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy API Key
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setCreateOpen(false);
                          setNewKey(null);
                        }}
                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="api-name"
                          className="mb-1.5 block text-[13px] font-medium text-white/60"
                        >
                          API Key Name
                        </label>
                        <input
                          id="api-name"
                          type="text"
                          value={apiName}
                          onChange={(e) => setApiName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreate();
                          }}
                          placeholder="e.g. My Mobile App"
                          autoFocus
                          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none transition-colors focus:border-orange-500/30 focus:bg-white/[0.03]"
                        />
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
                        <p className="text-xs leading-relaxed text-white/40">
                          Use this key to upload, fetch, and manage media in
                          your apps. Keep it secret — anyone with this key can
                          access your media store.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {!newKey && (
                  <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] px-5 py-3.5">
                    <button
                      onClick={() => setCreateOpen(false)}
                      className="rounded-lg px-4 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={!apiName.trim() || creating}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-3.5 w-3.5" />
                          Create Key
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API keys list */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="dash-skeleton h-24 rounded-xl border border-white/[0.06]"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchKeys} />
        ) : apiKeys.length === 0 ? (
          <EmptyState
            icon={KeyRound}
            title="No API keys yet"
            description="Create your first API key to start integrating Venthen Space into your apps."
            action={
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-400"
              >
                <Plus className="h-4 w-4" />
                Create your first key
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key, index) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <KeyRound className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/85">
                        {key.name}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-white/35">
                        {maskKey(key.apiKey.toString())} · Created{" "}
                        {formatDistanceToNow(new Date(key.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(key.apiKey.toString(), key.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {copiedId === key.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(key)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/[0.1]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Integration guide */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08]">
              <Code2 className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/85">
                Quick Integration
              </h3>
              <p className="text-xs text-white/40">
                Use your API key to upload and fetch media from your apps.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCode(!showCode)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {showCode ? "Hide integration guide" : "View integration guide"}
          </button>

          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Upload snippet */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#0d0d0f] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                      <span className="text-xs font-medium text-white/50">
                        Upload media
                      </span>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                        POST /api/upload
                      </span>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/70">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Fetch snippet */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#0d0d0f] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                      <span className="text-xs font-medium text-white/50">
                        Fetch your media
                      </span>
                      <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] text-sky-400">
                        GET /api/media
                      </span>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/70">
                      <code>{codeSnippet2}</code>
                    </pre>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    <p className="text-xs leading-relaxed text-amber-200/60">
                      Keep your API keys secure. Never share them in client-side
                      code, public repositories, or anywhere they could be
                      exposed.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCode(false)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-orange-400 transition-colors hover:text-orange-300"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Hide guide
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete API Key"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        icon={Trash2}
        iconColor="text-rose-400"
        confirmText="Delete Key"
        confirmColor="danger"
        isDangerous
        warningMessage="Applications using this key will immediately lose access to your media store."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </MotionConfig>
  );
}
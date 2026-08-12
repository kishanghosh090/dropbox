"use client";

interface StorageIndicatorProps {
  usedBytes: number;
  totalBytes?: number;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} GB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} TB`;
}

export default function StorageIndicator({
  usedBytes,
  totalBytes = 10 * 1024 * 1024 * 1024, // 10 GB default
}: StorageIndicatorProps) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((usedBytes / totalBytes) * 100))
  );

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
        Storage
      </p>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-white/35">
        {formatBytes(usedBytes)} of {formatBytes(totalBytes)} used
      </p>
    </div>
  );
}
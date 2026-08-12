"use client";

export function FileCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
      <div className="dash-skeleton mb-2.5 h-24 rounded-lg sm:h-28" />
      <div className="dash-skeleton mb-1.5 h-3.5 w-3/4 rounded" />
      <div className="dash-skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

export function FileRowSkeleton() {
  return (
    <tr className="border-b border-white/[0.03]">
      {[0, 1, 2, 3, 4].map((i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="dash-skeleton h-4 rounded" style={{ width: `${[60, 40, 30, 45, 20][i]}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function FileGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <FileCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FileTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.01]">
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
            {Array.from({ length: count }).map((_, i) => (
              <FileRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="dash-skeleton h-7 w-48 rounded" />
          <div className="dash-skeleton h-4 w-64 rounded" />
        </div>
        <div className="dash-skeleton h-9 w-32 rounded-lg" />
      </div>
      <FileGridSkeleton />
    </div>
  );
}
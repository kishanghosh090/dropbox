"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.01] px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
        <Icon className="h-6 w-6 text-white/30" />
      </div>
      <h3 className="text-[15px] font-medium text-white/80">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/40">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const email = user.primaryEmailAddress?.emailAddress || "";
  const initials =
    fullName
      .split(" ")
      .map((name) => name?.[0] || "")
      .join("")
      .toUpperCase() || "U";

  const handleSignOut = () => {
    setIsOpen(false);
    signOut(() => {
      router.push("/");
    });
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-left transition-colors hover:border-white/[0.06] hover:bg-white/[0.02]"
      >
        {user.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt={fullName}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/20 text-xs font-medium text-orange-400">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-white/80">
            {fullName || "User"}
          </p>
          <p className="truncate text-[11px] text-white/35">{email}</p>
        </div>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-white/25" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 z-50 mb-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0f] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div className="py-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/dashboard?tab=profile");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/dashboard");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <FileText className="h-3.5 w-3.5" />
                My Files
              </button>
              <div className="my-1.5 border-t border-white/[0.06]" />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-rose-400 transition-colors hover:bg-rose-500/[0.06] hover:text-rose-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
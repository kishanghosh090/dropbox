"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import FilesView from "@/components/dashboard/FilesView";
import DeveloperView from "@/components/dashboard/DeveloperView";
import UploadModal from "@/components/dashboard/UploadModal";
import UserProfile from "@/components/UserProfile";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [starredCount, setStarredCount] = useState(0);
  const [trashCount, setTrashCount] = useState(0);
  const [usedBytes, setUsedBytes] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const handleCountsChange = useCallback(
    (counts: { starred: number; trash: number; usedBytes: number }) => {
      setStarredCount(counts.starred);
      setTrashCount(counts.trash);
      setUsedBytes(counts.usedBytes);
    },
    []
  );

  const handleUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // If tab=profile, show the profile view
  const showProfile = tabParam === "profile";

  return (
    <>
      <DashboardShell
        starredCount={starredCount}
        trashCount={trashCount}
        usedBytes={usedBytes}
        onUploadClick={() => setIsUploadOpen(true)}
      >
        {({ activeView }) => (
          <div className="space-y-8">
            {showProfile ? (
              <UserProfile />
            ) : activeView === "developers" ? (
              <DeveloperView userId={userId} />
            ) : (
              <FilesView
                key={`${activeView}-${refreshTrigger}`}
                userId={userId}
                activeView={activeView}
                currentFolder={currentFolder}
                onCurrentFolderChange={setCurrentFolder}
                onCountsChange={handleCountsChange}
                onUploadClick={() => setIsUploadOpen(true)}
              />
            )}
          </div>
        )}
      </DashboardShell>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userId={userId}
        currentFolder={currentFolder}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}
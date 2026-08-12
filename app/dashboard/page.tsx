import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardContent
      userId={userId}
      userName={
        user?.firstName ||
        user?.fullName ||
        user?.emailAddresses?.[0]?.emailAddress ||
        ""
      }
    />
  );
}
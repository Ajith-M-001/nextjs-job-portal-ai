import { Suspense } from "react";
import SidebarUserButtonClient from "./_SidebarUserButtonClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";

export const SidebarUserButton = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarUserSuspense />
    </Suspense>
  );
};

async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ allData: true });

  if (!user)
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  return <SidebarUserButtonClient user={user} />;
}

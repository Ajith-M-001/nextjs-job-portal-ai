import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import {
  BrainCircuit,
  ClipboardListIcon,
  LayoutDashboard,
  LogInIcon,
} from "lucide-react";
import React from "react";

const JobSeekerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={[
            { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
            { href: "/ai-search", icon: <BrainCircuit />, label: "AI Search" },
            {
              href: "/employer",
              icon: <LayoutDashboard />,
              label: "Employer DashBoard",
              authStatus: "signedIn",
            },
            {
              href: "/sign-in",
              icon: <LogInIcon />,
              label: "Sign In",
              authStatus: "signedOut",
            },
          ]}
        />
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
};

export default JobSeekerLayout;

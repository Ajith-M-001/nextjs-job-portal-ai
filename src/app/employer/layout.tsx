import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarGroup, SidebarGroupAction, SidebarGroupLabel } from "@/components/ui/sidebar";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import {
    ClipboardListIcon,
    PlusIcon
} from "lucide-react";
import Link from "next/link";
import React from "react";

const EmployerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppSidebar
            content={
                <>
                    <SidebarGroup>
                        <SidebarGroupLabel>Job Listing</SidebarGroupLabel>
                        <SidebarGroupAction title="Add Job Listing" asChild>
                            <Link href="/employer/job-listings/new">
                                <PlusIcon /> <span className="sr-only">Add New Job</span>
                            </Link>
                        </SidebarGroupAction>
                    </SidebarGroup>
                    <SidebarNavMenuGroup
                        className="mt-auto"
                        items={[
                            { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },


                        ]}
                    />
                </>
            }
            footerButton={<SidebarUserButton />}
        >
            {children}
        </AppSidebar>
    );
};

export default EmployerLayout;

"use client";

import React from "react";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import {
    ChevronsUpDown,
    LogOutIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";
import { useClerk } from "@clerk/nextjs";

type User = {
    email: string;
    name: string;
    imageUrl: string;
};

const SidebarUserButtonClient = ({ user }: { user: User }) => {
    // const isMobile = useIsMobile();
    const { isMobile, setOpenMobile } = useSidebar();
    const { openUserProfile } = useClerk();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <UserInfo {...user} />
                    <ChevronsUpDown className="ml-auto group-data-[state=collapsed]:hidden" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={4}
                align="end"
                side={isMobile ? "bottom" : "right"}
                className="min-w-64 max-w-80"
            >
                <DropdownMenuLabel className="font-normal p-1">
                    <UserInfo {...user} />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        openUserProfile();
                        setOpenMobile(false);
                    }}
                >
                    <UserIcon />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/user-settings/notifications"}>
                        <SettingsIcon />
                        <span>Setting</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOutButton>
                    <DropdownMenuItem>
                        <LogOutIcon />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </SignOutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SidebarUserButtonClient;

function UserInfo({ name, email, imageUrl }: User) {
    const nameInitials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    return (
        <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-8 w-8 overflow-hidden rounded-lg">
                <AvatarImage src={imageUrl} alt={name} />
                <AvatarFallback className="uppercase bg-primary text-primary-foreground">
                    {nameInitials}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
                <span className="text-sm truncate font-medium leading-none">
                    {name}
                </span>
                <span className="text-xs truncate leading-none text-muted-foreground">
                    {email}
                </span>
            </div>
        </div>
    );
}

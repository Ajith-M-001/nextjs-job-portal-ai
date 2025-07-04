"use client";

import React from "react";
import { useIsMobile } from "../../../hooks/use-mobile";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type User = {
    email: string;
    name: string;
    imageUrl: string;
};

const SidebarUserButtonClient = ({ user }: { user: User }) => {
    const isMobile = useIsMobile();

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
            <DropdownMenuContent>fsdfasdf</DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SidebarUserButtonClient;

function UserInfo({ name, email, imageUrl }: User) {
    const nameInitials = name.split(" ").map((n) => n[0]).join("");
    return <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="h-8 w-8 overflow-hidden rounded-lg">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">{nameInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
            <span className="text-sm truncate font-medium leading-none">{name}</span>
            <span className="text-xs truncate leading-none text-muted-foreground">{email}</span>
        </div>
    </div>;
}

"use client";
import React, { ReactNode } from "react";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";
import { SignedIn, SignedOut } from "@/services/clerk/components/SignInStatus";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarGroupProps = {
    items: {
        href: string;
        icon: ReactNode;
        label: string;
        authStatus?: "signedOut" | "signedIn";
    }[];
    className?: string;
};
const SidebarNavMenuGroup = ({ items, className }: SidebarGroupProps) => {
    const pathname = usePathname();
    return (
        <SidebarGroup className={className}>
            <SidebarMenu>
                {items.map((item) => {
                    const html = (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );

                    if (item.authStatus === 'signedOut') {
                        return <SignedOut key={item.href}>{html}</SignedOut>
                    } else {
                        return <SignedIn key={item.href}>{html}</SignedIn>
                    }

                    return html;
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export default SidebarNavMenuGroup;

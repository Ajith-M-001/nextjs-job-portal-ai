import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import SidebarUserButtonClient from "./_SidebarUserButtonClient";

export const SidebarUserButton = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SidebarUserSuspense />
        </Suspense>
    );
};

async function SidebarUserSuspense() {
    const { userId } = await auth();
    return (
        <SidebarUserButtonClient
            user={{
                email: "kyle@test.com",
                name: "Kyle Cook",
                imageUrl:
                    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
            }}
        />
    );
}

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebarClient from "./_AppSidebarClient";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { SignedIn, SignedOut } from "@/services/clerk/components/SignInStatus";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";

const Homepage = () => {
  return <SidebarProvider className="overflow-y-hidden">
    <AppSidebarClient>
      <Sidebar collapsible="icon" className="overflow-y-hidden">
        <SidebarHeader className="flex-row">
          <SidebarTrigger />
          <span className="text-xl  text-nowrap">Apply Hub</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SignedOut>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/sign-in">
                      <LogInIcon />
                      <span>Sign-In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedOut>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarUserButton />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">adsfdsf</main>
    </AppSidebarClient>
  </SidebarProvider>;
};

export default Homepage;

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebarClient from "./_AppSidebarClient";

const Homepage = () => {
  return <SidebarProvider className="overflow-y-hidden">
    <AppSidebarClient>
      <Sidebar collapsible="icon" className="overflow-y-hidden">
        <SidebarHeader className="flex-row">
          <SidebarTrigger />
          <span className="text-xl  text-nowrap">Apply Hub</span>
        </SidebarHeader>
        <SidebarContent>
          menu list
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Logout</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">adsfdsf</main>
    </AppSidebarClient>
  </SidebarProvider>;
};

export default Homepage;

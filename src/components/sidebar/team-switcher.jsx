import logo from "@/assets/images/logo.png";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

export function TeamSwitcher({ slug }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <NavLink to={`/admin/${slug}/users/super-admin`}>
              <SidebarMenuButton
                size="xl"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src={logo} alt="logo" className="h-8" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-2xl">
                    {import.meta.env.VITE_APP_NAME}
                  </span>
                  <span className="truncate text-xs">
                    {/* Customer Relationship Manager */}A test CRM project
                  </span>
                </div>
              </SidebarMenuButton>
            </NavLink>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

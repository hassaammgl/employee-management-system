import { Button } from "@/components/ui/button";
import {
  Sidebar as Bar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  StickyNote,
  Users,
  Warehouse,
} from "lucide-react";
import { NavLink } from "react-router";

const Sidebar = () => {
  const { open } = useSidebar();
  return (
    <Bar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Appname />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="destructive"
          onClick={() => {
            console.log("Logged out");
            // TODO: Replace with your logout function
          }}
        >
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Bar>
  );
};

export default Sidebar;

const items = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: Users,
  },
  {
    title: "Departments",
    url: "/admin/departments",
    icon: Warehouse,
  },
  {
    title: "Leaves",
    url: "/admin/leaves",
    icon: StickyNote,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const Appname = () => {
  const { open } = useSidebar();
  return (
    <h1 className={cn("font-bold text-center", open ? "text-3xl" : "text-sm")}>
      {open ? (
        <>
          <span className="text-primary">E.M.</span> System{" "}
        </>
      ) : (
        <>
          <span className="text-primary">EM</span>S
        </>
      )}
    </h1>
  );
};

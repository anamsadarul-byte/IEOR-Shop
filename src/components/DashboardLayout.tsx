import { Outlet, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Package, BarChart3, CalendarDays, TrendingUp, AlertTriangle, Table2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Executive Summary", url: "/dashboard", icon: BarChart3 },
  { title: "Order Schedule", url: "/dashboard/orders", icon: CalendarDays },
  { title: "Inventory Flow", url: "/dashboard/inventory", icon: TrendingUp },
  { title: "Waste & Shortage", url: "/dashboard/waste", icon: AlertTriangle },
  { title: "Item Details", url: "/dashboard/items", icon: Table2 },
];

const DashboardLayout = () => {
  const { logout } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r-0">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
                <Package className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-sidebar-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  IEOR
                </h2>
                <p className="text-xs text-sidebar-foreground/60">Shop Dashboard</p>
              </div>
            </div>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/dashboard"}
                          className="hover:bg-sidebar-accent/50"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1 ieor-bg ieor-grid-bg relative">
          <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger />
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

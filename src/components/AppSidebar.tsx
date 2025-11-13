import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  ClipboardList,
  LayoutGrid,
  Package,
  Wrench,
  CheckCircle,
  BarChart3,
  Users,
  History,
  Layers,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: ClipboardList, label: 'Work Orders', path: '/work-orders' },
  { icon: LayoutGrid, label: 'Assignment', path: '/assignment' },
  { icon: History, label: 'Assignment History', path: '/assignment-history' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Layers, label: 'Part Requests', path: '/part-requests' },
  { icon: Wrench, label: 'Equipment', path: '/equipment' },
  { icon: CheckCircle, label: 'Verify', path: '/verify' },
  { icon: Users, label: 'Staff', path: '/staff' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

export function AppSidebar() {
  const { user } = useAuth();
  const { open } = useSidebar();
  const location = useLocation();

  const filteredNavItems = NAV_ITEMS;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={open ? 'w-60' : 'w-14'} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          {open && <span className="text-xl font-bold tracking-tight">EMMS</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <NavLink to={item.path}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

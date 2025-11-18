import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  FileText,
  Wrench,
  Pin,
  LogOut,
  ClipboardList,
  Package,
  ShoppingCart,
  Users,
  History,
  Briefcase,
} from 'lucide-react';
import sahcoLogo from '@/assets/sahco-logo.png';

const MENU_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutGrid },
  { label: 'Work Orders', path: '/work-orders', icon: FileText },
  { label: 'Equipment', path: '/equipment', icon: Wrench },
  { label: 'Assignment Board', path: '/assignment', icon: ClipboardList },
  { label: 'Inventory', path: '/inventory', icon: Package },
  { label: 'Part Requests', path: '/part-requests', icon: ShoppingCart },
  { label: 'Staff List', path: '/staff', icon: Users },
  { label: 'Assignment History', path: '/assignment-history', icon: History },
  { label: 'Tech', path: '/tech', icon: Briefcase },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1a3a52] text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={sahcoLogo} alt="SAHCO" className="h-8" />
            <div className="text-xs leading-tight">
              <div className="font-semibold">Skyway Aviation</div>
              <div className="text-white/80">Handling Company Plc.</div>
            </div>
          </div>
          <button className="text-white/60 hover:text-white">
            <Pin className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-white/90 hover:bg-white/5'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

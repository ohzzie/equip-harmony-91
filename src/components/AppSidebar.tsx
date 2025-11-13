import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  FileText,
  Wrench,
  Pin,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import sahcoLogo from '@/assets/sahco-logo.png';

const HOME_SUBMENU = [
  { label: 'Operations', path: '/operations' },
  { label: 'Planning & Assignment', path: '/assignment' },
  { label: 'Technician', path: '/technician' },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [homeExpanded, setHomeExpanded] = useState(true);

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
      <nav className="flex-1 py-6 px-4 space-y-2">
        {/* Home with submenu */}
        <div>
          <button
            onClick={() => setHomeExpanded(!homeExpanded)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-primary text-white'
                : 'text-white/90 hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="h-5 w-5 text-primary" />
            <span className="flex-1 text-left font-medium">Home</span>
            {homeExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {homeExpanded && (
            <div className="ml-12 mt-1 space-y-1">
              {HOME_SUBMENU.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Work Order */}
        <NavLink
          to="/work-orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-white/90 hover:bg-white/5'
            }`
          }
        >
          <FileText className="h-5 w-5" />
          <span className="font-medium">Work Order</span>
        </NavLink>

        {/* Equipment */}
        <NavLink
          to="/equipment"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-white/90 hover:bg-white/5'
            }`
          }
        >
          <Wrench className="h-5 w-5" />
          <span className="font-medium">Equipment</span>
        </NavLink>
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

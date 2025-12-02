import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Users,
  Vote,
  Settings,
  LogOut,
  FileText,
  PlusCircle,
  Eye,
  UserCog,
  BarChart3,
  Upload,
  User,
  History,
  Bell,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const userNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
  { name: 'Explore', path: '/user/dashboard/explore', icon: Compass },
  { name: 'Voting', path: '/user/dashboard/voting', icon: Vote },
  { name: 'Events', path: '/user/dashboard/events', icon: Calendar },
  { name: 'My Registrations', path: '/user/dashboard/registrations', icon: Trophy },
  { name: 'My Profile', path: '/user/dashboard/profile', icon: User },
];

const judgeNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/judge/dashboard', icon: LayoutDashboard },
  { name: 'Submissions', path: '/judge/dashboard/submissions', icon: FileText },
  { name: 'Voting Panel', path: '/judge/dashboard/voting', icon: Vote },
  { name: 'Entries', path: '/judge/dashboard/entries', icon: Eye },
  { name: 'My Profile', path: '/judge/dashboard/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Create Competition', path: '/admin/dashboard/create', icon: PlusCircle },
  { name: 'View Competitions', path: '/admin/dashboard/competitions', icon: Eye },
  { name: 'Manage Judges', path: '/admin/dashboard/judges', icon: UserCog },
  { name: 'Manage Users', path: '/admin/dashboard/users', icon: Users },
  { name: 'Voting Outcomes', path: '/admin/dashboard/outcomes', icon: BarChart3 },
  { name: 'Notifications', path: '/admin/dashboard/notifications', icon: Bell },
  { name: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
];

export const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const { user, logout, role } = useAuth();
  const location = useLocation();

  const navItems =
    role === 'admin' ? adminNavItems : role === 'judge' ? judgeNavItems : userNavItems;

  const roleColors = {
    user: 'from-primary to-red-dark',
    judge: 'from-secondary to-accent',
  admin: 'from-red to-red-dark',
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
              roleColors[role || 'user']
            )}
          >
            <span className="text-primary-foreground font-display font-bold text-lg">S</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="font-display font-bold text-sidebar-foreground">Story Seed</span>
              <span className="text-xs text-muted-foreground capitalize">{role} Portal</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium animate-fade-in">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {user && (
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent',
              collapsed && 'justify-center'
            )}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-sidebar-primary text-sidebar-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
};

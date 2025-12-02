import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/PreferencesContext';

interface DashboardLayoutProps {
  requiredRole: 'user' | 'judge' | 'admin';
}

export const DashboardLayout = ({ requiredRole }: DashboardLayoutProps) => {
  const { isAuthenticated, role } = useAuth();
  const { theme } = usePreferences();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Only apply dark mode styling inside the dashboard area.
  // Login / signup and public pages remain on the global light theme.
  const effectiveTheme = theme === 'dark' ? 'dark' : 'light';

  if (!isAuthenticated) {
    return <Navigate to={`/${requiredRole}`} replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return (
    <div className={effectiveTheme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-muted/30">
        <DashboardSidebar
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        <div
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          <DashboardHeader />
          <main className="p-6 page-enter">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

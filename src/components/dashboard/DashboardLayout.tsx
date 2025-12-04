import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  requiredRole: 'user' | 'judge' | 'admin';
}

export const DashboardLayout = ({ requiredRole }: DashboardLayoutProps) => {
  const { isAuthenticated, role } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  if (!isAuthenticated) {
    return <Navigate to={`/${requiredRole}`} replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  const contentOffset = cn(
    'transition-all duration-300',
    isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {isMobile && (
        <div
          className={cn(
            'fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden',
            isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <DashboardSidebar
        collapsed={isMobile ? false : isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobile={isMobile}
        isOpen={isMobile ? isMobileSidebarOpen : true}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className={contentOffset}>
        <DashboardHeader onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import { Outlet, Navigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  requiredRole: 'user' | 'judge' | 'admin';
}

export const DashboardLayout = ({ requiredRole }: DashboardLayoutProps) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${requiredRole}`} replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <MobileHeader />
        <div className="hidden lg:flex justify-end p-4 pb-0">
          <span className="text-muted-foreground">
            {getGreeting()}, <span className="text-foreground font-medium">{displayName}</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto bg-background p-4 lg:p-8 lg:pt-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

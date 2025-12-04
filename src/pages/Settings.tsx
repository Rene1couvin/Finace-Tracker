import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-4xl mx-auto pb-10">
        <div className="mb-8 mt-2 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Account: {user?.email}</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-lg text-foreground">Profile Settings</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
              <input
                type="text"
                value={user?.displayName || ''}
                className="w-full px-4 py-3 bg-muted border-none rounded-xl text-foreground"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-4 py-3 bg-muted border-none rounded-xl text-foreground"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-lg text-foreground">Account Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">User ID</span>
              <span className="text-foreground font-mono text-sm">{user?.uid?.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Email Verified</span>
              <span className={`font-semibold ${user?.emailVerified ? 'text-primary' : 'text-destructive'}`}>
                {user?.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground">Account Created</span>
              <span className="text-foreground">
                {user?.metadata?.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString() 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

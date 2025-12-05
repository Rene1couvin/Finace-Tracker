import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Pencil, Check, X } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    setSaving(true);
    try {
      await updateUserProfile(displayName.trim());
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
  };

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
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1"
                      placeholder="Enter your name"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSave} 
                      disabled={saving}
                      className="shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      type="text"
                      value={user?.displayName || ''}
                      className="flex-1 bg-muted"
                      disabled
                    />
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="shrink-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <Input
                type="email"
                value={user?.email || ''}
                className="bg-muted"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
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

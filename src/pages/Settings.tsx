import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User, Settings as SettingsIcon, AlertTriangle, Lock, Bell } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type TabType = 'profile' | 'preferences' | 'account';

const Settings: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    setSaving(true);
    try {
      await updateUserProfile(displayName.trim());
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available in this demo');
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'preferences' as TabType, label: 'Preferences', icon: SettingsIcon },
    { id: 'account' as TabType, label: 'Account', icon: AlertTriangle },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-4xl mx-auto pb-10">
        <div className="mb-8 mt-2 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Tab Navigation */}
        <div className="bg-muted/50 rounded-full p-1 flex mb-8 border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
            <h3 className="font-bold text-lg text-foreground">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  className="bg-muted/50"
                  disabled
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <h4 className="font-medium text-foreground">Password</h4>
                <p className="text-sm text-primary">Change your password</p>
              </div>
              <Button variant="outline" onClick={handleChangePassword} className="gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving || displayName === user?.displayName}
                className="w-full sm:w-auto"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
            <h3 className="font-bold text-lg text-foreground">App Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                  <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-primary">Get notified about transactions</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-destructive/10 rounded-2xl border-2 border-destructive/20 p-6">
            <h3 className="font-bold text-lg text-destructive mb-4">Danger Zone</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-destructive/80">This action cannot be undone</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;

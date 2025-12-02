import { useState } from 'react';
import { Bell, Shield, UserCog, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
}

const notificationPrefs: PreferenceToggle[] = [
  {
    id: 'competition-updates',
    label: 'Competition updates',
    description: 'Get notified when competitions go live or change status.',
  },
  {
    id: 'judge-alerts',
    label: 'Judge alerts',
    description: 'Remind judges about pending reviews or approvals.',
  },
  {
    id: 'user-registrations',
    label: 'User registrations',
    description: 'Receive alerts when daily registration targets are met.',
  },
];

const securityPrefs: PreferenceToggle[] = [
  {
    id: '2fa',
    label: 'Two-factor authentication',
    description: 'Add an extra layer of security to your admin account.',
  },
  {
    id: 'login-alerts',
    label: 'Login alerts',
    description: 'Notify me when a new device logs into the admin portal.',
  },
];

const AdminSettings = () => {
  const { toast } = useToast();
  const [about, setAbout] = useState('');
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    'competition-updates': true,
    'judge-alerts': true,
    'user-registrations': false,
    '2fa': false,
    'login-alerts': true,
  });

  const handleToggle = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Profile updated', description: 'Your settings were saved successfully.' });
  };

  return (
    <div className="space-y-6 page-enter max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your admin profile, notifications, and security.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <section className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <div className="flex items-center gap-3 text-foreground">
            <UserCog className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-display text-xl font-semibold">Admin Profile</h2>
              <p className="text-sm text-muted-foreground">Update basic details displayed in the dashboard.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full name</label>
              <Input placeholder="e.g., Madhan Kumar" defaultValue="Madhan Kumar" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input type="email" placeholder="name@storyseed.com" defaultValue="madhan@storyseed.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Input disabled defaultValue="Admin" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contact number</label>
              <Input placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">About</label>
            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Share a brief bio or note for the judge/user portals."
              rows={4}
            />
          </div>
        </section>

        <section className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <div className="flex items-center gap-3 text-foreground">
            <Bell className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-display text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Choose what you want to be notified about via email or dashboard alerts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {notificationPrefs.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 border border-border/40 rounded-xl p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={prefs[item.id]}
                  onCheckedChange={() => handleToggle(item.id)}
                  aria-label={item.label}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <div className="flex items-center gap-3 text-foreground">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-display text-xl font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Control login safety and platform access.</p>
            </div>
          </div>

          <div className="space-y-4">
            {securityPrefs.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 border border-border/40 rounded-xl p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={prefs[item.id]}
                  onCheckedChange={() => handleToggle(item.id)}
                  aria-label={item.label}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-foreground">Reset password</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" variant="hero" className="gap-2">
            <Save className="w-4 h-4" />
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { usePreferences } from '@/contexts/PreferencesContext';

export const DashboardHeader = () => {
  const { user, role } = useAuth();
  const { language: globalLanguage, setLanguage: setGlobalLanguage, theme: globalTheme, setTheme: setGlobalTheme } =
    usePreferences();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'appearance' | 'account'>('general');
  const [language, setLanguage] = useState<'English' | 'Tamil'>(globalLanguage === 'ta' ? 'Tamil' : 'English');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  // Locally treat theme as just light or dark so appearance changes affect only the dashboard,
  // and keep light as the default if anything else is stored.
  const [theme, setTheme] = useState<'light' | 'dark'>(globalTheme === 'dark' ? 'dark' : 'light');
  const [compactLayout, setCompactLayout] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-6 py-4">
      <div className="flex items-center justify-end">
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Settings */}
          <button
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Profile – direct link to profile page */}
          <button
            onClick={() => navigate(`/${role}/dashboard/profile`)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
            />
          </button>
        </div>
      </div>

      {/* Settings dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mt-4 items-start">
            {/* Left menu */}
            <div className="w-40 border-r border-border pr-4 space-y-1 text-sm">
              {[
                { id: 'general', label: 'General' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'account', label: 'Account' },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                  onClick={() =>
                    setActiveSection(item.id as typeof activeSection)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right content */}
            <div className="flex-1 space-y-4 text-sm">
              {activeSection === 'general' && (
                <>
                  <h3 className="font-semibold text-foreground">General</h3>
                  <p className="text-xs text-muted-foreground">
                    Basic preferences for your Story Seed dashboard.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Language</p>
                        <p className="text-xs text-muted-foreground">
                          Currently set to {language}.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const next = language === 'English' ? 'Tamil' : 'English';
                          setLanguage(next);
                          setGlobalLanguage(next === 'English' ? 'en' : 'ta');
                          toast({
                            title: 'Language updated',
                            description: `Interface language set to ${next}.`,
                          });
                        }}
                      >
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Email updates</p>
                        <p className="text-xs text-muted-foreground">
                          Receive important updates about events and results.
                        </p>
                      </div>
                      <Switch
                        checked={emailUpdates}
                        onCheckedChange={(checked) => {
                          setEmailUpdates(!!checked);
                          toast({
                            title: 'Email updates',
                            description: checked
                              ? 'You will receive important updates.'
                              : 'Email updates turned off.',
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Auto-play animations</p>
                        <p className="text-xs text-muted-foreground">
                          Play subtle animations on dashboard cards.
                        </p>
                      </div>
                      <Switch
                        checked={compactLayout}
                        onCheckedChange={(checked) => {
                          setCompactLayout(!!checked);
                          toast({
                            title: 'Dashboard animations',
                            description: checked
                              ? 'Animations enabled.'
                              : 'Animations disabled.',
                          });
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'notifications' && (
                <>
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Control how you&apos;re notified about events, votes and
                    results.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Email notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Get emails when registrations open or results are
                          announced.
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={(checked) => {
                          setEmailNotifications(!!checked);
                          toast({
                            title: 'Email notifications',
                            description: checked
                              ? 'Email notifications enabled.'
                              : 'Email notifications disabled.',
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">In-app alerts</p>
                        <p className="text-xs text-muted-foreground">
                          Show reminders about upcoming deadlines.
                        </p>
                      </div>
                      <Switch
                        checked={inAppAlerts}
                        onCheckedChange={(checked) => {
                          setInAppAlerts(!!checked);
                          toast({
                            title: 'In-app alerts',
                            description: checked
                              ? 'You will see deadline reminders.'
                              : 'In-app alerts muted.',
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          Weekly summary email
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Get a weekly summary of your submissions and votes.
                        </p>
                      </div>
                      <Switch
                        checked={weeklySummary}
                        onCheckedChange={(checked) => {
                          setWeeklySummary(!!checked);
                          toast({
                            title: 'Weekly summary',
                            description: checked
                              ? 'Weekly summary enabled.'
                              : 'Weekly summary disabled.',
                          });
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'appearance' && (
                <>
                  <h3 className="font-semibold text-foreground">Appearance</h3>
                  <p className="text-xs text-muted-foreground">
                    Personalise how Story Seed looks on your dashboard.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Theme</p>
                        <p className="text-xs text-muted-foreground">
                          Switch between light and dark themes. Currently:{' '}
                          <span className="font-medium capitalize">
                            {theme}
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const next = theme === 'light' ? 'dark' : 'light';
                          setTheme(next);
                          setGlobalTheme(next);
                          toast({
                            title: 'Theme updated',
                            description: `Theme set to ${next}.`,
                          });
                        }}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Compact layout</p>
                        <p className="text-xs text-muted-foreground">
                          Reduce padding on cards to see more content at once.
                        </p>
                      </div>
                      <Switch
                        checked={compactLayout}
                        onCheckedChange={(checked) => {
                          setCompactLayout(!!checked);
                          toast({
                            title: 'Layout updated',
                            description: checked
                              ? 'Compact layout enabled.'
                              : 'Compact layout disabled.',
                          });
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'account' && (
                <>
                  <h3 className="font-semibold text-foreground">Account</h3>
                  <p className="text-xs text-muted-foreground">
                    Manage your Story Seed account details.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Profile</p>
                        <p className="text-xs text-muted-foreground">
                          Update your name, school and contact information.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSettingsOpen(false);
                          navigate(`/${role}/dashboard/profile`);
                        }}
                      >
                        Open profile
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Security</p>
                        <p className="text-xs text-muted-foreground">
                          Change your password or sign out from all devices.
                        </p>
                      </div>
                      <Switch
                        checked={rememberDevice}
                        onCheckedChange={(checked) => {
                          setRememberDevice(!!checked);
                          toast({
                            title: 'Security setting',
                            description: checked
                              ? 'This device will be remembered.'
                              : 'This device will not be remembered.',
                          });
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

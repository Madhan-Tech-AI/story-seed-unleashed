import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DashboardHeader = () => {
  const { user, role } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const notifications = [
    { id: 1, text: 'New submission received', time: '5 min ago', unread: true },
    { id: 2, text: 'Voting round starts in 2 hours', time: '1 hour ago', unread: true },
    { id: 3, text: 'Registration deadline extended', time: '2 hours ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>

          {/* Settings */}
          <Link to={`/${role}/dashboard/profile`}>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="hidden md:block text-left">
                <p className="font-medium text-foreground text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl shadow-lg border border-border overflow-hidden animate-scale-in">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
                    Notifications
                  </p>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                        notif.unread
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-muted'
                      )}
                    >
                      <p className="text-foreground">{notif.text}</p>
                      <p className="text-xs text-muted-foreground">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

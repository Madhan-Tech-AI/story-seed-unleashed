import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 page-enter max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>
      <div className="bg-card p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/20" />
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium">Full Name</label><Input defaultValue={user?.name} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input defaultValue={user?.email} type="email" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium">Phone</label><Input defaultValue="+91 98765 43210" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">City</label><Input defaultValue="Mumbai" /></div>
          </div>
          <Button variant="hero" className="w-fit"><Save className="w-4 h-4" />Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

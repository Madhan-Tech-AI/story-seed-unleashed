import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

const JudgeProfile = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 page-enter max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">Judge Profile</h1>
      <div className="bg-card p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-4 border-secondary/20" />
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-secondary font-medium">Judge</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium">Full Name</label><Input defaultValue={user?.name} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input defaultValue={user?.email} type="email" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Expertise</label><Input defaultValue="Children's Literature, Fantasy, Creative Writing" /></div>
          <Button variant="gold" className="w-fit"><Save className="w-4 h-4" />Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default JudgeProfile;

import { Users, Mail, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const judges = [
  { id: 1, name: 'Raj Patel', email: 'raj@example.com', reviews: 156, status: 'Active' },
  { id: 2, name: 'Anita Verma', email: 'anita@example.com', reviews: 203, status: 'Active' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', reviews: 89, status: 'Inactive' },
];

const AdminJudges = () => (
  <div className="space-y-6 page-enter">
    <div className="flex justify-between items-center">
      <h1 className="font-display text-2xl font-bold text-foreground">Manage Judges</h1>
      <Button variant="hero"><Users className="w-4 h-4" />Add Judge</Button>
    </div>
    <div className="grid gap-4">
      {judges.map((judge) => (
        <div key={judge.id} className="bg-card p-6 rounded-2xl border border-border/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-secondary" /></div>
            <div>
              <h3 className="font-semibold text-foreground">{judge.name}</h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1"><Mail className="w-3 h-3" />{judge.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">{judge.reviews} reviews</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${judge.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>{judge.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminJudges;

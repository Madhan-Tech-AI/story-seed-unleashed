import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const competitions = [
  { id: 1, name: 'Summer Championship 2025', participants: 2500, status: 'Live', votes: 12500 },
  { id: 2, name: 'Monsoon Tales Festival', participants: 1800, status: 'Upcoming', votes: 0 },
  { id: 3, name: 'Diwali Story Sparkle', participants: 2200, status: 'Upcoming', votes: 0 },
  { id: 4, name: 'Winter Wonder Tales', participants: 1500, status: 'Draft', votes: 0 },
];

const AdminCompetitions = () => (
  <div className="space-y-6 page-enter">
    <h1 className="font-display text-2xl font-bold text-foreground">Manage Competitions</h1>
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50"><tr><th className="text-left p-4 font-medium text-foreground">Competition</th><th className="text-left p-4 font-medium text-foreground">Participants</th><th className="text-left p-4 font-medium text-foreground">Votes</th><th className="text-left p-4 font-medium text-foreground">Status</th><th className="text-left p-4 font-medium text-foreground">Actions</th></tr></thead>
        <tbody>
          {competitions.map((comp) => (
            <tr key={comp.id} className="border-t border-border/50">
              <td className="p-4 font-medium text-foreground">{comp.name}</td>
              <td className="p-4 text-muted-foreground">{comp.participants.toLocaleString()}</td>
              <td className="p-4 text-muted-foreground">{comp.votes.toLocaleString()}</td>
              <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${comp.status === 'Live' ? 'bg-green-100 text-green-700' : comp.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-muted text-muted-foreground'}`}>{comp.status}</span></td>
              <td className="p-4"><div className="flex gap-2"><Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button><Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminCompetitions;

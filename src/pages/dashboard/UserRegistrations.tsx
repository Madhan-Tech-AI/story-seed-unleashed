import { FileText, Eye, Trophy } from 'lucide-react';

const registrations = [
  { id: 1, title: 'The Magical Garden', competition: 'Summer Championship 2025', status: 'Under Review', votes: 156, date: 'June 20, 2025' },
  { id: 2, title: 'Adventures in Mumbai', competition: 'City Tales 2024', status: 'Approved', votes: 234, date: 'May 15, 2024' },
  { id: 3, title: 'Robot Friends Forever', competition: 'Sci-Fi Stories 2024', status: 'Winner', votes: 512, date: 'March 10, 2024' },
];

const UserRegistrations = () => (
  <div className="space-y-6 page-enter">
    <h1 className="font-display text-2xl font-bold text-foreground">My Registrations</h1>
    <div className="grid gap-4">
      {registrations.map((reg) => (
        <div key={reg.id} className="bg-card p-6 rounded-2xl border border-border/50 card-hover">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{reg.title}</h3>
              <p className="text-muted-foreground text-sm">{reg.competition}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${reg.status === 'Winner' ? 'bg-secondary text-secondary-foreground' : reg.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{reg.status}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Trophy className="w-4 h-4" />{reg.votes} votes</span>
            <span>Submitted: {reg.date}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserRegistrations;

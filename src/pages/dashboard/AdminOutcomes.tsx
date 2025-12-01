import { Trophy, TrendingUp, ArrowUp } from 'lucide-react';

const outcomes = [
  { rank: 1, title: 'The Magical Garden', author: 'Ananya S.', votes: 1250, change: '+125' },
  { rank: 2, title: 'Adventures in Mumbai', author: 'Arjun P.', votes: 1180, change: '+89' },
  { rank: 3, title: 'Grandmother\'s Recipe', author: 'Priya R.', votes: 1050, change: '+67' },
  { rank: 4, title: 'Robot Who Danced', author: 'Vikram S.', votes: 920, change: '+45' },
  { rank: 5, title: 'Lost in Himalayas', author: 'Meera G.', votes: 850, change: '+32' },
];

const AdminOutcomes = () => (
  <div className="space-y-6 page-enter">
    <h1 className="font-display text-2xl font-bold text-foreground">Voting Outcomes</h1>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 mb-6"><Trophy className="w-5 h-5 text-secondary" /><h2 className="font-display text-xl font-semibold text-foreground">Current Leaderboard</h2></div>
        <div className="space-y-3">
          {outcomes.map((entry, i) => (
            <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl rank-rise ${i === 0 ? 'bg-gradient-to-r from-secondary/20 to-accent/10' : 'bg-muted/30'}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>{entry.rank}</div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{entry.title}</p>
                <p className="text-xs text-muted-foreground">{entry.author}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground text-sm flex items-center gap-1"><ArrowUp className="w-3 h-3 text-green-500" />{entry.votes.toLocaleString()}</p>
                <p className="text-xs text-green-600">{entry.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-primary" /><h2 className="font-display text-xl font-semibold text-foreground">Statistics</h2></div>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-xl"><p className="text-muted-foreground text-sm">Total Votes Today</p><p className="font-display text-3xl font-bold text-foreground">2,456</p></div>
          <div className="p-4 bg-muted/30 rounded-xl"><p className="text-muted-foreground text-sm">Active Voters</p><p className="font-display text-3xl font-bold text-foreground">1,234</p></div>
          <div className="p-4 bg-muted/30 rounded-xl"><p className="text-muted-foreground text-sm">Avg. Votes per Entry</p><p className="font-display text-3xl font-bold text-foreground">156</p></div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminOutcomes;

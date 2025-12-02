import { Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const submissions = [
  { id: 1, title: 'The Magical Garden', author: 'Ananya S.', age: 10, category: 'Fantasy', time: '2 hours ago' },
  { id: 2, title: 'Robot Friends', author: 'Vikram P.', age: 12, category: 'Sci-Fi', time: '5 hours ago' },
  { id: 3, title: 'Monsoon Magic', author: 'Priya R.', age: 9, category: 'Adventure', time: '1 day ago' },
  { id: 4, title: 'The Lost Treasure', author: 'Arjun M.', age: 11, category: 'Mystery', time: '2 days ago' },
];

const JudgeSubmissions = () => (
  <div className="space-y-6 page-enter">
    <h1 className="font-display text-2xl font-bold text-foreground">Pending Submissions</h1>
    <div className="grid gap-4">
      {submissions.map((sub) => (
        <div key={sub.id} className="bg-card p-6 rounded-2xl border border-border/50 flex justify-between items-center card-hover">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{sub.title}</h3>
            <p className="text-muted-foreground text-sm">By {sub.author}, Age {sub.age} • {sub.category}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{sub.time}</p>
          </div>
          <Link to="/judge/dashboard/voting"><Button variant="outline" size="sm"><Eye className="w-4 h-4" />Review</Button></Link>
        </div>
      ))}
    </div>
  </div>
);

export default JudgeSubmissions;

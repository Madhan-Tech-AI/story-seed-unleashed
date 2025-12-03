import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const submissions = [
  { id: 1, eventName: 'The Magical Garden' },
  { id: 2, eventName: 'Robot Friends' },
  { id: 3, eventName: 'Monsoon Magic' },
  { id: 4, eventName: 'The Lost Treasure' },
];

const JudgeSubmissions = () => (
  <div className="space-y-6 page-enter">
    <h1 className="font-display text-2xl font-bold text-foreground">Pending Submissions</h1>
    <div className="grid gap-4">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="bg-card p-6 rounded-2xl border border-border/50 flex justify-between items-center card-hover"
        >
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {submission.eventName}
            </h3>
          </div>
          <Link to="/judge/dashboard/voting">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
              Review
            </Button>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default JudgeSubmissions;

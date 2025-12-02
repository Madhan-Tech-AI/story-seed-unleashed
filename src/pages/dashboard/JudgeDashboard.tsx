import { FileText, CheckCircle, Clock, Star, Eye, Vote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useAuth } from '@/contexts/AuthContext';

const pendingSubmissions = [
  { id: 1, title: 'The Magical Garden', author: 'Ananya S.', age: 10, category: 'Fantasy', submitted: '2 hours ago' },
  { id: 2, title: 'Robot Friends', author: 'Vikram P.', age: 12, category: 'Sci-Fi', submitted: '5 hours ago' },
  { id: 3, title: 'Monsoon Magic', author: 'Priya R.', age: 9, category: 'Adventure', submitted: '1 day ago' },
];

const recentReviews = [
  { id: 1, title: 'Adventures in Space', score: 8.5, status: 'Approved' },
  { id: 2, title: 'The Lost Kingdom', score: 7.2, status: 'Approved' },
  { id: 3, title: 'Funny Stories', score: 5.0, status: 'Rejected' },
];

const JudgeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-secondary to-accent rounded-2xl p-6 text-secondary-foreground">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Welcome, Judge {user?.name?.split(' ')[0]}! ⚖️
        </h1>
        <p className="text-secondary-foreground/80">
          You have pending submissions awaiting your review.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Reviews"
          value={12}
          icon={Clock}
          iconColor="text-secondary"
          change="3 urgent"
          changeType="neutral"
        />
        <StatsCard
          title="Reviewed Today"
          value={8}
          icon={CheckCircle}
          iconColor="text-primary"
          change="+5 from yesterday"
          changeType="positive"
        />
        <StatsCard
          title="Total Reviews"
          value={156}
          icon={FileText}
          iconColor="text-accent"
          change="This month"
          changeType="neutral"
        />
        <StatsCard
          title="Avg. Score Given"
          value="7.4"
          icon={Star}
          iconColor="text-secondary"
          change="Out of 10"
          changeType="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Submissions */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Pending Submissions
            </h2>
            <Link to="/judge/dashboard/submissions" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{sub.title}</p>
                  <p className="text-sm text-muted-foreground">
                    By {sub.author}, Age {sub.age} • {sub.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{sub.submitted}</span>
                  <Link to="/judge/dashboard/voting">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link to="/judge/dashboard/voting" className="block mt-4">
            <Button variant="gold" className="w-full">
              Open Voting Panel
              <Vote className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Recent Reviews */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recent Reviews
            </h2>
            <Link to="/judge/dashboard/entries" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-foreground">{review.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {review.score}/10
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;

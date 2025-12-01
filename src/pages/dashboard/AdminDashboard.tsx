import { Users, Calendar, Trophy, BarChart3, TrendingUp, Eye, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useAuth } from '@/contexts/AuthContext';

const recentActivity = [
  { id: 1, action: 'New registration', user: 'Ananya Sharma', time: '5 min ago', type: 'user' },
  { id: 2, action: 'Submission approved', user: 'Judge Raj', time: '15 min ago', type: 'judge' },
  { id: 3, action: 'Competition created', user: 'Admin', time: '1 hour ago', type: 'admin' },
  { id: 4, action: 'Vote cast', user: 'Visitor', time: '2 hours ago', type: 'vote' },
];

const competitions = [
  { id: 1, name: 'Summer Championship 2025', participants: 2500, status: 'Live', votes: 12500 },
  { id: 2, name: 'Monsoon Tales Festival', participants: 1800, status: 'Upcoming', votes: 0 },
  { id: 3, name: 'Diwali Story Sparkle', participants: 2200, status: 'Upcoming', votes: 0 },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome */}
      <div className="bg-charcoal rounded-2xl p-6 text-primary-foreground">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-primary-foreground/80">
          Welcome back, {user?.name}. Here's your platform overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value="12,456"
          icon={Users}
          iconColor="text-primary"
          change="+234 this week"
          changeType="positive"
        />
        <StatsCard
          title="Active Competitions"
          value={3}
          icon={Calendar}
          iconColor="text-secondary"
          change="1 live now"
          changeType="neutral"
        />
        <StatsCard
          title="Total Submissions"
          value="5,678"
          icon={Trophy}
          iconColor="text-accent"
          change="+156 today"
          changeType="positive"
        />
        <StatsCard
          title="Total Votes"
          value="89,012"
          icon={BarChart3}
          iconColor="text-primary"
          change="+2,345 today"
          changeType="positive"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/dashboard/create">
          <Button variant="hero" className="w-full h-auto py-6 flex-col gap-2">
            <PlusCircle className="w-8 h-8" />
            <span>Create Competition</span>
          </Button>
        </Link>
        <Link to="/admin/dashboard/competitions">
          <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
            <Eye className="w-8 h-8" />
            <span>View Competitions</span>
          </Button>
        </Link>
        <Link to="/admin/dashboard/judges">
          <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
            <Users className="w-8 h-8" />
            <span>Manage Judges</span>
          </Button>
        </Link>
        <Link to="/admin/dashboard/outcomes">
          <Button variant="gold" className="w-full h-auto py-6 flex-col gap-2">
            <TrendingUp className="w-8 h-8" />
            <span>Voting Outcomes</span>
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competitions */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Competitions
            </h2>
            <Link to="/admin/dashboard/competitions" className="text-primary text-sm hover:underline">
              Manage All
            </Link>
          </div>
          <div className="space-y-4">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{comp.name}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      comp.status === 'Live'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{comp.participants.toLocaleString()} participants</span>
                  <span>{comp.votes.toLocaleString()} votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'user'
                      ? 'bg-primary/10 text-primary'
                      : activity.type === 'judge'
                      ? 'bg-secondary/10 text-secondary'
                      : activity.type === 'admin'
                      ? 'bg-charcoal text-primary-foreground'
                      : 'bg-accent/10 text-accent'
                  }`}
                >
                  {activity.type === 'user' && <Users className="w-5 h-5" />}
                  {activity.type === 'judge' && <Trophy className="w-5 h-5" />}
                  {activity.type === 'admin' && <Calendar className="w-5 h-5" />}
                  {activity.type === 'vote' && <BarChart3 className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

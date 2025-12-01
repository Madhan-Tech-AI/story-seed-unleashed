import { Calendar, Trophy, FileText, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useAuth } from '@/contexts/AuthContext';

const upcomingEvents = [
  { id: 1, title: 'Summer Championship 2025', date: 'June 15, 2025', status: 'Registered' },
  { id: 2, title: 'Monsoon Tales Festival', date: 'August 1, 2025', status: 'Open' },
  { id: 3, title: 'Diwali Story Sparkle', date: 'October 15, 2025', status: 'Open' },
];

const mySubmissions = [
  { id: 1, title: 'The Magical Garden', competition: 'Summer Championship', status: 'Under Review', votes: 156 },
  { id: 2, title: 'Adventures in Mumbai', competition: 'City Tales 2024', status: 'Approved', votes: 234 },
];

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome */}
      <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-primary-foreground/80">
          Ready to share your next story with the world?
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Registered Events"
          value={3}
          icon={Calendar}
          iconColor="text-primary"
          change="+1 this month"
          changeType="positive"
        />
        <StatsCard
          title="Submissions"
          value={5}
          icon={FileText}
          iconColor="text-secondary"
          change="2 under review"
          changeType="neutral"
        />
        <StatsCard
          title="Total Votes"
          value="1,234"
          icon={Trophy}
          iconColor="text-accent"
          change="+128 this week"
          changeType="positive"
        />
        <StatsCard
          title="Rank"
          value="#42"
          icon={Trophy}
          iconColor="text-primary"
          change="↑ 5 positions"
          changeType="positive"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Upcoming Events
            </h2>
            <Link to="/user/dashboard/events" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'Registered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* My Submissions */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              My Submissions
            </h2>
            <Link to="/user/dashboard/registrations" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{sub.title}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{sub.competition}</span>
                  <span className="text-foreground font-medium">{sub.votes} votes</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/register" className="block mt-4">
            <Button variant="hero" className="w-full">
              Submit New Story
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import { useState, useEffect } from 'react';
import { Calendar, Trophy, FileText, ArrowRight, Loader2, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Registration {
  id: string;
  story_title: string;
  category: string;
  created_at: string;
  event_id: string | null;
  overall_votes: number;
  overall_views: number;
  events?: { name: string } | null;
}

interface UserStats {
  totalSubmissions: number;
  totalVotes: number;
  totalViews: number;
  rank: number;
  registeredEvents: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalSubmissions: 0,
    totalVotes: 0,
    totalViews: 0,
    rank: 0,
    registeredEvents: 0,
  });
  const [submissions, setSubmissions] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user's registrations with event names, votes, and views
        const { data: registrations, error: regError } = await supabase
          .from('registrations')
          .select('id, story_title, category, created_at, event_id, overall_votes, overall_views, events(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (regError) {
          console.error('Error fetching registrations:', regError);
          return;
        }

        setSubmissions(registrations || []);

        // Count unique registered events
        const uniqueEventIds = new Set(
          (registrations || [])
            .map(r => r.event_id)
            .filter((id): id is string => id !== null)
        );

        // Calculate total votes and views from user's registrations
        const totalVotes = (registrations || []).reduce((sum, r) => sum + (r.overall_votes || 0), 0);
        const totalViews = (registrations || []).reduce((sum, r) => sum + (r.overall_views || 0), 0);

        // Calculate rank based on total votes across all users
        const { data: allRegistrations } = await supabase
          .from('registrations')
          .select('user_id, overall_votes');

        // Group votes by user
        const userVotesMap = new Map<string, number>();
        (allRegistrations || []).forEach((reg) => {
          if (reg.user_id) {
            userVotesMap.set(reg.user_id, (userVotesMap.get(reg.user_id) || 0) + (reg.overall_votes || 0));
          }
        });

        // Sort users by votes and find rank
        const sortedUsers = Array.from(userVotesMap.entries())
          .sort((a, b) => b[1] - a[1]);
        const userRank = sortedUsers.findIndex(([userId]) => userId === user.id) + 1;

        setStats({
          totalSubmissions: registrations?.length || 0,
          totalVotes,
          totalViews,
          rank: userRank || 0,
          registeredEvents: uniqueEventIds.size,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Set up realtime subscriptions
    const registrationsChannel = supabase
      .channel('user-registrations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchUserData();
        }
      )
      .subscribe();

    const votesChannel = supabase
      .channel('user-votes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchUserData();
        }
      )
      .subscribe();

    const viewsChannel = supabase
      .channel('user-views-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'views' },
        () => {
          fetchUserData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Registered Events"
          value={stats.registeredEvents}
          icon={Calendar}
          iconColor="text-primary"
        />
        <StatsCard
          title="Submissions"
          value={stats.totalSubmissions}
          icon={FileText}
          iconColor="text-secondary"
        />
        <StatsCard
          title="Total Votes"
          value={stats.totalVotes.toLocaleString()}
          icon={Trophy}
          iconColor="text-accent"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          iconColor="text-primary"
        />
        <StatsCard
          title="Rank"
          value={stats.rank > 0 ? `#${stats.rank}` : '-'}
          icon={TrendingUp}
          iconColor="text-secondary"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
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
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No submissions yet. Start by registering for an event!</p>
              </div>
            ) : (
              submissions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{sub.story_title}</p>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {sub.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {sub.events?.name || 'Unknown Event'}
                    </span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {sub.overall_votes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {sub.overall_views}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/register" className="block mt-4">
            <Button variant="hero" className="w-full">
              Submit New Story
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/user/dashboard/explore" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Trophy className="w-4 h-4 mr-2" />
                Explore & Vote Stories
              </Button>
            </Link>
            <Link to="/user/dashboard/events" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Browse Events
              </Button>
            </Link>
            <Link to="/user/dashboard/registrations" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View My Registrations
              </Button>
            </Link>
            <Link to="/leaderboard" className="block">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

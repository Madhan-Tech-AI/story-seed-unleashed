import { useState, useEffect } from 'react';
import { Calendar, Trophy, FileText, ArrowRight, Loader2 } from 'lucide-react';
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
  events?: { name: string } | null;
}

interface UserStats {
  totalSubmissions: number;
  totalVotes: number;
  rank: number;
  registeredEvents: number;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalSubmissions: 0,
    totalVotes: 0,
    rank: 0,
    registeredEvents: 0,
  });
  const [submissions, setSubmissions] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Fetch user's registrations with event names
        const { data: registrations, error: regError } = await supabase
          .from('registrations')
          .select('id, story_title, category, created_at, event_id, events(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (regError) {
          console.error('Error fetching registrations:', regError);
        } else {
          setSubmissions(registrations || []);
        }

        // Count unique registered events
        const uniqueEventIds = new Set(
          (registrations || [])
            .map(r => r.event_id)
            .filter((id): id is string => id !== null)
        );

        // Fetch total votes for all user's registrations
        const registrationIds = (registrations || []).map(r => r.id);
        let totalVotes = 0;

        if (registrationIds.length > 0) {
          const { data: votesData, error: votesError } = await supabase
            .from('votes')
            .select('score')
            .in('registration_id', registrationIds);

          if (!votesError && votesData) {
            totalVotes = votesData.reduce((sum, v) => sum + v.score, 0);
          }
        }

        // Calculate rank based on total votes (fetch all users' votes)
        const { data: allVotes } = await supabase
          .from('votes')
          .select('registration_id, score, registrations(user_id)');

        // Group votes by user
        const userVotesMap = new Map<string, number>();
        (allVotes || []).forEach((vote: any) => {
          const votedUserId = vote.registrations?.user_id;
          if (votedUserId) {
            userVotesMap.set(votedUserId, (userVotesMap.get(votedUserId) || 0) + vote.score);
          }
        });

        // Sort users by votes and find rank
        const sortedUsers = Array.from(userVotesMap.entries())
          .sort((a, b) => b[1] - a[1]);
        const userRank = sortedUsers.findIndex(([userId]) => userId === user.id) + 1;

        setStats({
          totalSubmissions: registrations?.length || 0,
          totalVotes,
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

    // Set up realtime subscription for votes
    const votesChannel = supabase
      .channel('user-votes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchUserData(); // Refresh data on vote changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          title="Rank"
          value={stats.rank > 0 ? `#${stats.rank}` : '-'}
          icon={Trophy}
          iconColor="text-primary"
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
                    <span className="text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
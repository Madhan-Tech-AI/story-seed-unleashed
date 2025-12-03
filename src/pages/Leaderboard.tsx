import { useState, useEffect } from 'react';
import { Eye, TrendingUp, Trophy, Medal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const leaderboardTabs = ['Leaderboard', 'Trending Stories', 'Top Viewed Stories'];

interface LeaderboardEntry {
  id: string;
  story_title: string;
  first_name: string;
  last_name: string;
  age: number;
  category: string;
  overall_votes: number;
  views_count: number;
}

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      // Get registrations with vote counts
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select('id, story_title, first_name, last_name, age, category, overall_votes');

      if (error) throw error;

      // Get view counts for each registration
      const entriesWithViews = await Promise.all(
        (registrations || []).map(async (reg) => {
          const { count } = await supabase
            .from('views')
            .select('*', { count: 'exact', head: true })
            .eq('registration_id', reg.id);

          return {
            ...reg,
            views_count: count || 0,
          };
        })
      );

      setEntries(entriesWithViews);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Real-time subscriptions
    const registrationsChannel = supabase
      .channel('leaderboard-registrations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    const viewsChannel = supabase
      .channel('leaderboard-views')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'views' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, []);

  const getSortedEntries = () => {
    const sorted = [...entries];
    if (activeTab === 'Top Viewed Stories') {
      return sorted.sort((a, b) => b.views_count - a.views_count);
    }
    if (activeTab === 'Trending Stories') {
      return sorted.sort((a, b) => {
        const aTrend = a.overall_votes * 0.7 + a.views_count * 0.3;
        const bTrend = b.overall_votes * 0.7 + b.views_count * 0.3;
        return bTrend - aTrend;
      });
    }
    return sorted.sort((a, b) => b.overall_votes - a.overall_votes);
  };

  const sortedEntries = getSortedEntries();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900';
    if (rank === 3) return 'bg-gradient-to-br from-amber-500 to-amber-700 text-amber-900';
    return 'bg-muted text-muted-foreground';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fantasy: 'bg-purple-500',
      Adventure: 'bg-green-500',
      'Sci-Fi': 'bg-blue-500',
      Family: 'bg-pink-500',
      Humor: 'bg-orange-500',
    };
    return colors[category] || 'bg-primary';
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="py-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the top-performing stories, trending content, and most viewed narratives from our community
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {leaderboardTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              )}
            >
              {tab === 'Leaderboard' && <Trophy className="w-4 h-4" />}
              {tab === 'Trending Stories' && <TrendingUp className="w-4 h-4" />}
              {tab === 'Top Viewed Stories' && <Eye className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
              <p className="text-muted-foreground">No entries yet. Be the first to participate!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEntries.map((entry, index) => {
                const displayRank = index + 1;
                
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'bg-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6 card-hover border border-border/50 animate-fade-in',
                      displayRank <= 3 && 'ring-2 ring-offset-2',
                      displayRank === 1 && 'ring-yellow-500',
                      displayRank === 2 && 'ring-gray-400',
                      displayRank === 3 && 'ring-amber-600'
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Rank Badge */}
                    <div className="flex items-center justify-center sm:justify-start">
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg relative',
                          getRankBadgeColor(displayRank)
                        )}
                      >
                        {getRankIcon(displayRank)}
                        <span className={cn(displayRank <= 3 && 'absolute bottom-1 text-xs')}>
                          {displayRank > 3 && displayRank}
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="relative w-full sm:w-32 aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                      <span className={cn('px-3 py-1 text-white text-sm rounded-md', getCategoryColor(entry.category))}>
                        {entry.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                          {entry.story_title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          By {entry.first_name} {entry.last_name}, Age {entry.age}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-2 text-foreground">
                          <Trophy className="w-4 h-4 text-secondary" />
                          <span className="font-semibold">{entry.overall_votes.toLocaleString()}</span>
                          <span className="text-muted-foreground">votes</span>
                        </span>
                        <span className="flex items-center gap-2 text-foreground">
                          <Eye className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{entry.views_count.toLocaleString()}</span>
                          <span className="text-muted-foreground">views</span>
                        </span>
                        {activeTab === 'Trending Stories' && (
                          <span className="flex items-center gap-2 text-primary">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">Trending</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
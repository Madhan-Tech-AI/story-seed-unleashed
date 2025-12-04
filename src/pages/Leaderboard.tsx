import { useState, useEffect } from 'react';
import { Eye, TrendingUp, Trophy, Medal, Crown, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  user_id: string | null;
}

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select('id, story_title, first_name, last_name, age, category, overall_votes, user_id');

      if (error) throw error;

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
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-500" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow-[0_0_20px_rgba(234,179,8,0.5)]';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900 shadow-[0_0_15px_rgba(156,163,175,0.5)]';
    if (rank === 3) return 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-amber-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'bg-muted text-muted-foreground';
  };

  const getCardStyle = (rank: number) => {
    if (rank === 1) return 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-transparent ring-2 ring-yellow-500/20';
    if (rank === 2) return 'border-gray-400/50 bg-gradient-to-r from-gray-400/10 to-transparent ring-1 ring-gray-400/20';
    if (rank === 3) return 'border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-transparent ring-1 ring-amber-500/20';
    return 'border-border/50';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fantasy: 'bg-purple-500/90',
      Adventure: 'bg-green-500/90',
      'Sci-Fi': 'bg-blue-500/90',
      Family: 'bg-pink-500/90',
      Humor: 'bg-orange-500/90',
    };
    return colors[category] || 'bg-primary/90';
  };

  const copyUserId = (userId: string | null) => {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    toast.success('User ID copied! Search in dashboard to find their videos.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truncateId = (id: string) => `${id.slice(0, 8)}...`;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="py-20 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">Live Rankings</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the top-performing stories, trending content, and most viewed narratives from our community
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {leaderboardTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3.5 rounded-2xl font-medium text-sm transition-all duration-300 flex items-center gap-2',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-glow scale-105'
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border hover:scale-102'
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
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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
                      'bg-card rounded-2xl p-5 flex flex-col sm:flex-row gap-5 card-hover border animate-fade-in transition-all',
                      getCardStyle(displayRank)
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Rank Badge */}
                    <div className="flex items-center justify-center sm:justify-start">
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold transition-transform hover:scale-110',
                          getRankBadgeColor(displayRank)
                        )}
                      >
                        {getRankIcon(displayRank)}
                        <span className={cn('text-lg', displayRank <= 3 ? 'text-xs mt-0.5' : '')}>
                          {displayRank > 3 ? `#${displayRank}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="relative w-full sm:w-28 aspect-video sm:aspect-square rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className={cn('px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md', getCategoryColor(entry.category))}>
                        {entry.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-1 line-clamp-1">
                          {entry.story_title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          By <span className="font-medium text-foreground">{entry.first_name} {entry.last_name}</span>, Age {entry.age}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-lg">
                          <Trophy className="w-4 h-4 text-secondary" />
                          <span className="font-bold text-foreground">{entry.overall_votes.toLocaleString()}</span>
                          <span className="text-muted-foreground">votes</span>
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                          <Eye className="w-4 h-4 text-primary" />
                          <span className="font-bold text-foreground">{entry.views_count.toLocaleString()}</span>
                          <span className="text-muted-foreground">views</span>
                        </span>
                        {activeTab === 'Trending Stories' && (
                          <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-lg">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">Trending</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* User ID */}
                    {entry.user_id && (
                      <div className="flex sm:flex-col items-center justify-end gap-2">
                        <button
                          onClick={() => copyUserId(entry.user_id)}
                          className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors group"
                          title="Copy User ID to search their videos"
                        >
                          <span className="hidden sm:inline">ID:</span>
                          <code className="font-mono">{truncateId(entry.user_id)}</code>
                          {copiedId === entry.user_id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 group-hover:text-primary" />
                          )}
                        </button>
                      </div>
                    )}
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

import { useState, useEffect } from 'react';
import { Eye, TrendingUp, Trophy, Medal, Crown, Copy, Check, Flame, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const leaderboardTabs = ['Leaderboard', 'Trending', 'Most Viewed'];

interface LeaderboardEntry {
  id: string;
  story_title: string;
  first_name: string;
  last_name: string;
  age: number;
  category: string;
  overall_votes: number;
  overall_views: number;
  user_id: string | null;
  trending_score?: number;
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
        .select('id, story_title, first_name, last_name, age, category, overall_votes, overall_views, user_id');

      if (error) throw error;

      // Calculate trending score for each entry
      const entriesWithTrending = (registrations || []).map((reg) => ({
        ...reg,
        trending_score: (reg.overall_votes || 0) * 0.7 + (reg.overall_views || 0) * 0.3,
      }));

      setEntries(entriesWithTrending);
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

    const votesChannel = supabase
      .channel('leaderboard-votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(viewsChannel);
      supabase.removeChannel(votesChannel);
    };
  }, []);

  const getSortedEntries = () => {
    const sorted = [...entries];
    if (activeTab === 'Most Viewed') {
      return sorted.sort((a, b) => (b.overall_views || 0) - (a.overall_views || 0));
    }
    if (activeTab === 'Trending') {
      return sorted.sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0));
    }
    return sorted.sort((a, b) => (b.overall_votes || 0) - (a.overall_votes || 0));
  };

  const sortedEntries = getSortedEntries();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Medal className="w-5 h-5" />;
    return <span className="font-bold text-lg">#{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-amber-500 text-yellow-900 shadow-lg shadow-yellow-500/30';
    if (rank === 2) return 'from-slate-300 to-slate-400 text-slate-800 shadow-lg shadow-slate-400/30';
    if (rank === 3) return 'from-amber-500 to-orange-600 text-amber-900 shadow-lg shadow-amber-500/30';
    return 'from-muted to-muted text-muted-foreground';
  };

  const getCardBorder = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/50 shadow-lg shadow-yellow-500/10';
    if (rank === 2) return 'border-slate-400/50 shadow-md shadow-slate-400/10';
    if (rank === 3) return 'border-amber-500/50 shadow-md shadow-amber-500/10';
    return 'border-border/50';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Fantasy: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
      Adventure: 'bg-green-500/20 text-green-700 border-green-500/30',
      'Sci-Fi': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      Family: 'bg-pink-500/20 text-pink-700 border-pink-500/30',
      Humor: 'bg-orange-500/20 text-orange-700 border-orange-500/30',
    };
    return colors[category] || 'bg-primary/20 text-primary border-primary/30';
  };

  const copyUserId = (userId: string | null) => {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    toast.success('User ID copied! Search in dashboard to find their videos.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truncateId = (id: string) => `${id.slice(0, 8)}...`;

  const getTabIcon = (tab: string) => {
    if (tab === 'Leaderboard') return <Trophy className="w-4 h-4" />;
    if (tab === 'Trending') return <Flame className="w-4 h-4" />;
    if (tab === 'Most Viewed') return <Eye className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="page-enter min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">Live Rankings</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Story <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover top stories by votes, trending content, and most viewed narratives from our creative community
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {leaderboardTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border hover:border-primary/20'
              )}
            >
              {getTabIcon(tab)}
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="bg-card p-12 rounded-2xl border border-border/50 text-center">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Entries Yet</h3>
              <p className="text-muted-foreground">Be the first to participate and claim the top spot!</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {sortedEntries.map((entry, index) => {
                const displayRank = index + 1;
                const isTopThree = displayRank <= 3;
                
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'bg-card rounded-xl md:rounded-2xl p-4 md:p-5 border transition-all hover:shadow-md',
                      getCardBorder(displayRank),
                      'animate-fade-in'
                    )}
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Rank Badge */}
                      <div
                        className={cn(
                          'w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br flex-shrink-0',
                          getRankStyle(displayRank)
                        )}
                      >
                        {getRankIcon(displayRank)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-base md:text-lg line-clamp-1">
                            {entry.story_title}
                          </h3>
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-md border flex-shrink-0 hidden sm:block',
                            getCategoryColor(entry.category)
                          )}>
                            {entry.category}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          By {entry.first_name} {entry.last_name}, Age {entry.age}
                        </p>
                        
                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="font-semibold text-foreground">{(entry.overall_votes || 0).toLocaleString()}</span>
                            <span className="text-muted-foreground text-xs">votes</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-semibold text-foreground">{(entry.overall_views || 0).toLocaleString()}</span>
                            <span className="text-muted-foreground text-xs">views</span>
                          </div>
                          {activeTab === 'Trending' && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Flame className="w-3.5 h-3.5 text-orange-500" />
                              <span className="font-semibold text-orange-600">{Math.round(entry.trending_score || 0)}</span>
                              <span className="text-muted-foreground text-xs">score</span>
                            </div>
                          )}
                          
                          {/* User ID - Copy Button */}
                          {entry.user_id && (
                            <button
                              onClick={() => copyUserId(entry.user_id)}
                              className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 hover:bg-muted rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
                              title="Copy User ID to search their videos"
                            >
                              <code className="font-mono">{truncateId(entry.user_id)}</code>
                              {copiedId === entry.user_id ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
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

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Copy, Check, Star, Users, Calendar, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommunityEntry {
  id: string;
  story_title: string;
  first_name: string;
  last_name: string;
  age: number;
  category: string;
  overall_views: number;
  user_id: string | null;
  event_id: string | null;
  vote_count: number;
}

interface JudgeEntry {
  id: string;
  story_title: string;
  first_name: string;
  last_name: string;
  age: number;
  category: string;
  user_id: string | null;
  event_id: string | null;
  average_score: number;
  total_reviews: number;
}

interface Event {
  id: string;
  name: string;
}

const Leaderboard = () => {
  const [communityEntries, setCommunityEntries] = useState<CommunityEntry[]>([]);
  const [judgeEntries, setJudgeEntries] = useState<JudgeEntry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('id, name')
      .eq('is_active', true);
    setEvents(data || []);
  };

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('registrations')
        .select('id, story_title, first_name, last_name, age, category, overall_views, user_id, event_id');
      
      if (selectedEvent !== 'all') {
        query = query.eq('event_id', selectedEvent);
      }
      
      const { data: registrations, error } = await query;
      if (error) throw error;

      // Fetch all votes with scores
      const { data: votes } = await supabase
        .from('votes')
        .select('registration_id, user_id, score');

      // Fetch judge user IDs
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const judgeUserIds = new Set(
        (userRoles || [])
          .filter(ur => ur.role === 'judge')
          .map(ur => ur.user_id)
      );

      // Calculate community votes (non-judge votes)
      const voteCounts: Record<string, number> = {};
      const scoreData: Record<string, { total: number; count: number }> = {};
      
      (votes || []).forEach(vote => {
        if (!judgeUserIds.has(vote.user_id)) {
          // Community vote
          voteCounts[vote.registration_id] = (voteCounts[vote.registration_id] || 0) + 1;
        } else {
          // Judge vote
          if (!scoreData[vote.registration_id]) {
            scoreData[vote.registration_id] = { total: 0, count: 0 };
          }
          scoreData[vote.registration_id].total += vote.score;
          scoreData[vote.registration_id].count += 1;
        }
      });

      // Community leaderboard entries
      const communityEntriesWithVotes = (registrations || []).map(reg => ({
        ...reg,
        vote_count: voteCounts[reg.id] || 0,
      }));

      // Judge leaderboard entries
      const judgeEntriesWithScores = (registrations || []).map(reg => {
        const data = scoreData[reg.id];
        return {
          ...reg,
          average_score: data ? parseFloat((data.total / data.count).toFixed(1)) : 0,
          total_reviews: data ? data.count : 0,
        };
      });

      setCommunityEntries(communityEntriesWithVotes);
      setJudgeEntries(judgeEntriesWithScores);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchLeaderboards();

    const votesChannel = supabase
      .channel('leaderboard-votes-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchLeaderboards();
      })
      .subscribe();

    const registrationsChannel = supabase
      .channel('leaderboard-registrations-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
        fetchLeaderboards();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(registrationsChannel);
    };
  }, [selectedEvent]);

  // Community leaderboard sorting
  const sortedCommunityEntries = [...communityEntries].sort((a, b) => b.vote_count - a.vote_count);
  const communityTopThree = sortedCommunityEntries.slice(0, 3);
  const communityRestEntries = sortedCommunityEntries.slice(3);

  // Judge leaderboard sorting
  const sortedJudgeEntries = [...judgeEntries]
    .filter(e => e.total_reviews > 0)
    .sort((a, b) => {
      if (b.average_score !== a.average_score) return b.average_score - a.average_score;
      return b.total_reviews - a.total_reviews;
    });
  const judgeTopThree = sortedJudgeEntries.slice(0, 3);
  const judgeRestEntries = sortedJudgeEntries.slice(3);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-amber-500 text-yellow-900';
    if (rank === 2) return 'from-slate-300 to-slate-400 text-slate-800';
    if (rank === 3) return 'from-amber-600 to-orange-700 text-amber-100';
    return 'from-muted to-muted text-muted-foreground';
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-yellow-900';
    if (rank === 2) return 'bg-slate-400 text-slate-900';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getCardShadow = (rank: number) => {
    if (rank === 1) return 'shadow-xl shadow-yellow-500/20 border-yellow-400/50';
    if (rank === 2) return 'shadow-lg shadow-slate-400/20 border-slate-400/50';
    if (rank === 3) return 'shadow-lg shadow-amber-500/20 border-amber-500/50';
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

  const getOrdinalSuffix = (rank: number) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const renderCommunityCard = (entry: CommunityEntry, actualRank: number) => {
    const isFirst = actualRank === 1;
    return (
      <div
        key={entry.id}
        className={cn(
          'bg-card rounded-2xl p-4 md:p-6 border-2 transition-all hover:scale-[1.02] relative overflow-hidden',
          getCardShadow(actualRank),
          isFirst && 'md:-mt-4 md:mb-4'
        )}
      >
        <div className="absolute top-0 right-0">
          <div className={cn(
            'px-3 py-1 md:px-4 md:py-2 rounded-bl-2xl font-bold text-sm md:text-lg',
            getRankBadgeColor(actualRank)
          )}>
            {actualRank}{getOrdinalSuffix(actualRank)}
          </div>
        </div>

        <div className="flex justify-center mb-3 md:mb-4">
          <div className={cn(
            'w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br',
            getRankStyle(actualRank)
          )}>
            {actualRank === 1 ? (
              <Crown className="w-8 h-8 md:w-10 md:h-10" />
            ) : (
              <Medal className="w-8 h-8 md:w-10 md:h-10" />
            )}
          </div>
        </div>

        <div className="text-center mb-3 md:mb-4">
          <h3 className="font-bold text-base md:text-lg text-foreground mb-1 line-clamp-1">
            {entry.first_name} {entry.last_name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
            {entry.story_title}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">{entry.vote_count}</p>
            <p className="text-xs text-muted-foreground">Votes</p>
          </div>
          <div className="w-px h-6 md:h-8 bg-border" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">{entry.overall_views}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
        </div>

        <div className="flex justify-center mb-2 md:mb-0">
          <span className={cn(
            'px-2 md:px-3 py-1 text-xs font-medium rounded-full border',
            getCategoryColor(entry.category)
          )}>
            {entry.category}
          </span>
        </div>

        {entry.user_id && (
          <button
            onClick={() => copyUserId(entry.user_id)}
            className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-muted/50 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
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
    );
  };

  const renderJudgeCard = (entry: JudgeEntry, actualRank: number) => {
    const isFirst = actualRank === 1;
    return (
      <div
        key={entry.id}
        className={cn(
          'bg-card rounded-2xl p-4 md:p-6 border-2 transition-all hover:scale-[1.02] relative overflow-hidden',
          getCardShadow(actualRank),
          isFirst && 'md:-mt-4 md:mb-4'
        )}
      >
        <div className="absolute top-0 right-0">
          <div className={cn(
            'px-3 py-1 md:px-4 md:py-2 rounded-bl-2xl font-bold text-sm md:text-lg',
            getRankBadgeColor(actualRank)
          )}>
            {actualRank}{getOrdinalSuffix(actualRank)}
          </div>
        </div>

        <div className="flex justify-center mb-3 md:mb-4">
          <div className={cn(
            'w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-gradient-to-br',
            getRankStyle(actualRank)
          )}>
            {actualRank === 1 ? (
              <Crown className="w-8 h-8 md:w-10 md:h-10" />
            ) : (
              <Medal className="w-8 h-8 md:w-10 md:h-10" />
            )}
          </div>
        </div>

        <div className="text-center mb-3 md:mb-4">
          <h3 className="font-bold text-base md:text-lg text-foreground mb-1 line-clamp-1">
            {entry.first_name} {entry.last_name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
            {entry.story_title}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">{entry.average_score}</p>
            <p className="text-xs text-muted-foreground">Avg /10</p>
          </div>
          <div className="w-px h-6 md:h-8 bg-border" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-foreground">{entry.total_reviews}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
        </div>

        <div className="flex justify-center mb-2 md:mb-0">
          <span className={cn(
            'px-2 md:px-3 py-1 text-xs font-medium rounded-full border',
            getCategoryColor(entry.category)
          )}>
            {entry.category}
          </span>
        </div>

        {entry.user_id && (
          <button
            onClick={() => copyUserId(entry.user_id)}
            className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-muted/50 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
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
    );
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
            Story <span className="text-gradient">Champions</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Compare community favorites with expert judge evaluations
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Event Filter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Split Leaderboards */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
            {/* Community Leaderboard */}
            <div className="space-y-6 lg:border-r lg:border-border/50 lg:pr-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-xl border border-border/50">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Community Leaderboard</span>
              </div>

              {sortedCommunityEntries.length === 0 ? (
                <div className="bg-card p-8 md:p-12 rounded-2xl border border-border/50 text-center">
                  <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Entries Yet</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Be the first to participate!</p>
                </div>
              ) : (
                <>
                  {/* Community Top 3 */}
                  {communityTopThree.length > 0 && (
                    <div className="mb-6">
                      <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                          <span className="text-gradient">Community Favorites</span>
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">Most Voted Stories</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {[communityTopThree[1], communityTopThree[0], communityTopThree[2]].filter(Boolean).map((entry) => {
                          if (!entry) return null;
                          const actualRank = sortedCommunityEntries.indexOf(entry) + 1;
                          return renderCommunityCard(entry, actualRank);
                        })}
                      </div>
                    </div>
                  )}

                  {/* Community Rest */}
                  {communityRestEntries.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border bg-muted/30">
                              <th className="text-left py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">Rank</th>
                              <th className="text-left py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">Participant</th>
                              <th className="text-center py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">Votes</th>
                              <th className="text-right py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {communityRestEntries.map((entry, index) => {
                              const rank = index + 4;
                              return (
                                <tr 
                                  key={entry.id} 
                                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                                >
                                  <td className="py-3 px-3">
                                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs md:text-sm text-muted-foreground">
                                      {rank}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div>
                                      <p className="font-semibold text-xs md:text-sm text-foreground">{entry.first_name} {entry.last_name}</p>
                                      <p className="text-xs text-muted-foreground line-clamp-1">{entry.story_title}</p>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <span className="font-bold text-xs md:text-sm text-foreground">{entry.vote_count}</span>
                                  </td>
                                  <td className="py-3 px-3 text-right">
                                    {entry.user_id && (
                                      <button
                                        onClick={() => copyUserId(entry.user_id)}
                                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                      >
                                        <code className="font-mono">{truncateId(entry.user_id)}</code>
                                        {copiedId === entry.user_id ? (
                                          <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Judge Leaderboard */}
            <div className="space-y-6 lg:pl-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-xl border border-border/50">
                <Gavel className="w-5 h-5 text-secondary" />
                <span className="font-semibold text-foreground">Judge Leaderboard</span>
              </div>

              {sortedJudgeEntries.length === 0 ? (
                <div className="bg-card p-8 md:p-12 rounded-2xl border border-border/50 text-center">
                  <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Reviews Yet</h3>
                  <p className="text-sm md:text-base text-muted-foreground">No judge evaluations submitted yet.</p>
                </div>
              ) : (
                <>
                  {/* Judge Top 3 */}
                  {judgeTopThree.length > 0 && (
                    <div className="mb-6">
                      <div className="text-center mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                          <span className="text-gradient">Judge's Top Picks</span>
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">Expert Evaluations</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {[judgeTopThree[1], judgeTopThree[0], judgeTopThree[2]].filter(Boolean).map((entry) => {
                          if (!entry) return null;
                          const actualRank = sortedJudgeEntries.indexOf(entry) + 1;
                          return renderJudgeCard(entry, actualRank);
                        })}
                      </div>
                    </div>
                  )}

                  {/* Judge Rest */}
                  {judgeRestEntries.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border bg-muted/30">
                              <th className="text-left py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">Rank</th>
                              <th className="text-left py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">Participant</th>
                              <th className="text-center py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">Score</th>
                              <th className="text-right py-3 px-3 text-xs md:text-sm font-semibold text-muted-foreground">ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {judgeRestEntries.map((entry, index) => {
                              const rank = index + 4;
                              return (
                                <tr 
                                  key={entry.id} 
                                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                                >
                                  <td className="py-3 px-3">
                                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs md:text-sm text-muted-foreground">
                                      {rank}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div>
                                      <p className="font-semibold text-xs md:text-sm text-foreground">{entry.first_name} {entry.last_name}</p>
                                      <p className="text-xs text-muted-foreground line-clamp-1">{entry.story_title}</p>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <span className="font-bold text-xs md:text-sm text-foreground">{entry.average_score}/10</span>
                                  </td>
                                  <td className="py-3 px-3 text-right">
                                    {entry.user_id && (
                                      <button
                                        onClick={() => copyUserId(entry.user_id)}
                                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                      >
                                        <code className="font-mono">{truncateId(entry.user_id)}</code>
                                        {copiedId === entry.user_id ? (
                                          <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

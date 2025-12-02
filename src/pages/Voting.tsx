import { useState } from 'react';
import { ThumbsUp, Eye, TrendingUp, Clock, Filter, Trophy, ArrowUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const votingTabs = ['Trending', 'Most Viewed', 'Latest'];

const entries = [
  {
    id: 1,
    title: 'The Magical Garden of Dreams',
    author: 'Ananya Sharma',
    age: 10,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
    votes: 1250,
    views: 3420,
    rank: 1,
    category: 'Fantasy',
    featured: true,
  },
  {
    id: 2,
    title: 'Adventures in Rainy Mumbai',
    author: 'Arjun Patel',
    age: 12,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    votes: 1180,
    views: 2890,
    rank: 2,
    category: 'Adventure',
  },
  {
    id: 3,
    title: "My Grandmother's Secret Recipe",
    author: 'Priya Reddy',
    age: 9,
    thumbnail: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&q=80',
    votes: 1050,
    views: 2560,
    rank: 3,
    category: 'Family',
  },
  {
    id: 4,
    title: 'The Robot Who Wanted to Dance',
    author: 'Vikram Singh',
    age: 11,
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
    votes: 920,
    views: 2100,
    rank: 4,
    category: 'Sci-Fi',
  },
  {
    id: 5,
    title: 'Lost in the Himalayas',
    author: 'Meera Gupta',
    age: 13,
    thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80',
    votes: 850,
    views: 1980,
    rank: 5,
    category: 'Adventure',
  },
  {
    id: 6,
    title: 'The Talking Parrot of Jaipur',
    author: 'Rahul Verma',
    age: 8,
    thumbnail: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=400&q=80',
    votes: 780,
    views: 1750,
    rank: 6,
    category: 'Humor',
  },
];

const Voting = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [votedEntries, setVotedEntries] = useState<number[]>([]);
  const { toast } = useToast();

  const handleVote = (entryId: number) => {
    if (votedEntries.includes(entryId)) {
      toast({
        title: 'Already Voted',
        description: "You've already voted for this entry.",
        variant: 'destructive',
      });
      return;
    }
    setVotedEntries([...votedEntries, entryId]);
    toast({
      title: 'Vote Recorded! 🎉',
      description: 'Thank you for supporting this storyteller!',
    });
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (activeTab === 'Most Viewed') return b.views - a.views;
    if (activeTab === 'Latest') return b.id - a.id;
    return b.votes - a.votes;
  });

  return (
    <div className="pt-20 page-enter">
      {/* Hero */}
      <section className="py-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vote for Your <span className="text-gradient">Favorites</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Support young storytellers by voting for the stories that inspire you the most
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {votingTabs.map((tab) => (
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
                  {tab === 'Trending' && <TrendingUp className="w-4 h-4" />}
                  {tab === 'Most Viewed' && <Eye className="w-4 h-4" />}
                  {tab === 'Latest' && <Clock className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Entries Grid */}
            <div className="space-y-4">
              {sortedEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="bg-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 card-hover border border-border/50 animate-fade-in rank-rise"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-48 aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={entry.thumbnail}
                      alt={entry.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-md">
                        {entry.category}
                      </span>
                    </div>
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary-foreground/90 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary ml-0.5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2">
                          {entry.title}
                        </h3>
                        {entry.featured && (
                          <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded-full flex-shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        By {entry.author}, Age {entry.age}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <ThumbsUp className="w-4 h-4" />
                          {(entry.votes + (votedEntries.includes(entry.id) ? 1 : 0)).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          {entry.views.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant={votedEntries.includes(entry.id) ? 'secondary' : 'hero'}
                        size="sm"
                        onClick={() => handleVote(entry.id)}
                        disabled={votedEntries.includes(entry.id)}
                      >
                        {votedEntries.includes(entry.id) ? 'Voted ✓' : 'Vote'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Leaderboard */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border/50 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-secondary" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Leaderboard
                </h2>
              </div>

              <div className="space-y-3">
                {entries.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all duration-300 rank-rise',
                      index === 0 && 'bg-gradient-to-r from-secondary/20 to-accent/10 border border-secondary/30',
                      index === 1 && 'bg-muted/50',
                      index === 2 && 'bg-muted/30'
                    )}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        index === 0 && 'bg-secondary text-secondary-foreground',
                        index === 1 && 'bg-muted-foreground/30 text-foreground',
                        index === 2 && 'bg-accent/50 text-accent-foreground',
                        index > 2 && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {entry.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground text-sm flex items-center gap-1">
                        <ArrowUp className="w-3 h-3 text-green-500" />
                        {entry.votes.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">votes</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  Updated in real-time
                </p>
              </div>
            </div>

            {/* Top Views */}
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Top Views
                </h2>
              </div>

              <div className="space-y-3">
                {[...entries]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 3)
                  .map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-3">
                      <img
                        src={entry.thumbnail}
                        alt={entry.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {entry.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.views.toLocaleString()} views
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;

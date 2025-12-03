import { useState } from 'react';
import { Eye, TrendingUp, Trophy, ArrowUp, Medal, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const leaderboardTabs = ['Leaderboard', 'Trending Stories', 'Top Viewed Stories'];

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
    title: 'My Grandmother\'s Secret Recipe',
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
  {
    id: 7,
    title: 'The Enchanted Forest',
    author: 'Kavya Nair',
    age: 10,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    votes: 720,
    views: 1650,
    rank: 7,
    category: 'Fantasy',
  },
  {
    id: 8,
    title: 'Diwali Lights and Laughter',
    author: 'Aditya Menon',
    age: 11,
    thumbnail: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80',
    votes: 680,
    views: 1520,
    rank: 8,
    category: 'Family',
  },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Leaderboard');

  const getSortedEntries = () => {
    const sorted = [...entries];
    if (activeTab === 'Top Viewed Stories') {
      return sorted.sort((a, b) => b.views - a.views);
    }
    if (activeTab === 'Trending Stories') {
      // Trending based on votes and views ratio
      return sorted.sort((a, b) => {
        const aTrend = a.votes * 0.7 + a.views * 0.3;
        const bTrend = b.votes * 0.7 + b.views * 0.3;
        return bTrend - aTrend;
      });
    }
    // Leaderboard - by votes
    return sorted.sort((a, b) => b.votes - a.votes);
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

        {/* Leaderboard Content */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {sortedEntries.map((entry, index) => {
              const displayRank = activeTab === 'Top Viewed Stories' || activeTab === 'Trending Stories' 
                ? index + 1 
                : entry.rank;
              
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

                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-32 aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0">
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
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl font-semibold text-foreground">
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
                    
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <Trophy className="w-4 h-4 text-secondary" />
                        <span className="font-semibold">{entry.votes.toLocaleString()}</span>
                        <span className="text-muted-foreground">votes</span>
                      </span>
                      <span className="flex items-center gap-2 text-foreground">
                        <Eye className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{entry.views.toLocaleString()}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;


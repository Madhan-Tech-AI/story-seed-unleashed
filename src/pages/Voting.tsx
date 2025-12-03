import { Eye, Trophy, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See the top performers and most viewed stories from our community
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="bg-card rounded-2xl p-6 border border-border/50">
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
  );
};

export default Voting;

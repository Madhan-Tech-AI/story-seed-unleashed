import { useMemo, useState } from 'react';
import { Search, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ExploreStory {
  id: number;
  title: string;
  author: string;
  userId: string;
  category: string;
  views: string;
  videoUrl: string;
}

const stories: ExploreStory[] = [
  {
    id: 1,
    title: 'The Magical Garden',
    author: 'Aarav Sharma',
    userId: 'SSU-2001',
    category: 'Fantasy',
    views: '12.4k',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: 2,
    title: 'Rainy Day Adventures',
    author: 'Diya Patel',
    userId: 'SSU-2002',
    category: 'Adventure',
    views: '9.1k',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: 3,
    title: "Grandma's Secret Recipe",
    author: 'Kabir Singh',
    userId: 'SSU-2003',
    category: 'Family',
    views: '7.8k',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: 4,
    title: 'The Lost Robot',
    author: 'Ananya Rao',
    userId: 'SSU-2004',
    category: 'Sci-Fi',
    views: '15.2k',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: 5,
    title: 'The Laughing Classroom',
    author: 'Ishaan Verma',
    userId: 'SSU-2005',
    category: 'Humor',
    views: '6.3k',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: 6,
    title: 'Mystery of the Missing Book',
    author: 'Sara Malik',
    userId: 'SSU-2006',
    category: 'Mystery',
    views: '11.0k',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
];

const UserExplore = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const filteredStories = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return stories;
    return stories.filter((story) => {
      const baseMatch =
        story.title.toLowerCase().includes(q) ||
        story.author.toLowerCase().includes(q) ||
        story.category.toLowerCase().includes(q);
      const idMatch = story.userId.toLowerCase().includes(q);
      return baseMatch || idMatch;
    });
  }, [query]);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Explore Stories</h1>
          <p className="text-muted-foreground text-sm">
            Watch reels from other storytellers across all competitions.
          </p>
        </div>
        {/* Instagram-style search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, creators, categories..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="group rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-video bg-muted">
              <video
                src={story.videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <div className="truncate">
                  <p className="font-semibold truncate">{story.title}</p>
                  <p className="text-[11px] text-white/80 truncate">
                    {story.author} • {story.userId}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Play className="w-3 h-3" />
                  <span>{story.views}</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-2 flex items-center justify-between text-xs">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {story.category}
              </span>
              {user && (
                <span className="text-muted-foreground">
                  For <span className="font-medium">{user.name?.split(' ')[0]}</span>
                </span>
              )}
            </div>
          </div>
        ))}
        {filteredStories.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No stories match your search yet. Try a different name or category.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserExplore;



import { useMemo, useRef, useState } from 'react';
import { Search, Play, SkipBack, SkipForward, Gauge, Captions, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ExploreStory {
  id: number;
  title: string;
  author: string;
  userId: string;
  category: string;
  views: string;
  videoUrl: string;
}

interface ExploreUser {
  userId: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  totalVideos: number;
  followers: string;
  following: string;
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

const users: ExploreUser[] = [
  {
    userId: 'SSU-2001',
    name: 'Aarav Sharma',
    username: '@aarav_stories',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    bio: 'Fantasy lover. I turn daydreams into tiny stories ✨',
    totalVideos: 8,
    followers: '2.1k',
    following: '180',
  },
  {
    userId: 'SSU-2002',
    name: 'Diya Patel',
    username: '@rainydiya',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diya',
    bio: 'Rain, chai and endless adventures ☔️',
    totalVideos: 5,
    followers: '1.4k',
    following: '120',
  },
  {
    userId: 'SSU-2003',
    name: 'Kabir Singh',
    username: '@grandmastales',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir',
    bio: 'Collecting recipes and memories from my nani 🧡',
    totalVideos: 6,
    followers: '980',
    following: '95',
  },
  {
    userId: 'SSU-2004',
    name: 'Ananya Rao',
    username: '@robotics_ananya',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    bio: 'Robots, sci-fi and coding my own universes 🤖',
    totalVideos: 10,
    followers: '3.2k',
    following: '210',
  },
  {
    userId: 'SSU-2005',
    name: 'Ishaan Verma',
    username: '@lolishaan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan',
    bio: 'If your classroom isn’t laughing, I’m not done yet 😄',
    totalVideos: 4,
    followers: '1.1k',
    following: '75',
  },
  {
    userId: 'SSU-2006',
    name: 'Sara Malik',
    username: '@mysterysara',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
    bio: 'Tiny detective solving big mysteries 🔍',
    totalVideos: 7,
    followers: '1.9k',
    following: '160',
  },
];

const UserExplore = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<ExploreStory | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [showVotingPanel, setShowVotingPanel] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [score, setScore] = useState(8);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Build a combined list of known users (static demo users + locally stored auth users)
  const { user: authUser } = useAuth();

  const knownUsers: ExploreUser[] = useMemo(() => {
    const list: ExploreUser[] = [...users];

    // Add the currently authenticated user if not already present in the static list
    if (authUser && !list.find((u) => u.userId === authUser.id)) {
      list.push({
        userId: authUser.id,
        name: authUser.name,
        username: '@' + authUser.name.toLowerCase().replace(/\s+/g, ''),
        avatar:
          authUser.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            authUser.name
          )}`,
        bio: 'Story Seed creator',
        totalVideos: stories.filter((s) => s.userId === authUser.id).length || 0,
        followers: '0',
        following: '0',
      });
    }

    // Add any registered signup user from localStorage, if available
    try {
      const storedSignup = localStorage.getItem('storyseed_signup_credentials');
      if (storedSignup) {
        const parsed = JSON.parse(storedSignup);
        if (
          parsed.userId &&
          !list.find((u) => u.userId === parsed.userId)
        ) {
          list.push({
            userId: parsed.userId,
            name: parsed.name || 'Story Seed User',
            username:
              '@' +
              (parsed.name || 'user')
                .toLowerCase()
                .replace(/\s+/g, ''),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              parsed.name || parsed.userId
            )}`,
            bio: 'Story Seed creator',
            totalVideos: stories.filter((s) => s.userId === parsed.userId).length || 0,
            followers: '0',
            following: '0',
          });
        }
      }
    } catch {
      // ignore parse errors
    }

    return list;
  }, [authUser]);

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

  const searchedUser = useMemo(() => {
    const raw = query.trim();
    if (!raw) return null;
    const q = raw.toLowerCase();

    // Try exact User ID match first (case-insensitive)
    let match =
      knownUsers.find((u) => u.userId.toLowerCase() === q) || null;

    // If not exact, allow partial match on userId (for convenience)
    if (!match) {
      match =
        knownUsers.find((u) =>
          u.userId.toLowerCase().includes(q)
        ) || null;
    }

    return match;
  }, [query, knownUsers]);

  const storiesForSearchedUser = useMemo(() => {
    if (!searchedUser) return [];
    return stories.filter((story) => story.userId === searchedUser.userId);
  }, [searchedUser]);

  const openPlayer = (story: ExploreStory) => {
    setSelectedStory(story);
    setIsPlayerOpen(true);
    setShowVotingPanel(false);
    setScore(8);
    setVoteSubmitted(false);
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime + seconds
      );
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedStory(null);
    setShowVotingPanel(false);
    setPlaybackRate(1);
  };

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
            placeholder="Search stories, creators, categories or type a User ID..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* When a valid User ID is searched, show Instagram-style profile view */}
      {searchedUser ? (
        <div className="space-y-6">
          {/* Profile header - centered layout */}
          <div className="rounded-2xl bg-card border border-border/60 p-6 flex flex-col items-center text-center gap-3">
            <Avatar className="w-24 h-24 border-4 border-primary/40 shadow-lg">
              <AvatarImage src={searchedUser.avatar} alt={searchedUser.name} />
              <AvatarFallback>
                {searchedUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-display text-xl font-semibold text-foreground">
                {searchedUser.name}
              </p>
              <p className="text-sm text-muted-foreground">{searchedUser.userId}</p>
              <p className="text-sm text-foreground">{searchedUser.bio}</p>
              <p className="text-sm font-medium text-foreground">
                Stories by {searchedUser.name}
              </p>
            </div>
          </div>

          {/* User stories grid */}
          <div>
            <h2 className="font-display text-lg font-semibold mb-3 text-foreground">
              Stories by {searchedUser.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {storiesForSearchedUser.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => openPlayer(story)}
                  className="group rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-xl transition-shadow duration-300 text-left"
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
                </button>
              ))}

              {storiesForSearchedUser.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  This creator hasn&apos;t uploaded any reels yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Default explore grid
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => openPlayer(story)}
              className="group rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-xl transition-shadow duration-300 text-left"
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
            </button>
          ))}
          {filteredStories.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No stories match your search yet. Try a different name or category.
            </div>
          )}
        </div>
      )}

      {/* Video player popup with controls + voting panel */}
      <Dialog open={isPlayerOpen} onOpenChange={(open) => !open && handleClosePlayer()}>
        <DialogContent className="max-w-5xl md:h-[80vh] p-0 overflow-hidden">
          {selectedStory && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Video section */}
              <div className="md:w-2/3 bg-black flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={selectedStory.videoUrl}
                    className="w-full max-h-[520px] object-contain bg-black"
                    controls
                    autoPlay
                  />
                </div>

                {/* Custom controls bar (aligned under the video) */}
                <div className="px-4 py-3 flex items-center justify-between gap-3 text-xs text-white bg-gradient-to-t from-black via-black/80 to-black/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSkip(-10)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <SkipBack className="w-3 h-3" />
                      <span>10s</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSkip(10)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <SkipForward className="w-3 h-3" />
                      <span>10s</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/80">
                      <Gauge className="w-3 h-3" />
                      Speed
                    </span>
                    {[0.5, 1, 1.5].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSpeedChange(rate)}
                        className={`px-2 py-1 rounded-full text-[11px] ${
                          playbackRate === rate
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCaptionsOn((c) => !c)}
                      className={`ml-1 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] ${
                        captionsOn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Captions className="w-3 h-3" />
                      <span>CC</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Info + voting section */}
              <div className="md:w-1/3 flex flex-col border-l border-border bg-card">
                <DialogHeader className="px-4 pt-4 pb-3 border-b border-border/60">
                  <div>
                    <DialogTitle className="text-base mb-1 line-clamp-2">
                      {selectedStory.title}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground">
                      {selectedStory.author} • {selectedStory.userId}
                    </p>
                  </div>
                </DialogHeader>

                <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {selectedStory.category}
                    </span>
                    <span>{selectedStory.views} views</span>
                  </div>

                  {user && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Watching as</span>
                      <span className="font-medium">
                        {user.id || user.name?.split(' ')[0]}
                      </span>
                    </div>
                  )}

                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowVotingPanel(true)}
                  >
                    Open Voting Panel
                  </Button>

                  {showVotingPanel && (
                    <div className="mt-2 rounded-xl border border-border/60 bg-muted/40 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground">
                          Quick Vote
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowVotingPanel(false)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Close
                        </button>
                      </div>
                      {voteSubmitted ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                              Vote submitted
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Thank you for rating this story.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Give an overall score and a short note.
                          </p>

                          <div className="space-y-1.5">
                            <div className="flex justify-center text-xs font-semibold text-foreground">
                              Score: <span className="ml-1 text-primary">{score}</span>/10
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">Overall Score</span>
                              <span className="text-muted-foreground">1 – 10</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-muted-foreground">1</span>
                              <input
                                type="range"
                                min={1}
                                max={10}
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                className="flex-1 accent-primary"
                              />
                              <span className="text-[11px] text-muted-foreground">10</span>
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            placeholder="Short comment about this story..."
                            className="w-full text-xs rounded-lg border border-border bg-background px-2 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />

                          <Button
                            type="button"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              // Placeholder for future API integration
                              setVoteSubmitted(true);
                            }}
                          >
                            Submit Vote
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserExplore;



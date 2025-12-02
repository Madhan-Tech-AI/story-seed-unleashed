import { useState, useRef, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Star, Eye, Vote, Play, Pause, Maximize, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const pendingSubmissions = [
  {
    id: 1,
    eventName: 'The Magical Garden',
    participants: [
      {
        id: 1,
        name: 'Ananya Sharma',
        storyTitle: 'The Magical Garden',
        age: 10,
        category: 'Fantasy',
        photo: 'https://api.dicebear.com/8.x/initials/svg?seed=AS',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      {
        id: 2,
        name: 'Rohan Verma',
        storyTitle: 'Secret of the Red Flower',
        age: 11,
        category: 'Fantasy',
        photo: 'https://api.dicebear.com/8.x/initials/svg?seed=RV',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      },
    ],
  },
  {
    id: 2,
    eventName: 'Robot Friends',
    participants: [
      {
        id: 3,
        name: 'Vikram Patel',
        storyTitle: 'Robot Friends',
        age: 12,
        category: 'Sci-Fi',
        photo: 'https://api.dicebear.com/8.x/initials/svg?seed=VP',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      {
        id: 4,
        name: 'Sara Khan',
        storyTitle: 'Circuits of Friendship',
        age: 13,
        category: 'Sci-Fi',
        photo: 'https://api.dicebear.com/8.x/initials/svg?seed=SK',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      },
    ],
  },
  {
    id: 3,
    eventName: 'Monsoon Magic',
    participants: [
      {
        id: 5,
        name: 'Priya Rao',
        storyTitle: 'Monsoon Magic',
        age: 9,
        category: 'Adventure',
        photo: 'https://api.dicebear.com/8.x/initials/svg?seed=PR',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
      {
        id: 6,
        name: 'Kunal Mehta',
        storyTitle: 'Rainy Day Quest',
        age: 10,
        category: 'Adventure',
        photo: 'https://api.dicebear.com/8.x/initials/svg?seed=KM',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      },
    ],
  },
];

const recentReviews = [
  { id: 1, title: 'Adventures in Space', score: 8.5, status: 'Approved' },
  { id: 2, title: 'The Lost Kingdom', score: 7.2, status: 'Approved' },
  { id: 3, title: 'Funny Stories', score: 5.0, status: 'Rejected' },
];

type Participant = {
  id: number;
  name: string;
  storyTitle: string;
  age: number;
  category: string;
  photo: string;
  videoUrl: string;
};

const JudgeDashboard = () => {
  const { user } = useAuth();
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<(typeof pendingSubmissions)[number] | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [voteScore, setVoteScore] = useState([50]); // 0-100 for slider, displayed as 0-10
  const [videoProgress, setVideoProgress] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenParticipants = (submission: (typeof pendingSubmissions)[number]) => {
    setSelectedSubmission(submission);
    setIsParticipantsOpen(true);
  };

  const handleOpenVoting = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsVotingOpen(true);
    setVoteScore([50]); // Default to 5/10
    setVideoProgress([0]);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(speed);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setVideoProgress(value);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        setVideoProgress([progress]);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [selectedParticipant]);

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-red-dark rounded-2xl p-6 text-secondary-foreground">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Welcome, Judge {user?.name?.split(' ')[0]}! ⚖️
        </h1>
        <p className="text-secondary-foreground/80">
          You have pending submissions awaiting your review.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Reviews"
          value={12}
          icon={Clock}
          iconColor="text-secondary"
          change="3 urgent"
          changeType="neutral"
        />
        <StatsCard
          title="Reviewed Today"
          value={8}
          icon={CheckCircle}
          iconColor="text-primary"
          change="+5 from yesterday"
          changeType="positive"
        />
        <StatsCard
          title="Total Reviews"
          value={156}
          icon={FileText}
          iconColor="text-accent"
          change="This month"
          changeType="neutral"
        />
        <StatsCard
          title="Avg. Score Given"
          value="7.4"
          icon={Star}
          iconColor="text-secondary"
          change="Out of 10"
          changeType="neutral"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Submissions */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Pending Submissions
            </h2>
            <Link to="/judge/dashboard/submissions" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {pendingSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{submission.eventName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => handleOpenParticipants(submission)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/judge/dashboard/voting" className="block mt-4">
            <Button variant="hero" className="w-full">
              Open Voting Panel
              <Vote className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Recent Reviews */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recent Reviews
            </h2>
            <Link to="/judge/dashboard/entries" className="text-primary text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-foreground">{review.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {review.score}/10
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    review.status === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={isParticipantsOpen} onOpenChange={setIsParticipantsOpen}>
        <SheetContent
          side="right"
          className="bg-background/95 backdrop-blur-lg border-l border-border/60 sm:max-w-md"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span className="font-display text-xl">Participants</span>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-red-dark text-primary-foreground font-display text-sm">
                S
              </span>
            </SheetTitle>
            <SheetDescription>
              {selectedSubmission?.eventName
                ? `Submissions for "${selectedSubmission.eventName}"`
                : 'Select an event to view participant details.'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {selectedSubmission?.participants?.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 rounded-xl bg-muted/40 border border-border/60 p-3"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={participant.photo} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">{participant.storyTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    Age {participant.age} • {participant.category}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => handleOpenVoting(participant)}
                >
                  View
                </Button>
              </div>
            ))}
            {!selectedSubmission?.participants?.length && (
              <p className="text-sm text-muted-foreground">
                No participant details available for this event yet.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Voting Panel */}
      <Dialog open={isVotingOpen} onOpenChange={setIsVotingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-lg border border-border/60">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedParticipant?.storyTitle}
            </DialogTitle>
          </DialogHeader>

          {selectedParticipant && (
            <div className="space-y-6 mt-4">
              {/* Video Section */}
              <div className="relative w-full bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={selectedParticipant.videoUrl}
                  className="w-full h-auto"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setVideoProgress([0]);
                    }
                  }}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Seek Bar */}
                  <div className="mb-3">
                    <Slider
                      value={videoProgress}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePlayPause}
                        className="bg-background/90 hover:bg-background"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-foreground" />
                        ) : (
                          <Play className="w-4 h-4 text-foreground" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleFullscreen}
                        className="bg-background/90 hover:bg-background"
                      >
                        <Maximize className="w-4 h-4 text-foreground" />
                      </Button>
                      <Select value={playbackSpeed} onValueChange={handleSpeedChange}>
                        <SelectTrigger className="w-20 h-8 bg-background/90 border-border/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-white/80">
                      {videoRef.current &&
                        `${Math.floor(videoRef.current.currentTime || 0)}s / ${Math.floor(
                          videoRef.current.duration || 0
                        )}s`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Participant Details */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedParticipant.photo} alt={selectedParticipant.name} />
                  <AvatarFallback>{selectedParticipant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-lg">{selectedParticipant.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedParticipant.storyTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    Age {selectedParticipant.age} • {selectedParticipant.category}
                  </p>
                </div>
              </div>

              {/* Voting Scale */}
              <div className="space-y-4 p-4 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Voting Score (0-10)
                  </h3>
                </div>
                <div className="space-y-3">
                  <Slider
                    value={voteScore}
                    onValueChange={setVoteScore}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <span className="text-lg font-semibold text-primary">
                      {((voteScore[0] / 100) * 10).toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
                <Button variant="hero" className="w-full mt-4">
                  Submit Vote
                  <Vote className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JudgeDashboard;

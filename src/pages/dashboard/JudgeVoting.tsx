import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Maximize, Vote, Gauge, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type Submission = {
  id: string;
  name: string;
  storyTitle: string;
  storyDescription: string;
  age: number;
  category: string;
  photo: string;
  videoUrl: string;
  eventName: string;
};

const JudgeVoting = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voteScore, setVoteScore] = useState([50]);
  const [videoProgress, setVideoProgress] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchPendingSubmissions = async () => {
    if (!user?.id) return;

    try {
      // Get all votes by this judge
      const { data: votes } = await supabase
        .from('votes')
        .select('registration_id')
        .eq('user_id', user.id);

      const votedRegistrationIds = votes?.map(v => v.registration_id) || [];

      // Fetch all registrations that haven't been voted on
      const { data: registrations } = await supabase
        .from('registrations')
        .select(`
          id, first_name, last_name, story_title, story_description, 
          age, category, yt_link, event_id
        `);

      if (registrations) {
        const pendingRegistrations = registrations.filter(
          r => !votedRegistrationIds.includes(r.id)
        );

        // Fetch event names
        const eventIds = [...new Set(pendingRegistrations.map(r => r.event_id).filter(Boolean))];
        const { data: events } = await supabase
          .from('events')
          .select('id, name')
          .in('id', eventIds);

        const eventMap = new Map(events?.map(e => [e.id, e.name]) || []);

        const formattedSubmissions: Submission[] = pendingRegistrations.map(r => ({
          id: r.id,
          name: `${r.first_name} ${r.last_name}`,
          storyTitle: r.story_title,
          storyDescription: r.story_description,
          age: r.age,
          category: r.category,
          photo: `https://api.dicebear.com/8.x/initials/svg?seed=${r.first_name}${r.last_name}`,
          videoUrl: r.yt_link || '',
          eventName: eventMap.get(r.event_id) || 'Unknown Event'
        }));

        setSubmissions(formattedSubmissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSubmissions();

    const channel = supabase
      .channel('judge-voting-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchPendingSubmissions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const currentSubmission = submissions[currentIndex];

  const handleSubmitVote = async () => {
    if (!user?.id || !currentSubmission) return;

    const score = Math.round((voteScore[0] / 100) * 10);

    try {
      const { error } = await supabase.from('votes').insert({
        user_id: user.id,
        registration_id: currentSubmission.id,
        score
      });

      if (error) throw error;

      toast({
        title: 'Vote Submitted! ✓',
        description: `You gave "${currentSubmission.storyTitle}" a score of ${score}/10`
      });

      // Move to next submission
      if (currentIndex < submissions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
      setVoteScore([50]);
      fetchPendingSubmissions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit vote',
        variant: 'destructive'
      });
    }
  };

  const handleSkip = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setVoteScore([50]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setVoteScore([50]);
    }
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
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
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
  }, [currentSubmission]);

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="space-y-6 page-enter max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-foreground">Voting Panel</h1>
        <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
          <p className="text-muted-foreground text-lg">All caught up! 🎉</p>
          <p className="text-muted-foreground text-sm mt-2">No pending submissions to review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Voting Panel</h1>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {submissions.length} pending
        </span>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border/50">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {currentSubmission.eventName}
            </span>
            <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
              {currentSubmission.category}
            </span>
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            {currentSubmission.storyTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            By {currentSubmission.name}, Age {currentSubmission.age}
          </p>
        </div>

        {/* Video Player */}
        <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video mb-6">
          {currentSubmission.videoUrl ? (
            currentSubmission.videoUrl.includes('youtube') || currentSubmission.videoUrl.includes('youtu.be') ? (
              <iframe
                src={getVideoEmbedUrl(currentSubmission.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={currentSubmission.videoUrl}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="mb-3">
                    <Slider
                      value={videoProgress}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={handlePlayPause} className="bg-background/90">
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleFullscreen} className="bg-background/90">
                        <Maximize className="w-4 h-4" />
                      </Button>
                      <Select value={playbackSpeed} onValueChange={handleSpeedChange}>
                        <SelectTrigger className="w-20 h-8 bg-background/90">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-white/80">
                      {videoRef.current &&
                        `${Math.floor(videoRef.current.currentTime || 0)}s / ${Math.floor(videoRef.current.duration || 0)}s`}
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No video available
            </div>
          )}
        </div>

        {/* Story Description */}
        <div className="bg-muted/50 p-4 rounded-xl mb-6 max-h-40 overflow-y-auto">
          <h4 className="text-sm font-medium text-foreground mb-2">Story Description</h4>
          <p className="text-foreground/80 leading-relaxed text-sm">
            {currentSubmission.storyDescription || 'No description provided.'}
          </p>
        </div>

        {/* Voting Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <label className="text-sm font-medium text-foreground">Score (0-10)</label>
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
              <span className="text-sm text-muted-foreground">Your Score:</span>
              <span className="text-2xl font-bold text-primary">
                {Math.round((voteScore[0] / 100) * 10)}/10
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 - Poor</span>
              <span>5 - Average</span>
              <span>10 - Excellent</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleSubmitVote}>
              <Vote className="w-4 h-4 mr-2" />
              Submit Vote
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={currentIndex === submissions.length - 1}
            >
              Skip
              <SkipForward className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeVoting;

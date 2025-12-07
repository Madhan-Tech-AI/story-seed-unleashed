import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ThumbsUp, Eye, X, Share2, Play, Loader2, User, Phone, Search, ArrowLeft, Copy, Check, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Contestant {
  id: string;
  first_name: string;
  last_name: string;
  story_title: string;
  story_description: string;
  age: number;
  category: string;
  yt_link: string | null;
  overall_votes: number;
  overall_views: number;
  photo: string;
  event_name?: string;
  city?: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

interface VoteRecord {
  contestantId: string;
  timestamp: number;
  voterName: string;
  voterPhone: string;
}

const Voting = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchContestants = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, name')
          .eq('id', eventId)
          .single();

        if (eventError || !eventData) {
          setLoading(false);
          return;
        }

        const { data: registrations, error } = await supabase
          .from('registrations')
          .select('id, first_name, last_name, story_title, story_description, age, category, yt_link, overall_votes, overall_views, city, email, phone, created_at, events:events!registrations_event_id_fkey(name)')
          .eq('event_id', eventId)
          .order('overall_votes', { ascending: false });

        if (error) {
          console.error('Error fetching contestants:', error);
          setLoading(false);
          return;
        }

        const formattedContestants = (registrations || []).map((reg) => ({
          id: reg.id,
          first_name: reg.first_name,
          last_name: reg.last_name,
          story_title: reg.story_title,
          story_description: reg.story_description || '',
          age: reg.age,
          category: reg.category,
          yt_link: reg.yt_link,
          overall_votes: reg.overall_votes || 0,
          overall_views: reg.overall_views || 0,
          photo: `https://api.dicebear.com/8.x/initials/svg?seed=${reg.first_name}${reg.last_name}&backgroundColor=9B1B1B&textColor=ffffff`,
          event_name: (reg.events as any)?.name || eventData.name || 'Unknown Event',
          city: reg.city || '',
          email: reg.email || '',
          phone: reg.phone || '',
          created_at: reg.created_at || '',
        }));

        setContestants(formattedContestants);

        // Load vote records from localStorage
        const storedVotes = localStorage.getItem(`vote_records_${eventId}`);
        if (storedVotes) {
          setVoteRecords(JSON.parse(storedVotes));
        }
      } catch (error) {
        console.error('Error fetching contestants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContestants();

    if (eventId) {
      const channel = supabase
        .channel(`voting-${eventId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'registrations',
            filter: `event_id=eq.${eventId}`,
          },
          () => {
            fetchContestants();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [eventId]);

  const handleContestantClick = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setIsModalOpen(true);
    setVoterName('');
    setVoterPhone('');
  };

  const canVote = (contestantId: string): { canVote: boolean; reason?: string } => {
    const now = Date.now();
    const lastVote = voteRecords.find(v => v.contestantId === contestantId);
    
    if (!lastVote) {
      return { canVote: true };
    }

    const timeSinceLastVote = now - lastVote.timestamp;
    const hoursSinceLastVote = timeSinceLastVote / (1000 * 60 * 60);

    if (hoursSinceLastVote < 24) {
      const hoursRemaining = Math.ceil(24 - hoursSinceLastVote);
      return { 
        canVote: false, 
        reason: `You can vote again in ${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}` 
      };
    }

    return { canVote: true };
  };

  const handleVote = async () => {
    if (!selectedContestant || !eventId) return;
    
    if (!voterName.trim() || !voterPhone.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your name and phone number to vote.',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone (should be 10 digits)
    const phoneDigits = voterPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }

    const voteCheck = canVote(selectedContestant.id);
    if (!voteCheck.canVote) {
      toast({
        title: 'Cannot Vote Yet',
        description: voteCheck.reason || 'You need to wait 24 hours before voting again.',
        variant: 'destructive',
      });
      return;
    }

    setVoting(true);

    try {
      // Increment vote count
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ overall_votes: (selectedContestant.overall_votes || 0) + 1 })
        .eq('id', selectedContestant.id);

      if (updateError) {
        throw updateError;
      }

      // Store vote record
      const newVoteRecord: VoteRecord = {
        contestantId: selectedContestant.id,
        timestamp: Date.now(),
        voterName: voterName.trim(),
        voterPhone: `+91${phoneDigits}`,
      };

      const updatedRecords = [...voteRecords.filter(v => v.contestantId !== selectedContestant.id), newVoteRecord];
      setVoteRecords(updatedRecords);
      localStorage.setItem(`vote_records_${eventId}`, JSON.stringify(updatedRecords));

      // Update local state
      setContestants((prev) =>
        prev.map((c) =>
          c.id === selectedContestant.id
            ? { ...c, overall_votes: (c.overall_votes || 0) + 1 }
            : c
        )
      );

      toast({
        title: 'Vote Recorded! 🎉',
        description: `Thank you for voting for ${selectedContestant.first_name} ${selectedContestant.last_name}!`,
      });

      setIsModalOpen(false);
      setVoterName('');
      setVoterPhone('');
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Vote Failed',
        description: 'Could not record your vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVoting(false);
    }
  };

  const handleShare = () => {
    if (!selectedContestant || !eventId) return;
    setIsShareModalOpen(true);
  };

  const getShareUrl = () => {
    if (!selectedContestant || !eventId) return '';
    return `${window.location.origin}/voting/${eventId}?contestant=${selectedContestant.id}`;
  };

  const getShareText = () => {
    if (!selectedContestant) return '';
    return `Check out this amazing story: ${selectedContestant.story_title} by ${selectedContestant.first_name} ${selectedContestant.last_name}. Vote now!`;
  };

  const copyToClipboard = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      toast({
        title: 'Link Copied!',
        description: 'Voting link has been copied to clipboard.',
      });
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy link. Please try again.',
        variant: 'destructive',
      });
    });
  };

  const shareOnWhatsApp = () => {
    const shareUrl = getShareUrl();
    const shareText = getShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const shareUrl = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the link and show a message
    copyToClipboard();
    toast({
      title: 'Link Copied!',
      description: 'Instagram doesn\'t support direct sharing. The link has been copied to your clipboard. You can paste it in your Instagram story or post.',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContestant(null);
    setVoterName('');
    setVoterPhone('');
  };

  // Handle phone input - only allow 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      setVoterPhone(digits);
    }
  };

  // Check if contestant was shared via URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const contestantId = urlParams.get('contestant');
    if (contestantId && contestants.length > 0) {
      const contestant = contestants.find(c => c.id === contestantId);
      if (contestant) {
        handleContestantClick(contestant);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [contestants]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading contestants...</p>
        </div>
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            No Event Selected
          </h1>
          <p className="text-muted-foreground mb-8">
            Please select an event to view contestants and vote.
          </p>
          <Link to="/events">
            <Button variant="hero">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (contestants.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            No Contestants Yet
          </h1>
          <p className="text-muted-foreground mb-8">
            There are no contestants registered for this event yet. Check back later!
          </p>
          <Link to="/events">
            <Button variant="hero">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedVoteCheck = selectedContestant ? canVote(selectedContestant.id) : { canVote: true };

  // Filter contestants based on search query
  const filteredContestants = contestants.filter((contestant) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      contestant.first_name.toLowerCase().includes(query) ||
      contestant.last_name.toLowerCase().includes(query) ||
      contestant.story_title.toLowerCase().includes(query) ||
      contestant.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <section className="pt-20 pb-8 sm:pb-12 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className={cn(
                "group relative backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-white/30 dark:border-white/20",
                "rounded-2xl px-4 py-3 shadow-lg hover:shadow-2xl transition-all duration-300",
                "hover:scale-105 hover:border-primary/50 flex items-center gap-2",
                "bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/50"
              )}
            >
              <ArrowLeft className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
              <span className="font-medium text-primary group-hover:text-primary-foreground transition-colors">
                Back
              </span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Vote for Your <span className="text-gradient">Favorites</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Support young storytellers by voting for the stories that inspire you the most
            </p>
          </div>
        </div>
      </section>

      {/* Search Box */}
      <section className="py-4 sm:py-6 container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Search contestants by name, story title, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-12 bg-background/80 backdrop-blur-sm border-border/60 focus:bg-background shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Contestants Grid */}
      <section className="py-6 sm:py-12 container mx-auto px-4">
        {filteredContestants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery.trim() ? 'No contestants found matching your search.' : 'No contestants available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filteredContestants.map((contestant, index) => {
            const voteCheck = canVote(contestant.id);
            const hasVoted = voteRecords.some(v => v.contestantId === contestant.id);
            
            return (
              <button
                key={contestant.id}
                onClick={() => handleContestantClick(contestant)}
                className={cn(
                  'group relative aspect-square rounded-2xl overflow-hidden',
                  'backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10',
                  'shadow-lg hover:shadow-2xl transition-all duration-300',
                  'hover:scale-105 animate-fade-in',
                  hasVoted && !voteCheck.canVote && 'ring-2 ring-primary'
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Profile Photo */}
                <div className="absolute inset-0">
                  <img
                    src={contestant.photo}
                    alt={`${contestant.first_name} ${contestant.last_name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm truncate">
                    {contestant.first_name} {contestant.last_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <ThumbsUp className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{contestant.overall_votes}</span>
                  </div>
                </div>

                {/* Voted Badge */}
                {hasVoted && !voteCheck.canVote && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                    <ThumbsUp className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && selectedContestant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ top: 0 }}>
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border/50 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <div className="p-6 space-y-6">
              {/* Video Placeholder */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                {selectedContestant.yt_link ? (
                  <iframe
                    src={selectedContestant.yt_link}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Video coming soon</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contestant Info */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  {selectedContestant.first_name} {selectedContestant.last_name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-4">
                  <span>Age {selectedContestant.age}</span>
                  <span>•</span>
                  <span>{selectedContestant.category}</span>
                  {selectedContestant.city && (
                    <>
                      <span>•</span>
                      <span>{selectedContestant.city}</span>
                    </>
                  )}
                  {selectedContestant.event_name && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">{selectedContestant.event_name}</span>
                    </>
                  )}
                </div>
                <p className="text-foreground mb-2">
                  <span className="font-semibold">Story:</span> {selectedContestant.story_title}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedContestant.story_description}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedContestant.overall_votes} votes</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{selectedContestant.overall_views} views</span>
                  </div>
                </div>
              </div>

              {/* Voter Details in Container */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Voter Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-medium text-foreground">
                      <User className="w-4 h-4" />
                      Your Name
                    </Label>
                    <Input
                      placeholder="Enter your name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-medium text-foreground">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                        <span className="text-lg">🇮🇳</span>
                        <span className="text-sm font-medium text-foreground">+91</span>
                      </div>
                      <Input
                        type="tel"
                        placeholder="98765 43210"
                        value={voterPhone}
                        onChange={handlePhoneChange}
                        className="pl-20 w-full"
                        maxLength={10}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter your 10-digit mobile number
                    </p>
                  </div>
                  {selectedVoteCheck.reason && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {selectedVoteCheck.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  onClick={handleVote}
                  disabled={voting || !selectedVoteCheck.canVote || !voterName.trim() || !voterPhone.trim() || voterPhone.length !== 10}
                  className="flex-1"
                >
                  {voting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Voting...
                    </>
                  ) : !selectedVoteCheck.canVote ? (
                    <>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Already Voted
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Vote
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share This Story</DialogTitle>
            <DialogDescription>
              Share this amazing story with your friends and family
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Share Link Input */}
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={getShareUrl()}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 h-12"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={shareOnWhatsApp}
                className="flex items-center justify-center gap-2 h-12 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 border-green-200 dark:border-green-800"
              >
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={shareOnFacebook}
                className="flex items-center justify-center gap-2 h-12 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800"
              >
                <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Facebook
              </Button>

              <Button
                variant="outline"
                onClick={shareOnInstagram}
                className="flex items-center justify-center gap-2 h-12 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950 dark:hover:bg-pink-900 border-pink-200 dark:border-pink-800"
              >
                <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                Instagram
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Voting;

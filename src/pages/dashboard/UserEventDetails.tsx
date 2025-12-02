import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Trophy,
  Copy,
  MessageCircle,
  Mail,
  Send,
  Facebook,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EventDetailsData {
  id: number;
  title: string;
  bannerUrl: string;
  host: string;
  dateRange: string;
  eventDate: string; // ISO string for main day
  time: string;
  location: string;
  description: string;
  agenda: string[];
  prizes: string;
  rules: string[];
}

const eventsDetails: EventDetailsData[] = [
  {
    id: 1,
    title: 'Summer Championship 2025',
    bannerUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200&auto=format&fit=crop&q=80',
    host: 'Story Seed',
    dateRange: 'June 15 - July 30, 2025',
    eventDate: '2025-07-30',
    time: '9:00 AM IST',
    location: 'Online & Partner Schools',
    description:
      'Welcome to the Summer Championship 2025, the ultimate arena for young storytellers to showcase their creativity and performance skills.',
    agenda: [
      'Submit your short video stories based on the given themes.',
      'Top entries will be shortlisted for the live showcase round.',
      'Finalists get feedback from expert judges and special guests.',
    ],
    prizes:
      'Prizes worth ₹50,000, certificates for all finalists, and a special feature on the Story Seed spotlight page.',
    rules: [
      'Each story video must be between 60 and 120 seconds.',
      'Original content only – no plagiarism or copyrighted background music.',
      'Respectful language and family-friendly content are mandatory.',
      'One submission per registered participant for this event.',
    ],
  },
  {
    id: 2,
    title: 'Monsoon Tales Festival',
    bannerUrl: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=1200&auto=format&fit=crop&q=80',
    host: 'Story Seed',
    dateRange: 'August 1 - Sept 15, 2025',
    eventDate: '2025-09-15',
    time: '10:00 AM IST',
    location: 'Hybrid – Online + City Hubs',
    description:
      'Monsoon Tales Festival celebrates cosy, heartfelt and adventurous stories inspired by the magic of the rainy season.',
    agenda: [
      'Record and upload your monsoon-inspired story.',
      'Shortlisted storytellers join an interactive storytelling circle.',
      'Audience choice awards based on community voting.',
    ],
    prizes:
      'Prizes worth ₹35,000, digital badges, and invitations to exclusive Story Seed workshops.',
    rules: [
      'Stories should relate to monsoon, rain, or seasonal experiences.',
      'Maximum of 2 minutes per video.',
      'No harmful or unsafe activities should be shown in the video.',
    ],
  },
  {
    id: 3,
    title: 'Diwali Story Sparkle',
    bannerUrl: 'https://images.unsplash.com/photo-1602881917760-7379db593981?w=1200&auto=format&fit=crop&q=80',
    host: 'Story Seed',
    dateRange: 'Oct 15 - Nov 5, 2025',
    eventDate: '2025-11-05',
    time: '6:00 PM IST',
    location: 'Online Celebration',
    description:
      'Diwali Story Sparkle brings together bright, hopeful and inspiring stories to celebrate the festival of lights.',
    agenda: [
      'Share a story that reflects the spirit of Diwali – kindness, courage or new beginnings.',
      'Watch a curated showcase of the best entries with families across the country.',
      'Special recognition for the most heart-warming story.',
    ],
    prizes:
      'Prizes worth ₹40,000, festival hampers for winners and digital certificates for all participants.',
    rules: [
      'Respect all cultures and avoid insensitive stereotypes.',
      'Fireworks, if shown, must be in safe and supervised settings.',
      'Videos should focus on storytelling, not just background visuals.',
    ],
  },
];

const UserEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Is there any age limit for participants?',
    'Can we submit stories in regional languages?',
  ]);

  const event = useMemo(
    () => eventsDetails.find((e) => e.id === Number(id)),
    [id],
  );

  if (!event) {
    navigate('/user/dashboard/events', { replace: true });
    return null;
  }

  const today = new Date();
  const eventDate = new Date(event.eventDate);
  const hasEnded = today > eventDate;
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleAddComment = () => {
    const value = newComment.trim();
    if (!value) return;
    setComments((prev) => [value, ...prev]);
    setNewComment('');
  };

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/user/dashboard/events/${event.id}`
      : `/user/dashboard/events/${event.id}`;

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event on Story Seed: ${event.title}`,
          url: shareUrl,
        });
        return;
      } catch {
        // if user cancels, just ignore
      }
    }
    setIsShareOpen(true);
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Top bar with back + status */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            hasEnded
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {hasEnded ? 'Event ended' : 'Upcoming event'}
        </span>
      </div>

      {/* Banner */}
      <div className="overflow-hidden rounded-2xl border border-border/60">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full max-h-[260px] object-cover"
        />
      </div>

      {/* Main details header */}
      <div className="space-y-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {event.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Event by <span className="font-semibold">{event.host}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{event.dateRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={hasEnded ? 'outline' : 'hero'}
            className="min-w-[160px]"
            disabled={hasEnded}
          >
            {hasEnded ? 'Event ended' : 'Register Now'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={handleShareClick}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Tabs: Details / Comments / Rules */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-4 bg-destructive/10 text-destructive">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="rules"
            className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
          >
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-foreground">
              About
            </h2>
            <p className="text-sm leading-relaxed text-foreground">
              {event.description}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Schedule
            </h3>
            <p className="text-sm text-foreground">
              Main event date:{' '}
              <span className="font-medium">
                {new Date(event.eventDate).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>{' '}
              at <span className="font-medium">{event.time}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              What to expect
            </h3>
            <ul className="list-disc list-inside text-sm text-foreground space-y-1">
              {event.agenda.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-secondary" />
              Prizes & Recognition
            </h3>
            <p className="text-sm text-foreground">{event.prizes}</p>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Comments
            </h2>
            <p className="text-xs text-muted-foreground">
              Ask questions about the event. Organisers can use this space to reply.
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment or question..."
              className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddComment}>
                Post comment
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {comments.map((comment, idx) => (
              <div
                key={`${comment}-${idx}`}
                className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm"
              >
                <p className="text-foreground">{comment}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to ask something about this event.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Rules & Regulations
            </h2>
            <p className="text-xs text-muted-foreground">
              Please read these carefully before submitting your story.
            </p>
          </div>

          <ul className="list-disc list-inside text-sm text-foreground space-y-1">
            {event.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      {/* Share dialog (fallback if native share is not available) */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Event link
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    navigator.clipboard?.writeText(shareUrl);
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      `Check out this event: ${event.title} - ${shareUrl}`,
                    )}`,
                    '_blank',
                  );
                }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  window.open(
                    `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
                      event.title,
                    )}&body=${encodeURIComponent(
                      `Hi,\n\nI thought you might like this event: ${event.title}.\n\nYou can view it here: ${shareUrl}`,
                    )}`,
                    '_blank',
                  );
                }}
              >
                <Mail className="w-4 h-4" />
                Gmail
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  window.open(
                    `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${encodeURIComponent(
                      event.title,
                    )}&body=${encodeURIComponent(
                      `Check out this event on Story Seed:\n${shareUrl}`,
                    )}`,
                    '_blank',
                  );
                }}
              >
                <Mail className="w-4 h-4" />
                Outlook
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(
                      shareUrl,
                    )}&text=${encodeURIComponent(event.title)}`,
                    '_blank',
                  );
                }}
              >
                <Send className="w-4 h-4" />
                Telegram
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl,
                    )}`,
                    '_blank',
                  );
                }}
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl,
                    )}&text=${encodeURIComponent(event.title)}`,
                    '_blank',
                  );
                }}
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserEventDetails;



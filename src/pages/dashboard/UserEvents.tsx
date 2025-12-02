import { Calendar, Trophy, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const events = [
  {
    id: 1,
    title: 'Summer Championship 2025',
    date: 'June 15 - July 30, 2025',
    prize: '₹50,000',
    participants: 2500,
  },
  {
    id: 2,
    title: 'Monsoon Tales Festival',
    date: 'August 1 - Sept 15, 2025',
    prize: '₹35,000',
    participants: 1800,
  },
  {
    id: 3,
    title: 'Diwali Story Sparkle',
    date: 'Oct 15 - Nov 5, 2025',
    prize: '₹40,000',
    participants: 2200,
  },
];

const UserEvents = () => (
  <div className="space-y-6 page-enter">
    <div className="flex justify-between items-center">
      <h1 className="font-display text-2xl font-bold text-foreground">Available Events</h1>
    </div>
    <div className="grid gap-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-card p-6 rounded-2xl border border-border/50 card-hover flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {event.title}
              </h3>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {event.date}
              </p>
            </div>
            <Link to={`/user/dashboard/events/${event.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="md:self-center gap-1"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-secondary" />
              {event.prize}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.participants.toLocaleString()} participants
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserEvents;

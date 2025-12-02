import { Calendar, Trophy, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const events = [
  { id: 1, title: 'Summer Championship 2025', date: 'June 15 - July 30', status: 'Registered', prize: '₹50,000', participants: 2500 },
  { id: 2, title: 'Monsoon Tales Festival', date: 'August 1 - Sept 15', status: 'Open', prize: '₹35,000', participants: 1800 },
  { id: 3, title: 'Diwali Story Sparkle', date: 'Oct 15 - Nov 5', status: 'Open', prize: '₹40,000', participants: 2200 },
];

const UserEvents = () => (
  <div className="space-y-6 page-enter">
    <div className="flex justify-between items-center">
      <h1 className="font-display text-2xl font-bold text-foreground">Available Events</h1>
      <Link to="/user/dashboard/register">
        <Button variant="hero">Register Now</Button>
      </Link>
    </div>
    <div className="grid gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-card p-6 rounded-2xl border border-border/50 card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">{event.title}</h3>
              <p className="text-muted-foreground flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" />{event.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'Registered' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>{event.status}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-secondary" />{event.prize}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.participants.toLocaleString()} participants</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserEvents;

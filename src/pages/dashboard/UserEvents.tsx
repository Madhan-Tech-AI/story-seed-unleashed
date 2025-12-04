import { useState, useEffect } from 'react';
import { Calendar, Trophy, Users, ArrowRight, Image, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Event {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  banner_image: string | null;
  prize_amount: number | null;
  prize_currency: string | null;
  participantCount: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

const UserEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Get participant counts
      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          return {
            ...event,
            participantCount: count || 0,
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('user-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchEvents())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => fetchEvents())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start && !end) return 'Dates TBD';
    if (start && end) {
      return `${format(new Date(start), 'MMM d')} - ${format(new Date(end), 'MMM d, yyyy')}`;
    }
    if (start) return `Starts ${format(new Date(start), 'MMM d, yyyy')}`;
    return `Ends ${format(new Date(end!), 'MMM d, yyyy')}`;
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return null;
    const symbol = CURRENCY_SYMBOLS[currency || 'USD'] || currency || '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Available Events</h1>
      </div>

      {events.length === 0 ? (
        <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
          <p className="text-muted-foreground">No active events at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card rounded-2xl border border-border/50 card-hover overflow-hidden"
            >
              {/* Banner Image */}
              {event.banner_image ? (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={event.banner_image} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Image className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {event.name}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateRange(event.start_date, event.end_date)}
                    </p>
                  </div>
                  <Link to={`/user/dashboard/events/${event.id}`}>
                    <Button variant="outline" size="sm" className="md:self-center gap-1">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {event.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.participantCount.toLocaleString()} participants
                  </span>
                  {event.prize_amount && (
                    <span className="flex items-center gap-1 text-yellow-600 font-medium">
                      <Trophy className="w-4 h-4" />
                      Prize: {formatCurrency(event.prize_amount, event.prize_currency)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEvents;
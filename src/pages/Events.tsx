import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Event {
  id: string;
  name: string;
  description: string | null;
  banner_image: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  participantCount: number;
  status: 'live' | 'upcoming' | 'ended';
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .eq('results_announced', false)
        .order('start_date', { ascending: true });

      if (error) throw error;

      const eventsWithStats = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          const now = new Date();
          const start = event.start_date ? new Date(event.start_date) : null;
          const end = event.end_date ? new Date(event.end_date) : null;
          
          let status: 'live' | 'upcoming' | 'ended' = 'upcoming';
          if (start && now < start) status = 'upcoming';
          else if (end && now > end) status = 'ended';
          else status = 'live';

          return {
            id: event.id,
            name: event.name,
            description: event.description,
            banner_image: event.banner_image,
            start_date: event.start_date,
            end_date: event.end_date,
            is_active: event.is_active,
            participantCount: count || 0,
            status,
          };
        })
      );

      setEvents(eventsWithStats);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start) return 'TBD';
    const startDate = format(new Date(start), 'MMM d, yyyy');
    if (end) {
      const endDate = format(new Date(end), 'MMM d, yyyy');
      return `${startDate} - ${endDate}`;
    }
    return startDate;
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="py-16 bg-gradient-warm relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            All <span className="text-gradient">Events</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover all our exciting storytelling competitions and events. Register now to participate!
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm card-hover glow-border animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={event.banner_image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          event.status === 'live'
                            ? 'bg-primary text-primary-foreground pulse-live'
                            : event.status === 'upcoming'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {event.status === 'live' ? '🔴 Live Now' : event.status === 'upcoming' ? 'Coming Soon' : 'Ended'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {event.description || 'Join this exciting storytelling competition!'}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateRange(event.start_date, event.end_date).split(' - ')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-foreground text-sm">
                            Rewards for winners
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">{event.participantCount}+</span>
                        </div>
                      </div>
                    </div>

                    <Link to="/register">
                      <Button variant="hero" className="w-full group/btn">
                        Register Now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
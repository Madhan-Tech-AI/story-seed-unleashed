import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, Star, TrendingUp, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const eventCategories = ['Upcoming', 'Live', 'All'];

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

export const EventsSection = () => {
  const [activeCategory, setActiveCategory] = useState('Upcoming');
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
      .channel('home-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredEvents = events.filter((event) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Upcoming') return event.status === 'upcoming';
    if (activeCategory === 'Live') return event.status === 'live';
    return true;
  });

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start) return 'TBD';
    const startDate = format(new Date(start), 'MMM d, yyyy');
    if (end) {
      const endDate = format(new Date(end), 'MMM d, yyyy');
      return `${startDate} - ${endDate}`;
    }
    return startDate;
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Upcoming <span className="text-gradient">Events</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't miss out on these exciting storytelling competitions and events
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {eventCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-6 py-3 rounded-full font-medium text-sm transition-all duration-300',
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {category === 'Live' && <Star className="w-4 h-4 inline mr-2" />}
              {category === 'All' && <TrendingUp className="w-4 h-4 inline mr-2" />}
              {category === 'Upcoming' && <Clock className="w-4 h-4 inline mr-2" />}
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.slice(0, 6).map((event, index) => (
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
                  <p className="text-muted-foreground text-sm line-clamp-2">
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
                    <Button variant="outline" className="w-full group/btn">
                      Join Competition
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link to="/events">
            <Button variant="hero" size="lg">
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
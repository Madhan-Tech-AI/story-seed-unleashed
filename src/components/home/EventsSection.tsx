import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, Star, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const eventCategories = ['Upcoming', 'Featured', 'Trending'];

const events = [
  {
    id: 1,
    title: 'Summer Storytelling Championship 2025',
    description: 'Join thousands of young storytellers in our biggest competition yet!',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    date: 'June 15 - July 30, 2025',
    prize: '₹50,000',
    participants: '2,500+',
    status: 'live',
    category: 'Upcoming',
    featured: true,
    trending: true,
  },
  {
    id: 2,
    title: 'Monsoon Tales Festival',
    description: 'Share your rainy day adventures and magical monsoon stories',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    date: 'August 1 - September 15, 2025',
    prize: '₹35,000',
    participants: '1,800+',
    status: 'live',
    category: 'Upcoming',
    featured: true,
    trending: false,
  },
  {
    id: 3,
    title: 'Diwali Story Sparkle',
    description: 'Celebrate the festival of lights with your creative tales',
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    date: 'October 15 - November 5, 2025',
    prize: '₹40,000',
    participants: '2,200+',
    status: 'upcoming',
    category: 'Upcoming',
    featured: false,
    trending: true,
  },
  {
    id: 4,
    title: 'Winter Wonder Tales',
    description: 'Share your magical winter stories and holiday adventures',
    image: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800&q=80',
    date: 'December 1 - January 15, 2026',
    prize: '₹30,000',
    participants: '1,500+',
    status: 'upcoming',
    category: 'Featured',
    featured: true,
    trending: false,
  },
  {
    id: 5,
    title: 'Nature Stories Challenge',
    description: 'Tell stories about the wonders of nature and wildlife',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    date: 'March 1 - April 15, 2025',
    prize: '₹25,000',
    participants: '1,200+',
    status: 'ended',
    category: 'Trending',
    featured: false,
    trending: true,
  },
  {
    id: 6,
    title: 'Fantasy Realm Quest',
    description: 'Create epic tales of fantasy worlds and magical creatures',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    date: 'May 1 - June 30, 2025',
    prize: '₹45,000',
    participants: '2,000+',
    status: 'live',
    category: 'Trending',
    featured: true,
    trending: true,
  },
];

export const EventsSection = () => {
  const [activeCategory, setActiveCategory] = useState('Upcoming');

  const filteredEvents = events.filter((event) => {
    if (activeCategory === 'Featured') return event.featured;
    if (activeCategory === 'Trending') return event.trending;
    return event.category === activeCategory;
  });

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
              {category === 'Featured' && <Star className="w-4 h-4 inline mr-2" />}
              {category === 'Trending' && <TrendingUp className="w-4 h-4 inline mr-2" />}
              {category === 'Upcoming' && <Clock className="w-4 h-4 inline mr-2" />}
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm card-hover glow-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
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
                  {event.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {event.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date.split(' - ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-secondary" />
                      <span className="font-semibold text-foreground">{event.prize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">{event.participants}</span>
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

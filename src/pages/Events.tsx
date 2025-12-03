import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, Star, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const events = [
  {
    id: 1,
    title: 'Summer Storytelling Championship 2025',
    description: 'Join thousands of young storytellers in our biggest competition yet! This championship brings together the most creative young minds to showcase their storytelling talents.',
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
    description: 'Share your rainy day adventures and magical monsoon stories. Celebrate the beauty of the monsoon season through creative storytelling.',
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
    description: 'Celebrate the festival of lights with your creative tales. Share stories that capture the essence of Diwali and its traditions.',
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
    description: 'Share your magical winter stories and holiday adventures. Let your imagination run wild with tales of snow, celebrations, and wonder.',
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
    description: 'Tell stories about the wonders of nature and wildlife. Connect with the environment through your creative narratives.',
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
    description: 'Create epic tales of fantasy worlds and magical creatures. Build your own universe and take readers on an unforgettable journey.',
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

const Events = () => {
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

                  {/* Featured Badge */}
                  {event.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
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
                    <Button variant="hero" className="w-full group/btn">
                      Register Now
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;


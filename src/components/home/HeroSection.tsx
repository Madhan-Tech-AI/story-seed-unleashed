import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    id: 1,
    title: 'Small Voices.',
    subtitle: 'Big Dreams!',
    description: "India's most joyful storytelling platform for children. Share your stories, compete with peers, and win exciting awards.",
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    accent: 'red',
  },
  {
    id: 2,
    title: 'Unleash Your',
    subtitle: 'Creativity!',
    description: 'Join thousands of young storytellers in exciting competitions and workshops.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80',
    accent: 'yellow',
  },
  {
    id: 3,
    title: 'Every Story',
    subtitle: 'Matters!',
    description: 'From fairy tales to adventures, every story has the power to inspire and transform.',
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80',
    accent: 'gold',
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-warm">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div key={currentSlide} className="animate-fade-in">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">{slide.title}</span>
                <br />
                <span className="text-gradient">{slide.subtitle}</span>
              </h1>
            </div>
            <p
              key={`desc-${currentSlide}`}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              {slide.description}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Register Now
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="hero-outline" size="xl">
                  View Competitions
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {heroSlides.map((s, index) => (
                <div
                  key={s.id}
                  className={cn(
                    'absolute inset-0 transition-all duration-700 ease-in-out',
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  )}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === currentSlide
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-background/60 hover:bg-background'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

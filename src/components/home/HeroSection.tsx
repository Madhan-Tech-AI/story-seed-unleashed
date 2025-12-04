import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import slide1 from '@/assets/slides/slide-1.jpg';
import slide2 from '@/assets/slides/slide-2.jpg';
import slide3 from '@/assets/slides/slide-3.jpg';

const heroSlides = [
  {
    id: 1,
    title: 'Small Voices.',
    subtitle: 'Big Dreams!',
    description: "India's most joyful storytelling platform for children. Share your stories, compete with peers, and win exciting awards.",
    image: slide1,
  },
  {
    id: 2,
    title: 'Unleash Your',
    subtitle: 'Creativity!',
    description: 'Join thousands of young storytellers in exciting competitions and workshops.',
    image: slide2,
  },
  {
    id: 3,
    title: 'Every Story',
    subtitle: 'Matters!',
    description: 'From fairy tales to adventures, every story has the power to inspire and transform.',
    image: slide3,
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-[140px] md:pt-[120px] pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-left order-2 lg:order-1">
            <div key={currentSlide} className="animate-fade-in">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                <span>{slide.title}</span>
                <br />
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-500 to-gold">
                  {slide.subtitle}
                </span>
              </h1>
            </div>
            <p
              key={`desc-${currentSlide}`}
              className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              {slide.description}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Link to="/register">
                <Button variant="hero" size="xl" className="shadow-xl">
                  Register Now
                </Button>
              </Link>
              <Link to="/events">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-primary/30 text-foreground hover:bg-primary/10 shadow-lg"
                >
                  View Competitions
                </Button>
              </Link>
            </div>

            {/* Dots Indicator */}
            <div className="flex gap-2 pt-4">
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
                      ? 'w-8 bg-primary shadow-lg'
                      : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Slider */}
          <div className="relative order-1 lg:order-2">
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
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center hover:bg-background hover:scale-110 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Decorative frame */}
            <div className="absolute -inset-4 border-2 border-primary/20 rounded-3xl -z-10" />
            <div className="absolute -inset-8 border border-gold/10 rounded-[2rem] -z-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

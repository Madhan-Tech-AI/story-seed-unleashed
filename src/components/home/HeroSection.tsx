import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    id: 1,
    title: 'Small Voices.',
    subtitle: 'Big Dreams!',
    description: "India's most joyful storytelling platform for children. Share your stories, compete with peers, and win exciting awards.",
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1600&q=80&auto=format&fit=crop',
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images Carousel */}
      <div className="absolute inset-0">
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              'absolute inset-0 transition-all duration-700 ease-in-out',
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-110'
            )}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 max-w-4xl pt-[120px] md:pt-[120px]">
        <div className="space-y-8 text-center">
          <div key={currentSlide} className="animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg">
              <span>{slide.title}</span>
              <br />
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-lg">
                {slide.subtitle}
              </span>
            </h1>
          </div>
          <p
            key={`desc-${currentSlide}`}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in drop-shadow-md"
            style={{ animationDelay: '0.1s' }}
          >
            {slide.description}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Link to="/register">
              <Button variant="hero" size="xl" className="shadow-xl">
                Register Now
              </Button>
            </Link>
            <Link to="/gallery">
              <Button 
                variant="outline" 
                size="xl"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl"
              >
                View Competitions
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
                ? 'w-8 bg-white shadow-lg'
                : 'w-2 bg-white/60 hover:bg-white/80'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

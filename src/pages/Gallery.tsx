import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Star, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const galleryCategories = ['All', 'Events', 'Performers', 'Sessions', 'Awards'];

const galleryItems = [
  {
    id: 1,
    title: 'Summer Championship 2024 Finals',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    type: 'image',
    date: 'July 2024',
    participants: 500,
  },
  {
    id: 2,
    title: 'Young Storyteller Award Ceremony',
    category: 'Awards',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    type: 'image',
    date: 'August 2024',
    participants: 300,
  },
  {
    id: 3,
    title: 'Star Performer - Ananya, Age 10',
    category: 'Performers',
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    type: 'image',
    date: 'June 2024',
    featured: true,
  },
  {
    id: 4,
    title: 'Creative Writing Workshop',
    category: 'Sessions',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    type: 'image',
    date: 'May 2024',
    participants: 150,
  },
  {
    id: 5,
    title: 'Monsoon Tales Festival',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    type: 'image',
    date: 'September 2024',
    participants: 400,
  },
  {
    id: 6,
    title: 'Winner - Arjun, Fantasy Category',
    category: 'Performers',
    image: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800&q=80',
    type: 'image',
    date: 'July 2024',
    featured: true,
  },
  {
    id: 7,
    title: 'Storytelling Masterclass',
    category: 'Sessions',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    type: 'video',
    date: 'April 2024',
    participants: 80,
  },
  {
    id: 8,
    title: 'Annual Excellence Awards 2024',
    category: 'Awards',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    type: 'image',
    date: 'December 2024',
    participants: 600,
  },
  {
    id: 9,
    title: 'Diwali Special Event',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    type: 'image',
    date: 'November 2024',
    participants: 450,
  },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="pt-20 page-enter">
      {/* Hero */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore moments from our events, celebrate our star performers, and relive the magic of storytelling
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background sticky top-16 z-30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {galleryCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-6 py-2 rounded-full font-medium text-sm transition-all duration-300',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Video Icon */}
                {item.type === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-primary-foreground font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 text-primary-foreground/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </span>
                    {item.participants && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.participants}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] px-4">
            <img
              src={filteredItems[currentIndex].image}
              alt={filteredItems[currentIndex].title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-primary-foreground font-display text-xl font-semibold">
                {filteredItems[currentIndex].title}
              </h3>
              <p className="text-primary-foreground/60 mt-1">
                {filteredItems[currentIndex].category} • {filteredItems[currentIndex].date}
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {filteredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'bg-primary-foreground/30 hover:bg-primary-foreground/50'
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

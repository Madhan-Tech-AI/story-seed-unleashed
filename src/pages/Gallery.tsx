import { useState } from 'react';
import { X, ArrowLeft, Star, Calendar, Users, Trophy, Award, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const galleryCategories = ['All', 'Events', 'Performers', 'Sessions', 'Awards'];

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  participants?: number;
  featured?: boolean;
  description?: string;
  winners?: Array<{ name: string; position: string; category?: string }>;
  photos?: string[];
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Summer Championship 2024 Finals',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    date: 'July 15, 2024',
    participants: 500,
    featured: true,
    description: 'The Summer Championship 2024 Finals was an extraordinary event that brought together 500 talented young storytellers from across the country. The competition showcased incredible creativity, passion, and storytelling skills. Participants competed in various categories including Fantasy, Adventure, Realistic Fiction, and Poetry. The event featured live performances, interactive workshops, and inspiring keynote speeches from renowned authors and storytellers.',
    winners: [
      { name: 'Ananya Sharma', position: '1st Place', category: 'Fantasy' },
      { name: 'Arjun Patel', position: '2nd Place', category: 'Adventure' },
      { name: 'Priya Reddy', position: '3rd Place', category: 'Realistic Fiction' },
      { name: 'Vikram Singh', position: 'Best Performance', category: 'Overall' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    ],
  },
  {
    id: 2,
    title: 'Young Storyteller Award Ceremony',
    category: 'Awards',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    date: 'August 20, 2024',
    participants: 300,
    description: 'A prestigious ceremony honoring the most outstanding young storytellers of the year. The event celebrated achievements in creativity, originality, and storytelling excellence.',
    winners: [
      { name: 'Meera Gupta', position: 'Young Storyteller of the Year' },
      { name: 'Rahul Verma', position: 'Most Creative Story' },
      { name: 'Sneha Kapoor', position: 'Best Emerging Talent' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    ],
  },
  {
    id: 3,
    title: 'Star Performer - Ananya, Age 10',
    category: 'Performers',
    image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    date: 'June 10, 2024',
    featured: true,
    description: 'Ananya Sharma, a 10-year-old prodigy, captivated the audience with her enchanting storytelling performance. Her ability to weave magical narratives and connect with listeners of all ages made her a standout performer.',
  },
  {
    id: 4,
    title: 'Creative Writing Workshop',
    category: 'Sessions',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    date: 'May 5, 2024',
    participants: 150,
    description: 'An interactive workshop focused on developing creative writing skills, character development, and narrative structure. Participants learned from experienced authors and practiced their craft.',
  },
  {
    id: 5,
    title: 'Monsoon Tales Festival',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    date: 'September 8, 2024',
    participants: 400,
    description: 'A vibrant festival celebrating monsoon-themed stories. The event featured storytelling sessions, art exhibitions, and cultural performances inspired by the rainy season.',
    winners: [
      { name: 'Kavya Nair', position: 'Best Monsoon Story' },
      { name: 'Aditya Menon', position: 'Most Atmospheric Narrative' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
  },
  {
    id: 6,
    title: 'Winner - Arjun, Fantasy Category',
    category: 'Performers',
    image: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800&q=80',
    date: 'July 20, 2024',
    featured: true,
    description: 'Arjun Patel won the Fantasy Category with his imaginative tale of magical realms and epic adventures. His storytelling prowess and creative world-building impressed judges and audiences alike.',
  },
  {
    id: 7,
    title: 'Storytelling Masterclass',
    category: 'Sessions',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    date: 'April 12, 2024',
    participants: 80,
    description: 'An exclusive masterclass led by renowned storytellers, focusing on advanced techniques, voice modulation, and audience engagement strategies.',
  },
  {
    id: 8,
    title: 'Annual Excellence Awards 2024',
    category: 'Awards',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    date: 'December 15, 2024',
    participants: 600,
    description: 'The grandest celebration of storytelling excellence, recognizing outstanding achievements across all categories and age groups throughout the year.',
    winners: [
      { name: 'Ananya Sharma', position: 'Overall Excellence Award' },
      { name: 'Arjun Patel', position: 'Innovation in Storytelling' },
      { name: 'Priya Reddy', position: 'Community Impact Award' },
      { name: 'Vikram Singh', position: 'Rising Star Award' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    ],
  },
  {
    id: 9,
    title: 'Diwali Special Event',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    date: 'November 3, 2024',
    participants: 450,
    description: 'A special Diwali celebration featuring stories of light, hope, and tradition. The event combined storytelling with cultural festivities and traditional performances.',
    winners: [
      { name: 'Diya Mehta', position: 'Best Diwali Story' },
      { name: 'Rohan Joshi', position: 'Cultural Heritage Award' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    ],
  },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  // Blog-style post view
  if (selectedItem) {
    return (
      <div className="page-enter">
        <article className="bg-background">
          {/* Header Image */}
          <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
            
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Gallery</span>
            </button>

            {/* Featured Badge */}
            {selectedItem.featured && (
              <div className="absolute top-6 right-6 z-10">
                <span className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Featured
                </span>
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="container mx-auto max-w-4xl">
                <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedItem.date}
                  </span>
                  {selectedItem.participants && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedItem.participants} Participants
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                    {selectedItem.category}
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {selectedItem.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 max-w-4xl py-12">
            {/* Description */}
            {selectedItem.description && (
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            )}

            {/* Winners List */}
            {selectedItem.winners && selectedItem.winners.length > 0 && (
              <div className="bg-card rounded-2xl p-8 mb-12 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-6 h-6 text-secondary" />
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Winners
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedItem.winners.map((winner, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{winner.name}</p>
                        <p className="text-sm text-muted-foreground">{winner.position}</p>
                        {winner.category && (
                          <p className="text-xs text-primary mt-1">{winner.category}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {selectedItem.photos && selectedItem.photos.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Event Photos
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedItem.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={photo}
                        alt={`${selectedItem.title} - Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    );
  }

  // Gallery grid view
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
            Our <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore moments from our events, celebrate our star performers, and relive the magic of storytelling
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background sticky top-16 z-30 border-b border-border backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {galleryCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Unique Design */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer card-hover border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                    {item.participants && (
                      <>
                        <span>•</span>
                        <Users className="w-3 h-3" />
                        <span>{item.participants}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="pt-2 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Read More</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

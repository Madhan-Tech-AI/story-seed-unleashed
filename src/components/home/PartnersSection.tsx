const partners = [
  { id: 1, name: 'Education Trust', logo: 'https://via.placeholder.com/150x60?text=Partner+1' },
  { id: 2, name: 'Creative Kids Foundation', logo: 'https://via.placeholder.com/150x60?text=Partner+2' },
  { id: 3, name: 'Story Academy', logo: 'https://via.placeholder.com/150x60?text=Partner+3' },
  { id: 4, name: 'Young Authors Guild', logo: 'https://via.placeholder.com/150x60?text=Partner+4' },
  { id: 5, name: 'Book Lovers Club', logo: 'https://via.placeholder.com/150x60?text=Partner+5' },
  { id: 6, name: 'Literary Stars', logo: 'https://via.placeholder.com/150x60?text=Partner+6' },
  { id: 7, name: 'Story Hub', logo: 'https://via.placeholder.com/150x60?text=Partner+7' },
  { id: 8, name: 'Creative Minds', logo: 'https://via.placeholder.com/150x60?text=Partner+8' },
];

export const PartnersSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our <span className="text-gradient">Partners</span>
          </h2>
          <p className="text-muted-foreground">
            Trusted by leading educational and creative organizations
          </p>
        </div>

        {/* Infinite Marquee */}
        <div className="relative overflow-hidden">
          <div className="flex marquee">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <div className="w-36 h-16 bg-background rounded-lg shadow-sm flex items-center justify-center p-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

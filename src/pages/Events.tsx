import { EventsSection } from "@/components/home/EventsSection";

const Events = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-28 pb-8 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 text-center space-y-4 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            All <span className="text-gradient">Events</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore all storytelling competitions and events happening on Story Seed Studio.
          </p>
        </div>
      </section>
      <EventsSection mode="all" />
    </main>
  );
};

export default Events;

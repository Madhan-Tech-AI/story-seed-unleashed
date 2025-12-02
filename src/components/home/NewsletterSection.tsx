import { Sparkles, Bell } from 'lucide-react';

export const NewsletterSection = () => {
  return (
    <section className="py-20 bg-charcoal text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full">
            <Bell className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">Stay Updated</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Newsletter
          </h2>

          <div className="relative">
            <div className="inline-block">
              <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-secondary animate-pulse" />
              <Sparkles className="absolute -bottom-4 -right-4 w-6 h-6 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              <h3 className="text-5xl md:text-6xl font-display font-bold coming-soon-glow">
                Coming Soon
              </h3>
            </div>
          </div>

          <p className="text-primary-foreground/70 text-lg max-w-md mx-auto">
            We're working on something exciting! Subscribe to be the first to know when we launch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary transition-colors"
              disabled
            />
            <button
              className="px-8 py-4 rounded-xl bg-gradient-hero text-primary-foreground font-semibold opacity-50 cursor-not-allowed"
              disabled
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Voting', path: '/voting' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'top-0 py-2 bg-background/95 backdrop-blur-lg border-border/60 shadow-md'
          : 'top-[40px] py-4 bg-transparent border-transparent shadow-none'
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-display font-bold text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-tight text-foreground">
                Story Seed
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative font-medium text-sm transition-colors link-underline',
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/user">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="hero" size="sm">
                Register Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="bg-card rounded-xl p-4 shadow-lg space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'block px-4 py-3 rounded-lg font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-muted'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Link to="/user" className="block">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button variant="hero" className="w-full">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

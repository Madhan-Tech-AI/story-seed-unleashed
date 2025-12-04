import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
const footerLinks = {
  quickLinks: [{
    name: 'Home',
    path: '/'
  }, {
    name: 'About Us',
    path: '/about'
  }, {
    name: 'Events',
    path: '/events'
  }, {
    name: 'Gallery',
    path: '/gallery'
  }, {
    name: 'Leaderboard',
    path: '/leaderboard'
  }, {
    name: 'Contact',
    path: '/contact'
  }],
  legal: [{
    name: 'Terms & Conditions',
    path: '/terms'
  }, {
    name: 'Privacy Policy',
    path: '/privacy'
  }, {
    name: 'FAQ',
    path: '/faq'
  }],
  portals: [{
    name: 'User Portal',
    path: '/user'
  }, {
    name: 'Judge Portal',
    path: '/judge'
  }, {
    name: 'Admin Portal',
    path: '/admin'
  }]
};
const socialLinks = [{
  icon: Facebook,
  href: '#',
  label: 'Facebook'
}, {
  icon: Twitter,
  href: '#',
  label: 'Twitter'
}, {
  icon: Instagram,
  href: '#',
  label: 'Instagram'
}, {
  icon: Youtube,
  href: '#',
  label: 'YouTube'
}];
export const Footer = () => {
  return <footer className="bg-charcoal text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">Story Seed</span>
                <span className="text-[10px] text-primary-foreground/60 tracking-wider uppercase">
                  Studio
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              India's most joyful storytelling platform for children. Share your stories, compete with peers, and win exciting awards.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(social => <a key={social.label} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300">
                  <social.icon className="w-5 h-5" />
                </a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map(link => <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Legal & Portals */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 mb-6">
              {footerLinks.legal.map(link => <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">{link.name}
                  </Link>
                </li>)}
            </ul>
            
            <ul className="space-y-2">
              {footerLinks.portals.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">
                  123 Story Lane, Creative Hub, Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">hello@storyseed.studio</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Story Seed Studio. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-sm">
            Made with ❤️ for young storytellers
          </p>
        </div>
      </div>
    </footer>;
};
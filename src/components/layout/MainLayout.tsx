import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import { AnnouncementBanner } from '@/components/shared/AnnouncementBanner';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1 pt-[96px] md:pt-[104px]">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

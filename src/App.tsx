import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import TopBanner from './components/TopBanner';
import PageLoader from './components/PageLoader';
import ActiveBookingBar from './components/ActiveBookingBar';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const TrackingScreen = lazy(() => import('./pages/TrackingScreen'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Help = lazy(() => import('./pages/Help'));
const Profile = lazy(() => import('./pages/Profile'));
const RatingScreen = lazy(() => import('./pages/RatingScreen'));

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldHideNav = ['/book', '/track'].some(route => 
    location.pathname === route || 
    location.pathname.startsWith(route + '/')
  );

  return (
    <div id="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff' }}>
      {isDesktop && <TopBanner />}
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {isDesktop && !shouldHideNav && <SideNav />}
        
        <main style={{ 
          flex: 1, 
          marginLeft: isDesktop && !shouldHideNav ? '220px' : '0',
          marginTop: isDesktop ? '48px' : '0',
          paddingBottom: !isDesktop && !shouldHideNav ? '80px' : '0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </main>
      </div>

      {!isDesktop && !shouldHideNav && <BottomNav />}
      <ActiveBookingBar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/track/:bookingId" element={<TrackingScreen />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rate/:bookingId" element={<RatingScreen />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

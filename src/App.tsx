/* src/App.tsx */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ResponsiveShell } from './components/ResponsiveShell';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const TrackingScreen = lazy(() => import('./pages/TrackingScreen'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Help = lazy(() => import('./pages/Help'));
const Profile = lazy(() => import('./pages/Profile'));
const RatingScreen = lazy(() => import('./pages/RatingScreen'));
const AmbulanceChoiceScreen = lazy(() => import('./components/AmbulanceChoiceScreen'));

// Loading fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 gap-4 text-center">
    <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Swift Aid...</p>
  </div>
);

export default function App() {
  return (
    <ResponsiveShell>
      <Router>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ambulance-choice" element={<AmbulanceChoiceScreen />} />
              <Route path="/booking/*" element={<BookingFlow />} />
              <Route path="/tracking/:id" element={<TrackingScreen />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rating" element={<RatingScreen />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ResponsiveShell>
  );
}

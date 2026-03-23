import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, HelpCircle, User } from 'lucide-react';
import { SOSButton } from './SOSButton';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isTracking = location.pathname.startsWith('/tracking');
  const isBooking = location.pathname.startsWith('/booking');
  const isRating = location.pathname.startsWith('/rating');

  const hideNav = isTracking || isBooking || isRating;

  return (
    <div className="min-h-screen bg-[#F1FAEE] flex flex-col items-center">
      <main className="w-full max-w-[430px] bg-white min-h-screen flex flex-col relative shadow-2xl overflow-x-hidden">
        <div className={cn("flex-1", !hideNav && "pb-24")}>
          {children}
        </div>

        {!isTracking && <SOSButton />}

        {!hideNav && (
          <nav className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-[1100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 transition-all active:scale-90",
                  isActive ? "text-[#E63946]" : "text-gray-300"
                )
              }
            >
              <Home size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 transition-all active:scale-90",
                  isActive ? "text-[#E63946]" : "text-gray-300"
                )
              }
            >
              <ClipboardList size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Bookings</span>
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 transition-all active:scale-90",
                  isActive ? "text-[#E63946]" : "text-gray-300"
                )
              }
            >
              <HelpCircle size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Help</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 transition-all active:scale-90",
                  isActive ? "text-[#E63946]" : "text-gray-300"
                )
              }
            >
              <User size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
            </NavLink>
          </nav>
        )}
      </main>
    </div>
  );
};

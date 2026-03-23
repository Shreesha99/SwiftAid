/* src/pages/Home.tsx */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, Phone, ShieldCheck, Zap, ArrowRight, CheckCircle, Hospital } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { hospitals } from '../data/hospitals';
import { useAppStore } from '../store/useAppStore';
import { RotaryLogo } from '../components/RotaryLogo';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { lat, lng, loading, error, address } = useLocation();
  const { currentBooking } = useAppStore();

  // Calculate distance between two points in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const nearestHospitals = React.useMemo(() => {
    if (lat === null || lng === null) return [];
    return hospitals
      .map((h) => ({
        ...h,
        distance: getDistance(lat, lng, h.lat, h.lng),
        eta: Math.round(getDistance(lat, lng, h.lat, h.lng) * 3 + 5) // Mock ETA calculation
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [lat, lng]);

  const handleBookNow = () => {
    const hasSeenChoice = sessionStorage.getItem('hasSeenAmbulanceChoice');
    if (hasSeenChoice) {
      navigate('/booking/step-1');
    } else {
      navigate('/ambulance-choice');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      {/* Header Section with Gradient */}
      <div className="h-[320px] bg-gradient-to-br from-[#E63946] to-[#C1121F] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🚑</span>
            <h1 className="text-4xl font-black text-white tracking-tight">Swift Aid</h1>
          </div>
          <p className="text-white/80 font-bold text-lg">Emergency care in under 10 minutes</p>
          
          {/* Rotary Trust Badge on Header */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <RotaryLogo size={18} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Rotary International Partner</span>
          </div>
        </div>

        {/* Big Overlapping CTA Button */}
        <button
          onClick={handleBookNow}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[85%] h-24 bg-white rounded-[32px] shadow-2xl shadow-red-200 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform z-20 border-4 border-[#E63946]/5"
        >
          <div className="flex items-center gap-3">
            <Navigation size={28} className="text-[#E63946]" fill="currentColor" />
            <span className="text-2xl font-black text-[#1D3557]">BOOK AMBULANCE</span>
          </div>
          <span className="text-[10px] font-bold text-[#E63946] uppercase tracking-[0.2em]">Immediate Dispatch</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-col p-6 pt-16 gap-8">
        
        {/* Rotary Trust Banner */}
        <div className="bg-white border-2 border-gray-50 border-l-[#F7A600] border-l-4 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <RotaryLogo size={36} className="shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] font-black text-[#1D3557] uppercase tracking-tight">Powered by Rotary International Partnership</p>
            <p className="text-[10px] text-gray-400 font-medium leading-tight">Connected to 300+ verified hospitals across Bengaluru</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-[9px] font-black text-green-600 uppercase">
            <CheckCircle size={12} />
            <span>Verified</span>
          </div>
        </div>

        {/* Active Booking Banner */}
        {currentBooking && currentBooking.status === 'Active' && (
          <button
            onClick={() => navigate(`/tracking/${currentBooking.id}`)}
            className="w-full p-5 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Navigation size={24} className="animate-bounce" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase opacity-80">Active Booking</span>
                <span className="font-black text-lg">Track Ambulance</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Clock size={20} />
            </div>
          </button>
        )}

        {/* Your Location Card */}
        <div className="bg-gray-50 rounded-3xl p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E63946] shadow-sm shrink-0">
            <MapPin size={24} />
          </div>
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Location</span>
            <p className="text-sm font-black text-[#1D3557] truncate">
              {loading ? 'Detecting location...' : address || 'Bengaluru, India'}
            </p>
          </div>
        </div>

        {/* Nearby Hospitals Horizontal Scroll */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1D3557]">Nearby Hospitals</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Hospital size={12} className="text-[#E63946]" />
              <span>300+ Connected</span>
            </div>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[240px] h-32 bg-gray-50 rounded-3xl animate-pulse shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
              {nearestHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="min-w-[260px] p-5 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col gap-3 shrink-0 active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-black text-[#1D3557] text-sm leading-tight">{hospital.name}</h3>
                      <span className="text-[10px] text-gray-400 font-medium">{hospital.specialities[0]}</span>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase">Available</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-[#E63946] font-black text-xs">
                      <Clock size={12} />
                      <span>{hospital.eta} MINS</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">
                      {hospital.distance.toFixed(1)} KM
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pb-8">
          {[
            { label: 'Verified Drivers', icon: ShieldCheck, color: 'text-blue-500' },
            { label: 'ALS/BLS Support', icon: Zap, color: 'text-orange-500' },
            { label: '24/7 Service', icon: Clock, color: 'text-green-500' }
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className={cn("w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm", badge.color)}>
                <badge.icon size={20} />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase leading-tight">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Banner */}
      {!navigator.onLine && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-[10px] font-black uppercase tracking-widest z-[5000]">
          YOU ARE OFFLINE - Using cached data
        </div>
      )}
    </div>
  );
};

export default Home;

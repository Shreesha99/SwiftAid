/* src/components/ResponsiveShell.jsx */
import React, { useState, useEffect } from 'react';
import { RotaryLogo } from './RotaryLogo';
import { ShieldCheck, Zap, Clock } from 'lucide-react';

/**
 * ResponsiveShell handles the layout for different screen sizes.
 * Mobile: Full screen
 * Tablet: Centered card with blurred background
 * Desktop: Split layout with branding panel and phone frame
 */
export const ResponsiveShell = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center p-8 relative overflow-hidden">
        {/* Blurred background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E63946] to-[#C1121F] opacity-10 blur-3xl -z-10" />
        <div className="w-full max-w-[480px] h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden relative border border-gray-100">
          {children}
        </div>
      </div>
    );
  }

  // Desktop Split Layout
  return (
    <div className="min-h-screen flex bg-[#F1FAEE]">
      {/* Left Panel: Branding */}
      <div className="w-[40%] bg-gradient-to-br from-[#E63946] to-[#C1121F] p-16 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E63946] shadow-lg">
              <span className="text-2xl font-black">🚑</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Swift Aid</h1>
          </div>
          
          <div className="flex flex-col gap-4">
            <h2 className="text-5xl font-black leading-tight">
              Emergency care in <br />
              <span className="text-white/80 underline decoration-white/30 underline-offset-8">under 10 minutes</span>
            </h2>
            <p className="text-xl text-white/80 font-medium max-w-md">
              Connecting you to 300+ verified hospitals across Bengaluru through our exclusive Rotary partnership.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Our Network</h3>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <RotaryLogo size={48} className="shadow-xl" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">In partnership with</span>
                  <span className="text-lg font-black text-[#F7A600]">Rotary International</span>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Rotary's hospital network gives Swift Aid direct access to 300+ verified private and government hospitals across Bengaluru, ensuring the nearest and most appropriate care for your emergency.
              </p>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">300+ Hospitals</div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">All Verified</div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">Since 2024</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-black">300+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Hospitals</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-black">&lt;10 min</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Response</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-black">24/7</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Available</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Phone Frame */}
      <div className="w-[60%] flex items-center justify-center p-12 bg-[#F1FAEE]">
        <div className="relative w-full max-w-[430px] h-[850px] max-h-[90vh]">
          {/* Phone Frame Mockup */}
          <div className="absolute inset-0 border-[12px] border-[#1D3557] rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] pointer-events-none z-50">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1D3557] rounded-b-2xl" />
          </div>
          {/* Content */}
          <div className="absolute inset-[12px] bg-white rounded-[28px] overflow-hidden overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveShell;

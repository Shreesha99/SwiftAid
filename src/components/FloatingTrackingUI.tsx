/* src/components/FloatingTrackingUI.tsx */
import React, { useState } from 'react';
import { X, Phone, Navigation, Clock, ShieldCheck, Zap, MoreVertical, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingTrackingUIProps {
  bookingId: string;
  status: 'En Route' | 'Arriving' | 'Arrived';
  eta: number;
  driver: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  ambulanceType: string;
  onCancel: () => void;
}

export const FloatingTrackingUI: React.FC<FloatingTrackingUIProps> = ({
  bookingId,
  status,
  eta,
  driver,
  ambulanceType,
  onCancel
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-[2000] flex flex-col">
      {/* Top Bar */}
      <div className="mx-4 mt-6 pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center justify-between">
          <button 
            onClick={() => setShowCancelConfirm(true)}
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-90 transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{bookingId}</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'Arrived' ? 'bg-green-500' : 'bg-[#E63946]'}`} />
              <span className="text-sm font-black text-[#1D3557] uppercase tracking-wider">{status}</span>
            </div>
          </div>

          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <MoreVertical size={20} />
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="mt-auto pointer-events-auto">
        <div className="bg-white rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] p-6 pt-3 flex flex-col gap-6 border-t border-gray-50">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-2" />

          {/* Driver Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                👨‍✈️
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-lg font-black text-[#1D3557]">{driver.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                    {driver.vehicleNumber}
                  </span>
                  <span className="text-[10px] font-bold text-[#E63946] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    {ambulanceType}
                  </span>
                </div>
              </div>
            </div>
            
            <a 
              href={`tel:${driver.phone}`}
              className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 active:scale-90 transition-transform"
            >
              <Phone size={24} fill="white" />
            </a>
          </div>

          {/* ETA Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#E63946] font-black">
                <Clock size={16} />
                <span className="text-sm uppercase tracking-widest">Estimated Arrival</span>
              </div>
              <span className="text-2xl font-black text-[#1D3557]">{eta} MINS</span>
            </div>
            
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-[#E63946]"
                initial={{ width: '0%' }}
                animate={{ width: `${100 - (eta * 10)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-1">
                <span className="text-[8px] font-black text-white/50">START</span>
                <span className="text-[8px] font-black text-white/50">DEST</span>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest justify-center pb-4">
            <Navigation size={12} className="animate-pulse text-[#E63946]" />
            <span>
              {status === 'En Route' && 'Ambulance is navigating through traffic'}
              {status === 'Arriving' && 'Ambulance is just around the corner'}
              {status === 'Arrived' && 'Ambulance has reached your location'}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Overlay */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-xs flex flex-col items-center gap-6 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#E63946]">
                <AlertCircle size={40} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-[#1D3557]">Cancel Booking?</h2>
                <p className="text-gray-500 text-xs">Are you sure you want to cancel this emergency ambulance?</p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-100"
                >
                  YES, CANCEL
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="w-full py-4 bg-gray-100 text-[#1D3557] rounded-2xl font-black text-sm"
                >
                  NO, KEEP TRACKING
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingTrackingUI;

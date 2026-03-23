import React from 'react';
import { WifiOff, Phone, RefreshCw, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { hospitals } from '../data/hospitals';

interface OfflineModalProps {
  isOpen: boolean;
  onRetry: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ isOpen, onRetry }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-xs relative z-10 flex flex-col items-center gap-8 text-center"
          >
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <WifiOff size={48} />
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-[#1D3557]">You're Offline</h2>
              <p className="text-gray-500 text-sm">
                Booking requires an internet connection. For immediate help, call:
              </p>
            </div>

            <div className="w-full flex flex-col gap-4">
              <a
                href="tel:108"
                className="w-full h-20 bg-[#E63946] text-white rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <Phone size={24} />
                <span className="text-lg font-black">Call 108 (Free)</span>
              </a>

              <div className="flex flex-col gap-3 text-left">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nearby Hospitals</h3>
                {hospitals.slice(0, 3).map((h) => (
                  <div key={h.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1D3557] text-xs">{h.name}</span>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400">
                        <MapPin size={10} />
                        <span>{h.address}</span>
                      </div>
                    </div>
                    <a href={`tel:${h.phone}`} className="p-2 bg-white text-[#E63946] rounded-full shadow-sm">
                      <Phone size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onRetry}
              className="flex items-center gap-2 text-[#457B9D] font-bold text-sm"
            >
              <RefreshCw size={16} /> TRY AGAIN
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

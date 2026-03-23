import React, { useState, useEffect } from 'react';
import { Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SOSButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showModal && countdown === 0) {
      window.location.href = 'tel:108';
      setShowModal(false);
      setCountdown(3);
    }
    return () => clearTimeout(timer);
  }, [showModal, countdown]);

  const handleSOS = () => {
    if (navigator.vibrate) navigator.vibrate(500);
    setShowModal(true);
    setCountdown(3);
  };

  return (
    <>
      <button
        onClick={handleSOS}
        className="fixed bottom-24 right-4 z-50 bg-[#E63946] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-pulse hover:scale-105 transition-transform"
        style={{ right: 'calc(50% - 200px + 16px)' }}
      >
        <Phone size={24} />
        <span className="hidden sm:inline">SOS 108</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-xs relative z-10 flex flex-col items-center gap-6 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#E63946]">
                <Phone size={40} className="animate-bounce" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-[#1D3557]">Calling 108</h2>
                <p className="text-gray-500 text-sm">Emergency services will be contacted in</p>
              </div>
              <div className="text-6xl font-black text-[#E63946]">{countdown}</div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 bg-gray-100 text-[#1D3557] rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <X size={20} /> CANCEL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

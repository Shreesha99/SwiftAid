/* src/components/AmbulanceChoiceScreen.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Zap, Info, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * AmbulanceChoiceScreen allows users to choose between 108 (Free) and Swift Aid (Private).
 * It appears only once per session.
 */
export const AmbulanceChoiceScreen = () => {
  const navigate = useNavigate();
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showCountdown && countdown === 0) {
      window.location.href = 'tel:108';
      setShowCountdown(false);
      setCountdown(3);
    }
    return () => clearTimeout(timer);
  }, [showCountdown, countdown]);

  const handle108Call = () => {
    if (navigator.vibrate) navigator.vibrate(500);
    setShowCountdown(true);
  };

  const handleSwiftAid = () => {
    sessionStorage.setItem('hasSeenAmbulanceChoice', 'true');
    navigate('/booking/step-1');
  };

  return (
    <div className="flex flex-col min-h-full bg-white p-6 gap-8 overflow-y-auto">
      <div className="flex flex-col gap-2 mt-8">
        <h1 className="text-3xl font-black text-[#1D3557] tracking-tight">Choose Ambulance Type</h1>
        <p className="text-gray-500 font-medium">Select the service that best fits your situation.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Option A: 108 Government */}
        <div className="bg-white border-2 border-gray-100 rounded-[24px] p-6 flex flex-col gap-5 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl">
              🚑
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-[#1D3557]">Government Ambulance</h3>
              <div className="flex items-center gap-1 text-xs text-green-600 font-bold">
                <CheckCircle size={14} />
                <span>Completely Free</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Est. Wait</span>
              <span className="text-[#1D3557] font-black">20–40 mins</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-300 w-[40%]" />
            </div>
          </div>

          <button 
            onClick={handle108Call}
            className="w-full py-4 bg-gray-100 text-[#1D3557] rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Phone size={18} /> CALL 108 NOW
          </button>
        </div>

        {/* Option B: Swift Aid Private (Recommended) */}
        <div className="bg-white border-2 border-[#E63946] rounded-[24px] p-6 flex flex-col gap-5 relative shadow-[0_15px_40px_rgba(230,57,70,0.15)] ring-4 ring-[#E63946]/5 transition-all active:scale-[0.98]">
          <div className="absolute -top-3 right-6 bg-[#E63946] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            ⭐ RECOMMENDED
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl">
              🚑
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-[#1D3557]">Swift Aid Private</h3>
              <div className="flex items-center gap-1 text-xs text-[#E63946] font-bold">
                <ShieldCheck size={14} />
                <span>300+ Hospitals via Rotary</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Est. Arrival</span>
              <span className="text-[#E63946] font-black">8–12 mins</span>
            </div>
            <div className="h-1.5 w-full bg-red-50 rounded-full overflow-hidden">
              <div className="h-full bg-[#E63946] w-[85%]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm py-1 border-t border-gray-50 mt-1">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Estimated Fare</span>
            <span className="text-[#1D3557] font-black">₹800 – ₹2,000</span>
          </div>

          <button 
            onClick={handleSwiftAid}
            className="w-full py-5 bg-[#E63946] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-100 hover:bg-[#C1121F] transition-colors"
          >
            BOOK NOW <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto pb-8">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
            In life-threatening emergencies, always call 108 AND book Swift Aid simultaneously for fastest response.
          </p>
        </div>
      </div>

      {/* 108 Countdown Modal */}
      <AnimatePresence>
        {showCountdown && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-xs flex flex-col items-center gap-6 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#E63946]">
                <Phone size={40} className="animate-bounce" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-[#1D3557]">Calling 108</h2>
                <p className="text-gray-500 text-xs">Connecting to Government Emergency Services in</p>
              </div>
              <div className="text-6xl font-black text-[#E63946]">{countdown}</div>
              <button
                onClick={() => setShowCountdown(false)}
                className="w-full py-4 bg-gray-100 text-[#1D3557] rounded-2xl font-black text-sm"
              >
                CANCEL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AmbulanceChoiceScreen;

import React from 'react';
import { Phone, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HospitalRecommendationCard } from './HospitalRecommendationCard';
import { Hospital } from '../data/hospitals';

interface ArrivalModalProps {
  isOpen: boolean;
  onComplete: () => void;
  hospital: Hospital;
  emergencyType: string;
}

export const ArrivalModal: React.FC<ArrivalModalProps> = ({ isOpen, onComplete, hospital, emergencyType }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white rounded-t-[32px] p-8 w-full max-w-[430px] relative z-10 flex flex-col gap-6 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full self-center -mt-4 mb-2" />
            
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                <CheckCircle size={48} className="animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-[#1D3557]">Ambulance has arrived!</h2>
              <p className="text-gray-500 text-sm">
                The crew will assess the patient and determine the best hospital based on your condition and availability.
              </p>
            </div>

            <HospitalRecommendationCard hospital={hospital} emergencyType={emergencyType} />

            <div className="flex flex-col gap-3">
              <button
                onClick={onComplete}
                className="w-full py-5 bg-[#E63946] text-white rounded-2xl font-black text-lg shadow-xl shadow-red-100 active:scale-95 transition-transform"
              >
                MARK AS COMPLETED
              </button>
              <a
                href="tel:9876543210"
                className="w-full py-4 bg-gray-100 text-[#1D3557] rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Phone size={20} /> CALL AMBULANCE CREW
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

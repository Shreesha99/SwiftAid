import React from 'react';
import { Ambulance, Info } from 'lucide-react';
import { AmbulanceType } from '../utils/pricing';

interface PriceEstimateCardProps {
  type: AmbulanceType;
  estimate: { min: number; max: number };
}

export const PriceEstimateCard: React.FC<PriceEstimateCardProps> = ({ type, estimate }) => {
  const getIcon = () => {
    switch (type) {
      case 'ALS': return '🚑';
      case 'Neonatal': return '👶';
      default: return '🚐';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
            {getIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ambulance Type</span>
            <span className="font-bold text-[#1D3557]">{type} (Advanced)</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase">
          Private
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Fare</span>
        <div className="text-2xl font-black text-[#1D3557]">
          ₹{estimate.min.toLocaleString()} – ₹{estimate.max.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 text-[10px] text-gray-500">
          <Info size={12} className="shrink-0 mt-0.5" />
          <p>Final fare depends on actual distance & wait time. Payment collected by crew after service.</p>
        </div>
        <div className="p-2 bg-green-50 rounded-lg text-[9px] text-green-700 font-medium">
          Note: Govt ambulance (108) is free — this applies to private ambulances.
        </div>
      </div>
    </div>
  );
};

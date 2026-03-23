import React from 'react';
import { Hospital as HospitalIcon, Info, Navigation } from 'lucide-react';
import { Hospital } from '../data/hospitals';

interface HospitalRecommendationCardProps {
  hospital: Hospital;
  emergencyType: string;
}

export const HospitalRecommendationCard: React.FC<HospitalRecommendationCardProps> = ({ hospital, emergencyType }) => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#457B9D]">
          <HospitalIcon size={24} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Recommended Hospital</h3>
          <p className="text-sm font-medium text-blue-900">Best equipped for {emergencyType}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="font-bold text-[#1D3557]">{hospital.name}</h4>
        <div className="flex items-center gap-1 text-[10px] text-[#457B9D] font-bold">
          <Navigation size={10} />
          <span>{hospital.specialities}</span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-[10px] text-blue-700/70 italic">
        <Info size={12} className="shrink-0 mt-0.5" />
        <p>Final hospital decision is made by the ambulance crew based on real-time availability.</p>
      </div>
    </div>
  );
};

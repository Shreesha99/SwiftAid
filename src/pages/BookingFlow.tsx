/* src/pages/BookingFlow.tsx */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MapPin, Navigation, Clock, Phone, ShieldCheck, Zap, 
  ArrowRight, ArrowLeft, Heart, Activity, Wind, Brain, 
  Baby, AlertCircle, Search, X, CheckCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../hooks/useLocation';
import { hospitals } from '../data/hospitals';
import { useAppStore } from '../store/useAppStore';
import { StepTransition } from '../components/StepTransition';
import { HospitalRecommendationCard } from '../components/HospitalRecommendationCard';
import { PriceEstimateCard } from '../components/PriceEstimateCard';
import { OfflineModal } from '../components/OfflineModal';
import { createUserIcon } from '../utils/mapHelpers';
import '../components/MapStyles.css';

// Emergency Types
const EMERGENCY_TYPES = [
  { id: 'cardiac', label: 'Cardiac', icon: Heart, color: 'bg-red-50 text-red-600' },
  { id: 'accident', label: 'Accident/Trauma', icon: Activity, color: 'bg-orange-50 text-orange-600' },
  { id: 'breathing', label: 'Breathing', icon: Wind, color: 'bg-blue-50 text-blue-600' },
  { id: 'stroke', label: 'Stroke', icon: Brain, color: 'bg-purple-50 text-purple-600' },
  { id: 'maternity', label: 'Maternity', icon: Baby, color: 'bg-pink-50 text-pink-600' },
  { id: 'general', label: 'General', icon: AlertCircle, color: 'bg-gray-50 text-gray-600' },
];

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStep = searchParams.get('step') || '1';
  
  const [step, setStep] = useState(parseInt(initialStep));
  const [emergencyType, setEmergencyType] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  const { lat, lng, loading, address, setManualLocation } = useLocation();
  const { addBooking } = useAppStore();

  const userIcon = useMemo(() => createUserIcon(), []);

  // Progress calculation
  const progress = (step / 3) * 100;

  const handleEmergencySelect = (id: string) => {
    setEmergencyType(id);
    setStep(2);
  };

  const handleConfirmLocation = () => {
    if (!navigator.onLine) {
      setIsOfflineModalOpen(true);
      return;
    }
    setStep(3);
  };

  const handleFinalConfirm = () => {
    if (!lat || !lng || !emergencyType) return;

    const bookingId = `SWF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: bookingId,
      status: 'Active' as const,
      timestamp: new Date().toISOString(),
      emergencyType,
      userLocation: { lat, lng, address: address || 'Current Location' },
      hospital: selectedHospital || hospitals[0],
      ambulanceType: 'ALS',
      driver: {
        name: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        vehicleNumber: 'KA-01-AB-1234'
      }
    };

    addBooking(newBooking);
    
    // Vibrate on confirmation
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    // Simulate SMS
    console.log(`[SMS Simulation] Booking Confirmed! ID: ${bookingId}. Driver: Ramesh. Track at: ${window.location.origin}/tracking/${bookingId}`);

    navigate(`/tracking/${bookingId}`);
  };

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-100 z-[2000]">
        <div 
          className="h-full bg-[#E63946] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-8 border-b border-gray-50">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#1D3557] active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step} of 3</span>
          <h2 className="text-sm font-black text-[#1D3557]">
            {step === 1 && 'Emergency Type'}
            {step === 2 && 'Confirm Location'}
            {step === 3 && 'Final Details'}
          </h2>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-hidden relative">
        <StepTransition stepKey={step}>
          {/* Step 1: Emergency Type */}
          {step === 1 && (
            <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-[#1D3557]">What's the emergency?</h1>
                <p className="text-gray-500 text-sm font-medium">Select the type of emergency for better assistance.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {EMERGENCY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleEmergencySelect(type.id)}
                    className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-100 rounded-[24px] gap-3 active:scale-95 transition-all hover:border-[#E63946]/30"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type.color}`}>
                      <type.icon size={28} />
                    </div>
                    <span className="font-black text-[#1D3557] text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="flex flex-col h-full relative">
              <div className="flex-1 relative">
                {lat && lng ? (
                  <MapContainer 
                    center={[lat, lng]} 
                    zoom={15} 
                    className="w-full h-full"
                    zoomControl={false}
                    key={`${lat}-${lng}`}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <Marker position={[lat, lng]} icon={userIcon} />
                    <MapController center={[lat, lng]} />
                  </MapContainer>
                ) : (
                  <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching GPS...</p>
                  </div>
                )}
                
                {/* Floating Search in Map */}
                <div className="absolute top-6 left-6 right-6 z-[1000]">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
                    <Search size={20} className="text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search for a location..." 
                      className="flex-1 bg-transparent outline-none text-sm font-medium text-[#1D3557]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[1000] flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#E63946]">
                    <MapPin size={24} />
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup Address</span>
                    <p className="text-sm font-black text-[#1D3557] truncate">
                      {loading ? 'Detecting...' : address || 'Bengaluru, India'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConfirmLocation}
                  className="w-full py-5 bg-[#E63946] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-100 active:scale-95 transition-transform"
                >
                  CONFIRM LOCATION <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Final Confirm */}
          {step === 3 && (
            <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto pb-32">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-[#1D3557]">Confirm Booking</h1>
                <p className="text-gray-500 text-sm font-medium">Review details and confirm your ambulance.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E63946] shadow-sm">
                      {EMERGENCY_TYPES.find(t => t.id === emergencyType)?.icon && 
                        React.createElement(EMERGENCY_TYPES.find(t => t.id === emergencyType)!.icon, { size: 24 })}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emergency</span>
                      <span className="font-black text-[#1D3557]">{EMERGENCY_TYPES.find(t => t.id === emergencyType)?.label}</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] font-black text-[#E63946] uppercase underline">Change</button>
                </div>

                <HospitalRecommendationCard 
                  emergencyType={emergencyType || ''} 
                  userLat={lat || 0} 
                  userLng={lng || 0}
                  onSelect={setSelectedHospital}
                />

                <PriceEstimateCard 
                  distance={2.5} // Mock distance
                  ambulanceType="ALS"
                />

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                  <AlertCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-orange-800 font-medium leading-relaxed">
                    By confirming, you agree to pay the estimated fare to the ambulance crew. Private ambulances are not free.
                  </p>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50 z-[2000] max-w-[430px] mx-auto">
                <button
                  onClick={handleFinalConfirm}
                  className="w-full py-5 bg-[#E63946] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-100 active:scale-95 transition-transform"
                >
                  CONFIRM & DISPATCH <CheckCircle size={20} />
                </button>
              </div>
            </div>
          )}
        </StepTransition>
      </div>

      <OfflineModal 
        isOpen={isOfflineModalOpen} 
        onClose={() => setIsOfflineModalOpen(false)} 
      />
    </div>
  );
};

// Helper component to control map view
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

export default BookingFlow;

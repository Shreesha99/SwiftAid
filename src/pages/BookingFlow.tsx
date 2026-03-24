import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ShieldCheck, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { hospitals } from '../data/hospitals';
import { useAppStore } from '../store/useAppStore';
import { createUserIcon, reverseGeocode, haversine } from '../utils/mapHelpers';

const EMERGENCY_TYPES = [
  { id: 'cardiac', label: 'Cardiac', emoji: '🫀' },
  { id: 'trauma', label: 'Trauma', emoji: '🩸' },
  { id: 'respiratory', label: 'Respiratory', emoji: '🫁' },
  { id: 'maternity', label: 'Maternity', emoji: '🤰' },
  { id: 'stroke', label: 'Stroke', emoji: '🧠' },
  { id: 'other', label: 'Other', emoji: '🆘' },
];

function LocationPicker({ position, setPosition, setAddress }: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void,
  setAddress: (addr: string) => void
}) {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      reverseGeocode(newPos[0], newPos[1]).then(setAddress);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} icon={createUserIcon()} />;
}

export default function BookingFlow() {
  const navigate = useNavigate();
  const { addBooking } = useAppStore();
  const [step, setStep] = useState(1);
  const [emergencyType, setEmergencyType] = useState('');
  const [ambulanceType, setAmbulanceType] = useState('Private');
  const [location, setLocation] = useState<{ pos: [number, number], address: string }>({
    pos: [12.9344, 77.6192],
    address: 'Koramangala, Bengaluru'
  });
  const [note, setNote] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => step > 1 ? setStep(prev => prev - 1) : navigate('/');

  const handleConfirm = () => {
    const nearestHospital = hospitals.reduce((prev, curr) => {
      const d1 = haversine(location.pos[0], location.pos[1], prev.lat, prev.lng);
      const d2 = haversine(location.pos[0], location.pos[1], curr.lat, curr.lng);
      return d1 < d2 ? prev : curr;
    });

    const id = `SA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newBooking = {
      id,
      status: 'Active' as const,
      timestamp: new Date().toISOString(),
      emergencyType,
      userLocation: { lat: location.pos[0], lng: location.pos[1], address: location.address },
      hospital: nearestHospital,
      ambulanceType,
      driver: {
        name: 'Ravi Kumar',
        phone: '+91 98765 00001',
        vehicleNumber: 'KA-01-AB-1234'
      }
    };

    addBooking(newBooking);
    setBookingId(id);
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div style={{ padding: '24px 20px', textAlign: 'center', minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Big success state */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#ECFDF5', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40,
        }}>🚑</div>
        
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1D3557' }}>
          Ambulance Dispatched
        </h2>
        <p style={{ color: '#6B7280', marginTop: 8, fontSize: 15 }}>
          Booking SWF-{bookingId}
        </p>

        {/* Primary action */}
        <button
          onClick={() => navigate(`/track/${bookingId}`)}
          style={{
            width: '100%', marginTop: 32, padding: '16px',
            background: '#E63946', color: 'white',
            border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Track Ambulance →
        </button>

        {/* Secondary — go home */}
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%', marginTop: 12, padding: '14px',
            background: 'white', color: '#6B7280',
            border: '1px solid #E5E7EB', borderRadius: 12,
            fontSize: 15, cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <header style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', color: '#1D3557', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>
          {step === 1 && "What's the emergency?"}
          {step === 2 && "Your location"}
          {step === 3 && "Confirm booking"}
        </h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: '8px', height: '8px', borderRadius: '50%', background: s === step ? '#E63946' : '#F0F0F0' }} />
          ))}
        </div>
      </header>

      <main style={{ flex: 1, padding: '0 20px 40px' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="emergency-grid">
              {EMERGENCY_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setEmergencyType(type.id)}
                  style={{
                    height: '80px',
                    borderRadius: '16px',
                    border: `2px solid ${emergencyType === type.id ? '#E63946' : '#F0F0F0'}`,
                    background: emergencyType === type.id ? '#fef2f2' : 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{type.emoji}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1D3557' }}>{type.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>Ambulance type:</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Private', '108'].map(type => (
                  <button
                    key={type}
                    onClick={() => setAmbulanceType(type)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: `1.5px solid ${ambulanceType === type ? '#E63946' : '#F0F0F0'}`,
                      background: ambulanceType === type ? '#fef2f2' : 'white',
                      color: ambulanceType === type ? '#E63946' : '#6B7280',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {type === 'Private' ? 'Private (8-12 min, ₹800+)' : 'Govt 108 (20-40 min, Free)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            <div style={{ height: '260px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #F0F0F0' }}>
              <MapContainer center={location.pos} zoom={15} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <LocationPicker 
                  position={location.pos} 
                  setPosition={(pos) => setLocation(prev => ({ ...prev, pos }))}
                  setAddress={(address) => setLocation(prev => ({ ...prev, address }))}
                />
              </MapContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Pickup address</span>
                <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F0F0F0', fontSize: '15px', fontWeight: 600 }}>
                  {location?.address || 'Detecting location...'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Add a note (optional)</span>
                <input 
                  type="text"
                  placeholder="e.g. Near the blue gate"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #F0F0F0', outline: 'none', fontSize: '15px' }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Emergency</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1D3557' }}>{emergencyType.charAt(0).toUpperCase() + emergencyType.slice(1)}</span>
                    <span style={{ padding: '2px 8px', background: '#fef2f2', color: '#E63946', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{ambulanceType}</span>
                  </div>
                </div>
                <Zap size={20} color="#E63946" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Pickup</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1D3557' }}>{location?.address || 'Detecting location...'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Est. Arrival</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#10B981' }}>~8-12 min</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Est. Fare</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1D3557' }}>{ambulanceType === '108' ? 'FREE' : '₹850 – ₹1,150'}</span>
                </div>
              </div>

              <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏥</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Recommended Hospital</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D3557' }}>Manipal Hospital · 1.2km</span>
                </div>
              </div>
              
              <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500, fontStyle: 'italic' }}>
                *Final decision by ambulance crew based on patient condition.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Action */}
      <footer style={{ padding: '20px', borderTop: '1px solid #F0F0F0', background: 'white' }}>
        {step < 3 ? (
          <button 
            className="primary-button" 
            disabled={!emergencyType}
            onClick={handleNext}
          >
            Continue →
          </button>
        ) : (
          <button 
            className="primary-button"
            onClick={handleConfirm}
            style={{ background: '#E63946' }}
          >
            DISPATCH AMBULANCE
          </button>
        )}
      </footer>
    </div>
  );
}

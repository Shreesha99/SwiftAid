import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ShieldCheck, Zap, AlertCircle, CheckCircle, HeartPulse, Droplets, Wind, Baby, Brain, AlertTriangle, Ambulance, Hospital as HospitalIcon, Navigation, Search, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { hospitals, Hospital } from '../data/hospitals';
import { useAppStore } from '../store/useAppStore';
import { createUserIcon, reverseGeocode, haversine, searchLocation } from '../utils/mapHelpers';
import { getClosestAmbulance, formatEta, formatDistance } from '../utils/ambulanceHelpers';

const EMERGENCY_TYPES = [
  { id: 'cardiac', label: 'Cardiac', icon: HeartPulse },
  { id: 'trauma', label: 'Trauma', icon: Droplets },
  { id: 'respiratory', label: 'Respiratory', icon: Wind },
  { id: 'maternity', label: 'Maternity', icon: Baby },
  { id: 'stroke', label: 'Stroke', icon: Brain },
  { id: 'other', label: 'Other', icon: AlertTriangle },
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

// Removed unused MapUpdater

export default function BookingFlow() {
  const navigate = useNavigate();
  const navLocation = useLocation();
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
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        const results = await searchLocation(searchQuery);
        setSuggestions(results);
        setIsSearching(false);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSuggestion = (suggestion: any) => {
    const newPos: [number, number] = [suggestion.lat, suggestion.lon];
    setLocation({ pos: newPos, address: suggestion.display_name });
    setSearchQuery('');
    setSuggestions([]);
  };

  useEffect(() => {
    if (navLocation.state?.hospitalId) {
      const hospital = hospitals.find(h => h.id === navLocation.state.hospitalId);
      if (hospital) {
        setSelectedHospital(hospital);
      }
    }

    // Detect user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setLocation(prev => ({ ...prev, pos: newPos }));
          reverseGeocode(latitude, longitude).then(address => {
            setLocation(prev => ({ ...prev, address }));
          });
        },
        (error) => {
          console.error("Error detecting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [navLocation.state]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => step > 1 ? setStep(prev => prev - 1) : navigate('/');

  const handleConfirm = () => {
    const hospitalToUse = selectedHospital || hospitals.reduce((prev, curr) => {
      const d1 = haversine(location.pos[0], location.pos[1], prev.lat, prev.lng);
      const d2 = haversine(location.pos[0], location.pos[1], curr.lat, curr.lng);
      return d1 < d2 ? prev : curr;
    });

    const closestDriver = getClosestAmbulance(location.pos[0], location.pos[1]);
    const id = `SA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const newBooking = {
      id,
      status: 'Active' as const,
      timestamp: new Date().toISOString(),
      emergencyType,
      userLocation: { lat: location.pos[0], lng: location.pos[1], address: location.address },
      hospital: hospitalToUse,
      ambulanceType,
      driver: {
        name: closestDriver.name,
        phone: closestDriver.phone,
        vehicleNumber: closestDriver.vehicleNumber,
        currentLocation: closestDriver.currentLocation,
        initialDistance: closestDriver.distance,
        initialEta: closestDriver.eta
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
          color: '#10B981',
        }}>
          <Ambulance size={40} />
        </div>
        
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ 
        padding: '24px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        borderBottom: '1px solid #F0F0F0',
        background: 'white',
        zIndex: 10
      }}>
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

      <main style={{ flex: 1, padding: '24px 20px 40px', overflowY: 'auto' }}>
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
                      cursor: 'pointer'
                    }}
                  >
                    <type.icon size={24} color={emergencyType === type.id ? '#E63946' : '#1D3557'} />
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            {/* Search Input - Floating style on mobile, integrated on desktop */}
            <div style={{ 
              position: isDesktop ? 'relative' : 'absolute', 
              top: isDesktop ? 0 : '16px', 
              left: isDesktop ? 0 : '16px', 
              right: isDesktop ? 0 : '16px', 
              zIndex: 1001 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '14px 16px', 
                background: 'white', 
                border: '1px solid #F0F0F0', 
                borderRadius: '16px'
              }}>
                <Search size={20} color="#E63946" />
                <input 
                  type="text"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', fontWeight: 600, color: '#1D3557' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={18} color="#9CA3AF" />
                  </button>
                )}
              </div>

              {/* Suggestions List */}
              {(suggestions.length > 0 || isSearching) && (
                <div style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 8px)', 
                  left: 0, 
                  right: 0, 
                  background: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid #F0F0F0',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  zIndex: 1002
                }}>
                  {isSearching ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px', fontWeight: 500 }}>Searching...</div>
                  ) : (
                    suggestions.map((s, i) => (
                      <div 
                        key={i}
                        onClick={() => handleSelectSuggestion(s)}
                        style={{ 
                          padding: '16px', 
                          borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid #F9FAFB',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '14px',
                          alignItems: 'flex-start'
                        }}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <MapPin size={18} color="#E63946" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '14px', color: '#1D3557', fontWeight: 700 }}>{s.display_name.split(',')[0]}</span>
                          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, lineHeight: 1.3 }}>{s.display_name}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Map Container - Much larger and more prominent */}
            <div style={{ 
              height: isDesktop ? '480px' : '340px', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              border: '1px solid #F0F0F0', 
              position: 'relative',
              width: '100%'
            }}>
              <MapContainer center={location.pos} zoom={15} scrollWheelZoom={true} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}>
                  <button 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          const newPos: [number, number] = [position.coords.latitude, position.coords.longitude];
                          setLocation(prev => ({ ...prev, pos: newPos }));
                          reverseGeocode(newPos[0], newPos[1]).then(address => setLocation(prev => ({ ...prev, address })));
                        });
                      }
                    }}
                    style={{ 
                      width: 48, 
                      height: 48, 
                      background: 'white', 
                      borderRadius: 14, 
                      border: '1px solid #F0F0F0',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      color: '#E63946'
                    }}
                  >
                    <Navigation size={24} />
                  </button>
                </div>
                <LocationPicker 
                  position={location.pos} 
                  setPosition={(pos) => setLocation(prev => ({ ...prev, pos }))}
                  setAddress={(address) => setLocation(prev => ({ ...prev, address }))}
                />
              </MapContainer>
              
              {/* Floating Address Indicator on Map */}
              {!isDesktop && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '20px', 
                  right: '80px', 
                  background: 'white', 
                  padding: '12px 16px', 
                  borderRadius: '16px', 
                  border: '1px solid #F0F0F0',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D3557', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {location?.address.split(',')[0] || 'Detecting...'}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={12} color="#E63946" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pickup address</span>
                </div>
                <div style={{ 
                  padding: '18px', 
                  background: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid #F0F0F0', 
                  fontSize: '15px', 
                  fontWeight: 700, 
                  color: '#1D3557',
                  lineHeight: 1.4
                }}>
                  {location?.address || 'Detecting location...'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertCircle size={12} color="#6B7280" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add a note (optional)</span>
                </div>
                <input 
                  type="text"
                  placeholder="e.g. Near the blue gate, 2nd floor"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ 
                    padding: '18px', 
                    borderRadius: '16px', 
                    border: '1px solid #F0F0F0', 
                    outline: 'none', 
                    fontSize: '15px', 
                    fontWeight: 600,
                    background: 'white',
                    color: '#1D3557'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#10B981' }}>
                    ~{formatEta(getClosestAmbulance(location.pos[0], location.pos[1]).eta)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Distance</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1D3557' }}>
                    {formatDistance(getClosestAmbulance(location.pos[0], location.pos[1]).distance)}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HospitalIcon size={20} color="#E63946" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                    {selectedHospital ? 'Selected Hospital' : 'Recommended Hospital'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D3557' }}>
                    {selectedHospital ? selectedHospital.name : 'Manipal Hospital'} · 
                    {selectedHospital ? `${haversine(location.pos[0], location.pos[1], selectedHospital.lat, selectedHospital.lng).toFixed(1)}km` : '1.2km'}
                  </span>
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
      <footer style={{ 
        padding: '20px', 
        borderTop: '1px solid #F0F0F0', 
        background: 'white',
        zIndex: 10
      }}>
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

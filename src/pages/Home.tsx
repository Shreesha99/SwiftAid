import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, ChevronRight, User, Search, Navigation, Filter, Ambulance, Hospital as HospitalIcon, Info, Activity, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { hospitals, Hospital } from '../data/hospitals';
import { useAppStore } from '../store/useAppStore';
import { createHospitalIcon, createUserIcon, reverseGeocode, ROTARY_LOGO_URL } from '../utils/mapHelpers';
import { getClosestAmbulance, formatEta } from '../utils/ambulanceHelpers';
import Logo from '../components/Logo';

function MapControls({ onLocateMe }: { onLocateMe: () => void }) {
  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button 
        onClick={onLocateMe}
        style={{ width: 40, height: 40, background: 'white', border: 'none', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        title="Locate Me"
      >
        <Navigation size={20} color="#E63946" />
      </button>
    </div>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Home() {
  const navigate = useNavigate();
  const { userProfile } = useAppStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9344, 77.6192]);
  const [userLocation, setUserLocation] = useState<[number, number]>([12.9344, 77.6192]);
  const [userAddress, setUserAddress] = useState('Koramangala, Bengaluru');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setUserLocation(newPos);
          setMapCenter(newPos);
          reverseGeocode(latitude, longitude).then(setUserAddress);
        },
        (error) => {
          console.error("Error detecting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const specialities = ['All', ...new Set(hospitals.flatMap(h => h.specialities))];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeciality = selectedSpeciality === 'All' || h.specialities.includes(selectedSpeciality);
    return matchesSearch && matchesSpeciality;
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos: [number, number] = [latitude, longitude];
          setUserLocation(newPos);
          setMapCenter(newPos);
          reverseGeocode(latitude, longitude).then(setUserAddress);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setMapCenter(userLocation); // Fallback to last known
        },
        { enableHighAccuracy: true }
      );
    } else {
      setMapCenter(userLocation);
    }
  };

  return (
    <div style={{ padding: isDesktop ? '40px' : '0 20px 20px' }}>
      {/* Mobile Header */}
      {!isDesktop && (
        <header style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Logo size={28} showText />
          <button 
            onClick={() => navigate('/profile')}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F9FAFB', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <User size={20} color="#1D3557" />
          </button>
        </header>
      )}

      <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: '40px', maxWidth: '1200px' }}>
        
        {/* Left Half: Actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontSize: '15px', color: '#6B7280' }}>Good morning, {userProfile.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1D3557', cursor: 'pointer' }}>
              <MapPin size={16} color="#E63946" />
              <span style={{ fontWeight: 600 }}>{userAddress}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/book')}
            className="primary-button"
            style={{ height: '96px', fontSize: '20px', gap: '12px' }}
          >
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ambulance size={32} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span>BOOK AMBULANCE</span>
              <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.9 }}>
                Nearest arrives in ~{formatEta(getClosestAmbulance(userLocation[0], userLocation[1]).eta)}
              </span>
            </div>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#F0F0F0' }} />
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>or call for free</span>
            <div style={{ flex: 1, height: '1px', background: '#F0F0F0' }} />
          </div>

          <a 
            href="tel:108"
            className="secondary-button"
            style={{ textDecoration: 'none', gap: '12px' }}
          >
            <Phone size={20} />
            <span>Call 108 — Free</span>
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '13px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>nearby hospitals</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hospitals.slice(0, 3).map(h => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', border: '1px solid #F0F0F0', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 600 }}>{h.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>1.2km · {h.specialities[0]}</span>
                      <CheckCircle size={12} color="#10B981" />
                    </div>
                  </div>
                  <ChevronRight size={18} color="#D1D5DB" />
                </div>
              ))}
            </div>
          </div>

          {/* Official Partner Badge */}
          <div style={{ 
            marginTop: 'auto', 
            padding: '20px', 
            background: '#F9FAFB', 
            borderRadius: '16px', 
            border: '1px solid #F0F0F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 800, 
                color: '#6B7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em' 
              }}>
                Official Partner
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src={ROTARY_LOGO_URL} 
                alt="Rotary International" 
                height="32" 
                style={{ objectFit: 'contain' }}
                onError={(e: any) => { e.target.style.display = 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1D3557' }}>Rotary International</span>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>300+ verified hospitals across Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Half: Map (Desktop only) */}
        {isDesktop && (
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Map Search and Filters */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search hospitals..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #F0F0F0', outline: 'none', fontSize: '14px' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Filter size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select 
                  value={selectedSpeciality}
                  onChange={(e) => setSelectedSpeciality(e.target.value)}
                  style={{ padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #F0F0F0', outline: 'none', fontSize: '14px', appearance: 'none', background: 'white', cursor: 'pointer' }}
                >
                  {specialities.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ flex: 1, position: 'relative', height: '530px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #F0F0F0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <MapUpdater center={mapCenter} />
                <MapControls onLocateMe={handleLocateMe} />
                
                <Marker position={userLocation} icon={createUserIcon()}>
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>Your Location</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>{userAddress}</p>
                    </div>
                  </Popup>
                </Marker>

                {filteredHospitals.map(h => (
                  <Marker key={h.id} position={[h.lat, h.lng]} icon={createHospitalIcon()}>
                    <Popup>
                      <div style={{ padding: '8px', minWidth: '180px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '32px', height: '32px', background: '#F9FAFB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HospitalIcon size={18} color="#E63946" />
                          </div>
                          <p style={{ fontWeight: 700, margin: 0, fontSize: '14px' }}>{h.name}</p>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 12px' }}>
                          {h.specialities.join(', ')}
                        </p>
                        <button 
                          onClick={() => navigate('/book', { state: { hospitalId: h.id } })}
                          style={{ width: '100%', padding: '8px', background: '#E63946', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Book Ambulance Here
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map Legend */}
              <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, background: 'white', padding: '8px 12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E63946' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Hospital</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D3557' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>You</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

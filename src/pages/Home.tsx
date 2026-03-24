import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, ChevronRight, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { hospitals } from '../data/hospitals';
import { useAppStore } from '../store/useAppStore';
import { createHospitalIcon, createUserIcon } from '../utils/mapHelpers';

const ROTARY_LOGO = "https://upload.wikimedia.org/wikipedia/commons/3/35/Rotary_International_Logo.svg";

export default function Home() {
  const navigate = useNavigate();
  const { userProfile } = useAppStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const userLocation: [number, number] = [12.9344, 77.6192]; // Koramangala, Bengaluru

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ padding: isDesktop ? '40px' : '0 20px 20px' }}>
      {/* Mobile Header */}
      {!isDesktop && (
        <header style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#E63946' }}>Swift Aid</h1>
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
              <span style={{ fontWeight: 600 }}>Koramangala, Bengaluru</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/book')}
            className="primary-button"
            style={{ height: '96px', fontSize: '20px', gap: '12px' }}
          >
            <span style={{ fontSize: '32px' }}>🚑</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span>BOOK AMBULANCE</span>
              <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.9 }}>Nearest arrives in ~8min</span>
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
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>1.2km · {h.specialities[0]} ✓</span>
                  </div>
                  <ChevronRight size={18} color="#D1D5DB" />
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div style={{ marginTop: 'auto', padding: '16px', background: '#F9FAFB', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={ROTARY_LOGO} alt="Rotary" height="20" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Rotary International</span>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>300+ verified hospitals across Bengaluru</span>
            </div>
          </div>
        </div>

        {/* Right Half: Map (Desktop only) */}
        {isDesktop && (
          <div style={{ flex: 1.2, height: '600px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #F0F0F0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <MapContainer center={userLocation} zoom={13} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <Marker position={userLocation} icon={createUserIcon()}>
                <Popup>Your Location</Popup>
              </Marker>
              {hospitals.map(h => (
                <Marker key={h.id} position={[h.lat, h.lng]} icon={createHospitalIcon()}>
                  <Popup>{h.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}

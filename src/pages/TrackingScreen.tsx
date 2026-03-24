import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, X, ChevronUp, ChevronDown, ShieldCheck, Clock, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../store/useAppStore';
import { createAmbulanceIcon, createUserIcon, fetchRoute, interpolate } from '../utils/mapHelpers';

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function TrackingScreen() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useAppStore();
  const booking = bookings.find(b => b.id === bookingId);
  
  const [ambulancePos, setAmbulancePos] = useState<[number, number]>([12.9592, 77.6444]); // Manipal Hospital
  const [route, setRoute] = useState<[number, number][]>([]);
  const [eta, setEta] = useState(8);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const animationRef = useRef<number | undefined>(undefined);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!booking) return;

    const start: [number, number] = [12.9592, 77.6444];
    const end: [number, number] = [booking.userLocation?.lat || 12.9344, booking.userLocation?.lng || 77.6192];

    fetchRoute(start, end).then(coords => {
      setRoute(coords);
      
      const animate = () => {
        if (stepRef.current < coords.length) {
          setAmbulancePos(coords[stepRef.current]);
          setEta(Math.max(1, Math.ceil(8 * (1 - stepRef.current / coords.length))));
          stepRef.current += 1;
          animationRef.current = window.setTimeout(animate, 1000);
        }
      };
      animate();
    });

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [booking]);

  if (!booking) return <div>Booking not found</div>;

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      cancelBooking(booking.id);
      navigate('/');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'white' }}>
      {/* Map Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapContainer center={ambulancePos} zoom={15} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={ambulancePos} icon={createAmbulanceIcon()} />
          <Marker position={[booking.userLocation?.lat || 12.9344, booking.userLocation?.lng || 77.6192]} icon={createUserIcon()} />
          {route.length > 0 && <Polyline positions={route} color="#E63946" weight={4} opacity={0.6} dashArray="8, 12" />}
          <MapController center={ambulancePos} />
        </MapContainer>
      </div>

      {/* Top Floating Pill */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 300, display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          background: 'white', 
          padding: '12px 20px', 
          borderRadius: '100px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid #F0F0F0'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E63946', animation: 'pulse-ring 1.5s infinite' }} />
          <span style={{ fontWeight: 700, fontSize: '15px' }}>🚑 En route · ETA {eta} min</span>
          <div style={{ width: '1px', height: '16px', background: '#F0F0F0' }} />
          <button onClick={handleCancel} style={{ background: 'none', border: 'none', color: '#6B7280', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 300,
        background: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.1)',
        padding: '20px',
        transition: 'transform 0.3s ease',
        transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 140px))'
      }}>
        {/* Handle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ width: '100%', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '4px', background: '#F0F0F0', borderRadius: '2px' }} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
          {/* Driver Info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F9FAFB', border: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👨‍✈️</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '18px' }}>{booking.driver?.name}</span>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>{booking.driver?.vehicleNumber}</span>
              </div>
            </div>
            <a href={`tel:${booking.driver?.phone}`} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none' }}>
              <Phone size={20} />
            </a>
          </div>

          {/* Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
              <span>Dispatch</span>
              <span>Hospital</span>
            </div>
            <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(stepRef.current / (route.length || 1)) * 100}%`, background: '#E63946', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          {/* Additional Details (Visible when expanded) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>
            <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={16} color="#6B7280" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Emergency: {booking.emergencyType}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={16} color="#6B7280" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>To: {booking.hospital.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', background: '#ecfdf5', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Rotary Verified Ambulance Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

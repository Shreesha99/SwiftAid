import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Info, X, ChevronLeft, Ambulance, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { createAmbulanceIcon, createUserIcon, createPulseIcon, fetchRoute, getBearing } from '../utils/mapHelpers';

const EMERGENCY_TIPS: Record<string, { title: string; tips: string[] }> = {
  cardiac: {
    title: 'Cardiac Emergency Tips',
    tips: [
      'Call for help and stay on the line.',
      'Check if the person is breathing and has a pulse.',
      'If no pulse, start CPR (30 compressions, 2 breaths).',
      'Locate and use an AED if one is nearby.'
    ]
  },
  trauma: {
    title: 'Trauma & Bleeding Tips',
    tips: [
      'Apply firm, direct pressure to any bleeding wounds.',
      'Do not move the person unless they are in immediate danger.',
      'Keep the person warm and lying flat.',
      'Do not remove any impaled objects.'
    ]
  },
  respiratory: {
    title: 'Breathing Difficulty Tips',
    tips: [
      'Help the person sit upright in a comfortable position.',
      'Loosen any tight clothing around the neck or chest.',
      'Assist them with their prescribed inhaler if available.',
      'Keep the person calm and encourage slow breaths.'
    ]
  },
  maternity: {
    title: 'Maternity Emergency Tips',
    tips: [
      'Help the mother lie on her left side.',
      'Time the frequency and duration of contractions.',
      'Prepare clean towels and blankets.',
      'Stay calm and provide constant reassurance.'
    ]
  },
  stroke: {
    title: 'Stroke Emergency Tips',
    tips: [
      'Note the exact time symptoms first appeared.',
      'Keep the person lying down on their side.',
      'Do not give them anything to eat or drink.',
      'Monitor their breathing closely.'
    ]
  },
  other: {
    title: 'Emergency Response Tips',
    tips: [
      'Stay on the line with the emergency dispatcher.',
      'Keep the person calm, still, and reassured.',
      'Clear a path for the paramedics to enter.',
      'Gather any medications the person is currently taking.'
    ]
  }
};

function MapController({ 
  route, 
  ambulancePos, 
  rotation, 
  userLocation, 
  stepIndex,
  isAutoCenter,
  onMapMove
}: { 
  route: [number, number][], 
  ambulancePos: [number, number], 
  rotation: number,
  userLocation: [number, number],
  stepIndex: number,
  isAutoCenter: boolean,
  onMapMove: () => void
}) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const pulseMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const coveredLineRef = useRef<L.Polyline | null>(null);
  const initializedRef = useRef(false);

  // Detect manual map movement
  useEffect(() => {
    if (!map) return;
    const handleMove = () => {
      onMapMove();
    };
    map.on('dragstart', handleMove);
    map.on('zoomstart', handleMove);
    return () => {
      map.off('dragstart', handleMove);
      map.off('zoomstart', handleMove);
    };
  }, [map, onMapMove]);

  useEffect(() => {
    if (!map || route.length === 0 || initializedRef.current) return;

    // 1. Shadow line (draw first — lowest layer)
    L.polyline(route, {
      color: 'rgba(0,0,0,0.08)',
      weight: 10,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // 2. White outline (draw second)
    L.polyline(route, {
      color: '#ffffff',
      weight: 7,
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.9,
    }).addTo(map);

    // 3. Colored route (draw on top)
    routeLineRef.current = L.polyline(route, {
      color: '#E63946',
      weight: 4,
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 1,
    }).addTo(map);

    // 4. Traveled portion (grey, updated as ambulance moves)
    coveredLineRef.current = L.polyline([], {
      color: '#CBD5E1',
      weight: 4,
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.7,
    }).addTo(map);

    // Pulse marker
    pulseMarkerRef.current = L.marker(ambulancePos, { 
      icon: createPulseIcon(),
      zIndexOffset: -100 
    }).addTo(map);

    // Ambulance marker
    markerRef.current = L.marker(ambulancePos, { 
      icon: createAmbulanceIcon(rotation),
      zIndexOffset: 100
    }).addTo(map);

    // User marker
    L.marker(userLocation, { icon: createUserIcon() }).addTo(map);

    initializedRef.current = true;
    map.setView(ambulancePos, 15);
  }, [map, route, userLocation]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(ambulancePos);
      markerRef.current.setIcon(createAmbulanceIcon(rotation));
    }
    if (pulseMarkerRef.current) {
      pulseMarkerRef.current.setLatLng(ambulancePos);
    }
    if (routeLineRef.current && coveredLineRef.current) {
      routeLineRef.current.setLatLngs(route.slice(stepIndex));
      coveredLineRef.current.setLatLngs(route.slice(0, stepIndex + 1));
    }
    if (map && isAutoCenter) {
      map.panTo(ambulancePos, { animate: true, duration: 0.4 });
    }
  }, [ambulancePos, rotation, stepIndex, route, map, isAutoCenter]);

  return null;
}

export default function TrackingScreen() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, cancelBooking, updateBookingStatus } = useAppStore();
  const booking = bookings.find(b => b.id === bookingId);
  
  const [ambulancePos, setAmbulancePos] = useState<[number, number]>(
    booking.driver?.currentLocation 
      ? [booking.driver.currentLocation.lat, booking.driver.currentLocation.lng] 
      : [12.9592, 77.6444]
  );
  const [rotation, setRotation] = useState(0);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [eta, setEta] = useState(booking.driver?.initialEta || 8);
  const [initialEta] = useState(booking.driver?.initialEta || 8);
  const [stepIndex, setStepIndex] = useState(0);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [isAutoCenter, setIsAutoCenter] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [isArrived, setIsArrived] = useState(false);
  
  const stepRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const coordsRef = useRef<[number, number][]>([]);

  const STEP_DURATION = 800; // ms between steps

  // Handle Android back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setCancelConfirmOpen(true);
      // Push state back to prevent actual navigation
      window.history.pushState(null, '', window.location.pathname);
    };
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!booking) return;

    const start: [number, number] = booking.driver?.currentLocation 
      ? [booking.driver.currentLocation.lat, booking.driver.currentLocation.lng] 
      : [12.9592, 77.6444];
    const end: [number, number] = [booking.userLocation?.lat || 12.9344, booking.userLocation?.lng || 77.6192];

    fetchRoute(start, end).then(coords => {
      setRoute(coords);
      coordsRef.current = coords;
      
      const animate = (timestamp: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        const elapsed = timestamp - lastTimestampRef.current;

        const progress = Math.min(elapsed / STEP_DURATION, 1);
        const i = stepRef.current;
        const coords = coordsRef.current;

        if (i >= coords.length - 1) {
          setEta(0);
          updateBookingStatus(booking.id, 'Completed');
          setIsArrived(true);
          return;
        }

        const curr = coords[i];
        const next = coords[Math.min(i + 1, coords.length - 1)];

        const interpolatedLat = curr[0] + (next[0] - curr[0]) * progress;
        const interpolatedLng = curr[1] + (next[1] - curr[1]) * progress;

        setAmbulancePos([interpolatedLat, interpolatedLng]);
        
        const bearing = getBearing(curr, next);
        setRotation(bearing);

        if (progress >= 1) {
          stepRef.current += 1;
          setStepIndex(stepRef.current);
          lastTimestampRef.current = timestamp;
          setEta(Math.max(1, Math.ceil(initialEta * (1 - stepRef.current / coords.length))));
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [booking, initialEta]);

  if (!booking) return <div>Booking not found</div>;

  const handleConfirmCancel = () => {
    // 1. Stop animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    // 2. Update store
    cancelBooking(bookingId!);
    
    // 3. Update localStorage
    const bookingsLocal = JSON.parse(localStorage.getItem('swiftaid_bookings') || '[]');
    const updated = bookingsLocal.map((b: any) =>
      b.id === bookingId
        ? { ...b, status: 'Cancelled', cancelledAt: Date.now() }
        : b
    );
    localStorage.setItem('swiftaid_bookings', JSON.stringify(updated));
    
    // 4. Navigate home
    navigate('/', { replace: true });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'white' }}>
      {/* Floating top bar */}
      <div style={{
        position: 'absolute',
        top: 16, left: 16, right: 16,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 8, pointerEvents: 'all' }}>
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              width: 40, height: 40,
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1D3557',
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Booking ID pill */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            color: '#1D3557',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
          }}>
            SWF-{bookingId}
          </div>
        </div>

        {/* X button */}
        <button
          onClick={() => setCancelConfirmOpen(true)}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'all',
            color: '#1D3557',
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Emergency Tips overlay */}
      {showTips && EMERGENCY_TIPS[booking.emergencyType] && (
        <div style={{
          position: 'absolute',
          top: 80, left: 16, right: 16,
          zIndex: 1000,
          background: 'white',
          borderRadius: 16,
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid #F3F4F6',
          animation: 'slideDown 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={18} color="#E63946" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1D3557' }}>
                {EMERGENCY_TIPS[booking.emergencyType].title}
              </h3>
            </div>
            <button 
              onClick={() => setShowTips(false)}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EMERGENCY_TIPS[booking.emergencyType].tips.map((tip, idx) => (
              <li key={idx} style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.4, fontWeight: 500 }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Map Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapContainer center={ambulancePos} zoom={15} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <MapController 
            route={route} 
            ambulancePos={ambulancePos} 
            rotation={rotation}
            userLocation={[booking.userLocation?.lat || 12.9344, booking.userLocation?.lng || 77.6192]}
            stepIndex={stepIndex}
            isAutoCenter={isAutoCenter}
            onMapMove={() => setIsAutoCenter(false)}
          />
        </MapContainer>
      </div>

      {/* Navigation Button (Re-center) */}
      <div style={{
        position: 'absolute',
        bottom: '40vh',
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 1000,
      }}>
        {!showTips && EMERGENCY_TIPS[booking.emergencyType] && (
          <button
            onClick={() => setShowTips(true)}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1D3557',
            }}
          >
            <Info size={24} />
          </button>
        )}
        {!isAutoCenter && (
          <button
            onClick={() => setIsAutoCenter(true)}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#E63946',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          </button>
        )}
      </div>

      {/* Compact Bottom Sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        zIndex: 1000,
        background: 'white',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
        padding: '12px 20px 32px',
        maxHeight: '38vh',
      }}>
        {/* Handle */}
        <div style={{
          width: 36, height: 4, background: '#E5E7EB',
          borderRadius: 2, margin: '0 auto 16px',
        }} />

        {/* ETA — large and central */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: '#1D3557', lineHeight: 1 }}>
            {eta}
          </span>
          <span style={{ fontSize: 15, color: '#6B7280' }}>min away</span>
          <div style={{
            marginLeft: 'auto',
            background: '#ECFDF5',
            color: '#10B981',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 600,
          }}>
            Closest Unit Dispatched
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 5, background: '#F3F4F6',
          borderRadius: 3, marginBottom: 16, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, (1 - eta / initialEta) * 100)}%`,
            background: '#E63946',
            borderRadius: 3,
            transition: 'width 1s ease',
          }} />
        </div>

        {/* Driver row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          paddingTop: 12, borderTop: '1px solid #F3F4F6',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#1D3557',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            RK
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1D3557' }}>
              {booking.driver?.name || 'Ravi Kumar'}
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>
              {booking.driver?.vehicleNumber || 'KA-01-AB-1234'}
            </div>
          </div>
          <a href={`tel:${booking.driver?.phone || '+919876543210'}`} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#10B981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, textDecoration: 'none',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07
                19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3
                a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09
                9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573
                2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </a>
          <button
            onClick={() => setCancelConfirmOpen(true)}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#FEF2F2',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: '#E63946',
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {cancelConfirmOpen && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'flex-end',
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            borderRadius: '20px 20px 0 0',
            padding: '24px 20px 40px',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1D3557', marginBottom: 8 }}>
              Cancel booking?
            </h3>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
              The ambulance is already on its way. Are you sure?
            </p>
            <button
              onClick={handleConfirmCancel}
              style={{
                width: '100%', padding: '14px',
                background: 'white', color: '#E63946',
                border: '1.5px solid #E63946',
                borderRadius: 12, fontSize: 15,
                fontWeight: 600, cursor: 'pointer',
                marginBottom: 10,
              }}
            >
              Yes, cancel booking
            </button>
            <button
              onClick={() => setCancelConfirmOpen(false)}
              style={{
                width: '100%', padding: '14px',
                background: '#E63946', color: 'white',
                border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Keep booking
            </button>
          </div>
        </div>
      )}

      {/* Arrival Flow */}
      {isArrived && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: 400,
            borderRadius: 24,
            padding: '40px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              width: 80, height: 80, background: '#ECFDF5',
              borderRadius: '50%', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#10B981',
            }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1D3557', marginBottom: 12 }}>
              Ambulance Arrived
            </h2>
            <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 32, lineHeight: 1.5 }}>
              The ambulance has reached your location. Please proceed to the vehicle.
            </p>
            <button
              onClick={() => navigate(`/rate/${bookingId}`)}
              style={{
                width: '100%', padding: '16px',
                background: '#E63946', color: 'white',
                border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
              }}
            >
              Rate Experience
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%', marginTop: 12, padding: '14px',
                background: 'white', color: '#6B7280',
                border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

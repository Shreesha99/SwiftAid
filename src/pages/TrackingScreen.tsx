/* src/pages/TrackingScreen.tsx */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../store/useAppStore';
import { FloatingTrackingUI } from '../components/FloatingTrackingUI';
import { ArrivalModal } from '../components/ArrivalModal';
import { createUserIcon, createAmbulanceIcon, createHospitalIcon, fetchOSRMRoute } from '../utils/mapHelpers';
import '../components/MapStyles.css';

const TrackingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, cancelBooking, completeBooking } = useAppStore();
  const booking = bookings.find((b) => b.id === id);

  const [eta, setEta] = useState(10);
  const [status, setStatus] = useState<'En Route' | 'Arriving' | 'Arrived'>('En Route');
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [traveledCoords, setTraveledCoords] = useState<[number, number][]>([]);

  // Refs for animation to prevent React re-renders
  const mapRef = useRef<L.Map | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const stepIndexRef = useRef(0);
  const intervalRef = useRef<any>(null);

  const userIcon = useMemo(() => createUserIcon(), []);
  const ambulanceIcon = useMemo(() => createAmbulanceIcon(), []);
  const hospitalIcon = useMemo(() => createHospitalIcon(booking?.hospital?.name), [booking?.hospital?.name]);

  // Initial setup: Fetch route and start animation
  useEffect(() => {
    if (!booking) return;

    const setupTracking = async () => {
      // Start ambulance ~3km away in a random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.025; // ~2.5-3km in lat/lng approx
      const startLat = booking.userLocation.lat + Math.sin(angle) * distance;
      const startLng = booking.userLocation.lng + Math.cos(angle) * distance;

      const coords = await fetchOSRMRoute(
        startLat, startLng,
        booking.userLocation.lat, booking.userLocation.lng
      );

      setRouteCoords(coords);
      
      // Fit bounds once on load
      if (mapRef.current) {
        mapRef.current.fitBounds([
          [startLat, startLng],
          [booking.userLocation.lat, booking.userLocation.lng]
        ], { padding: [80, 80] });
      }

      // Create marker once
      if (mapRef.current && !ambulanceMarkerRef.current) {
        ambulanceMarkerRef.current = L.marker([startLat, startLng], { icon: ambulanceIcon })
          .addTo(mapRef.current);
        
        startAnimation(coords);
      }
    };

    setupTracking();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      ambulanceMarkerRef.current?.remove();
      ambulanceMarkerRef.current = null;
    };
  }, [booking]);

  const startAnimation = (coords: [number, number][]) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    stepIndexRef.current = 0;
    intervalRef.current = setInterval(() => {
      const i = stepIndexRef.current;
      
      if (i >= coords.length) {
        clearInterval(intervalRef.current);
        handleArrival();
        return;
      }

      const [lat, lng] = coords[i];
      ambulanceMarkerRef.current?.setLatLng([lat, lng]);

      // Rotate marker toward next point
      if (i < coords.length - 1) {
        const [nextLat, nextLng] = coords[i + 1];
        const angle = Math.atan2(nextLng - lng, nextLat - lat) * 180 / Math.PI;
        const el = ambulanceMarkerRef.current?.getElement();
        if (el) {
          // Leaflet handles rotation via CSS transform
          el.style.transform = `${el.style.transform} rotate(${angle}deg)`;
        }
      }

      // Update traveled path for visual effect
      setTraveledCoords(coords.slice(0, i + 1));
      
      // Update ETA and Status based on progress
      const remaining = Math.ceil(((coords.length - i) / coords.length) * 10);
      setEta(remaining);
      if (remaining <= 2 && remaining > 0) setStatus('Arriving');
      
      stepIndexRef.current += 1;
    }, 600);
  };

  const handleArrival = () => {
    setStatus('Arrived');
    setEta(0);
    setIsArrivalModalOpen(true);
    if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
  };

  const handleCancel = () => {
    if (id) {
      cancelBooking(id);
      navigate('/');
    }
  };

  const handleComplete = () => {
    if (id) {
      completeBooking(id);
      navigate('/rating');
    }
  };

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-[#E63946] rounded-full flex items-center justify-center">
          <span className="text-3xl">🚑</span>
        </div>
        <h2 className="text-xl font-black text-[#1D3557]">Booking Not Found</h2>
        <p className="text-gray-500 text-sm">This booking may have been cancelled or expired.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#E63946] text-white rounded-2xl font-black">GO HOME</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[booking.userLocation.lat, booking.userLocation.lng]} 
          zoom={15} 
          className="w-full h-full"
          zoomControl={false}
          ref={(map) => { mapRef.current = map; }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* User Location */}
          <LMarker position={[booking.userLocation.lat, booking.userLocation.lng]} icon={userIcon} />
          
          {/* Hospital Location (Mocked slightly offset from user for visual) */}
          <LMarker 
            position={[booking.hospital.lat, booking.hospital.lng]} 
            icon={hospitalIcon} 
          />

          {/* Route Polyline - Background Outline */}
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ color: '#ffffff', weight: 8, opacity: 0.6, lineCap: 'round' }} 
          />
          
          {/* Route Polyline - Primary Route */}
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ color: '#E63946', weight: 4, opacity: 0.8, lineCap: 'round' }} 
          />

          {/* Traveled Path */}
          <Polyline 
            positions={traveledCoords} 
            pathOptions={{ color: '#9CA3AF', weight: 3, opacity: 0.5, lineCap: 'round' }} 
          />
        </MapContainer>
      </div>

      {/* Floating UI Layers */}
      <FloatingTrackingUI 
        bookingId={booking.id}
        status={status}
        eta={eta}
        driver={booking.driver}
        ambulanceType={booking.ambulanceType}
        onCancel={handleCancel}
      />

      <ArrivalModal 
        isOpen={isArrivalModalOpen}
        onClose={() => setIsArrivalModalOpen(false)}
        hospital={booking.hospital}
        onComplete={handleComplete}
      />
    </div>
  );
};

// Simple wrapper for Leaflet Marker to avoid direct import issues in some envs
const LMarker = ({ position, icon }: { position: [number, number], icon: L.DivIcon }) => {
  const map = useMap();
  useEffect(() => {
    const marker = L.marker(position, { icon }).addTo(map);
    return () => { marker.remove(); };
  }, [map, position, icon]);
  return null;
};

export default TrackingScreen;

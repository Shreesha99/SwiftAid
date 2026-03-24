import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ambulance, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function ActiveBookingBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookings } = useAppStore();

  const activeBooking = bookings.find(b => b.status === 'Active');

  // Don't show if no active booking or if already on the tracking screen
  if (!activeBooking || location.pathname.startsWith('/track/')) {
    return null;
  }

  return (
    <div 
      onClick={() => navigate(`/track/${activeBooking.id}`)}
      style={{
        position: 'fixed',
        bottom: location.pathname === '/' || location.pathname === '/bookings' || location.pathname === '/help' || location.pathname === '/profile' ? '80px' : '20px',
        left: '16px',
        right: '16px',
        background: '#E63946',
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'white',
        boxShadow: '0 8px 24px rgba(230, 57, 70, 0.3)',
        cursor: 'pointer',
        zIndex: 1000,
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ambulance size={24} color="white" />
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 700 }}>Ambulance En Route</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          Arriving in ~{activeBooking.driver?.initialEta || 8} min
        </div>
      </div>

      <ChevronRight size={20} color="white" />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

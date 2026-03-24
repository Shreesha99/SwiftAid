import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function MyBookings() {
  const navigate = useNavigate();
  const { bookings } = useAppStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#E63946';
      case 'Completed': return '#10B981';
      case 'Cancelled': return '#6B7280';
      default: return '#1D3557';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <AlertCircle size={16} color="#E63946" />;
      case 'Completed': return <CheckCircle size={16} color="#10B981" />;
      case 'Cancelled': return <XCircle size={16} color="#6B7280" />;
      default: return null;
    }
  };

  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>My Bookings</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>History of your ambulance requests</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {bookings.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', background: '#F9FAFB', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
            <Calendar size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
            <p style={{ fontWeight: 600, color: '#6B7280' }}>No bookings yet</p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Your emergency requests will appear here</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div 
              key={booking.id}
              onClick={() => booking.status === 'Active' ? navigate(`/track/${booking.id}`) : null}
              style={{ 
                padding: '20px', 
                background: 'white', 
                border: '1px solid #F0F0F0', 
                borderRadius: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                cursor: booking.status === 'Active' ? 'pointer' : 'default',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{booking.emergencyType}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: `${getStatusColor(booking.status)}15`, borderRadius: '4px' }}>
                      {getStatusIcon(booking.status)}
                      <span style={{ fontSize: '11px', fontWeight: 700, color: getStatusColor(booking.status) }}>{booking.status}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>{new Date(booking.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {booking.status === 'Active' && <ChevronRight size={20} color="#D1D5DB" />}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={16} color="#6B7280" style={{ marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Pickup</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1D3557' }}>{booking.userLocation?.address || 'Location not specified'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', marginTop: '2px' }}>🏥</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Destination</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1D3557' }}>{booking.hospital.name}</span>
                  </div>
                </div>
              </div>

              {booking.status === 'Completed' && !booking.rating && (
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/rate/${booking.id}`); }}
                  style={{ marginTop: '4px', padding: '12px', background: '#F9FAFB', border: '1px solid #F0F0F0', borderRadius: '12px', color: '#1D3557', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Rate your experience
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

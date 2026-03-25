import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Hospital as HospitalIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Logo from '../components/Logo';

export default function MyBookings() {
  const navigate = useNavigate();
  const { bookings } = useAppStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const activeBookings = bookings.filter(b => b.status === 'Active');
  const pastBookings = bookings.filter(b => b.status !== 'Active');

  const BookingCard = ({ booking }: { booking: any }) => (
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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#1D3557' }}>{booking.emergencyType}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: `${getStatusColor(booking.status)}10`, borderRadius: '6px' }}>
              {getStatusIcon(booking.status)}
              <span style={{ fontSize: '11px', fontWeight: 800, color: getStatusColor(booking.status), textTransform: 'uppercase', letterSpacing: '0.02em' }}>{booking.status}</span>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
            {new Date(booking.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {booking.status === 'Active' && <ChevronRight size={20} color="#94A3B8" />}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <MapPin size={14} color="#64748B" style={{ marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pickup</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{booking.userLocation?.address || 'Location not specified'}</span>
          </div>
        </div>

        <div style={{ height: '1px', background: '#E2E8F0', margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <HospitalIcon size={14} color="#64748B" style={{ marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destination</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{booking.hospital.name}</span>
          </div>
        </div>
      </div>

      {booking.status === 'Completed' && !booking.rating && (
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/rate/${booking.id}`); }}
          style={{ 
            marginTop: '4px', 
            padding: '12px', 
            background: '#1D3557', 
            border: 'none', 
            borderRadius: '12px', 
            color: 'white', 
            fontSize: '13px', 
            fontWeight: 700, 
            cursor: 'pointer' 
          }}
        >
          Rate Experience
        </button>
      )}

      {booking.rating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < booking.rating ? '#F59E0B' : '#E2E8F0', fontSize: '16px' }}>★</span>
          ))}
          <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '4px', fontWeight: 500 }}>Rated</span>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: isDesktop ? '40px' : '0 20px 20px', background: '#FDFDFD', minHeight: '100%' }}>
      {/* Mobile Header */}
      {!isDesktop && (
        <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Logo size={28} showText />
        </header>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1280px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px', 
          height: isDesktop ? 'auto' : '56px', 
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1D3557' }}>My Bookings</h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Manage your emergency requests</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {bookings.length === 0 ? (
            <div style={{ 
              padding: '64px 24px', 
              textAlign: 'center', 
              background: '#F8FAFC', 
              borderRadius: '24px', 
              border: '1px dashed #CBD5E1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #E2E8F0'
              }}>
                <Calendar size={32} color="#94A3B8" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#1D3557' }}>No bookings yet</p>
                <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '240px', margin: '0 auto', lineHeight: 1.5 }}>
                  Your emergency requests and history will appear here once you make a booking.
                </p>
              </div>
              <button 
                onClick={() => navigate('/')}
                style={{ 
                  marginTop: '12px',
                  padding: '12px 32px', 
                  background: '#E63946', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                }}
              >
                Request Ambulance
              </button>
            </div>
          ) : (
            <>
              {activeBookings.length > 0 && (
                <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#E63946', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E63946' }} />
                    Active Request
                  </h2>
                  {activeBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </section>
              )}

              {pastBookings.length > 0 && (
                <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Past Bookings</h2>
                  {pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

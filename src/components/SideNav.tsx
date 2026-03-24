import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, HelpCircle, User, ShieldCheck } from 'lucide-react';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';
import Logo from './Logo';

export default function SideNav() {
  const location = useLocation();
  
  // Hide on booking and tracking routes
  const hideNav = ['/book', '/track'].some(route => 
    location.pathname === route || 
    location.pathname.startsWith(route + '/')
  );
  if (hideNav) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      top: '48px',
      bottom: 0,
      width: '220px',
      background: 'white',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 40,
    }}>
      <div style={{ marginBottom: '32px', padding: '0 16px' }}>
        <Logo size={32} showText />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              textDecoration: 'none',
              borderRadius: '12px',
              color: isActive ? '#E63946' : '#1D3557',
              background: isActive ? '#fef2f2' : 'transparent',
              fontSize: '15px',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s ease',
            })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div style={{ 
        marginTop: 'auto', 
        padding: '16px', 
        background: '#F9FAFB', 
        borderRadius: '16px', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid #F0F0F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>Official Partner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={ROTARY_LOGO_URL} 
            alt="Rotary International" 
            height="24" 
            style={{ objectFit: 'contain' }}
            onError={(e: any) => { e.target.style.display = 'none' }}
          />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1D3557' }}>Rotary Int.</span>
        </div>
      </div>
    </nav>
  );
}

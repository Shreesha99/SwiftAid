import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, HelpCircle, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  // Hide on booking and tracking routes
  const hideRoutes = ['/book', '/track'];
  if (hideRoutes.some(route => location.pathname.startsWith(route))) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/bookings', icon: Calendar, label: 'History' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'white',
      borderTop: '1px solid #f0f0f0',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            textDecoration: 'none',
            color: isActive ? '#E63946' : '#6B7280',
            flex: 1,
            height: '100%',
          })}
        >
          <item.icon size={20} />
          <span style={{ fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

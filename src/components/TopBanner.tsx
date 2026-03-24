import React from 'react';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';
import Logo from './Logo';

export default function TopBanner() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      background: 'white',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      padding: '0 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Logo size={24} showText />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600, color: '#1D3557' }}>
        <span style={{ color: '#6B7280', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Official Partner</span>
        <img 
          src={ROTARY_LOGO_URL} 
          alt="Rotary International" 
          height="24" 
          style={{ objectFit: 'contain' }}
          onError={(e: any) => { e.target.style.display = 'none' }}
        />
        <span style={{ color: '#F7A600', margin: '0 4px' }}>·</span>
        <span style={{ color: '#6B7280', fontWeight: 500 }}>300+ verified hospitals</span>
      </div>
    </div>
  );
}

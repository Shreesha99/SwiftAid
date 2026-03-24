import React from 'react';
import { ROTARY_LOGO_URL } from '../utils/mapHelpers';

export default function TopBanner() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      background: '#FFF8E7',
      borderBottom: '1px solid #F7A600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '0 24px',
      gap: '12px',
      fontSize: '13px',
      fontWeight: 600,
      color: '#1D3557',
    }}>
      <span>In partnership with Rotary International</span>
      <img 
        src={ROTARY_LOGO_URL} 
        alt="Rotary International" 
        height="24" 
        style={{ objectFit: 'contain' }}
        onError={(e: any) => { e.target.style.display = 'none' }}
      />
      <span style={{ color: '#F7A600', margin: '0 8px' }}>·</span>
      <span>300+ verified hospitals across Bengaluru</span>
    </div>
  );
}

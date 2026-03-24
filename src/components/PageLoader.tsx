import React from 'react';

export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      gap: '24px',
      animation: 'fade-in 0.3s ease',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #F3F4F6',
        borderTop: '4px solid #E63946',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#E63946' }}>Swift Aid</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>Connecting you to nearest help...</p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

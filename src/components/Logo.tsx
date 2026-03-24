import React from 'react';

interface LogoProps {
  size?: number;
  color?: string;
  showText?: boolean;
}

export default function Logo({ size = 32, color = '#E63946', showText = false }: LogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized 'S' that looks like a pulse/road */}
        <path
          d="M12 48C12 48 18 42 24 42C30 42 34 48 40 48C46 48 52 42 52 42"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M12 22C12 22 18 16 24 16C30 16 34 22 40 22C46 22 52 16 52 16"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Red Cross in the middle */}
        <rect x="28" y="24" width="8" height="16" rx="2" fill={color} />
        <rect x="24" y="28" width="16" height="8" rx="2" fill={color} />
      </svg>
      {showText && (
        <span style={{ 
          fontSize: size * 0.6, 
          fontWeight: 900, 
          color: color,
          letterSpacing: '-0.02em'
        }}>
          Swift Aid
        </span>
      )}
    </div>
  );
}

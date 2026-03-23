/* src/components/RotaryLogo.jsx */
import React from 'react';

/**
 * Rotary International Logo Placeholder
 * A golden gear/wheel shape.
 */
export const RotaryLogo = ({ size = 32, className = "" }) => {
  return (
    <div 
      className={`relative flex items-center justify-center rounded-full bg-[#F7A600] shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full p-1.5"
        fill="white"
      >
        {/* Simple 6-spoked wheel/gear representation */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" />
        <circle cx="50" cy="50" r="10" />
        <rect x="46" y="10" width="8" height="80" rx="4" />
        <rect x="10" y="46" width="80" height="8" rx="4" transform="rotate(60 50 50)" />
        <rect x="10" y="46" width="80" height="8" rx="4" transform="rotate(-60 50 50)" />
      </svg>
    </div>
  );
};

export default RotaryLogo;

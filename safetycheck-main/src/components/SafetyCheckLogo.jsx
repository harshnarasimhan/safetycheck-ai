import React from 'react';

export default function SafetyCheckLogo({ size = 40, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon shape */}
      <path 
        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" 
        fill="url(#hexGradient)"
      />
      
      {/* Inner shield */}
      <path 
        d="M50 25 L70 37 L70 60 Q70 70 50 78 Q30 70 30 60 L30 37 Z" 
        fill="white"
        opacity="0.15"
      />
      
      {/* Checkmark */}
      <path 
        d="M38 50 L46 58 L62 38" 
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
    </svg>
  );
}
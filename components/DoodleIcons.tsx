
import React from 'react';

export const Dice: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 20 L80 20 L80 80 L20 80 Z" strokeLinejoin="round" />
    <circle cx="35" cy="35" r="4" fill="currentColor" />
    <circle cx="65" cy="35" r="4" fill="currentColor" />
    <circle cx="35" cy="65" r="4" fill="currentColor" />
    <circle cx="65" cy="65" r="4" fill="currentColor" />
    <path d="M25 25 Q50 15 75 25" />
  </svg>
);

export const Chip: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="50" cy="50" r="40" strokeDasharray="5 5" />
    <circle cx="50" cy="50" r="30" />
    <path d="M50 10 L50 20 M90 50 L80 50 M50 90 L50 80 M10 50 L20 50" />
    <path d="M50 50 L65 35" />
  </svg>
);

export const Card: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="20" y="10" width="60" height="80" rx="5" transform="rotate(-5, 50, 50)" />
    <path d="M45 40 L55 40 L50 55 Z" fill="currentColor" />
    <text x="30" y="30" fontSize="12" fill="currentColor" style={{ fontFamily: 'serif' }}>A</text>
  </svg>
);

export const Sparkle: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M50 10 Q50 50 90 50 Q50 50 50 90 Q50 50 10 50 Q50 50 50 10" />
  </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

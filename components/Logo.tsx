import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative flex items-center gap-3 h-24 md:h-32 text-black ${className}`}>
    {/* Animated Hat/Crown - Absolute Positioned */}
    <div className="absolute -top-8 -left-2 -rotate-12 z-20 transform scale-100 md:scale-125 origin-bottom-left pointer-events-none">
      <svg width="40" height="35" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 5 30 L 35 30 L 20 5 Z" fill="#fff" stroke="black" strokeWidth="2.5"></path>
        <path d="M 10 30 L 30 30 L 20 12 Z" fill="#ef4444" stroke="black" strokeWidth="2"></path>
        <circle cx="20" cy="5" r="5" fill="white" stroke="black" strokeWidth="1.5"></circle>
        <rect x="5" y="26" width="30" height="6" rx="2" fill="white" stroke="black" strokeWidth="1.5"></rect>
      </svg>
    </div>

    {/* Main Circle Icon */}
    <div className="relative h-full aspect-square">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="42" className="dl-wiggle"></circle>
        <path d="M 15 35 Q 50 15 85 35"></path>
        <path d="M 15 65 Q 50 85 85 65"></path>
        <path d="M 50 12 Q 50 50 50 88" strokeDasharray="10 10" opacity="0.4"></path>
        <path d="M 85 15 L 95 5 L 105 15" strokeWidth="5" className="dl-bounce text-yellow-500"></path>
      </svg>
    </div>

    {/* Branding Text */}
    <div className="flex flex-col justify-center leading-[0.85] text-left pt-2">
      <span className="font-marker font-bold text-[2em] md:text-[2.8em] tracking-tight text-black">
        Doodle
      </span>
      <span className="font-hand font-bold text-[1.2em] md:text-[1.5em] tracking-[0.2em] uppercase border-t-4 border-black pt-1">
        Leagues
      </span>
    </div>
  </div>
);
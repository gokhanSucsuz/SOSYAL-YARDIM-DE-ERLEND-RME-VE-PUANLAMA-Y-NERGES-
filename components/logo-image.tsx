'use client';

import React from 'react';
import { Scale, HeartHandshake } from 'lucide-react';

interface LogoImageProps {
  className?: string;
  alt?: string;
}

export function LogoImage({ 
  className = "w-10 h-10 rounded-2xl shadow-md shrink-0", 
  alt = "Sosyal Yardım Değerlendirme ve Puanlama Sistemi İkonu" 
}: LogoImageProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white shadow-lg border border-white/20 select-none ${className}`}
      title={alt}
      aria-label={alt}
    >
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400/25 rounded-full blur-md pointer-events-none" />
      <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-primary-300/20 rounded-full blur-md pointer-events-none" />
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5 drop-shadow-sm"
      >
        {/* Shield Base representing Institutional Trust & Social Protection */}
        <path
          d="M32 6L10 15V30.5C10 44.8 19.4 57.6 32 61C44.6 57.6 54 44.8 54 30.5V15L32 6Z"
          fill="url(#shieldGrad)"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {/* Balance Scale & Evaluation Bars representing 100-Point Fair Scoring */}
        <path
          d="M32 17V45M21 24H43"
          stroke="#FBBF24"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Left Scale Pan */}
        <path
          d="M21 24L16.5 33.5H25.5L21 24Z"
          fill="rgba(251,191,36,0.35)"
          stroke="#FDE68A"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Right Scale Pan */}
        <path
          d="M43 24L38.5 33.5H47.5L43 24Z"
          fill="rgba(251,191,36,0.35)"
          stroke="#FDE68A"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Base Pedestal */}
        <path
          d="M25 45H39"
          stroke="#FBBF24"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Top Star / Point Indicator */}
        <circle cx="32" cy="15.5" r="2.8" fill="#FDE68A" />
        <defs>
          <linearGradient id="shieldGrad" x1="10" y1="6" x2="54" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,255,255,0.22)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

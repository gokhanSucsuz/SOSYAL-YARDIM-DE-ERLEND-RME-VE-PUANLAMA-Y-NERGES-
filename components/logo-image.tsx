'use client';

import React, { useState } from 'react';

interface LogoImageProps {
  className?: string;
  alt?: string;
}

export function LogoImage({ 
  className = "w-10 h-10 rounded-2xl shadow-md border-2 border-red-700 shrink-0", 
  alt = "T.C. Edirne Valiliği Sosyal Yardımlaşma ve Dayanışma Vakfı Logo" 
}: LogoImageProps) {
  const OFFICIAL_LOGO_URL = 'https://pbs.twimg.com/profile_images/1456143975845404674/xGjOJe4S_400x400.jpg';
  const [imgSrc, setImgSrc] = useState<string>(OFFICIAL_LOGO_URL);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (imgSrc === '/logo.jpg') {
      setImgSrc(OFFICIAL_LOGO_URL);
    } else if (imgSrc === OFFICIAL_LOGO_URL) {
      setImgSrc('/logo.png');
    } else {
      setHasError(true);
    }
  };

  if (!hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 overflow-hidden bg-red-900 rounded-2xl border-2 border-red-700 shadow-md ${className}`} title={alt}>
      <svg viewBox="0 0 100 100" className="w-full h-full p-1">
        <circle cx="50" cy="50" r="46" fill="#991b1b" stroke="#fef08a" strokeWidth="2" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
        <path d="M 44 32 A 18 18 0 1 0 62 68 A 15 15 0 1 1 44 32 Z" fill="#ffffff" />
        <polygon points="60,44 62,49 67,49 63,52 64,57 60,54 56,57 57,52 53,49 58,49" fill="#ffffff" />
        <text x="50" y="80" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold">EDİRNE SYDV</text>
      </svg>
    </div>
  );
}

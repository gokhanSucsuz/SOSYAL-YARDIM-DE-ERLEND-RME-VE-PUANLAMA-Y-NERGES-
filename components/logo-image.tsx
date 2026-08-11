'use client';

import React, { useState } from 'react';

interface LogoImageProps {
  className?: string;
  alt?: string;
}

export function LogoImage({ 
  className = "w-10 h-10 rounded-2xl shadow-md border-2 border-slate-700 object-cover shrink-0", 
  alt = "Sosyal İnceleme Logo" 
}: LogoImageProps) {
  const [imgSrc, setImgSrc] = useState<string>('/logo.jpg');
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (imgSrc === '/logo.jpg') {
      setImgSrc('/logo.png');
    } else if (imgSrc === '/logo.png') {
      setImgSrc('/icon.png');
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-red-900 via-slate-900 to-blue-900 text-white flex items-center justify-center font-black text-xs tracking-tighter border-2 border-amber-500/50 shrink-0 shadow-md`}>
        <div className="text-center leading-none">
          <span className="block text-[8px] text-amber-300 font-extrabold tracking-wider">T.C.</span>
          <span className="text-[10px] font-black text-white">SYDV</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}

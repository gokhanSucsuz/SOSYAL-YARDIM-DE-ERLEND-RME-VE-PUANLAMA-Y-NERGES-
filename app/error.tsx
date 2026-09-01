'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Sistem Hatası:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-md w-full text-center shadow-xl">
        <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl border border-red-500/30">
          !
        </div>
        <h2 className="text-lg font-bold mb-2">Sistem Hatası Oluştu</h2>
        <p className="text-slate-400 text-xs mb-6">
          {error?.message || 'Beklenmeyen bir durum oluştu. Lütfen işlemi tekrar deneyin.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Yeniden Dene
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    </div>
  );
}


'use client';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-md w-full text-center shadow-xl">
          <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl border border-red-500/30">
            !
          </div>
          <h2 className="text-lg font-bold mb-2">Kritik Sistem Hatası</h2>
          <p className="text-slate-400 text-xs mb-6">
            Uygulama genelinde beklenmeyen bir durum oluştu.
          </p>
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Sistemi Yeniden Başlat
          </button>
        </div>
      </body>
    </html>
  );
}


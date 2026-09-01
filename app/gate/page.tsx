"use client";

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function GatePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Success! Redirect to the internal login page
        router.push('/login');
      } else {
        setError(data.error || 'Yetkisiz erişim.');
        setLoading(false);
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c1e3a] p-4 selection:bg-blue-600 selection:text-white">
      <div className="bg-[#132d54] p-8 rounded-3xl shadow-2xl shadow-black/50 border border-blue-900/50 w-full max-w-md relative overflow-hidden text-slate-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-600"></div>
        
        <div className="flex justify-center mb-6">
          <ShieldAlert size={64} className="text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-black mb-2 text-center tracking-tight">
          Sistem Koruması
        </h1>
        <p className="text-sm text-slate-400 text-center mb-8 font-medium">
          Bu sisteme yalnızca <strong className="text-white">edirnesydv@gmail.com</strong> yetkili Google hesabı ile erişim sağlanabilir.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <GoogleOAuthProvider clientId={clientId}>
          <div className="flex flex-col items-center justify-center bg-[#0c1e3a]/50 p-6 rounded-2xl border border-blue-800/40 min-h-[120px]">
            {loading ? (
              <div className="text-slate-400 font-bold animate-pulse flex flex-col items-center gap-2">
                <ShieldCheck size={24} className="text-emerald-500" />
                Doğrulanıyor...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                  setError('Google girişi başarısız oldu.');
                }}
                theme="filled_black"
                shape="pill"
                text="continue_with"
                size="large"
              />
            )}
          </div>
        </GoogleOAuthProvider>
      </div>

      {/* Hidden Superadmin Login Link for Mobile (Tap bottom right corner) */}
      <div 
        className="fixed bottom-0 right-0 w-16 h-16 opacity-0 z-50 cursor-default"
        onClick={() => router.push('/sa-login')}
        title="Sistem Yöneticisi"
      />
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { LogoImage } from '@/components/logo-image';

export default function TwoFactorVerify() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (token.length !== 6) {
      setError('Lütfen 6 haneli kodu giriniz.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error || 'Doğrulama başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50 p-4 selection:bg-red-600 selection:text-white">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl shadow-red-950/10 border border-slate-200 dark:border-slate-700 w-full max-w-md relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-800"></div>
        
        <div className="flex justify-center mb-6 mt-2">
          <ShieldCheck size={64} className="text-red-700" />
        </div>

        <h1 className="text-2xl font-black mb-2 text-center text-slate-900 dark:text-slate-100 tracking-tight">
          İki Aşamalı Doğrulama
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 font-semibold">
          Lütfen Google Authenticator uygulamanızdaki 6 haneli kodu girin.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-center">Doğrulama Kodu</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={token}
              onChange={e => setToken(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-red-500 outline-none bg-slate-50 dark:bg-slate-900"
              placeholder="000000"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm font-semibold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className="w-full flex justify-center items-center gap-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-900/20"
          >
            {loading ? 'Doğrulanıyor...' : 'Doğrula ve Giriş Yap'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}

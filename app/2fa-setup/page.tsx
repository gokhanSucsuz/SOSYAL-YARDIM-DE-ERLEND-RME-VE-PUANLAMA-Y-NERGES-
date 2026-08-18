"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2, QrCode } from 'lucide-react';
import { useDialog } from '@/components/DialogProvider';
import Image from 'next/image';

export default function TwoFactorSetup() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const { showAlert } = useDialog();

  useEffect(() => {
    // Generate QR Code on mount
    fetch('/api/auth/2fa/generate', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQrCode(data.qrCode);
          setSecret(data.secret);
        } else {
          setError(data.error || 'QR Kod oluşturulamadı.');
        }
      })
      .catch(() => setError('Ağ hatası.'))
      .finally(() => setIsGenerating(false));
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (token.length !== 6) {
      setError('Lütfen 6 haneli kodu giriniz.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();

      if (res.ok) {
        await showAlert('2FA başarıyla aktifleştirildi!', 'success');
        router.push('/settings'); // Redirect to settings or home
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 selection:bg-blue-600 selection:text-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-950/10 border border-slate-200 w-full max-w-md relative overflow-hidden text-slate-900">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800"></div>
        
        <div className="flex justify-center mb-4 mt-2">
          <QrCode size={48} className="text-blue-700" />
        </div>

        <h1 className="text-2xl font-black mb-2 text-center text-slate-900 tracking-tight">
          İki Aşamalı Doğrulama Kurulumu
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6 font-medium">
          Google Authenticator uygulamanızla aşağıdaki QR kodu okutun.
        </p>

        {isGenerating ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <div className="flex flex-col items-center mb-6">
            {qrCode ? (
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
                <Image src={qrCode} alt="QR Code" width={200} height={200} />
              </div>
            ) : null}
            {secret && (
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Kurulum Anahtarı (Manuel giriş için):</p>
                <code className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md font-mono text-sm border border-slate-200 select-all">
                  {secret}
                </code>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 text-center">Uygulamadaki Kodu Girin</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={token}
              onChange={e => setToken(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              placeholder="000000"
              required
              disabled={isGenerating || !qrCode}
            />
          </div>

          {error && <p className="text-red-600 text-sm font-semibold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading || token.length !== 6 || isGenerating || !qrCode}
            className="w-full flex justify-center items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
          >
            {loading ? 'Doğrulanıyor...' : 'Aktifleştir'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}

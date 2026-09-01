"use client";

import { useState } from 'react';
import { Mail, ArrowLeft, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoImage } from '@/components/logo-image';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Şifre sıfırlama talimatları gönderildi.');
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      } else {
        setError(data.error || 'İşlem başarısız');
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-primary-900/10 border border-slate-200 dark:border-slate-700 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-600"></div>
        
        <div className="flex justify-center mb-6">
          <LogoImage className="w-16 h-16 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 object-cover" />
        </div>

        <h1 className="text-xl font-black mb-2 text-center text-slate-800 dark:text-slate-200">Şifremi Unuttum</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 font-medium leading-relaxed">
          Sisteme kayıtlı e-posta adresinizi girin. Size tek kullanımlık geçici bir giriş şifresi göndereceğiz.
        </p>

        {message ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="text-emerald-500" size={48} />
            </div>
            <h3 className="font-bold text-emerald-800 text-lg">E-posta Gönderildi</h3>
            <p className="text-sm text-emerald-600 font-medium">{message}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">Giriş sayfasına yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">E-Posta Adresiniz</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                  placeholder="isim@sydv.gov.tr"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl flex items-center gap-2">
                <ShieldAlert size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Gönderiliyor...' : (
                <>
                  <Send size={18} />
                  <span>Geçici Şifre İste</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors">
            <ArrowLeft size={16} />
            <span>Giriş Ekranına Dön</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

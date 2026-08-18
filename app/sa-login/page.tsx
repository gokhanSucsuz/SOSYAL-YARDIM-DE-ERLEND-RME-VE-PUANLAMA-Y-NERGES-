"use client";

export const dynamic = "force-dynamic";

import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { LogoImage } from '@/components/logo-image';
import Link from 'next/link';

export default function SuperAdminLogin() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/sa-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          router.push('/2fa-verify');
        } else {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          router.push('/');
        }
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 relative p-4 py-12 selection:bg-amber-600 selection:text-white">
      <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl shadow-black/50 border border-slate-700 w-full max-w-md relative overflow-hidden text-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700"></div>
        
        <div className="flex justify-center mb-6 mt-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <LogoImage className="relative w-20 h-20 rounded-2xl shadow-xl border-2 border-slate-700 object-cover bg-white" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black mb-2 text-center text-white tracking-tight flex items-center justify-center gap-2">
          <ShieldAlert className="text-amber-500" /> Sistem Yönetimi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 text-center mb-8 font-semibold">
          Kritik Erişim Portalı
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Yönetici E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="E-posta adresiniz"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-slate-300">Şifre</label>
              <Link href="/forgot-password" className="text-[11px] font-bold text-amber-500 hover:text-amber-400 underline">Şifremi Unuttum</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-600 bg-slate-900 text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="İlk giriş için boş bırakın"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Sisteme ilk defa giriyorsanız şifre kısmını boş bırakıp ilerleyin.</p>
          </div>

          {error && <p className="text-red-400 text-sm font-semibold text-center bg-red-950/50 py-2 rounded-lg border border-red-900/50">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-xl transition-colors shadow-lg bg-amber-600 hover:bg-amber-700 shadow-amber-900/20 mt-4"
          >
            {loading ? 'Giriş yapılıyor...' : 'Yetkili Girişi'}
          </button>
        </form>
      </div>
    </div>
  );
}

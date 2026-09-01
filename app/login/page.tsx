"use client";

export const dynamic = "force-dynamic";

import { useRouter } from 'next/navigation';
import { User, ShieldCheck, Download, Smartphone, ChevronUp, Info, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstallPwaModal } from '@/components/install-pwa-modal';
import { LogoImage } from '@/components/logo-image';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personnel' | 'manager'>('manager');
  
  // Install states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  // Auth states
  const [users, setUsers] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState('edirnesydv@gmail.com'); // default for manager
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Setup state
  const [needsSetup, setNeedsSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Check if there is a session already
    fetch('/api/auth/me').then(res => {
      if (res.ok) {
        res.json().then(data => {
          if (data.user?.needsSetup) {
            setNeedsSetup(true);
          } else if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            router.push('/');
          }
        });
      }
    });

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, [router]);

  useEffect(() => {
    if (activeTab === 'personnel') {
      fetch('/api/users').then(res => res.json()).then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
          if (data.length > 0) setSelectedEmail(data[0].email);
        }
      });
    } else {
      setSelectedEmail('edirnesydv@gmail.com');
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail, password })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          router.push('/2fa-verify');
        } else if (data.needs2FASetup) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          router.push('/2fa-setup');
        } else {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          if (data.needsSetup) {
            setNeedsSetup(true);
          } else {
            router.push('/');
          }
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

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error || 'Şifre belirlenemedi');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') setDeferredPrompt(null);
          else setIsInstallModalOpen(true);
        }).catch(() => setIsInstallModalOpen(true));
      } catch (err) { setIsInstallModalOpen(true); }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  if (needsSetup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl shadow-primary-950/10 border border-slate-200 dark:border-slate-700 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <ShieldCheck size={64} className="text-primary-700" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-center text-slate-900 dark:text-slate-100">Güvenlik: Şifre Belirleme</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Sisteme ilk kez giriş yapıyorsunuz. Güvenliğiniz için lütfen yeni bir şifre belirleyin.</p>
          
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Yeni Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="En az 6 karakter"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            {error && <p className="text-rose-600 text-sm font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Kaydediliyor...' : 'Şifreyi Kaydet ve Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50 relative p-4 py-12 selection:bg-primary-600 selection:text-white">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl shadow-primary-950/10 border border-slate-200 dark:border-slate-700 w-full max-w-md relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-800 via-amber-500 to-primary-700"></div>
        
        <div className="flex justify-center mb-6 mt-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-700 to-primary-900 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <LogoImage className="relative w-20 h-20 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 object-cover" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black mb-2 text-center text-slate-900 dark:text-slate-100 tracking-tight">
          T.C. SYDV Otomasyonu
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mb-6 font-semibold">
          Güvenli Oturum Açma Portalı
        </p>

        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('manager')}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'manager' ? 'bg-white dark:bg-slate-800 text-primary-700 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
          >
            <ShieldCheck size={16} /> Müdür
          </button>
          <button
            onClick={() => setActiveTab('personnel')}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'personnel' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
          >
            <User size={16} /> Personel
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {activeTab === 'manager' ? (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">E-Posta (Sabit)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={selectedEmail}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Personel Seçiniz</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={selectedEmail}
                  onChange={e => setSelectedEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-slate-800 font-medium"
                  required
                >
                  {users.length === 0 && <option value="">Sistemde kayıtlı personel yok</option>}
                  {users.map(u => (
                    <option key={u.id} value={u.email}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Şifre {activeTab === 'manager' && <span className="text-xs text-slate-400 font-normal">(İlk girişte boş bırakın)</span>}
              </label>
              <Link href="/forgot-password" className="text-[11px] font-bold text-primary-600 hover:text-primary-700 underline">Şifremi Unuttum</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Şifreniz"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {error && <p className="text-rose-600 text-sm font-semibold text-center bg-rose-50 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading || (activeTab === 'personnel' && users.length === 0)}
            className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-lg ${
              activeTab === 'manager' ? 'bg-primary-700 hover:bg-primary-800 shadow-primary-900/20' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
            }`}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>

      {/* Detailed App Install Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 dark:border-slate-700 w-full max-w-md mt-6 relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 text-primary-700 p-2.5 rounded-xl"><Smartphone size={22} /></div>
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Mobil Uygulamayı Yükle</h2>
          </div>
          <button onClick={() => setShowInstallHelp(!showInstallHelp)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
            {showInstallHelp ? <ChevronUp size={22} /> : <Info size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {showInstallHelp && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-2 pb-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed font-medium">Bu sistemi telefonunuza veya tabletinize PWA olarak yükleyebilirsiniz.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={handleInstallClick} className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white p-4 rounded-2xl font-bold transition-all shadow-md mt-2">
          <Download size={20} /> Hemen Yükle
        </button>
      </div>
      <InstallPwaModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} deferredPrompt={deferredPrompt} />

      {/* Hidden Superadmin Login Link for Mobile (Tap bottom right corner) */}
      <div 
        className="fixed bottom-0 right-0 w-16 h-16 opacity-0 z-50 cursor-default"
        onClick={() => router.push('/sa-login')}
        title="Sistem Yöneticisi"
      />
    </div>
  );
}

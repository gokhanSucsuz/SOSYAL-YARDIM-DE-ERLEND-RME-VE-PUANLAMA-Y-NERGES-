"use client";
/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";

import { useRouter } from 'next/navigation';
import { User, Smartphone, Download, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { InstallPwaModal } from '@/components/install-pwa-modal';
import { LogoImage } from '@/components/logo-image';

export default function Login() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleLogin = (role: 'personnel' | 'manager', name: string, id: string) => {
    localStorage.setItem('currentUser', JSON.stringify({ id, name, role }));
    router.push('/');
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            setDeferredPrompt(null);
          } else {
            setIsInstallModalOpen(true);
          }
        }).catch(() => {
          setIsInstallModalOpen(true);
        });
      } catch (err) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative p-4 selection:bg-red-600 selection:text-white">
      {/* Mobile App Download Floating Button */}
      <button 
        onClick={handleInstallClick}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all font-bold text-xs sm:text-sm active:scale-95 z-10 border border-red-500"
      >
        <Smartphone size={18} />
        <span className="hidden sm:inline">Mobil Sürümü İndir</span>
        <span className="sm:hidden">Uygulamayı Yükle</span>
        <Download size={14} className="ml-1 opacity-80" />
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-red-950/10 border border-slate-200 w-full max-w-md relative overflow-hidden text-slate-900">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-800"></div>
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6 mt-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <LogoImage 
              className="relative w-20 h-20 rounded-2xl shadow-xl border-2 border-slate-200 object-cover" 
            />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black mb-2 text-center text-slate-900 tracking-tight">
          T.C. SYDV Sosyal İnceleme Puanlama Sistemi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-8 font-semibold">
          Sosyal Adalet ve Nesnel İnceleme Otomasyonu
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleLogin('personnel', 'Sosyal Yardım ve İnceleme Görevlisi', 'p1')}
            className="w-full flex items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-red-500 hover:bg-red-50/50 hover:shadow-lg hover:shadow-red-900/10 transition-all group text-left active:scale-[0.98]"
          >
            <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-xl group-hover:bg-red-700 group-hover:text-white transition-colors mr-4 shrink-0 shadow-sm">
              <User size={22} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-red-700">Personel Girişi</p>
              <p className="text-xs text-slate-500 group-hover:text-slate-600">Sosyal Yardım ve İnceleme Görevlisi</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleLogin('manager', 'Vakıf Müdürü', 'm1')}
            className="w-full flex items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-red-700 hover:bg-red-50/50 hover:shadow-lg hover:shadow-red-900/10 transition-all group text-left active:scale-[0.98]"
          >
            <div className="bg-red-800 text-white border border-red-900 p-3 rounded-xl group-hover:bg-red-900 transition-colors mr-4 shrink-0 shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-red-800">Müdür Girişi</p>
              <p className="text-xs text-slate-500 group-hover:text-slate-600">Vakıf Müdürü Yetkilisi</p>
            </div>
          </button>
        </div>
      </div>

      <InstallPwaModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
        deferredPrompt={deferredPrompt} 
      />
    </div>
  );
}

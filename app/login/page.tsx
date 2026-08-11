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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative p-4 selection:bg-blue-600 selection:text-white">
      {/* Mobile App Download Floating Button */}
      <button 
        onClick={handleInstallClick}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all font-bold text-xs sm:text-sm active:scale-95 z-10 border border-blue-400/30"
      >
        <Smartphone size={18} />
        <span className="hidden sm:inline">Mobil Sürümü İndir</span>
        <span className="sm:hidden">Uygulamayı Yükle</span>
        <Download size={14} className="ml-1 opacity-80" />
      </button>

      <div className="bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl shadow-blue-950/80 border border-slate-800 w-full max-w-md relative overflow-hidden text-slate-100">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6 mt-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <LogoImage 
              className="relative w-20 h-20 rounded-2xl shadow-xl border-2 border-slate-700 object-cover" 
            />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black mb-2 text-center bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
          Sosyal İnceleme Puanlama Sistemi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 text-center mb-8 font-semibold">
          Saha Araştırmaları ve Yardım Kriterleri Yönetimi
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleLogin('personnel', 'Sosyal Yardım ve İnceleme Görevlisi', 'p1')}
            className="w-full flex items-center p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl hover:border-blue-500 hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-900/20 transition-all group text-left active:scale-[0.98]"
          >
            <div className="bg-blue-600/20 text-blue-400 border border-blue-500/30 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors mr-4 shrink-0 shadow-sm">
              <User size={22} />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm sm:text-base group-hover:text-blue-300">Personel Girişi</p>
              <p className="text-xs text-slate-400 group-hover:text-slate-300">Sosyal Yardım ve İnceleme Görevlisi</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleLogin('manager', 'Vakıf Müdürü', 'm1')}
            className="w-full flex items-center p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl hover:border-amber-500 hover:bg-slate-800 hover:shadow-xl hover:shadow-amber-900/20 transition-all group text-left active:scale-[0.98]"
          >
            <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 p-3 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors mr-4 shrink-0 shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm sm:text-base group-hover:text-amber-300">Müdür Girişi</p>
              <p className="text-xs text-slate-400 group-hover:text-slate-300">Vakıf Müdürü Yetkilisi</p>
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

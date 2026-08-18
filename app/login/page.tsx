"use client";

export const dynamic = "force-dynamic";

import { useRouter } from 'next/navigation';
import { User, Smartphone, Download, ShieldCheck, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InstallPwaModal } from '@/components/install-pwa-modal';
import { LogoImage } from '@/components/logo-image';

export default function Login() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 relative p-4 py-12 selection:bg-red-600 selection:text-white">
      
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

      {/* Detailed App Install Section */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 w-full max-w-md mt-6 relative overflow-hidden text-slate-900">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 p-2.5 rounded-xl">
              <Smartphone size={22} />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Mobil Uygulamayı Yükle</h2>
          </div>
          <button 
            onClick={() => setShowInstallHelp(!showInstallHelp)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Nasıl Yüklenir?"
          >
            {showInstallHelp ? <ChevronUp size={22} /> : <Info size={22} />}
          </button>
        </div>
        
        <AnimatePresence>
          {showInstallHelp && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-2">
                <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                  Bu sistemi telefonunuza veya tabletinize bir mobil uygulama (PWA) olarak yükleyebilirsiniz. Kurulum tamamlandığında ana ekranınıza uygulamanın ikonu eklenir ve tarayıcı sekmelerinden bağımsız, tam ekran, daha hızlı bir şekilde çalışır.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 shrink-0 bg-white shadow-sm w-6 h-6 flex items-center justify-center rounded-full text-xs">1</div>
                    <div>
                      Aşağıdaki <strong className="text-slate-800">&quot;Hemen Yükle&quot;</strong> butonuna basın veya tarayıcınızın sağ üst köşesindeki üç nokta (⋮) menüsünden <strong className="text-slate-800">&quot;Ana Ekrana Ekle&quot;</strong> (veya Uygulamayı Yükle) seçeneğini seçin.
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="font-bold text-slate-800 shrink-0 bg-white shadow-sm w-6 h-6 flex items-center justify-center rounded-full text-xs">2</div>
                    <div>
                      Ekrana gelen küçük onay penceresinde <strong className="text-slate-800">&quot;Yükle&quot;</strong> butonuna dokunun. Kurulum saniyeler içinde tamamlanacaktır.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-md shadow-blue-900/10 mt-2"
        >
          <Download size={20} />
          Hemen Yükle
        </button>
      </div>

      <InstallPwaModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
        deferredPrompt={deferredPrompt} 
      />
    </div>
  );
}

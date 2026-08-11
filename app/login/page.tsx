"use client";
"use client";

export const dynamic = "force-dynamic";


import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Smartphone, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleLogin = (role: 'personnel' | 'manager', name: string, id: string) => {
    localStorage.setItem('currentUser', JSON.stringify({ id, name, role }));
    router.push('/');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("Cihazınızda / Tarayıcınızda 'Ana Ekrana Ekle' (Mobil Uygulama Olarak Yükle) özelliği kullanılamıyor veya zaten yüklü. Lütfen tarayıcı menüsünden 'Ana Ekrana Ekle' seçeneğini kullanın.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative p-4">
      {/* Mobile App Download Floating Button */}
      <button 
        onClick={handleInstallClick}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all font-semibold text-sm active:scale-95"
      >
        <Smartphone size={18} />
        <span className="hidden sm:inline">Mobil Sürümü İndir</span>
        <span className="sm:hidden">Uygulama İndir</span>
        <Download size={14} className="ml-1 opacity-70" />
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="flex justify-center mb-6 mt-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-md shadow-blue-900/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2 text-center text-slate-800 tracking-tight">Sosyal İnceleme Puanlama Sistemi ve Yardım Kriterleri</h1>
        <p className="text-sm text-slate-500 text-center mb-8">Test hesabı seçerek giriş yapın</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleLogin('personnel', 'Sosyal Yardım ve İnceleme Görevlisi', 'p1')}
            className="w-full flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md transition-all group text-left active:scale-[0.98]"
          >
            <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors mr-4 text-slate-500 shadow-sm">
              <User size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-800 group-hover:text-blue-900">Personel Girişi</p>
              <p className="text-[13px] text-slate-500 group-hover:text-blue-700">Sosyal Yardım ve İnceleme Görevlisi</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleLogin('manager', 'Vakıf Müdürü', 'm1')}
            className="w-full flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50/50 hover:shadow-md transition-all group text-left active:scale-[0.98]"
          >
            <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors mr-4 text-slate-500 shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-800 group-hover:text-amber-900">Müdür Girişi</p>
              <p className="text-[13px] text-slate-500 group-hover:text-amber-700">Vakıf Müdürü Yetkilisi</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, MoreVertical, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export function InstallPwaModal({ isOpen, onClose, deferredPrompt }: InstallPwaModalProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent;
      setIsIOS(/iPhone|iPad|iPod/i.test(ua));
      
      const inStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      setIsStandalone(inStandaloneMode);

      setIsIframe(window.self !== window.top);
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          onClose();
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIframe) {
      window.open(window.location.href, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-950/50 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-slate-800 p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Sosyal İnceleme Logo" 
              className="w-12 h-12 rounded-2xl shadow-md border-2 border-blue-400/30 object-cover shrink-0" 
            />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-1.5">
                <span>Mobil Uygulama Kurulumu</span>
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-blue-300 font-medium">Sosyal Yardım &amp; İnceleme Sistemi</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {isStandalone ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-2">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-200 text-base">Uygulama Zaten Yüklü!</h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Bu sistem cihazınıza uygulama olarak başarıyla kurulmuştur. Telefonunuzun ana ekranından doğrudan simgeye dokunarak çalıştırabilirsiniz.
              </p>
            </div>
          ) : (
            <>
              {/* If deferredPrompt available */}
              {deferredPrompt && (
                <div className="bg-blue-950/60 border border-blue-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left space-y-1">
                    <p className="font-bold text-sm text-blue-200">Otomatik Kurulum Hazır</p>
                    <p className="text-xs text-blue-300/80">Tek tıkla telefonunuza mobil uygulama olarak yükleyin.</p>
                  </div>
                  <button
                    onClick={handleNativeInstall}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 shrink-0 transition-all active:scale-95"
                  >
                    <Download size={16} />
                    <span>Şimdi Yükle</span>
                  </button>
                </div>
              )}

              {/* If in iframe (Preview Window) */}
              {isIframe && !deferredPrompt && (
                <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                  <p className="text-xs text-amber-200 font-semibold leading-relaxed">
                    💡 <strong>Not:</strong> Önizleme penceresi içerisinden doğrudan yükleme bazı tarayıcılarda kısıtlanabilir. Uygulamayı harici bir sekmede açarak hızlıca ana ekrana ekleyebilirsiniz.
                  </p>
                  <button
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ExternalLink size={15} />
                    <span>Harici Sekmede Aç ve Yükle</span>
                  </button>
                </div>
              )}

              {/* Manual Step-by-Step Instructions based on OS */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Smartphone size={16} className="text-blue-400" />
                  <span>{isIOS ? 'iOS (iPhone / iPad) Yükleme Adımları' : 'Android / Chrome Yükleme Adımları'}</span>
                </h4>

                {isIOS ? (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20">1</div>
                      <p className="pt-1">Safari tarayıcınızın alt veya üst barında bulunan <strong>Paylaş (<Share size={14} className="inline mx-1 text-blue-400" />)</strong> butonuna dokunun.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20">2</div>
                      <p className="pt-1">Açılan paylaşım menüsünü aşağı kaydırıp <strong>&quot;Ana Ekrana Ekle&quot; (<PlusSquare size={14} className="inline mx-1 text-blue-400" />)</strong> seçeneğine tıklayın.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20">3</div>
                      <p className="pt-1">Sağ üstteki <strong>&quot;Ekle&quot;</strong> butonuna basarak uygulamayı telefon ana ekranınızda kullanmaya başlayın.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20">1</div>
                      <p className="pt-1">Chrome / tarayıcınızın sağ üst köşesindeki <strong>Üç Nokta (<MoreVertical size={14} className="inline mx-1 text-blue-400" />)</strong> menüsüne dokunun.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20">2</div>
                      <p className="pt-1">Menüdeki <strong>&quot;Uygulamayı Yükle&quot;</strong> veya <strong>&quot;Ana Ekrana Ekle&quot;</strong> seçeneğini seçin.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20">3</div>
                      <p className="pt-1">Açılan pencerede <strong>&quot;Yükle&quot;</strong> butonunu onaylayarak mobil uygulamayı cihazınıza kurun.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">v1.2 Mobil PWA Sürümü</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

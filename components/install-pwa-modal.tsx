"use client";
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, MoreVertical, CheckCircle2, ExternalLink, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { LogoImage } from './logo-image';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export function InstallPwaModal({ isOpen, onClose, deferredPrompt }: InstallPwaModalProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [installResult, setInstallResult] = useState<'idle' | 'accepted' | 'dismissed'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent;
      setIsIOS(/iPhone|iPad|iPod/i.test(ua));
      setIsAndroid(/Android/i.test(ua));

      const inStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(inStandaloneMode);

      setIsIframe(window.self !== window.top);
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallResult('accepted');
          setTimeout(() => onClose(), 2000);
        } else {
          setInstallResult('dismissed');
        }
      } catch (err) {
        console.error('Kurulum prompt hatası:', err);
        setInstallResult('dismissed');
      }
    } else if (isIframe) {
      window.open(window.location.href, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-950/50 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/60 to-blue-800/60 border-b border-slate-800 p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoImage
              className="w-12 h-12 rounded-2xl shadow-md border-2 border-blue-400/30 object-cover shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-1.5">
                <span>Uygulamayı Ana Ekrana Ekle</span>
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-blue-300 font-medium">Sosyal Yardım &amp; İnceleme Sistemi — PWA</p>
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
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">

          {/* Zaten kurulu */}
          {isStandalone ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-2">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-200 text-base">Uygulama Zaten Kurulu!</h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Sistem cihazınıza başarıyla kurulmuştur. Ana ekrandan simgeye dokunarak açabilirsiniz.
              </p>
            </div>

          ) : installResult === 'accepted' ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-2">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-200 text-base">Kurulum Başarılı!</h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Uygulama ana ekranınıza eklendi. Artık internet olmadan da erişebilirsiniz.
              </p>
            </div>

          ) : (
            <>
              {/* Ne Nedir — Bilgilendirme */}
              <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl text-xs text-slate-300 space-y-1.5">
                <p className="font-bold text-white text-sm">📱 Bu bir PWA&apos;dir (Web Uygulaması)</p>
                <p className="leading-relaxed text-slate-400">
                  Bu sistem, tarayıcı üzerinden ana ekrana eklenen bir <strong className="text-slate-200">Progressive Web App (PWA)</strong>&apos;dır.
                  APK veya Play Store üzerinden indirilmez — Chrome menüsü ile kurulur ve tam ekran, uygulama gibi çalışır.
                </p>
              </div>

              {/* Otomatik kurulum butonu (deferredPrompt geldiğinde) */}
              {deferredPrompt && (
                <div className="bg-blue-950/60 border border-blue-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left space-y-1">
                    <p className="font-bold text-sm text-blue-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      Otomatik Kurulum Hazır!
                    </p>
                    <p className="text-xs text-blue-300/80">Chrome, cihazınıza kurmaya hazır. Aşağıdaki butona tıklayın.</p>
                  </div>
                  <button
                    onClick={handleNativeInstall}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 shrink-0 transition-all active:scale-95"
                  >
                    <Download size={16} />
                    <span>Ana Ekrana Ekle</span>
                  </button>
                </div>
              )}

              {/* Önce iFrame'den çıkış gerekiyorsa */}
              {isIframe && !deferredPrompt && (
                <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                  <p className="text-xs text-amber-300 font-extrabold flex items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0" />
                    Önizleme Modundasınız!
                  </p>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    PWA kurulumu için uygulamayı <strong>harici Chrome sekmesinde</strong> açmanız gerekir. Aşağıdaki butona tıklayın:
                  </p>
                  <button
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <ExternalLink size={16} />
                    <span>Harici Chrome&apos;da Aç</span>
                  </button>
                </div>
              )}

              {/* dismissal uyarısı */}
              {installResult === 'dismissed' && (
                <div className="bg-orange-950/40 border border-orange-500/30 p-4 rounded-2xl text-xs text-orange-200/90 space-y-1">
                  <p className="font-bold text-orange-300">Kurulum iptal edildi.</p>
                  <p>Manuel olarak kurmak için aşağıdaki adımları izleyebilirsiniz.</p>
                </div>
              )}

              {/* Manuel kurulum adımları */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Smartphone size={16} className="text-blue-400" />
                  <span>
                    {isIOS
                      ? 'iOS (Safari) — Manuel Kurulum Adımları'
                      : 'Android (Chrome) — Manuel Kurulum Adımları'}
                  </span>
                </h4>

                {isIOS ? (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20 min-w-[32px] text-center">1</div>
                      <p className="pt-1">
                        Safari tarayıcısında bu sayfayı açın. Alt veya üst barda bulunan{' '}
                        <strong>Paylaş (<Share size={13} className="inline mx-1 text-blue-400" />)</strong> simgesine dokunun.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20 min-w-[32px] text-center">2</div>
                      <p className="pt-1">
                        Açılan menüde aşağı kaydırarak{' '}
                        <strong>&quot;Ana Ekrana Ekle&quot; (<PlusSquare size={13} className="inline mx-1 text-blue-400" />)</strong> seçeneğine dokunun.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20 min-w-[32px] text-center">3</div>
                      <p className="pt-1">Sağ üstteki <strong>&quot;Ekle&quot;</strong> butonuna basın. Uygulama ana ekranınıza eklenir.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20 min-w-[32px] text-center">1</div>
                      <p className="pt-1">
                        Android Chrome&apos;un sağ üst köşesindeki{' '}
                        <strong>Üç Nokta (<MoreVertical size={13} className="inline mx-1 text-blue-400" />)</strong> menüsüne dokunun.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20 min-w-[32px] text-center">2</div>
                      <p className="pt-1">
                        <strong>&quot;Uygulamayı yükle&quot;</strong> veya{' '}
                        <strong>&quot;Ana ekrana ekle&quot;</strong> seçeneğine dokunun.{' '}
                        <span className="text-amber-300">(Kısayol ekle değil, uygulama olarak yükleyin!)</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl shrink-0 font-bold border border-blue-500/20 min-w-[32px] text-center">3</div>
                      <p className="pt-1">
                        Açılan onay penceresinde <strong>&quot;Yükle&quot;</strong> butonuna basın.
                        Uygulama telefon ana ekranınıza bağımsız uygulama olarak kurulur.
                      </p>
                    </div>
                    {isAndroid && !deferredPrompt && (
                      <div className="mt-3 bg-amber-950/30 border border-amber-700/40 p-3 rounded-xl text-amber-200/80 space-y-1">
                        <p className="font-bold text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle size={14} className="shrink-0" />
                          &quot;Uygulamayı yükle&quot; seçeneği görünmüyorsa:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
                          <li>Chrome tarayıcısını kullandığınızdan emin olun (Firefox/Samsung Internet değil).</li>
                          <li>Siteyi daha önce reddettiyseniz Chrome 90 gün bu seçeneği gizler — üç noktadan &quot;Ana ekrana ekle&quot;yi deneyin.</li>
                          <li>Adres çubuğunun solundaki <strong>🔒 kilit ikonuna</strong> dokunup &quot;Uygulamayı yükle&quot; seçeneğini kontrol edin.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              if (window.caches) {
                caches.keys().then((names) => {
                  for (let name of names) caches.delete(name);
                });
              }
              window.location.reload();
            }}
            className="text-slate-500 dark:text-slate-400 hover:text-white underline decoration-slate-700 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Önbelleği Temizle &amp; Yenile
          </button>
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

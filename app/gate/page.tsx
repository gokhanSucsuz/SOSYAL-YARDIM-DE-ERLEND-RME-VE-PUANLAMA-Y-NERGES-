"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  Lock,
  Landmark,
  ClipboardCheck,
  BarChart3,
  Printer,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function GatePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Yetkisiz erişim.");
        setLoading(false);
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 sm:p-6 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-800/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT 5 COLUMNS */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo-sydv.jpg"
                  alt="T.C. SYDV Logo"
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-amber-400/60 shadow-lg shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    T.C. Valilik / Kaymakamlık
                  </span>
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase leading-snug">
                    Sosyal Yardımlaşma ve Dayanışma Vakfı
                  </h1>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/90 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sosyal Yardım Değerlendirme ve Puanlama Sistemi</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Sosyal inceleme ve hane ziyaretlerinde objektif kriterlere dayalı puanlama yapılması ve Mütevelli Heyeti değerlendirme raporlarının üretilmesi için kurumsal çalışma alanı.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Yönerge Bazlı Puanlama:</strong> Standart kriterlerle adil ve şeffaf muhtaçlık değerlendirmesi.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <BarChart3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Hane Analizi:</strong> Geçmiş inceleme ve puanlama kayıtlarını karşılaştırmalı izleme.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Printer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Resmi Raporlama:</strong> Kurul sunumu ve PDF/Excel rapor çıktıları.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AES-256 Şifreli Veri
              </span>
              <span>•</span>
              <span>Kayıtlı Denetim İzi</span>
            </div>
          </div>

          {/* RIGHT 7 COLUMNS */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white text-slate-900 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                    Kurumsal Google Kapısı
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Personel girişine devam etmek için yetkili kurum hesabınızı doğrulayınız.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 uppercase shrink-0">
                  <Lock className="w-3 h-3 text-blue-700" />
                  Yetkili Erişim
                </span>
              </div>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      Kurumsal Hesap Doğrulaması
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bu sisteme yalnızca yetkilendirilmiş kurumsal Google hesabı ile erişim sağlanabilir.
                    </p>
                  </div>
                </div>

                <GoogleOAuthProvider clientId={clientId}>
                  <div className="flex flex-col items-center justify-center bg-white p-5 rounded-xl border border-slate-200 min-h-[104px]">
                    {loading ? (
                      <div className="text-slate-700 text-xs font-bold uppercase flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <span>Doğrulanıyor...</span>
                      </div>
                    ) : (
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => {
                          setError("Google girişi başarısız oldu.");
                        }}
                        theme="filled_blue"
                        shape="rectangular"
                        text="continue_with"
                        size="large"
                      />
                    )}
                  </div>
                </GoogleOAuthProvider>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Süper Admin Yönetim Paneli
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Doğrudan sistem yöneticisi kimlik doğrulaması
                  </p>
                </div>
              </div>

              <Link
                href="/sa-login"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-4 py-2 rounded-lg font-bold text-xs uppercase whitespace-nowrap transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Yönetici Girişi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

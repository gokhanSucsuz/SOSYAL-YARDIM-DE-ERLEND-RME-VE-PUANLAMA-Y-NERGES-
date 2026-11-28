"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Landmark,
  ClipboardCheck,
  BarChart3,
  Printer,
  Users,
  ChevronLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SuperAdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/sa-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          router.push("/2fa-verify");
        } else if (data.needs2FASetup) {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          router.push("/2fa-setup");
        } else {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          router.push("/");
        }
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch {
      setError("Bir hata oluştu");
    } finally {
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
                  <span>Puanlama Sistemi • Süper Admin Portalı</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Yönerge puanlama parametrelerinin, personel yetkilerinin, 2FA güvenlik politikalarının ve denetim kayıtlarının yönetildiği yüksek yetkili alan.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Puanlama Parametreleri:</strong> Sosyal inceleme kriter ağırlıklarını ve eşik değerlerini yönetme.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <BarChart3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Personel & Güvenlik:</strong> Kullanıcı hesaplarını ve iki faktörlü doğrulama ayarlarını yapılandırma.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Printer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Denetim Kayıtları:</strong> Tüm puanlama ve veri güncellemelerini izleme.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AES-256 Şifreli Veri & 2FA
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
                    Süper Admin Girişi
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Kritik sistem yönetimi için yönetici bilgilerinizi doğrulayın.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 uppercase shrink-0">
                  <Shield className="w-3 h-3 text-amber-600" />
                  Yüksek Yetki
                </span>
              </div>

              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="puan-sa-email"
                      className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Yönetici E-Posta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        id="puan-sa-email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        spellCheck={false}
                        enterKeyHint="next"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15 outline-none"
                        placeholder="E-posta adresiniz"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="puan-sa-pass"
                        className="block text-[11px] font-bold uppercase tracking-wider text-slate-700"
                      >
                        Şifre
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-bold text-blue-700 hover:underline"
                      >
                        Şifremi Unuttum
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input
                        id="puan-sa-pass"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        enterKeyHint="done"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15 outline-none"
                        placeholder="İlk giriş için boş bırakın"
                      />
                      <button
                        type="button"
                        aria-pressed={showPassword}
                        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Sisteme ilk defa giriyorsanız şifre alanını boş bırakıp ilerleyebilirsiniz.
                    </p>
                  </div>

                  {error && (
                    <p className="text-red-700 text-xs font-bold bg-red-50 border border-red-200 p-2.5 rounded-xl">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Giriş Yapılıyor...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Süper Admin Girişi Yap</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Personel & Müdür Giriş Ekranı
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Standart değerlendirme oturumu açmak için geri dönün
                  </p>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2 rounded-lg font-bold text-xs uppercase whitespace-nowrap transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Personel Girişi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

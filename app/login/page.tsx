"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import {
  User,
  Users,
  Shield,
  ShieldCheck,
  Download,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Landmark,
  ClipboardCheck,
  BarChart3,
  Printer,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { InstallPwaModal } from "@/components/install-pwa-modal";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"personnel" | "manager">("personnel");

  // Install states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Auth states
  const [users, setUsers] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("edirnesydv@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Setup state
  const [needsSetup, setNeedsSetup] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Google Login setting
  const [isGoogleLoginEnabled, setIsGoogleLoginEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (data.user?.needsSetup) {
            setNeedsSetup(true);
          } else if (data.user) {
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            router.push("/");
          }
        });
      }
    });

    fetch("/api/settings/google-login")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isGoogleLoginEnabled === "boolean") {
          setIsGoogleLoginEnabled(data.isGoogleLoginEnabled);
        }
      })
      .catch(() => {});

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, [router]);

  useEffect(() => {
    if (activeTab === "personnel") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUsers(data);
            if (data.length > 0) setSelectedEmail(data[0].email);
          }
        });
    } else {
      setSelectedEmail("edirnesydv@gmail.com");
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedEmail, password }),
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
          if (data.needsSetup) {
            setNeedsSetup(true);
          } else {
            router.push("/");
          }
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

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Şifre belirlenemedi");
      }
    } catch {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        deferredPrompt.userChoice
          .then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") setDeferredPrompt(null);
            else setIsInstallModalOpen(true);
          })
          .catch(() => setIsInstallModalOpen(true));
      } catch {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle GovTech Background Grid */}
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
          {/* LEFT 5 COLUMNS: OFFICIAL INSTITUTION BRANDING & CAPABILITIES */}
          <div className="lg:col-span-5 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="space-y-6">
              {/* Logo & Institution Name */}
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

              {/* Official Description */}
              <div className="pt-4 border-t border-slate-800/90 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sosyal Yardım Değerlendirme ve Puanlama Sistemi</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Sosyal inceleme ve hane ziyaretlerinde yönerge kriterlerine dayalı objektif puanlama yapılması, muhtaçlık derecesinin hesaplanması ve Mütevelli Heyeti değerlendirme formlarının üretilmesi için kurumsal çalışma alanı.
                </p>
              </div>

              {/* Key System Capabilities List */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Yönerge Bazlı Objektif Puanlama:</strong> Gelir, barınma, sağlık ve hane halkı kriterlerine göre standartlaştırılmış çok adımlı puan hesaplama.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <BarChart3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Hane İnceleme & Karşılaştırma:</strong> Değerlendirme sihirbazı ile aktif ve geçmiş inceleme dosyalarını anlık analiz etme.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Printer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Heyet Sunum & Resmi Çıktı:</strong> Puanlama sonuçlarını standart PDF/Excel raporlarına ve heyet sunum ekranına aktarma.
                  </span>
                </div>
              </div>
            </div>

            {/* Security Footer */}
            <div className="mt-8 pt-4 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AES-256 Şifreli Veri & 2FA
              </span>
              <span>•</span>
              <span>Kayıtlı Denetim İzi</span>
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: CLEAN PROFESSIONAL ACCESS PORTAL */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white text-slate-900 flex flex-col justify-between space-y-6">
            <div>
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                    {needsSetup ? "İlk Giriş Şifre Belirleme" : "Kurumsal Oturum Açma"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {needsSetup
                      ? "Güvenliğiniz için devam etmeden önce yeni bir şifre belirleyiniz."
                      : "Sosyal inceleme ve puanlama işlemlerine devam etmek için giriş yapınız."}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 uppercase shrink-0">
                  <Lock className="w-3 h-3 text-blue-700" />
                  Yetkili Erişim
                </span>
              </div>

              {/* Primary Access Card */}
              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                {needsSetup ? (
                  <form onSubmit={handleSetup} className="space-y-4">
                    <div>
                      <label
                        htmlFor="puan-setup-pass"
                        className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                      >
                        Yeni Kişisel Şifre
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input
                          id="puan-setup-pass"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none"
                          placeholder="En az 6 karakter"
                          required
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
                    </div>
                    {error && (
                      <p className="text-red-700 text-xs font-bold bg-red-50 border border-red-200 p-2.5 rounded-xl">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl transition-colors"
                    >
                      <span>{loading ? "Kaydediliyor..." : "Şifreyi Kaydet ve Giriş Yap"}</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab("personnel")}
                        className={`flex-1 flex justify-center items-center gap-1.5 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                          activeTab === "personnel"
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Vakıf Personeli</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("manager")}
                        className={`flex-1 flex justify-center items-center gap-1.5 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                          activeTab === "manager"
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Müdür Girişi</span>
                      </button>
                    </div>

                    <div className="flex items-start gap-3.5 pt-1">
                      <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 uppercase">
                            {activeTab === "manager"
                              ? "Vakıf Müdürü Oturumu"
                              : "Sosyal İnceleme Personeli"}
                          </h3>
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                            Puanlama & Analiz
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeTab === "manager"
                            ? "Tüm değerlendirme dosyalarını, istatistikleri ve kurul raporlarını yönetmek için şifrenizi girin."
                            : "Hane inceleme formları oluşturmak ve puanlama yapmak için personel hesabınızla giriş yapın."}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-3.5">
                      {activeTab === "manager" ? (
                        <div>
                          <label
                            htmlFor="puan-manager-name"
                            className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                          >
                            Yönetici Hesabı
                          </label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-700 w-4 h-4 pointer-events-none" />
                            <input
                              id="puan-manager-name"
                              type="text"
                              value="Sistem Yöneticisi (Müdür)"
                              disabled
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-sm font-bold"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="puan-personnel-select"
                            className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                          >
                            Personel Seçimi
                          </label>
                          <div className="relative">
                            <select
                              id="puan-personnel-select"
                              name="email"
                              autoComplete="username"
                              value={selectedEmail}
                              onChange={(e) => setSelectedEmail(e.target.value)}
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none appearance-none"
                              required
                            >
                              {users.length === 0 && (
                                <option value="">Sistemde kayıtlı personel yok</option>
                              )}
                              {users.map((u) => (
                                <option key={u.id} value={u.email}>
                                  {u.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="puan-password"
                            className="block text-[11px] font-bold uppercase tracking-wider text-slate-700"
                          >
                            Şifre{" "}
                            {activeTab === "manager" && (
                              <span className="text-[10px] text-slate-400 font-medium normal-case">
                                (İlk girişte boş bırakın)
                              </span>
                            )}
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
                            id="puan-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            enterKeyHint="done"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 outline-none"
                            placeholder="••••••••"
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
                      </div>

                      {error && (
                        <p className="text-red-700 text-xs font-bold bg-red-50 border border-red-200 p-2.5 rounded-xl">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading || (activeTab === "personnel" && users.length === 0)}
                        className="w-full flex items-center justify-center gap-2.5 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Giriş Yapılıyor...</span>
                          </>
                        ) : (
                          <>
                            <span>Puanlama Sistemine Giriş Yap</span>
                            <ArrowRight className="w-4 h-4 ml-auto" />
                          </>
                        )}
                      </button>
                    </form>

                    {isGoogleLoginEnabled && (
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = "/api/auth/google";
                        }}
                        className="w-full flex justify-center items-center gap-2.5 py-2.5 px-4 border border-slate-300 rounded-xl bg-white text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <span>Kurumsal Google Hesabı İle Giriş Yap</span>
                      </button>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Yönerge uyumlu otomatik puanlama
                      </span>
                      <button
                        type="button"
                        onClick={handleInstallClick}
                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <Download className="w-3 h-3" />
                        <span>Mobil Uygulamayı Yükle (PWA)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Secondary Super Admin Access Card */}
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
                    Kriter ağırlıkları, personel hesapları ve denetim kayıtları yönetimi
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

      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ChevronRight, ChevronLeft, Save, AlertTriangle, ArrowLeft, CheckCircle2, Info,
  Tv, Smartphone, Wind, Flame, Box, Shirt, Sparkles, Plug, User, MapPin, Phone, Hash, Users, Activity, Minus, Plus,
  Eye, EyeOff, Award, Banknote, TrendingUp
} from 'lucide-react';
import { saveAssessment, getAllAssessments, calculateAssistanceFromScore } from '@/lib/db';
import { SectionCard, CheckboxItem, RadioItem, ScoreButtons, CounterItem, ApplianceStatusItem } from '@/components/ui-components';
import Link from 'next/link';
import { LogoImage } from '@/components/logo-image';
import { useDialog } from '@/components/DialogProvider';
import { calculateNewSystemScore } from '@/lib/scoring';

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingId = searchParams?.get('meetingId') || undefined;
  const { showAlert } = useDialog();
  
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  const [tcHistory, setTcHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showScores, setShowScores] = useState(true); // Puan gizleme varsaylan olarak kapal (puan ve yardm ak)

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userStr));
    }
    // TC geçmiş araması için tüm kayıtları yükle
    getAllAssessments().then(res => setAllAssessments(res.data)).catch(() => {});
  }, [router]);

  const [state, setState] = useState({
    applicantName: "",
    applicantTc: "",
    applicantAddress: "",
    householdSize: 1,
    phoneNumber: "",
    householdNo: "",
    // A
    income: 0,
    noWorker: false,
    noRegularIncome: false,
    noSgk: false,
    // B
    b_agirEngelli: false,
    b_engelli: false,
    b_evdeBakim: false,
    b_kanser: false,
    b_kronik: false,
    b_yasliYalniz: false,
    b_sehitYakini: false,
    b_gazi: false,
    b_yetim: false,
    b_koruyucuAile: false,
    b_yabanciUyruklu: false,
    b_dusukEngelli: false,         // YENİ: %20-39 engel oranı (+3 puan)
    b_ozelSebepMetin: "",
    b_ozelSebepPuan: 0,            // Müdür onayıyla aktif; personel giremez
    b_ozelSebepPuanBekliyor: false, // Personel metin girdi, müdür onayı bekliyor
    b_cokluOzelDurumluBirey: false,
    // C
    c_0_6yas: 0,
    c_ilkokul: 0,
    c_ortaokul: 0,
    c_lise: 0,
    c_meslekiEgitim: 0,
    c_acikLise: 0,
    c_uni: 0,
    // D - Barınma (Genişletilmiş Kriterler)
    d_evsiz: false,
    d_afetzede: false,
    d_kiraci: false,
    d_agirHasarli: false,
    d_sagliksiz: false,
    d_dereYatagi: false,
    d_tahliyeBaskisi: false,
    d_isinmaProblem: false,
    d_gecekondu: false,
    d_asansorsuzYuksek: false,
    d_tuvaletBanyoYetersiz: false,
    // E - Beyaz Eşya
    appliance_buzdolabi: 'yeni',
    appliance_camasir: 'yeni',
    appliance_bulasik: 'yeni',
    appliance_firin: 'yeni',
    appliance_tv: 'yeni',
    appliance_telefon: 'yeni',
    appliance_klima: 'yeni',
    appliance_diger: 'yeni',
    // F - Sosyal Kırılganlık (Genişletilmiş Kriterler)
    e_kadinReis: false,
    e_bosanmis: false,
    e_dul: false,
    e_esiCezaevinde: false,
    e_siddetMagduru: false,
    e_afetGelirKaybi: false,
    e_maddeBagimliligi: false,
    e_sosyalGuvencesiz: false,
    e_acilHastalik: false,
    e_icraBorcBaskisi: false,
    e_gebelikBebek: false,
    e_hukumluYakin: false,
    // G - Kanaat
    f_yasamKosullari: 0,
    f_aciliyet: 0,
    f_sosyalDestek: 0,
    f_risk: 0,
    // Varlık Testi (Sistem Kontrolleri Adımı)
    a_aracSahibi: false,           // Araç tescil kaydı var → -15 puan
    a_birdenFazlaTasinmaz: false,  // 2+ taşınmaz kaydı → -20 puan
    a_aktifSgkPrim: false,         // Aktif SGK prim ödemesi → -5 ceza puanı
    // Yardım Yığılması (Mükerrerlik)
    a_son3AyYardimAldi: false,     // Son 3 ayda vakıftan yardım aldı mı?
    a_son3AyYardimKisi: 0,         // Varsa kaç kişi? (Her kişi -5 puan)
    // Check
    systemChecksDone: false,
    falseStatement: false,
  });

  const set = (key: string, value: any) => setState(s => ({ ...s, [key]: value }));

  // TC geçmiş araması
  useEffect(() => {
    if (state.applicantTc.length === 11 && allAssessments.length > 0) {
      const found = allAssessments.filter(a => a.applicantTc === state.applicantTc);
      setTcHistory(found);
    } else {
      setTcHistory([]);
    }
  }, [state.applicantTc, allAssessments]);

  const calc = useMemo(() => calculateNewSystemScore(state), [state]);

  const stepsCount = 10;
  const stepNames = [
    "1. Kimlik",
    "2. Gelir (A)",
    "3. Dezavantaj (B)",
    "4. Çocuk (C)",
    "5. Barınma (D)",
    "6. Eşya (E)",
    "7. Sosyal (F)",
    "8. Kanaat (G)",
    "9. Kontrol",
    "10. Kaydet"
  ];

  const isIdentityValid = state.applicantName.trim() !== "" && state.applicantTc.length === 11;
  const canProceed = step === 0 ? isIdentityValid : (step === 8 ? state.systemChecksDone : true);

  const handleSave = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    try {
      const assessmentData = {
        id: (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).substring(2)),
        meetingId: meetingId,
        date: new Date().toISOString(),
        personnelId: user.id,
        personnelName: user.name,
        applicantName: state.applicantName,
        applicantTc: state.applicantTc,
        applicantAddress: state.applicantAddress,
        householdSize: state.householdSize,
        phoneNumber: state.phoneNumber,
        householdNo: state.householdNo,
        status: 'pending' as const,
        data: state,
        result: {
          scoreA: calc.scoreA,
          scoreB: calc.scoreB,
          scoreC: calc.scoreC,
          scoreD: calc.scoreD,
          scoreE: calc.scoreE,
          scoreF: calc.scoreF,
          scorePenalty: calc.scorePenalty,
          totalScore: calc.totalScore,
          assistance: calc.assistance,
          priorities: calc.priorities,
          isRejected: calc.isRejected
        }
      };
      await saveAssessment(assessmentData);
      router.push('/');
    } catch (err) {
      console.error(err);
      showAlert("Kayıt sırasında hata oluştu! " + (err instanceof Error ? err.message : ''), "error");
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 selection:bg-primary-600 selection:text-white">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-5 py-2 flex justify-between items-center shrink-0 z-30">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 touch-manipulation text-slate-700 dark:text-slate-300">
            <ArrowLeft size={18} />
          </Link>
          <LogoImage 
            className="w-8 h-8 rounded-xl shadow-md border-2 border-slate-300 dark:border-slate-700 object-cover shrink-0" 
          />
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight uppercase bg-gradient-to-r from-slate-800 via-slate-600 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Saha İnceleme Sihirbazı
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <span>Adım {step + 1} / {stepsCount}:</span>
              <span className="text-primary-600 dark:text-primary-400 font-extrabold bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20">
                {stepNames[step]}
              </span>
            </p>
          </div>
        </div>

        {/* Live Score & Aid Pill in Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col items-end border-r border-slate-200 dark:border-slate-800 pr-3">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Görevli Personel</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>

          <div className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-2 shadow-xs ${
            calc.isRejected
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60'
              : calc.totalScore >= 71
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
              : calc.totalScore >= 41
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
          }`}>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">
                  Puan:
                </span>
                <span className={`text-xs font-black ${
                  calc.isRejected ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'
                }`}>
                  {showScores ? `${calc.totalScore} P.` : '***'}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1 -mt-0.5">
                <span className="text-[9px] font-bold text-slate-400">Yardım:</span>
                <span className={`text-[11px] font-extrabold ${
                  calc.isRejected || calc.assistance.amount === 0 
                    ? 'text-slate-500' 
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {showScores 
                    ? (calc.assistance.amount > 0 ? `${calc.assistance.amount.toLocaleString('tr-TR')} ₺` : (calc.isRejected ? 'Kapsam Dışı' : 'Yok')) 
                    : '*** ₺'}
                </span>
              </div>
            </div>

            {/* Privacy toggle button */}
            <button
              type="button"
              onClick={() => setShowScores(!showScores)}
              className="p-1 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-700"
              title={showScores ? "Puanı ve Yardımı Gizle" : "Puanı ve Yardımı Göster"}
            >
              {showScores ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 dark:bg-slate-800 shrink-0 relative overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / stepsCount) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Touch-Friendly Step Pill Navigation Bar */}
      <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center gap-1 overflow-x-auto shrink-0 shadow-xs no-scrollbar">
        {stepNames.map((name, idx) => {
          const isActive = step === idx;
          const isPassed = step > idx;
          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={idx}
              type="button"
              onClick={() => {
                if (idx === 0 || isPassed || canProceed) setStep(idx);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition-all touch-manipulation shrink-0 flex items-center gap-1 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-sm ring-1 ring-primary-400/50'
                  : isPassed
                  ? 'bg-slate-100 dark:bg-slate-800 text-primary-400 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
              ) : (
                <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {idx + 1}
                </span>
              )}
              <span>{name.split('. ')[1] || name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto px-3 sm:px-6 py-2 flex flex-col items-center justify-start bg-slate-50/50 dark:bg-slate-950/40">
        <main className="w-full max-w-6xl xl:max-w-7xl flex-1 flex flex-col">
          <div className="w-full flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: "easeInOut" }}
                className="flex-1 flex flex-col"
              >
                {step === 0 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <User className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">
                          Başvuru Sahibi & Hane Bilgileri
                        </h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                        Kimlik, iletişim ve ikamet detayları
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <User size={13} className="text-primary-500" /> Adı Soyadı *
                          </label>
                          <input 
                            type="text" 
                            value={state.applicantName}
                            onChange={e => set('applicantName', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl py-2 px-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="Örn: Ayşe Yılmaz"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Hash size={13} className="text-primary-500" /> T.C. Kimlik No *
                          </label>
                          <input 
                            type="text" 
                            maxLength={11}
                            inputMode="numeric"
                            value={state.applicantTc}
                            onChange={e => set('applicantTc', e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl py-2 px-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="11 Haneli TC No"
                          />
                          {state.applicantTc.length > 0 && state.applicantTc.length < 11 && (
                            <p className="text-amber-500 text-[10px] mt-1 flex items-center font-bold">
                              <AlertTriangle size={12} className="mr-1 shrink-0"/> 11 hane olmalıdır
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Hash size={13} className="text-primary-500" /> Hane Ref No
                          </label>
                          <input 
                            type="text" 
                            value={state.householdNo}
                            onChange={e => set('householdNo', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl py-2 px-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="Örn: HN-12345"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Users size={13} className="text-primary-500" /> Hane Kişi Sayısı
                          </label>
                          <div className="flex items-center w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                            <button
                              type="button"
                              onClick={() => set('householdSize', Math.max(1, (state.householdSize || 1) - 1))}
                              className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <input 
                              type="number" 
                              min="1"
                              value={state.householdSize || ''}
                              onChange={e => set('householdSize', parseInt(e.target.value) || 1)}
                              onFocus={e => e.target.select()}
                              className="flex-1 w-full bg-transparent py-2 px-1 text-center text-sm font-bold text-slate-900 dark:text-white outline-none appearance-none"
                              style={{ MozAppearance: 'textfield' }}
                            />
                            <button
                              type="button"
                              onClick={() => set('householdSize', (state.householdSize || 1) + 1)}
                              className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* TC Geçmiş Yardım Uyarısı */}
                      {tcHistory.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600 rounded-xl p-2.5 flex items-start gap-2">
                          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-bold text-amber-800 dark:text-amber-200">
                              Bu hane daha önce {tcHistory.length} değerlendirmeye alınmış:
                            </span>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                              {tcHistory.slice(0, 3).map((h: any) => (
                                <span key={h.id}>
                                  • {new Date(h.date).toLocaleDateString('tr-TR')} ({h.result?.assistance?.text || 'Destek Yok'} - {h.status === 'approved' ? 'Onaylandı' : 'Beklemede'})
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <Banknote className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">A. Ekonomik Durum</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Hane halkı gelir ve sigorta durumuna göre değerlendirme</span>
                    </div>
                    
                    <div>
                      <SectionCard title="Gelir Seviyesi ve Çalışma Durumu" maxScore={25} currentScore={calc.scoreA} hideScore={true}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                          <div className="lg:col-span-7 space-y-2">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gelir Aralığı (Birini Seçiniz)</h3>
                            <RadioItem label="Kişi başına gelir muhtaçlık sınırının %25 altında" name="income" checked={state.income === 20} onChange={() => set('income', 20)} points={20} />
                            <RadioItem label="Muhtaçlık sınırının %25 – 50 arasında" name="income" checked={state.income === 15} onChange={() => set('income', 15)} points={15} />
                            <RadioItem label="Muhtaçlık sınırının %50 – 75 arasında" name="income" checked={state.income === 10} onChange={() => set('income', 10)} points={10} />
                            <RadioItem label="Muhtaçlık sınırının %75 – 100 arasında" name="income" checked={state.income === 5} onChange={() => set('income', 5)} points={5} />
                            <RadioItem label="Muhtaçlık sınırı üzerinde" name="income" checked={state.income === 0} onChange={() => set('income', 0)} points={0} />
                          </div>
                          <div className="lg:col-span-5 space-y-2 lg:border-l lg:border-slate-200 lg:dark:border-slate-700 lg:pl-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">İlave / Düzeltme Kriterleri</h3>
                            <CheckboxItem label="Hanede çalışan yok" checked={state.noWorker} onChange={(v:any) => set('noWorker', v)} points={3} />
                            <CheckboxItem label="Düzenli gelir bulunmuyor" checked={state.noRegularIncome} onChange={(v:any) => set('noRegularIncome', v)} points={2} />
                            <CheckboxItem label="SGK kaydı yok" checked={state.noSgk} onChange={(v:any) => set('noSgk', v)} points={2} />
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                              💡 SGK veya gelir tespiti sistem sorgularından otomatik teyit edilecektir.
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <Activity className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">B. Dezavantajlı Bireyler</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Hanedeki sağlık ve özel sosyal kırılganlık durumları</span>
                    </div>

                    <SectionCard title="Hastalık ve Engellilik Durumu" maxScore={25} currentScore={calc.scoreB} hideScore={true}>
                      <div className="mb-2.5">
                        <CheckboxItem label="Aynı hanede birden fazla özel durumu (dezavantajlı) olan farklı KİŞİ var" checked={state.b_cokluOzelDurumluBirey} onChange={(v:any) => set('b_cokluOzelDurumluBirey', v)} points={4} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        <CheckboxItem label="Ağır Engelli (Tam Bağımlı)" checked={state.b_agirEngelli} onChange={(v:any) => set('b_agirEngelli', v)} points={12} />
                        <CheckboxItem label="Engelli (Kısmi Bağımlı %40+)" checked={state.b_engelli} onChange={(v:any) => set('b_engelli', v)} points={8} />
                        <CheckboxItem label="Düşük Oranlı Engelli (%20-39)" checked={state.b_dusukEngelli} onChange={(v:any) => set('b_dusukEngelli', v)} points={3} />
                        <CheckboxItem label="Evde Bakım Hastası" checked={state.b_evdeBakim} onChange={(v:any) => set('b_evdeBakim', v)} points={8} />
                        <CheckboxItem label="Kanser Hastası" checked={state.b_kanser} onChange={(v:any) => set('b_kanser', v)} points={8} />
                        <CheckboxItem label="Kronik Hastalık (Sürekli İlaç)" checked={state.b_kronik} onChange={(v:any) => set('b_kronik', v)} points={5} />
                        <CheckboxItem label="Yaşlı ve Yalnız Yaşayan" checked={state.b_yasliYalniz} onChange={(v:any) => set('b_yasliYalniz', v)} points={6} />
                        <CheckboxItem label="Şehit Yakını" checked={state.b_sehitYakini} onChange={(v:any) => set('b_sehitYakini', v)} points={6} />
                        <CheckboxItem label="Gazi" checked={state.b_gazi} onChange={(v:any) => set('b_gazi', v)} points={6} />
                        <CheckboxItem label="Yetim (Anne/Baba vefat)" checked={state.b_yetim} onChange={(v:any) => set('b_yetim', v)} points={4} />
                        <CheckboxItem label="Koruyucu Aile / Evlatlık" checked={state.b_koruyucuAile} onChange={(v:any) => set('b_koruyucuAile', v)} points={4} />
                        <CheckboxItem label="Yabancı Uyruklu / Göçmen" checked={state.b_yabanciUyruklu} onChange={(v:any) => set('b_yabanciUyruklu', v)} points={2} />
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                              <Sparkles size={12} className="text-amber-500" /> Özel Sebep / Özel Durum Açıklaması
                            </label>
                            <input
                              type="text"
                              value={state.b_ozelSebepMetin || ''}
                              onChange={(e) => {
                                set('b_ozelSebepMetin', e.target.value);
                                set('b_ozelSebepPuanBekliyor', e.target.value.trim().length > 0);
                              }}
                              placeholder="Örn: Organ nakli, nadir hastalık, acil kriz durumu..."
                              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div className="w-full sm:w-44 shrink-0">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">İlave Puan Değeri</label>
                            <select
                              value={state.b_ozelSebepPuan || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                set('b_ozelSebepPuan', val);
                                if (val !== 0) {
                                  set('b_ozelSebepPuanBekliyor', false);
                                } else if (state.b_ozelSebepMetin && state.b_ozelSebepMetin.trim().length > 0) {
                                  set('b_ozelSebepPuanBekliyor', true);
                                }
                              }}
                              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-1 focus:ring-primary-500 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200"
                            >
                              <option value={0}>Puan Seçilmedi</option>
                              <option value={-20}>-20 Puan</option>
                              <option value={-15}>-15 Puan</option>
                              <option value={-10}>-10 Puan</option>
                              <option value={-5}>-5 Puan</option>
                              <option value={5}>+5 Puan</option>
                              <option value={10}>+10 Puan</option>
                              <option value={15}>+15 Puan</option>
                              <option value={20}>+20 Puan</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <Users className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">C. Çocuk ve Eğitim</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Kademeli ağırlıklı puanlama (Şartlı Eğitim Yardımı)</span>
                    </div>

                    <SectionCard title="Eğitim Durumu ve Çocuk Sayısı" maxScore={15} currentScore={calc.scoreC} hideScore={true}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                        <CounterItem label="0-6 yaş çocuk (Bakım Yükü)" value={state.c_0_6yas} onChange={(v:any) => set('c_0_6yas', v)} pointsPerItem={2} />
                        <CounterItem label="İlkokul öğrencisi" value={state.c_ilkokul} onChange={(v:any) => set('c_ilkokul', v)} pointsPerItem={2} />
                        <CounterItem label="Ortaokul öğrencisi" value={state.c_ortaokul} onChange={(v:any) => set('c_ortaokul', v)} pointsPerItem={2} />
                        <CounterItem label="Lise öğrencisi" value={state.c_lise} onChange={(v:any) => set('c_lise', v)} pointsPerItem={3} />
                        <CounterItem label="Mesleki Eğitim Merkezi" value={state.c_meslekiEgitim || 0} onChange={(v:any) => set('c_meslekiEgitim', v)} pointsPerItem={3} />
                        <CounterItem label="Açık Lise öğrencisi" value={state.c_acikLise || 0} onChange={(v:any) => set('c_acikLise', v)} pointsPerItem={3} />
                        <CounterItem label="Üniversite öğrencisi" value={state.c_uni} onChange={(v:any) => set('c_uni', v)} pointsPerItem={4} />
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 4 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">D. Barınma Durumu</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Fiziki yaşam alanları ve konut şartları</span>
                    </div>

                    <SectionCard title="Barınma Şartları" maxScore={10} currentScore={calc.scoreD} hideScore={true}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        <CheckboxItem label="Evsiz / Barınaksız / Geçici Sığınma" checked={state.d_evsiz} onChange={(v:any) => set('d_evsiz', v)} points={10} />
                        <CheckboxItem label="Afetzede (Yangın / Deprem / Su)" checked={state.d_afetzede} onChange={(v:any) => set('d_afetzede', v)} points={10} />
                        <CheckboxItem label="Konut ağır hasarlı / Yıkılma riski var" checked={state.d_agirHasarli} onChange={(v:any) => set('d_agirHasarli', v)} points={8} />
                        <CheckboxItem label="Sağlıksız konut (Rutubetli / Havasız)" checked={state.d_sagliksiz} onChange={(v:any) => set('d_sagliksiz', v)} points={6} />
                        <CheckboxItem label="Bodrum kat / Sığınak / Dere yatağı" checked={state.d_dereYatagi} onChange={(v:any) => set('d_dereYatagi', v)} points={6} />
                        <CheckboxItem label="Kiracı (Kira ödemekte zorlanan)" checked={state.d_kiraci} onChange={(v:any) => set('d_kiraci', v)} points={5} />
                        <CheckboxItem label="Ev sahibinin tahliye / icra baskısı altında" checked={state.d_tahliyeBaskisi} onChange={(v:any) => set('d_tahliyeBaskisi', v)} points={5} />
                        <CheckboxItem label="Sobalı / Isınma ve yakacak sıkıntısı" checked={state.d_isinmaProblem} onChange={(v:any) => set('d_isinmaProblem', v)} points={4} />
                        <CheckboxItem label="Gecekondu / İmar sıkıntılı / Hisseli tapu" checked={state.d_gecekondu} onChange={(v:any) => set('d_gecekondu', v)} points={4} />
                        <CheckboxItem label="Asansörsüz yüksek kat (Engelli/Yaşlı)" checked={state.d_asansorsuzYuksek} onChange={(v:any) => set('d_asansorsuzYuksek', v)} points={4} />
                        <CheckboxItem label="Islak hacim (Banyo/WC) yetersiz" checked={state.d_tuvaletBanyoYetersiz} onChange={(v:any) => set('d_tuvaletBanyoYetersiz', v)} points={4} />
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 5 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <Box className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">E. Beyaz Eşya ve Ev Aletleri</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Temel eşyaların varlık ve yıpranma durumu</span>
                    </div>

                    <SectionCard title="Beyaz Eşya ve Cihaz Kontrolü" maxScore={10} currentScore={calc.scoreE} hideScore={true}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                        <ApplianceStatusItem label="Buzdolabı" icon={Box} value={state.appliance_buzdolabi} onChange={(v: any) => set('appliance_buzdolabi', v)} pointsYok={3} pointsEski={1.5} />
                        <ApplianceStatusItem label="Çamaşır Makinesi" icon={Shirt} value={state.appliance_camasir} onChange={(v: any) => set('appliance_camasir', v)} pointsYok={3} pointsEski={1.5} />
                        <ApplianceStatusItem label="Fırın / Ocak" icon={Flame} value={state.appliance_firin} onChange={(v: any) => set('appliance_firin', v)} pointsYok={2} pointsEski={1} />
                        <ApplianceStatusItem label="Bulaşık Makinesi (Puan Dışı)" icon={Sparkles} value={state.appliance_bulasik} onChange={(v: any) => set('appliance_bulasik', v)} pointsYok={0} pointsEski={0} />
                        <ApplianceStatusItem label="Televizyon (TV)" icon={Tv} value={state.appliance_tv} onChange={(v: any) => set('appliance_tv', v)} pointsYok={1} pointsEski={0.5} />
                        <ApplianceStatusItem label="Akıllı / Sabit Telefon" icon={Smartphone} value={state.appliance_telefon} onChange={(v: any) => set('appliance_telefon', v)} pointsYok={1} pointsEski={0.5} />
                        <ApplianceStatusItem label="Klima / Isıtıcı" icon={Wind} value={state.appliance_klima} onChange={(v: any) => set('appliance_klima', v)} pointsYok={1} pointsEski={0.5} />
                        <ApplianceStatusItem label="Diğer Temel Aletler" icon={Plug} value={state.appliance_diger} onChange={(v: any) => set('appliance_diger', v)} pointsYok={1} pointsEski={0.5} />
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 6 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">F. Sosyal Kırılganlık</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Özel sosyal kırılganlık ve korunmaya muhtaçlık halleri</span>
                    </div>

                    <SectionCard title="Sosyal Kırılganlık Kriterleri" maxScore={30} currentScore={calc.scoreF} hideScore={true}>
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                        <span className="flex items-center gap-2 text-xs">
                          <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                          Hane Nüfusu Etkisi ({state.householdSize || 1} Kişi)
                        </span>
                        <span className="bg-primary-100 dark:bg-primary-900/60 text-primary-900 dark:text-primary-200 font-extrabold text-[11px] px-2.5 py-0.5 rounded-md">
                          {(state.householdSize || 1) >= 7 ? `Çok Kalabalık (+6 P.)` :
                           (state.householdSize || 1) >= 5 ? `Kalabalık (+4 P.)` :
                           (state.householdSize || 1) >= 3 ? `Orta Büyüklük (+2 P.)` : `Küçük Hane (+1 P.)`}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        <CheckboxItem label="Aile içi şiddet mağduru" checked={state.e_siddetMagduru} onChange={(v:any) => set('e_siddetMagduru', v)} points={6} />
                        <CheckboxItem label="Kadın hane reisi" checked={state.e_kadinReis} onChange={(v:any) => set('e_kadinReis', v)} points={5} />
                        <CheckboxItem label="Eşi / Bakmakla yükümlü kişi cezaevinde" checked={state.e_esiCezaevinde} onChange={(v:any) => set('e_esiCezaevinde', v)} points={5} />
                        <CheckboxItem label="Afet / Kaza nedeniyle gelir kaybı" checked={state.e_afetGelirKaybi} onChange={(v:any) => set('e_afetGelirKaybi', v)} points={5} />
                        <CheckboxItem label="Hane içinde bağımlı birey" checked={state.e_maddeBagimliligi} onChange={(v:any) => set('e_maddeBagimliligi', v)} points={5} />
                        <CheckboxItem label="Sosyal güvencesiz / Aile desteği yok" checked={state.e_sosyalGuvencesiz} onChange={(v:any) => set('e_sosyalGuvencesiz', v)} points={5} />
                        <CheckboxItem label="Acil hastalık durumu" checked={state.e_acilHastalik} onChange={(v:any) => set('e_acilHastalik', v)} points={4} />
                        <CheckboxItem label="Yüksek borç / icra / haciz baskısı" checked={state.e_icraBorcBaskisi} onChange={(v:any) => set('e_icraBorcBaskisi', v)} points={4} />
                        <CheckboxItem label="Bebek (0-1 Yaş) veya riskli gebelik" checked={state.e_gebelikBebek} onChange={(v:any) => set('e_gebelikBebek', v)} points={4} />
                        <CheckboxItem label="Boşanmış / Terk edilmiş eş" checked={state.e_bosanmis} onChange={(v:any) => set('e_bosanmis', v)} points={3} />
                        <CheckboxItem label="Dul (Eşi vefat etmiş)" checked={state.e_dul} onChange={(v:any) => set('e_dul', v)} points={3} />
                        <CheckboxItem label="Denetimli serbestlik / Eski hükümlü" checked={state.e_hukumluYakin} onChange={(v:any) => set('e_hukumluYakin', v)} points={3} />
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 7 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <Award className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">G. Sosyal İnceleme Kanaati</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">0 (İyi/Yeterli) ile 5 (Kritik/Acil) arası seviye seçiniz</span>
                    </div>

                    <SectionCard title="Kanaat Notları" maxScore={10} currentScore={calc.scoreF} hideScore={true}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <ScoreButtons 
                          label="1. Yaşam Koşulları (Fiziki Şartlar, Hijyen, Eşya)" 
                          description="0 = İyi / Yeterli • 5 = Aşırı Kötü / Harabe"
                          value={state.f_yasamKosullari} 
                          onChange={(v:any) => set('f_yasamKosullari', v)} 
                        />
                        <ScoreButtons 
                          label="2. Aciliyet Durumu (İvedilik ve Kriz Hali)" 
                          description="0 = Rutin • 5 = Derhal Acil Müdahale"
                          value={state.f_aciliyet} 
                          onChange={(v:any) => set('f_aciliyet', v)} 
                        />
                        <ScoreButtons 
                          label="3. Sosyal Destek Yetersizliği (Akraba / Çevre)" 
                          description="0 = Güçlü Destek Var • 5 = Tamamen Kimsesiz"
                          value={state.f_sosyalDestek} 
                          onChange={(v:any) => set('f_sosyalDestek', v)} 
                        />
                        <ScoreButtons 
                          label="4. Risk Değerlendirmesi (Güvenlik / İstismar)" 
                          description="0 = Güvenli • 5 = Hayati Risk / Tehlike"
                          value={state.f_risk} 
                          onChange={(v:any) => set('f_risk', v)} 
                        />
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 8 && (
                  <div className="flex-1 flex flex-col justify-start space-y-2.5">
                    <div className="flex items-center justify-between bg-primary-500/10 dark:bg-primary-950/40 border border-primary-500/20 px-3.5 py-1.5 rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="text-primary-500 shrink-0" size={16} />
                        <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">Sistem Kontrolleri</h2>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Kurum veritabanı sorguları ve mükerrerlik denetimi</span>
                    </div>

                    <SectionCard title="Varlık Testi ve Sorgu Sonuçları" maxScore={0} currentScore={0} hideScore={true}>
                      {/* Zorunlu Onay */}
                      <div className="mb-2.5">
                        <label className={`flex items-center p-2.5 sm:p-3 border rounded-xl cursor-pointer transition-all ${state.systemChecksDone ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/40' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}>
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 mr-2.5"
                            checked={state.systemChecksDone} onChange={(e) => set('systemChecksDone', e.target.checked)} />
                          <span className={`font-bold text-xs sm:text-sm ${state.systemChecksDone ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'}`}>
                            Zorunlu sistem sorgularını (Araç Tescil, Tapu, SGK) tamamladım ve aşağıdaki sonuçları girdim.
                          </span>
                        </label>
                        {!state.systemChecksDone && (
                          <p className="text-amber-500 text-[11px] font-bold flex items-center gap-1 mt-1"><AlertTriangle size={13}/> Sonraki adıma geçmek için onaylamanız gereklidir.</p>
                        )}
                      </div>

                      {/* Varlık Testi Sonuçları */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-2.5 space-y-2">
                          <h4 className="text-xs font-black text-orange-900 dark:text-orange-300 flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-orange-600" />
                            Sorgu Sonuçları — Ceza Puanları
                          </h4>
                          <CheckboxItem label="Araç tescil kaydı tespit edildi (−15 P.)" checked={state.a_aracSahibi} onChange={(v:any) => set('a_aracSahibi', v)} isAlert={true} points={null} />
                          <CheckboxItem label="Birden fazla taşınmaz (gayrimenkul) kaydı var (−20 P.)" checked={state.a_birdenFazlaTasinmaz} onChange={(v:any) => set('a_birdenFazlaTasinmaz', v)} isAlert={true} points={null} />
                          <CheckboxItem label="Aktif SGK prim ödemesi tespit edildi" checked={state.a_aktifSgkPrim} onChange={(v:any) => set('a_aktifSgkPrim', v)} isAlert={true} points={-5} />
                          <div className="space-y-1.5 pt-1.5 border-t border-orange-200 dark:border-orange-800">
                            <CheckboxItem label="Son 3 ayda bu vakıftan yardım aldı" checked={state.a_son3AyYardimAldi} onChange={(v:any) => { set('a_son3AyYardimAldi', v); if (!v) set('a_son3AyYardimKisi', 0); }} isAlert={true} points={null} />
                            {state.a_son3AyYardimAldi && (
                              <div className="flex items-center justify-between pl-6 text-xs font-bold text-orange-800 dark:text-orange-300">
                                <span>Kaç kişi yardım aldı? (Her biri −5 P.)</span>
                                <div className="flex items-center gap-1.5">
                                  <button type="button" onClick={() => set('a_son3AyYardimKisi', Math.max(0, (state.a_son3AyYardimKisi||0) - 1))} className="w-7 h-7 rounded bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100 font-black flex items-center justify-center">-</button>
                                  <span className="w-6 text-center font-black">{state.a_son3AyYardimKisi || 0}</span>
                                  <button type="button" onClick={() => set('a_son3AyYardimKisi', (state.a_son3AyYardimKisi||0) + 1)} className="w-7 h-7 rounded bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-100 font-black flex items-center justify-center">+</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2.5 flex flex-col justify-between">
                          {calc.scorePenalty > 0 && (
                            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-2.5 text-xs font-bold text-red-800 dark:text-red-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5"><AlertTriangle size={15} className="text-red-600 shrink-0" /> Toplam Ceza Kesintisi:</span>
                              <span className="text-sm font-black">−{calc.scorePenalty} Puan</span>
                            </div>
                          )}

                          <label className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${state.falseStatement ? 'bg-red-50 dark:bg-red-950/60 border-red-400 ring-1 ring-red-400/40' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-red-50/40'}`}>
                            <input type="checkbox" className="w-4 h-4 rounded border-red-300 text-red-600 focus:ring-red-500 mt-0.5"
                              checked={state.falseStatement} onChange={(e) => set('falseStatement', e.target.checked)} />
                            <div className="ml-2.5">
                              <span className="text-xs sm:text-sm font-black text-red-700 dark:text-red-400 block">DİKKAT: Gerçeğe Aykırı Beyan Tespit Edildi</span>
                              <span className="text-[11px] font-semibold text-red-500 dark:text-red-400 block mt-0.5">(İşaretlenirse başvuruyu doğrudan RED yapar)</span>
                            </div>
                          </label>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                            🔒 Tüm sorgular sistem log kayıtlarına şifreli olarak işlenmektedir.
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                )}

                {step === 9 && (
                  <div className="flex-1 flex flex-col justify-center items-center py-2 w-full">
                    <motion.div 
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow-xl w-full max-w-4xl space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-primary-600/20 text-primary-500 border border-primary-500/30 flex items-center justify-center shrink-0">
                            <Award size={20} />
                          </div>
                          <div>
                            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                              İnceleme Tamamlandı & Değerlendirme Sonucu
                            </h2>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {state.applicantName} ({state.applicantTc}) • Hane Mevcudu: {state.householdSize} Kişi
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Score & Assistance Overview Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        {/* Toplam Puan Kartı */}
                        <div className={`p-3.5 rounded-xl border transition-all ${
                          calc.isRejected
                            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
                            : calc.totalScore >= 71
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                            : calc.totalScore >= 41
                            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
                            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Hesaplanan Toplam Puan
                            </span>
                            <Award size={16} className={calc.isRejected ? 'text-red-500' : 'text-primary-500'} />
                          </div>
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className={`text-2xl sm:text-3xl font-black ${
                              calc.isRejected ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'
                            }`}>
                              {calc.totalScore}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/ 100 Puan</span>
                          </div>
                          <p className="text-[11px] font-bold mt-0.5 text-slate-600 dark:text-slate-300">
                            {calc.isRejected 
                              ? 'Başvuru Reddedildi / Kapsam Dışı' 
                              : calc.totalScore >= 86 
                              ? '1. Kademe (Kritik / Çok Yüksek İhtiyaç)' 
                              : calc.totalScore >= 71 
                              ? '2. Kademe (Yüksek İhtiyaç)' 
                              : calc.totalScore >= 56 
                              ? '3. Kademe (Orta Düzey İhtiyaç)' 
                              : calc.totalScore >= 41 
                              ? '4. Kademe (Düşük-Orta İhtiyaç)' 
                              : calc.totalScore >= 26 
                              ? '5. Kademe (Temel İhtiyaç)' 
                              : calc.totalScore >= 10 
                              ? '6. Kademe (Dönemsel/Sınır İhtiyaç)' 
                              : '10 Puan Altı: Kriter Karşılanmadı'}
                          </p>
                        </div>

                        {/* Tavsiye Edilen Yardım Tutarı Kartı */}
                        <div className={`p-3.5 rounded-xl border transition-all ${
                          calc.isRejected || calc.assistance.amount === 0
                            ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Öngörülen Yardım Tutarı
                            </span>
                            <Banknote size={16} className={calc.assistance.amount > 0 ? 'text-emerald-500' : 'text-slate-400'} />
                          </div>
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className={`text-2xl sm:text-3xl font-black ${
                              calc.assistance.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {calc.assistance.amount > 0 ? `${calc.assistance.amount.toLocaleString('tr-TR')} ₺` : '0 ₺'}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold mt-0.5 text-slate-600 dark:text-slate-300">
                            {calc.isRejected ? 'Kapsam Dışı (0 ₺)' : calc.assistance.text}
                          </p>
                        </div>
                      </div>

                      {/* Kategori Bazında Puan Dağılımı */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2.5 sm:p-3 border border-slate-200 dark:border-slate-700/80 text-left">
                        <div className="flex items-center justify-between mb-1.5 border-b border-slate-200 dark:border-slate-700 pb-1">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Kategori Dağılımı
                          </h4>
                          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">
                            Net Toplam: {calc.totalScore} Puan
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-slate-400 block text-[9px]">A: Gelir</span>
                            <strong className="text-slate-800 dark:text-slate-200 text-xs font-black">+{calc.scoreA}</strong>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-slate-400 block text-[9px]">B: Sağlık</span>
                            <strong className="text-slate-800 dark:text-slate-200 text-xs font-black">+{calc.scoreB}</strong>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-slate-400 block text-[9px]">C: Eğitim</span>
                            <strong className="text-slate-800 dark:text-slate-200 text-xs font-black">+{calc.scoreC}</strong>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-slate-400 block text-[9px]">D: Barınma</span>
                            <strong className="text-slate-800 dark:text-slate-200 text-xs font-black">+{calc.scoreD}</strong>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-slate-400 block text-[9px]">E: Eşya</span>
                            <strong className="text-slate-800 dark:text-slate-200 text-xs font-black">+{calc.scoreE}</strong>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-slate-400 block text-[9px]">F: Kanaat</span>
                            <strong className="text-slate-800 dark:text-slate-200 text-xs font-black">+{calc.scoreF}</strong>
                          </div>
                        </div>

                        {calc.scorePenalty > 0 && (
                          <div className="mt-2 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-600 dark:text-red-400 font-bold flex items-center justify-between">
                            <span>Varlık / Mükerrerlik Ceza Kesintisi:</span>
                            <span className="font-black text-xs">−{calc.scorePenalty} Puan</span>
                          </div>
                        )}
                      </div>

                      {/* Öncelikli Kriterler Varsa */}
                      {calc.priorities && calc.priorities.length > 0 && (
                        <div className="text-left space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Tespit Edilen Öncelikli Durumlar:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {calc.priorities.map((item, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                                ✓ {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gerçeğe Aykırı Beyan Varsa */}
                      {state.falseStatement && (
                        <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-left flex items-start gap-2">
                          <AlertTriangle size={15} className="shrink-0 text-red-600 mt-0.5" />
                          <span>DİKKAT: Gerçeğe aykırı beyan tespit edildiği için hane puanı sıfırlanmış ve başvuru doğrudan RED olarak sonuçlanacaktır.</span>
                        </div>
                      )}

                      <motion.button 
                        whileHover={{ scale: isSaving ? 1 : 1.01 }}
                        whileTap={{ scale: isSaving ? 1 : 0.99 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-500 hover:to-primary-500 text-white font-black text-base py-3 rounded-xl shadow-lg flex justify-center items-center gap-2 ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {isSaving ? (
                          <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Kaydediliyor...</>
                        ) : (
                          <><Save size={18} /> Formu Kaydet ve Onaya Gönder</>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* Ergonomic Bottom Navigation Bar as flex child */}
      <div className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 sm:py-2.5 shadow-lg z-30 flex items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`flex items-center justify-center px-4 py-2 rounded-xl font-bold text-xs sm:text-sm min-h-[40px] transition-all touch-manipulation ${
            step === 0 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600'
          }`}
        >
          <ChevronLeft size={18} className="mr-1" /> Geri
        </motion.button>
        
        <div className="text-center px-1">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-black text-primary-600 dark:text-primary-400">
              {showScores ? `${calc.totalScore} Puan` : '***'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className={`text-[11px] sm:text-xs font-black ${calc.assistance.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              {showScores ? (calc.assistance.amount > 0 ? `${calc.assistance.amount.toLocaleString('tr-TR')} TL` : 'Destek Yok') : '*** TL'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block tracking-tight">
            Adım {step + 1} / {stepsCount} ({stepNames[step].replace(/^\d+\.\s*/, '')})
          </span>
        </div>

        {step < stepsCount - 1 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setStep(s => Math.min(stepsCount - 1, s + 1))}
            disabled={!canProceed}
            className={`flex items-center justify-center px-5 py-2 rounded-xl font-black text-xs sm:text-sm min-h-[40px] transition-all shadow-md touch-manipulation ${
              !canProceed
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-primary-600/30'
            }`}
          >
            Sonraki Adım <ChevronRight size={18} className="ml-1" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: isSaving ? 1 : 0.95 }}
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center justify-center px-5 py-2 rounded-xl font-black text-xs sm:text-sm min-h-[40px] bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-500 hover:to-primary-500 text-white shadow-md shadow-emerald-900/30 transition-all touch-manipulation ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1.5" /> Kaydediliyor...</>
            ) : (
              <><Save size={16} className="mr-1.5" /> Kaydet ve Bitir</>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default function NewAssessmentWizard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">Form yükleniyor...</div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}

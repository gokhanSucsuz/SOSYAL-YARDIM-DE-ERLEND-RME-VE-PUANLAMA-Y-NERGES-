"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ChevronRight, ChevronLeft, Save, AlertTriangle, ArrowLeft, CheckCircle2, Info,
  Tv, Smartphone, Wind, Flame, Box, Shirt, Sparkles, Plug, User, MapPin, Phone, Hash, Users, Activity, Minus, Plus
} from 'lucide-react';
import { saveAssessment, getAllAssessments, calculateAssistanceFromScore } from '@/lib/db';
import { SectionCard, CheckboxItem, RadioItem, ScoreButtons, CounterItem, ApplianceStatusItem } from '@/components/ui-components';
import Link from 'next/link';
import { LogoImage } from '@/components/logo-image';
import { useDialog } from '@/components/DialogProvider';

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingId = searchParams?.get('meetingId') || undefined;
  const { showAlert } = useDialog();
  
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  const [tcHistory, setTcHistory] = useState<any[]>([]);

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
    a_aktifSgkPrim: false,         // Aktif SGK prim ödemesi → A bölümü zorla 0
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

  const calc = useMemo(() => {
    // Section A: Ekonomik Durum (Maksimum 25 Puan)
    // Aktif SGK prim ödemesi varsa gelir skoru zorla 0 (muhtaçlık sınırı üzeri sayılır)
    let rawScoreA = state.income || 0;
    if (state.noWorker) rawScoreA += 3;
    if (state.noRegularIncome) rawScoreA += 2;
    if (state.noSgk) rawScoreA += 2;
    const scoreA = state.a_aktifSgkPrim ? 0 : Math.max(0, Math.min(rawScoreA, 25));

    // Section B: Sağlık ve Dezavantajlılık (Maksimum 25 Puan)
    let scoreB = 0;
    if (state.b_agirEngelli) scoreB += 12;
    if (state.b_engelli) scoreB += 8;
    if (state.b_dusukEngelli) scoreB += 3;
    if (state.b_evdeBakim) scoreB += 8;
    if (state.b_kanser) scoreB += 8;
    if (state.b_kronik) scoreB += 5;
    if (state.b_yasliYalniz) scoreB += 6;
    if (state.b_sehitYakini) scoreB += 6;
    if (state.b_gazi) scoreB += 6;
    if (state.b_yetim) scoreB += 4;
    if (state.b_koruyucuAile) scoreB += 4;
    if (state.b_yabanciUyruklu) scoreB += 2;
    if (!state.b_ozelSebepPuanBekliyor && state.b_ozelSebepPuan && Number(state.b_ozelSebepPuan) > 0) {
      scoreB += Number(state.b_ozelSebepPuan);
    }
    if (state.b_cokluOzelDurumluBirey) scoreB += 4;
    scoreB = Math.min(scoreB, 25);

    const disadvantageCount = [
      state.b_agirEngelli, state.b_engelli, state.b_dusukEngelli,
      state.b_evdeBakim, state.b_kanser, state.b_kronik,
      state.b_yasliYalniz, state.b_sehitYakini, state.b_gazi,
      state.b_yetim, state.b_koruyucuAile, state.b_yabanciUyruklu
    ].filter(Boolean).length;

    // Section C: Sosyal Kırılganlık ve Krizler (Maksimum 15 Puan)
    let scoreC = 0;
    if (state.e_siddetMagduru) scoreC += 5;
    if (state.e_kadinReis) scoreC += 4;
    if (state.e_esiCezaevinde) scoreC += 4;
    if (state.e_afetGelirKaybi) scoreC += 4;
    if (state.e_maddeBagimliligi) scoreC += 4;
    if (state.e_sosyalGuvencesiz) scoreC += 4;
    if (state.e_icraBorcBaskisi) scoreC += 3;
    if (state.e_gebelikBebek) scoreC += 3;
    if (state.e_bosanmis) scoreC += 2;
    if (state.e_dul) scoreC += 2;
    if (state.e_hukumluYakin) scoreC += 2;
    const hhSize = state.householdSize || 1;
    if (hhSize >= 7) scoreC += 4;
    else if (hhSize >= 5) scoreC += 3;
    else if (hhSize >= 3) scoreC += 2;
    else scoreC += 1;
    scoreC = Math.min(scoreC, 15);

    // Section D: Eğitim ve Çocuk Yükü (Maksimum 15 Puan)
    let scoreD = 0;
    scoreD += (state.c_0_6yas || 0) * 2;
    scoreD += (state.c_ilkokul || 0) * 2;
    scoreD += (state.c_ortaokul || 0) * 2;
    scoreD += (state.c_lise || 0) * 3;
    scoreD += (state.c_meslekiEgitim || 0) * 3;
    scoreD += (state.c_acikLise || 0) * 2;
    scoreD += (state.c_uni || 0) * 4;
    scoreD = Math.min(scoreD, 15);

    // Section E: Barınma ve Fiziksel Şartlar (Maksimum 10 Puan)
    let scoreE = 0;
    if (state.d_evsiz) scoreE += 8;
    if (state.d_afetzede) scoreE += 8;
    if (state.d_agirHasarli) scoreE += 6;
    if (state.d_sagliksiz) scoreE += 4;
    if (state.d_dereYatagi) scoreE += 4;
    if (state.d_kiraci) scoreE += 3;
    if (state.d_tahliyeBaskisi) scoreE += 3;
    if (state.d_isinmaProblem) scoreE += 2;
    if (state.d_gecekondu) scoreE += 2;
    if (state.d_asansorsuzYuksek) scoreE += 2;
    if (state.d_tuvaletBanyoYetersiz) scoreE += 2;
    
    // Eşya (appliances) contribution to Section E
    let rawAppliances = 0;
    if (state.appliance_buzdolabi === 'yok') rawAppliances += 1.5;
    if (state.appliance_camasir === 'yok') rawAppliances += 1.5;
    if (state.appliance_firin === 'yok') rawAppliances += 1;
    if (state.appliance_tv === 'yok') rawAppliances += 0.5;
    scoreE += Math.min(3, rawAppliances); // Max 3 pts from appliances
    scoreE = Math.min(scoreE, 10);

    // Section F: Sosyal İnceleme Kanaati (Maksimum 10 Puan)
    const scoreF = Math.min(
      (state.f_yasamKosullari || 0) + (state.f_aciliyet || 0) + (state.f_sosyalDestek || 0) + (state.f_risk || 0),
      10
    );

    // CEZA PUANLARI (Means Testing / Varlık Testi)
    let scorePenalty = 0;
    if (state.a_aracSahibi) scorePenalty += 15;
    if (state.a_birdenFazlaTasinmaz) scorePenalty += 20;
    if (state.a_son3AyYardimAldi && (state.a_son3AyYardimKisi || 0) > 0) {
      scorePenalty += (state.a_son3AyYardimKisi || 0) * 5;
    }

    const rawTotal = scoreA + scoreB + scoreC + scoreD + scoreE + scoreF;
    const totalScore = state.falseStatement ? 0 : Math.max(0, Math.round(rawTotal - scorePenalty));
    
    const hasIncomeVulnerability = !!(state.income && state.income > 0);
    const assistance = calculateAssistanceFromScore(totalScore, !!state.falseStatement, undefined, hasIncomeVulnerability);

    const priorities: string[] = [];
    if (state.b_agirEngelli) priorities.push('Ağır engelli bulunan hane');
    if (state.b_cokluOzelDurumluBirey) priorities.push('Hanede Birden Fazla Özel Durumlu Birey');
    if (state.b_yetim) priorities.push('Yetim çocuk bulunan hane');
    if (state.b_sehitYakini || state.b_gazi) priorities.push('Şehit / Gazi Ailesi');
    if (state.d_afetzede || state.e_afetGelirKaybi) priorities.push('Afet Mağduru');
    if (state.b_yasliYalniz) priorities.push('Yaşlı ve Yalnız Yaşayan');
    if (state.e_siddetMagduru) priorities.push('Aile İçi Şiddet Mağduru');
    if (state.a_aracSahibi || state.a_birdenFazlaTasinmaz) priorities.push('Varlık Testi: Ceza Puanı Uygulandı');
    if (state.appliance_buzdolabi === 'yok' || state.appliance_camasir === 'yok') {
      priorities.push('Temel Ev Eşyası Eksikliği (Buzdolabı / Çamaşır M.)');
    }

    return { scoreA, scoreB, scoreC, scoreD, scoreE, scoreF, scorePenalty, totalScore, assistance, priorities, isRejected: state.falseStatement, disadvantageCount };
  }, [state, allAssessments]);

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
    if (!user) return;
    try {
      const assessmentData = {
        id: crypto.randomUUID(),
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
      showAlert("İnceleme hane kaydı başarıyla oluşturuldu.");
      router.push('/');
    } catch (err) {
      console.error(err);
      showAlert("Kayıt sırasında hata oluştu! " + (err instanceof Error ? err.message : ''), "error");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans flex flex-col text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Animated Header */}
      <header className="bg-white dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-all active:scale-95 touch-manipulation text-slate-700 dark:text-slate-300 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <LogoImage 
            className="w-10 h-10 rounded-2xl shadow-md border-2 border-slate-300 dark:border-slate-700 object-cover shrink-0" 
          />
          <div>
            <h1 className="text-xs sm:text-base font-black tracking-tight uppercase bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Saha İnceleme Sihirbazı
            </h1>
            <p className="text-[11px] text-slate-600 dark:text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <span>Adım {step + 1} / {stepsCount}:</span>
              <span className="text-blue-400 font-extrabold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                {stepNames[step]}
              </span>
            </p>
          </div>
        </div>

        {/* Live Score Pill in Header replaced with Privacy Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end border-r border-slate-200 dark:border-slate-800 pr-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 tracking-wider">Görevli Personel</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
          </div>

          <div className="bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-300 dark:border-slate-700/80 px-3 py-1.5 rounded-2xl text-right shrink-0 flex items-center gap-2">
            <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 tracking-widest leading-none">Saha Kayıt Modu</p>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 leading-none">Puan Gizli</p>
            </div>
          </div>
        </div>
      </header>

      {/* Animated Glowing Progress Bar */}
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 shrink-0 relative overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / stepsCount) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Touch-Friendly Step Pill Navigation Bar */}
      <div className="bg-white/80 dark:bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-3 py-2.5 flex items-center gap-1.5 overflow-x-auto shrink-0 shadow-inner no-scrollbar">
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
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all touch-manipulation shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400/50'
                  : isPassed
                  ? 'bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 text-blue-300 hover:bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/50'
                  : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-500 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:bg-slate-100/40 dark:bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              ) : (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                  isActive ? 'bg-white dark:bg-slate-100 dark:bg-slate-800/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400'
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
      <div className="flex-1 flex flex-col pb-28 bg-slate-50 dark:bg-slate-950/40">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="flex-1 flex flex-col"
              >
                {step === 0 && (
                  <div className="flex-1 space-y-5">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                        <User className="text-blue-400" size={24} />
                        Başvuru Sahibi & Hane Bilgileri
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-1">Saha incelemesi yapılan hanenin kimlik, iletişim ve ikamet detayları.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <User size={14} className="text-blue-400" /> Başvuru Sahibinin Adı Soyadı *
                          </label>
                          <input 
                            type="text" 
                            value={state.applicantName}
                            onChange={e => set('applicantName', e.target.value)}
                            className="w-full bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Örn: Ayşe Yılmaz"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Hash size={14} className="text-blue-400" /> T.C. Kimlik Numarası (11 Hane) *
                          </label>
                          <input 
                            type="text" 
                            maxLength={11}
                            inputMode="numeric"
                            value={state.applicantTc}
                            onChange={e => set('applicantTc', e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner"
                            placeholder="11 Haneli TC No"
                          />
                          {state.applicantTc.length > 0 && state.applicantTc.length < 11 && (
                            <p className="text-amber-400 text-xs mt-2 flex items-center font-bold"><AlertTriangle size={14} className="mr-1 shrink-0"/> TC Kimlik Numarası 11 hane olmalıdır.</p>
                          )}
                          {/* TC Geçmiş Yardım Uyarısı */}
                          {tcHistory.length > 0 && (
                            <div className="mt-3 bg-amber-900/40 border border-amber-500/40 rounded-xl p-3 space-y-1.5">
                              <p className="text-amber-300 text-xs font-extrabold flex items-center gap-1.5">
                                <AlertTriangle size={14} className="shrink-0" />
                                Bu hane daha önce {tcHistory.length} değerlendirmeye alınmış!
                              </p>
                              {tcHistory.slice(0, 3).map((h: any) => (
                                <p key={h.id} className="text-amber-200 text-[11px] font-medium pl-5">
                                  • {new Date(h.date).toLocaleDateString('tr-TR')} — {h.result?.assistance?.text || 'Bilgi yok'} ({h.status === 'approved' ? 'Onaylandı' : 'Onay Bekliyor'})
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Phone size={14} className="text-blue-400" /> Telefon Numarası
                          </label>
                          <input 
                            type="tel" 
                            value={state.phoneNumber}
                            onChange={e => set('phoneNumber', e.target.value)}
                            className="w-full bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Örn: 0555 555 5555"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Hash size={14} className="text-blue-400" /> Hane Numarası (Sistem Ref)
                          </label>
                          <input 
                            type="text" 
                            value={state.householdNo}
                            onChange={e => set('householdNo', e.target.value)}
                            className="w-full bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Örn: HN-12345"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Users size={14} className="text-blue-400" /> Hanedeki Toplam Kişi Sayısı
                          </label>
                          <div className="flex items-center w-full bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <button
                              type="button"
                              onClick={() => set('householdSize', Math.max(1, (state.householdSize || 1) - 1))}
                              className="px-4 py-3.5 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                              <Minus size={20} />
                            </button>
                            <input 
                              type="number" 
                              min="1"
                              value={state.householdSize || ''}
                              onChange={e => set('householdSize', parseInt(e.target.value) || 1)}
                              onFocus={e => e.target.select()}
                              className="flex-1 w-full bg-transparent py-3.5 px-2 text-center text-base font-bold text-white outline-none appearance-none"
                              style={{ MozAppearance: 'textfield' }}
                            />
                            <button
                              type="button"
                              onClick={() => set('householdSize', (state.householdSize || 1) + 1)}
                              className="px-4 py-3.5 text-slate-600 dark:text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MapPin size={14} className="text-blue-400" /> İkamet Adresi
                          </label>
                          <textarea 
                            value={state.applicantAddress}
                            onChange={e => set('applicantAddress', e.target.value)}
                            rows={2}
                            className="w-full bg-slate-100/80 dark:bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Mahalle, Cadde/Sokak, Kapı No, Daire..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">A. Ekonomik Durum</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Hane halkı gelir ve sigorta durumuna göre değerlendirme</p>
                    </div>
                    
                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Gelir Seviyesi" maxScore={25} currentScore={calc.scoreA} hideScore={true}>
                        <div className="space-y-3">
                          <RadioItem label="Kişi başına gelir muhtaçlık sınırının %25 altında" name="income" checked={state.income === 20} onChange={() => set('income', 20)} points={20} />
                          <RadioItem label="Muhtaçlık sınırının %25 – 50 arasında" name="income" checked={state.income === 15} onChange={() => set('income', 15)} points={15} />
                          <RadioItem label="Muhtaçlık sınırının %50 – 75 arasında" name="income" checked={state.income === 10} onChange={() => set('income', 10)} points={10} />
                          <RadioItem label="Muhtaçlık sınırının %75 – 100 arasında" name="income" checked={state.income === 5} onChange={() => set('income', 5)} points={5} />
                          <RadioItem label="Muhtaçlık sınırı üzerinde" name="income" checked={state.income === 0} onChange={() => set('income', 0)} points={0} />
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-200 dark:border-slate-800">
                          <h3 className="text-[10px] font-bold text-slate-600 dark:text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">İlave / Düzeltme Kriterleri</h3>
                          <div className="grid grid-cols-1 gap-3">
                            <CheckboxItem label="Hanede çalışan yok" checked={state.noWorker} onChange={(v:any) => set('noWorker', v)} points={3} />
                            <CheckboxItem label="Düzenli gelir bulunmuyor" checked={state.noRegularIncome} onChange={(v:any) => set('noRegularIncome', v)} points={2} />
                            <CheckboxItem label="SGK kaydı yok" checked={state.noSgk} onChange={(v:any) => set('noSgk', v)} points={2} />
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">B. Dezavantajlı Bireyler</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Hanedeki sağlık ve özel sosyal kırılganlık durumları</p>
                    </div>

                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Hastalık ve Engellilik Durumu" maxScore={25} currentScore={calc.scoreB} hideScore={true}>
                        <div className="mb-4">
                          <CheckboxItem label="Aynı hanede birden fazla özel durumu (dezavantajlı) olan farklı KİŞİ var" checked={state.b_cokluOzelDurumluBirey} onChange={(v:any) => set('b_cokluOzelDurumluBirey', v)} points={4} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-200 dark:border-slate-800">
                          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500" />
                            Özel Sebep / Özel Durum Tanımlama
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400 mb-3">
                            Standart kriterlerin dışındaki özel durumlar için açıklama girebilirsiniz.
                          </p>
                          <div className="space-y-3 bg-slate-50 dark:bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-300 dark:border-slate-700">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400 mb-1">
                                Özel Sebep Açıklaması
                              </label>
                              <input
                                type="text"
                                value={state.b_ozelSebepMetin || ''}
                                onChange={(e) => {
                                  set('b_ozelSebepMetin', e.target.value);
                                  // Personel girerken müdür onayı bekliyor bayrağı
                                  if (user?.role === 'personnel') {
                                    set('b_ozelSebepPuanBekliyor', e.target.value.trim().length > 0);
                                  }
                                }}
                                placeholder="Örn: Organ nakli, nadir hastalık, son birkaç günde karşılaşılan acil durum vb."
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-800 dark:text-slate-200 font-medium"
                              />
                            </div>
                            {user?.role === 'personnel' ? (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-800 font-semibold flex items-start gap-2">
                                <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-600" />
                                <span>Özel sebep puanı <strong>yalnızca Vakıf Müdürü</strong> tarafından belirlenebilir. Girdiğiniz açıklama Müdür incelemesi için kaydedilecek, puan otomatik olarak 0 kalacaktır.</span>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400 mb-1">İlave Puan Değeri (Müdür Yetkisi)</label>
                                <select
                                  value={state.b_ozelSebepPuan || 0}
                                  onChange={(e) => { set('b_ozelSebepPuan', Number(e.target.value)); set('b_ozelSebepPuanBekliyor', false); }}
                                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-800 dark:text-slate-200"
                                >
                                  <option value={0}>Ekleme Yok</option>
                                  <option value={5}>+5 Puan</option>
                                  <option value={10}>+10 Puan</option>
                                  <option value={15}>+15 Puan</option>
                                  <option value={20}>+20 Puan</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">C. Çocuk ve Eğitim</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Kademeli ağırlıklı puanlama (Şartlı Eğitim Yardımı ve Dünya Bankası metodolojisi)</p>
                    </div>
                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Eğitim Durumu (Maks. 15 Puan)" maxScore={15} currentScore={calc.scoreC} hideScore={true}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <CounterItem label="0-6 yaş çocuk (Bakım Yükü)" value={state.c_0_6yas} onChange={(v:any) => set('c_0_6yas', v)} pointsPerItem={2} />
                          <CounterItem label="İlkokul öğrencisi" value={state.c_ilkokul} onChange={(v:any) => set('c_ilkokul', v)} pointsPerItem={2} />
                          <CounterItem label="Ortaokul öğrencisi" value={state.c_ortaokul} onChange={(v:any) => set('c_ortaokul', v)} pointsPerItem={2} />
                          <CounterItem label="Lise öğrencisi" value={state.c_lise} onChange={(v:any) => set('c_lise', v)} pointsPerItem={3} />
                          <CounterItem label="Mesleki Eğitim Merkezi" value={state.c_meslekiEgitim || 0} onChange={(v:any) => set('c_meslekiEgitim', v)} pointsPerItem={3} />
                          <CounterItem label="Açık Lise öğrencisi" value={state.c_acikLise || 0} onChange={(v:any) => set('c_acikLise', v)} pointsPerItem={3} />
                          <CounterItem label="Üniversite öğrencisi (En Yüksek Maliyet)" value={state.c_uni} onChange={(v:any) => set('c_uni', v)} pointsPerItem={4} />
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">D. Barınma Durumu</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Fiziki yaşam alanları ve konut şartları (Genişletilmiş Kriterler)</p>
                    </div>
                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Barınma Şartları (Maks. 10 Puan)" maxScore={10} currentScore={calc.scoreD} hideScore={true}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <CheckboxItem label="Evsiz / Barınaksız / Geçici Sığınma" checked={state.d_evsiz} onChange={(v:any) => set('d_evsiz', v)} points={10} />
                          <CheckboxItem label="Afetzede (Yangın / Deprem / Su Baskını)" checked={state.d_afetzede} onChange={(v:any) => set('d_afetzede', v)} points={10} />
                          <CheckboxItem label="Konut ağır hasarlı / Yıkılma riski var" checked={state.d_agirHasarli} onChange={(v:any) => set('d_agirHasarli', v)} points={8} />
                          <CheckboxItem label="Sağlıksız konut (Rutubetli / Havalandırmasız)" checked={state.d_sagliksiz} onChange={(v:any) => set('d_sagliksiz', v)} points={6} />
                          <CheckboxItem label="Bodrum kat / Sığınak / Dere yatağı" checked={state.d_dereYatagi} onChange={(v:any) => set('d_dereYatagi', v)} points={6} />
                          <CheckboxItem label="Kiracı (Kira ödemekte zorlanan)" checked={state.d_kiraci} onChange={(v:any) => set('d_kiraci', v)} points={5} />
                          <CheckboxItem label="Ev sahibinin tahliye / icra baskısı altında" checked={state.d_tahliyeBaskisi} onChange={(v:any) => set('d_tahliyeBaskisi', v)} points={5} />
                          <CheckboxItem label="Sobalı / Isınma ve yakacak sıkıntısı var" checked={state.d_isinmaProblem} onChange={(v:any) => set('d_isinmaProblem', v)} points={4} />
                          <CheckboxItem label="Gecekondu / İmar sıkıntılı / Hisseli tapu" checked={state.d_gecekondu} onChange={(v:any) => set('d_gecekondu', v)} points={4} />
                          <CheckboxItem label="Asansörsüz yüksek kat (Engelli/Yaşlı/Bakıma muhtaç)" checked={state.d_asansorsuzYuksek} onChange={(v:any) => set('d_asansorsuzYuksek', v)} points={4} />
                          <CheckboxItem label="Hijyen / Islak hacim (Banyo/Tuvalet) ortak veya yetersiz" checked={state.d_tuvaletBanyoYetersiz} onChange={(v:any) => set('d_tuvaletBanyoYetersiz', v)} points={4} />
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">E. Beyaz Eşya ve Ev Aletleri</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Temel eşyaların varlık/yıpranma durumu — Bulaşık makinesi lüks eşya sayıldığından puanlama dışıdır (TÜİK/OECD)</p>
                    </div>
                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Beyaz Eşya ve Cihaz Kontrolü" maxScore={10} currentScore={calc.scoreE} hideScore={true}>
                        <div className="space-y-3">
                          <ApplianceStatusItem label="Buzdolabı" icon={Box} value={state.appliance_buzdolabi} onChange={(v: any) => set('appliance_buzdolabi', v)} pointsYok={3} pointsEski={1.5} />
                          <ApplianceStatusItem label="Çamaşır Makinesi" icon={Shirt} value={state.appliance_camasir} onChange={(v: any) => set('appliance_camasir', v)} pointsYok={3} pointsEski={1.5} />
                          <ApplianceStatusItem label="Fırın / Ocak" icon={Flame} value={state.appliance_firin} onChange={(v: any) => set('appliance_firin', v)} pointsYok={2} pointsEski={1} />
                          <ApplianceStatusItem label="Bulaşık Makinesi (Konfor Eşyası — Puanlama Dışı)" icon={Sparkles} value={state.appliance_bulasik} onChange={(v: any) => set('appliance_bulasik', v)} pointsYok={0} pointsEski={0} />
                          <ApplianceStatusItem label="Televizyon (TV)" icon={Tv} value={state.appliance_tv} onChange={(v: any) => set('appliance_tv', v)} pointsYok={1} pointsEski={0.5} />
                          <ApplianceStatusItem label="Akıllı / Sabit Telefon" icon={Smartphone} value={state.appliance_telefon} onChange={(v: any) => set('appliance_telefon', v)} pointsYok={1} pointsEski={0.5} />
                          <ApplianceStatusItem label="Klima / Isıtıcı" icon={Wind} value={state.appliance_klima} onChange={(v: any) => set('appliance_klima', v)} pointsYok={1} pointsEski={0.5} />
                          <ApplianceStatusItem label="Diğer Temel Aletler" icon={Plug} value={state.appliance_diger} onChange={(v: any) => set('appliance_diger', v)} pointsYok={1} pointsEski={0.5} />
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">F. Sosyal Kırılganlık</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Sosyal kırılganlık durumları (Literatürce Genişletilmiş Seçenekler)</p>
                    </div>
                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Sosyal Kırılganlık ve Nüfus" maxScore={30} currentScore={calc.scoreF} hideScore={true}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-slate-50 dark:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-300 dark:border-slate-700 p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-700 dark:text-slate-300 sm:col-span-2">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                              Hane Nüfusu Etkisi — {state.householdSize || 1} Kişi
                            </span>
                            <span className="bg-blue-100 text-blue-900 font-extrabold px-3 py-1 rounded-md">
                              {(state.householdSize || 1) >= 7 ? `Çok Kalabalık (+6)` :
                               (state.householdSize || 1) >= 5 ? `Kalabalık (+4)` :
                               (state.householdSize || 1) >= 3 ? `Orta Büyüklük (+2)` : `Küçük Hane (+1)`}
                            </span>
                          </div>
                          <CheckboxItem label="Aile içi şiddet mağduru" checked={state.e_siddetMagduru} onChange={(v:any) => set('e_siddetMagduru', v)} points={6} />
                          <CheckboxItem label="Kadın hane reisi" checked={state.e_kadinReis} onChange={(v:any) => set('e_kadinReis', v)} points={5} />
                          <CheckboxItem label="Eşi / Bakmakla yükümlü kişi cezaevinde" checked={state.e_esiCezaevinde} onChange={(v:any) => set('e_esiCezaevinde', v)} points={5} />
                          <CheckboxItem label="Afet / Kaza nedeniyle gelir kaybı" checked={state.e_afetGelirKaybi} onChange={(v:any) => set('e_afetGelirKaybi', v)} points={5} />
                          <CheckboxItem label="Hane içinde madde / alkol bağımlısı birey" checked={state.e_maddeBagimliligi} onChange={(v:any) => set('e_maddeBagimliligi', v)} points={5} />
                          <CheckboxItem label="Sosyal güvencesiz ve aile desteğinden yoksun" checked={state.e_sosyalGuvencesiz} onChange={(v:any) => set('e_sosyalGuvencesiz', v)} points={5} />
                          <CheckboxItem label="Yüksek borç / icra / haciz baskısı altında" checked={state.e_icraBorcBaskisi} onChange={(v:any) => set('e_icraBorcBaskisi', v)} points={4} />
                          <CheckboxItem label="Bakıma muhtaç bebek (0-1 Yaş) veya riskli gebelik" checked={state.e_gebelikBebek} onChange={(v:any) => set('e_gebelikBebek', v)} points={4} />
                          <CheckboxItem label="Boşanmış / Terk edilmiş eş" checked={state.e_bosanmis} onChange={(v:any) => set('e_bosanmis', v)} points={3} />
                          <CheckboxItem label="Dul (Eşi vefat etmiş)" checked={state.e_dul} onChange={(v:any) => set('e_dul', v)} points={3} />
                          <CheckboxItem label="Denetimli serbestlik / Eski hükümlü ikameti" checked={state.e_hukumluYakin} onChange={(v:any) => set('e_hukumluYakin', v)} points={3} />
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">G. Sosyal İnceleme Kanaati</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Görevlinin saha gözlemine dayalı kanaat değerlendirmesi</p>
                    </div>

                    <div className="bg-blue-950/60 border border-blue-500/30 rounded-2xl p-4 text-xs text-blue-200 space-y-2">
                      <div className="flex items-center gap-2 font-black text-blue-300">
                        <Info size={18} className="text-blue-400 shrink-0" />
                        <span>Kanaat Değerlendirme Rehberi</span>
                      </div>
                      <p className="leading-relaxed">
                        0 (İyi/Yeterli) ile 5 (Çok Kötü/Acil) arası seviye seçiniz.
                      </p>
                    </div>

                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Kanaat Notları" maxScore={10} currentScore={calc.scoreF} hideScore={true}>
                         <div className="space-y-3">
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
                  </div>
                )}

                {step === 8 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">Sistem Kontrolleri</h2>
                      <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs mt-1">Kayıt öncesi zorunlu kurum veritabanı inceleme başlıkları.</p>
                    </div>

                    <div className="text-slate-900 dark:text-slate-900 dark:text-slate-100">
                      <SectionCard title="Varlık Testi ve Kontrol Listesi" maxScore={0} currentScore={0} hideScore={true}>
                         {/* Zorunlu Onay */}
                         <div className="mb-5 space-y-3">
                            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${state.systemChecksDone ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30' : 'bg-white dark:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:bg-white dark:bg-slate-900'}`}>
                              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 mr-4"
                                checked={state.systemChecksDone} onChange={(e) => set('systemChecksDone', e.target.checked)} />
                              <span className={`font-bold text-sm ${state.systemChecksDone ? 'text-emerald-900' : 'text-slate-800 dark:text-slate-800 dark:text-slate-200'}`}>
                                Zorunlu sistem sorgularını (Araç Tescil, Tapu, SGK) tamamladım ve aşağıdaki sonuçları girdim.
                              </span>
                            </label>
                            {!state.systemChecksDone && (
                              <p className="text-amber-600 text-xs font-bold flex items-center gap-1"><AlertTriangle size={14}/> Sonraki adıma geçmek için onaylamanız gereklidir.</p>
                            )}
                         </div>

                         {/* Varlık Testi Sonuçları */}
                         <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5 space-y-3">
                           <h4 className="text-sm font-extrabold text-orange-900 flex items-center gap-2">
                             <AlertTriangle size={16} className="text-orange-600" />
                             Sorgu Sonuçları — Ceza Puanları Uygulanır
                           </h4>
                           <CheckboxItem label="Araç tescil kaydı tespit edildi (−15 Puan)" checked={state.a_aracSahibi} onChange={(v:any) => set('a_aracSahibi', v)} isAlert={true} points={null} />
                           <CheckboxItem label="Birden fazla taşınmaz (gayrimenkul) kaydı var (−20 Puan)" checked={state.a_birdenFazlaTasinmaz} onChange={(v:any) => set('a_birdenFazlaTasinmaz', v)} isAlert={true} points={null} />
                           <CheckboxItem label="Aktif SGK prim ödemesi tespit edildi → A bölümü puanı sıfırlanır" checked={state.a_aktifSgkPrim} onChange={(v:any) => set('a_aktifSgkPrim', v)} isAlert={true} points={null} />
                           <div className="space-y-2 pt-2 border-t border-orange-200">
                             <CheckboxItem label="Son 3 ayda bu vakıftan yardım aldığı tespit edildi" checked={state.a_son3AyYardimAldi} onChange={(v:any) => { set('a_son3AyYardimAldi', v); if (!v) set('a_son3AyYardimKisi', 0); }} isAlert={true} points={null} />
                             {state.a_son3AyYardimAldi && (
                               <div className="flex items-center gap-3 pl-9">
                                 <label className="text-xs font-bold text-orange-800">Kaç kişi yardım aldı? (Her kişi −5 puan)</label>
                                 <div className="flex items-center gap-2">
                                   <button type="button" onClick={() => set('a_son3AyYardimKisi', Math.max(0, (state.a_son3AyYardimKisi||0) - 1))} className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-black border border-orange-300 flex items-center justify-center">-</button>
                                   <span className="w-8 text-center font-black text-orange-900">{state.a_son3AyYardimKisi || 0}</span>
                                   <button type="button" onClick={() => set('a_son3AyYardimKisi', (state.a_son3AyYardimKisi||0) + 1)} className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-black border border-orange-300 flex items-center justify-center">+</button>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>

                         {/* Ceza özeti */}
                         {calc.scorePenalty > 0 && (
                           <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm font-bold text-red-800 flex items-center gap-2">
                             <AlertTriangle size={16} className="text-red-600 shrink-0" />
                             Toplam Ceza Puanı: −{calc.scorePenalty} puan uygulanacaktır.
                           </div>
                         )}

                         <div className="pt-4 border-t border-red-100">
                           <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${state.falseStatement ? 'bg-red-50 border-red-400 ring-2 ring-red-400/30' : 'bg-white dark:bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-300 dark:border-slate-700 hover:bg-red-50/50'}`}>
                             <input type="checkbox" className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 mt-0.5"
                               checked={state.falseStatement} onChange={(e) => set('falseStatement', e.target.checked)} />
                             <div className="ml-3 flex flex-col">
                               <span className="text-sm font-bold text-red-700">DİKKAT: Gerçeğe Aykırı Beyan TESPİT EDİLDİ!</span>
                               <span className="text-xs font-semibold text-red-500 mt-0.5">(İşaretlenirse başvuruyu doğrudan reddeder)</span>
                             </div>
                           </label>
                         </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 9 && (
                  <div className="flex-1 flex flex-col justify-center items-center py-6">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl text-center w-full max-w-lg space-y-6"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20">
                        <Save size={36} />
                      </div>

                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">İncelemeyi Tamamla & Kaydet</h2>
                        <p className="text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                          Tüm adımlar tamamlandı. Formu sisteme kaydederek Vakıf onay sürecine sunabilirsiniz.
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                          <ShieldCheck size={16} /> Saha Güvenlik Protokolü Etkin
                        </div>
                        <h3 className="text-sm font-extrabold text-white">Gizli Değerlendirme Modu</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                          Saha ziyareti sırasında hane halkı gizliliği gereği puan sonucu ekranda gösterilmemektedir. Form kaydedildikten sonra detay ve yönetim ekranlarından puan kümülasyonunu inceleyebilirsiniz.
                        </p>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-950/50 flex justify-center items-center gap-2"
                      >
                        <Save size={20} /> Formu Kaydet ve Onaya Gönder
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* Floating Sticky Ergonomic Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-2xl z-40 flex items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`flex items-center justify-center px-4 py-3 rounded-2xl font-bold text-sm min-h-[48px] transition-all touch-manipulation ${
            step === 0 
              ? 'bg-slate-100/40 dark:bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" /> Geri
        </motion.button>
        
        <div className="text-center">
          <span className="text-[9px] font-black text-slate-600 dark:text-slate-500 dark:text-slate-400 block uppercase tracking-widest">Saha Formu</span>
          <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">Adım {step + 1} / {stepsCount}</span>
        </div>

        {step < stepsCount - 1 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setStep(s => Math.min(stepsCount - 1, s + 1))}
            disabled={!canProceed}
            className={`flex items-center justify-center px-5 py-3 rounded-2xl font-black text-sm min-h-[48px] transition-all shadow-lg touch-manipulation ${
              !canProceed
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500 dark:text-slate-600 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
            }`}
          >
            Sonraki Adım <ChevronRight size={20} className="ml-1" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center px-5 py-3 rounded-2xl font-black text-sm min-h-[48px] bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-900/30 transition-all touch-manipulation"
          >
            <Save size={18} className="mr-1.5" /> Kaydet ve Bitir
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

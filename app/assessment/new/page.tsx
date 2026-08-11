"use client";
/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ChevronRight, ChevronLeft, Save, AlertTriangle, ArrowLeft, CheckCircle2, Info,
  Tv, Smartphone, Wind, Flame, Box, Shirt, Sparkles, Plug, User, MapPin, Phone, Hash, Users, Activity
} from 'lucide-react';
import { saveAssessment, calculateAssistanceFromScore } from '@/lib/db';
import { SectionCard, CheckboxItem, RadioItem, ScoreButtons, CounterItem, ApplianceStatusItem } from '@/components/ui-components';
import Link from 'next/link';

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingId = searchParams?.get('meetingId') || undefined;
  
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userStr));
    }
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
    b_ozelSebepMetin: "",
    b_ozelSebepPuan: 0,
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
    // Check
    systemChecksDone: false,
    falseStatement: false,
  });

  const set = (key: string, value: any) => setState(s => ({ ...s, [key]: value }));

  const calc = useMemo(() => {
    // Section A: Ekonomik Durum (Maksimum 40 Puan)
    let scoreA = state.income;
    if (state.noWorker) scoreA += 10;
    if (state.noRegularIncome) scoreA += 5;
    if (state.noSgk) scoreA += 5;
    scoreA = Math.max(0, Math.min(scoreA, 40));

    // Section B: Dezavantajlı Bireyler (Maksimum 35 Puan)
    let scoreB = 0;
    if (state.b_agirEngelli) scoreB += 15;
    if (state.b_engelli) scoreB += 10;
    if (state.b_evdeBakim) scoreB += 10;
    if (state.b_kanser) scoreB += 10;
    if (state.b_kronik) scoreB += 6;
    if (state.b_yasliYalniz) scoreB += 8;
    if (state.b_sehitYakini) scoreB += 8;
    if (state.b_gazi) scoreB += 8;
    if (state.b_yetim) scoreB += 5;
    if (state.b_koruyucuAile) scoreB += 5;
    if (state.b_yabanciUyruklu) scoreB += 3;
    if (state.b_ozelSebepPuan && Number(state.b_ozelSebepPuan) > 0) scoreB += Number(state.b_ozelSebepPuan);

    // Birden fazla dezavantajlı birey/durum mevcudiyeti ekstra puan bonusu (+5 Ek Puan)
    const disadvantageCount = [
      state.b_agirEngelli,
      state.b_engelli,
      state.b_evdeBakim,
      state.b_kanser,
      state.b_kronik,
      state.b_yasliYalniz,
      state.b_sehitYakini,
      state.b_gazi,
      state.b_yetim,
      state.b_koruyucuAile,
      state.b_yabanciUyruklu
    ].filter(Boolean).length;

    if (disadvantageCount >= 2) {
      scoreB += 5;
    }
    scoreB = Math.min(scoreB, 35);

    // Section C: Çocuk ve Eğitim (Tüm Eğitim Kademeleri Eşit +3 Puan / Öğrenci)
    let scoreC = 0;
    scoreC += (state.c_0_6yas || 0) * 3;
    scoreC += (state.c_ilkokul || 0) * 3;
    scoreC += (state.c_ortaokul || 0) * 3;
    scoreC += (state.c_lise || 0) * 3;
    scoreC += (state.c_meslekiEgitim || 0) * 3;
    scoreC += (state.c_acikLise || 0) * 3;
    scoreC += (state.c_uni || 0) * 3;
    scoreC = Math.min(scoreC, 15);

    // Section D: Barınma Durumu (Genişletilmiş Sosyal Kriterler - Maksimum 15 Puan)
    let scoreD = 0;
    if (state.d_evsiz) scoreD += 10;
    if (state.d_afetzede) scoreD += 10;
    if (state.d_agirHasarli) scoreD += 8;
    if (state.d_sagliksiz) scoreD += 6;
    if (state.d_dereYatagi) scoreD += 6;
    if (state.d_kiraci) scoreD += 5;
    if (state.d_tahliyeBaskisi) scoreD += 5;
    if (state.d_isinmaProblem) scoreD += 4;
    if (state.d_gecekondu) scoreD += 4;
    if (state.d_asansorsuzYuksek) scoreD += 4;
    if (state.d_tuvaletBanyoYetersiz) scoreD += 4;
    scoreD = Math.min(scoreD, 15);

    // Section E: Beyaz Eşya Durumu (Maksimum 10 Puan)
    let rawScoreE = 0;
    if (state.appliance_buzdolabi === 'yok') rawScoreE += 3;
    else if (state.appliance_buzdolabi === 'eski') rawScoreE += 1.5;

    if (state.appliance_camasir === 'yok') rawScoreE += 3;
    else if (state.appliance_camasir === 'eski') rawScoreE += 1.5;

    if (state.appliance_firin === 'yok') rawScoreE += 2;
    else if (state.appliance_firin === 'eski') rawScoreE += 1;

    if (state.appliance_bulasik === 'yok') rawScoreE += 1;
    else if (state.appliance_bulasik === 'eski') rawScoreE += 0.5;

    if (state.appliance_tv === 'yok') rawScoreE += 1;
    else if (state.appliance_tv === 'eski') rawScoreE += 0.5;

    if (state.appliance_telefon === 'yok') rawScoreE += 1;
    else if (state.appliance_telefon === 'eski') rawScoreE += 0.5;

    if (state.appliance_klima === 'yok') rawScoreE += 1;
    else if (state.appliance_klima === 'eski') rawScoreE += 0.5;

    if (state.appliance_diger === 'yok') rawScoreE += 1;
    else if (state.appliance_diger === 'eski') rawScoreE += 0.5;

    let scoreE = Math.min(10, Math.round(rawScoreE));

    // Section F: Sosyal Kırılganlık (Genişletilmiş Literatür Seçenekleri - Maksimum 15 Puan)
    let scoreF = 0;
    if (state.e_siddetMagduru) scoreF += 6;
    if (state.e_kadinReis) scoreF += 5;
    if (state.e_esiCezaevinde) scoreF += 5;
    if (state.e_afetGelirKaybi) scoreF += 5;
    if (state.e_maddeBagimliligi) scoreF += 5;
    if (state.e_sosyalGuvencesiz) scoreF += 5;
    if (state.e_icraBorcBaskisi) scoreF += 4;
    if (state.e_gebelikBebek) scoreF += 4;
    if (state.e_bosanmis) scoreF += 3;
    if (state.e_dul) scoreF += 3;
    if (state.e_hukumluYakin) scoreF += 3;

    const hhSize = state.householdSize || 1;
    if (hhSize >= 5) {
      scoreF += 3;
    } else if (hhSize >= 1) {
      scoreF += 1;
    }

    scoreF = Math.min(scoreF, 15);

    // Section G: Sosyal İnceleme Kanaati (Maksimum 20 Puan)
    let scoreG = state.f_yasamKosullari + state.f_aciliyet + state.f_sosyalDestek + state.f_risk;
    scoreG = Math.min(scoreG, 20);

    let totalScore = state.falseStatement ? 0 : (scoreA + scoreB + scoreC + scoreD + scoreE + scoreF + scoreG);
    const assistance = calculateAssistanceFromScore(totalScore, !!state.falseStatement);

    const priorities = [];
    if (state.b_agirEngelli) priorities.push("Ağır engelli bulunan hane");
    if (disadvantageCount >= 2) priorities.push("Birden Fazla Dezavantajlı Birey / Durum");
    if (state.b_yetim) priorities.push("Yetim çocuk bulunan hane");
    if (state.b_sehitYakini || state.b_gazi) priorities.push("Şehit / Gazi Ailesi");
    if (state.d_afetzede || state.e_afetGelirKaybi) priorities.push("Afet Mağduru");
    if (state.b_yasliYalniz) priorities.push("Yaşlı ve Yalnız Yaşayan");
    if (state.e_siddetMagduru) priorities.push("Aile İçi Şiddet Mağduru");
    if (state.appliance_buzdolabi === 'yok' || state.appliance_camasir === 'yok') {
      priorities.push("Temel Ev Eşyası Eksikliği (Buzdolabı / Çamaşır M.)");
    }

    return { scoreA, scoreB, scoreC, scoreD, scoreE, scoreF, scoreG, totalScore, assistance, priorities, isRejected: state.falseStatement, disadvantageCount };
  }, [state]);

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
          scoreG: calc.scoreG,
          totalScore: calc.totalScore,
          assistance: calc.assistance,
          priorities: calc.priorities,
          isRejected: calc.isRejected
        }
      };
      await saveAssessment(assessmentData);
      router.push(`/assessment/${assessmentData.id}`);
    } catch (err) {
      alert("Kayıt sırasında hata oluştu!");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Animated Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-xl transition-all active:scale-95 touch-manipulation text-slate-300 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="w-10 h-10 rounded-2xl shadow-md border-2 border-slate-700 object-cover shrink-0" 
          />
          <div>
            <h1 className="text-xs sm:text-base font-black tracking-tight uppercase bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Saha İnceleme Sihirbazı
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <span>Adım {step + 1} / {stepsCount}:</span>
              <span className="text-blue-400 font-extrabold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                {stepNames[step]}
              </span>
            </p>
          </div>
        </div>

        {/* Live Score Pill in Header replaced with Privacy Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end border-r border-slate-800 pr-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Görevli Personel</span>
            <span className="text-xs font-bold text-slate-200">{user.name}</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-2xl text-right shrink-0 flex items-center gap-2">
            <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest leading-none">Saha Kayıt Modu</p>
              <p className="text-xs font-black text-slate-200 mt-0.5 leading-none">Puan Gizli</p>
            </div>
          </div>
        </div>
      </header>

      {/* Animated Glowing Progress Bar */}
      <div className="h-1.5 bg-slate-800 shrink-0 relative overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / stepsCount) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Touch-Friendly Step Pill Navigation Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-3 py-2.5 flex items-center gap-1.5 overflow-x-auto shrink-0 shadow-inner no-scrollbar">
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
                  ? 'bg-slate-800/80 text-blue-300 hover:bg-slate-800 border border-slate-700/50'
                  : 'bg-slate-900/60 text-slate-500 hover:bg-slate-800/40 border border-slate-800'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              ) : (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
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
      <div className="flex-1 flex flex-col pb-28 bg-slate-950/40">
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
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">Saha incelemesi yapılan hanenin kimlik, iletişim ve ikamet detayları.</p>
                    </div>

                    <div className="bg-slate-900/90 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <User size={14} className="text-blue-400" /> Başvuru Sahibinin Adı Soyadı *
                          </label>
                          <input 
                            type="text" 
                            value={state.applicantName}
                            onChange={e => set('applicantName', e.target.value)}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Örn: Ayşe Yılmaz"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Hash size={14} className="text-blue-400" /> T.C. Kimlik Numarası (11 Hane) *
                          </label>
                          <input 
                            type="text" 
                            maxLength={11}
                            inputMode="numeric"
                            value={state.applicantTc}
                            onChange={e => set('applicantTc', e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner"
                            placeholder="11 Haneli TC No"
                          />
                          {state.applicantTc.length > 0 && state.applicantTc.length < 11 && (
                            <p className="text-amber-400 text-xs mt-2 flex items-center font-bold"><AlertTriangle size={14} className="mr-1 shrink-0"/> TC Kimlik Numarası 11 hane olmalıdır.</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Phone size={14} className="text-blue-400" /> Telefon Numarası
                          </label>
                          <input 
                            type="tel" 
                            value={state.phoneNumber}
                            onChange={e => set('phoneNumber', e.target.value)}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Örn: 0555 555 5555"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Hash size={14} className="text-blue-400" /> Hane Numarası (Sistem Ref)
                          </label>
                          <input 
                            type="text" 
                            value={state.householdNo}
                            onChange={e => set('householdNo', e.target.value)}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
                            placeholder="Örn: HN-12345"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Users size={14} className="text-blue-400" /> Hanedeki Toplam Kişi Sayısı
                          </label>
                          <input 
                            type="number" 
                            min="1"
                            value={state.householdSize}
                            onChange={e => set('householdSize', parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MapPin size={14} className="text-blue-400" /> İkamet Adresi
                          </label>
                          <textarea 
                            value={state.applicantAddress}
                            onChange={e => set('applicantAddress', e.target.value)}
                            rows={2}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-3.5 px-4 text-base font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner"
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
                      <h2 className="text-xl font-black text-white">A. Ekonomik Durum</h2>
                      <p className="text-slate-400 text-xs mt-1">Hane halkı gelir ve sigorta durumuna göre değerlendirme</p>
                    </div>
                    
                    <div className="text-slate-900">
                      <SectionCard title="Gelir Seviyesi" maxScore={40} currentScore={calc.scoreA} hideScore={true}>
                        <div className="space-y-3">
                          <RadioItem label="Kişi başına gelir muhtaçlık sınırının %25 altında" name="income" checked={state.income === 40} onChange={() => set('income', 40)} points={40} />
                          <RadioItem label="Muhtaçlık sınırının %25 – 50 arasında" name="income" checked={state.income === 35} onChange={() => set('income', 35)} points={35} />
                          <RadioItem label="Muhtaçlık sınırının %50 – 75 arasında" name="income" checked={state.income === 25} onChange={() => set('income', 25)} points={25} />
                          <RadioItem label="Muhtaçlık sınırının %75 – 100 arasında" name="income" checked={state.income === 15} onChange={() => set('income', 15)} points={15} />
                          <RadioItem label="Muhtaçlık sınırı üzerinde" name="income" checked={state.income === 0} onChange={() => set('income', 0)} points={0} />
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-100">
                          <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">İlave / Düzeltme Kriterleri</h3>
                          <div className="grid grid-cols-1 gap-3">
                            <CheckboxItem label="Hanede çalışan yok" checked={state.noWorker} onChange={(v:any) => set('noWorker', v)} points={10} />
                            <CheckboxItem label="Düzenli gelir bulunmuyor" checked={state.noRegularIncome} onChange={(v:any) => set('noRegularIncome', v)} points={5} />
                            <CheckboxItem label="SGK kaydı yok" checked={state.noSgk} onChange={(v:any) => set('noSgk', v)} points={5} />
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-white">B. Dezavantajlı Bireyler</h2>
                      <p className="text-slate-400 text-xs mt-1">Hanedeki sağlık ve özel sosyal kırılganlık durumları</p>
                    </div>

                    <div className="text-slate-900">
                      <SectionCard title="Hanehalkı Özel Durumları" maxScore={35} currentScore={calc.scoreB} hideScore={true}>
                        {calc.disadvantageCount >= 2 && (
                          <div className="mb-4 bg-amber-50 border border-amber-300 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900">
                            <span>Hanede Birden Fazla ({calc.disadvantageCount} Adet) Dezavantajlı Durum Mevcut</span>
                            <span className="bg-amber-200 text-amber-950 px-2.5 py-1 rounded-md font-extrabold">+5 Ek Bonus Puan</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <CheckboxItem label="Ağır engelli (%70+)" checked={state.b_agirEngelli} onChange={(v:any) => set('b_agirEngelli', v)} points={15} />
                          <CheckboxItem label="Engelli (%40-69)" checked={state.b_engelli} onChange={(v:any) => set('b_engelli', v)} points={10} />
                          <CheckboxItem label="Evde bakım hastası" checked={state.b_evdeBakim} onChange={(v:any) => set('b_evdeBakim', v)} points={10} />
                          <CheckboxItem label="Kanser tedavisi" checked={state.b_kanser} onChange={(v:any) => set('b_kanser', v)} points={10} />
                          <CheckboxItem label="Kronik hastalık" checked={state.b_kronik} onChange={(v:any) => set('b_kronik', v)} points={6} />
                          <CheckboxItem label="65 yaş üstü yalnız yaşayan" checked={state.b_yasliYalniz} onChange={(v:any) => set('b_yasliYalniz', v)} points={8} />
                          <CheckboxItem label="Şehit yakını" checked={state.b_sehitYakini} onChange={(v:any) => set('b_sehitYakini', v)} points={8} />
                          <CheckboxItem label="Gazi" checked={state.b_gazi} onChange={(v:any) => set('b_gazi', v)} points={8} />
                          <CheckboxItem label="Yetim/öksüz çocuk" checked={state.b_yetim} onChange={(v:any) => set('b_yetim', v)} points={5} />
                          <CheckboxItem label="Koruyucu aile" checked={state.b_koruyucuAile} onChange={(v:any) => set('b_koruyucuAile', v)} points={5} />
                          <CheckboxItem label="Yabancı uyruklu / Sığınmacı" checked={state.b_yabanciUyruklu} onChange={(v:any) => set('b_yabanciUyruklu', v)} points={3} />
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100">
                          <h3 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500" />
                            Özel Sebep / Özel Durum Tanımlama
                          </h3>
                          <p className="text-xs text-slate-500 mb-3">
                            Standart kriterlerin dışındaki özel durumlara ilave değer ekleyebilirsiniz.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Özel Sebep Açıklaması
                              </label>
                              <input
                                type="text"
                                value={state.b_ozelSebepMetin || ''}
                                onChange={(e) => set('b_ozelSebepMetin', e.target.value)}
                                placeholder="Örn: Organ nakli, nadir hastalık vb."
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                İlave Değer
                              </label>
                              <select
                                value={state.b_ozelSebepPuan || 0}
                                onChange={(e) => set('b_ozelSebepPuan', Number(e.target.value))}
                                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-bold text-slate-800"
                              >
                                <option value={0}>Ekleme Yok</option>
                                <option value={10}>+10 Kademe</option>
                                <option value={15}>+15 Kademe</option>
                                <option value={20}>+20 Kademe</option>
                                <option value={25}>+25 Kademe</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-white">C. Çocuk ve Eğitim</h2>
                      <p className="text-slate-400 text-xs mt-1">Hanedeki eğitim gören tüm kademelerdeki çocuklar ve öğrenciler (Tüm Kademeler Eşit)</p>
                    </div>
                    <div className="text-slate-900">
                      <SectionCard title="Eğitim Durumu" maxScore={15} currentScore={calc.scoreC} hideScore={true}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <CounterItem label="0-6 yaş çocuk" value={state.c_0_6yas} onChange={(v:any) => set('c_0_6yas', v)} pointsPerItem={3} />
                          <CounterItem label="İlkokul öğrencisi" value={state.c_ilkokul} onChange={(v:any) => set('c_ilkokul', v)} pointsPerItem={3} />
                          <CounterItem label="Ortaokul öğrencisi" value={state.c_ortaokul} onChange={(v:any) => set('c_ortaokul', v)} pointsPerItem={3} />
                          <CounterItem label="Lise öğrencisi" value={state.c_lise} onChange={(v:any) => set('c_lise', v)} pointsPerItem={3} />
                          <CounterItem label="Mesleki Eğitim Merkezi" value={state.c_meslekiEgitim || 0} onChange={(v:any) => set('c_meslekiEgitim', v)} pointsPerItem={3} />
                          <CounterItem label="Açık Lise öğrencisi" value={state.c_acikLise || 0} onChange={(v:any) => set('c_acikLise', v)} pointsPerItem={3} />
                          <CounterItem label="Üniversite öğrencisi" value={state.c_uni} onChange={(v:any) => set('c_uni', v)} pointsPerItem={3} />
                        </div>
                      </SectionCard>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="flex-1 space-y-4">
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md">
                      <h2 className="text-xl font-black text-white">D. Barınma Durumu</h2>
                      <p className="text-slate-400 text-xs mt-1">Fiziki yaşam alanları ve konut şartları (Genişletilmiş Kriterler)</p>
                    </div>
                    <div className="text-slate-900">
                      <SectionCard title="Barınma Şartları" maxScore={15} currentScore={calc.scoreD} hideScore={true}>
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
                      <h2 className="text-xl font-black text-white">E. Beyaz Eşya ve Ev Aletleri</h2>
                      <p className="text-slate-400 text-xs mt-1">Hanedeki temel eşyaların varlık ve yıpranma durumu</p>
                    </div>
                    <div className="text-slate-900">
                      <SectionCard title="Beyaz Eşya ve Cihaz Kontrolü" maxScore={10} currentScore={calc.scoreE} hideScore={true}>
                        <div className="space-y-3">
                          <ApplianceStatusItem label="Buzdolabı" icon={Box} value={state.appliance_buzdolabi} onChange={(v: any) => set('appliance_buzdolabi', v)} pointsYok={3} pointsEski={1.5} />
                          <ApplianceStatusItem label="Çamaşır Makinesi" icon={Shirt} value={state.appliance_camasir} onChange={(v: any) => set('appliance_camasir', v)} pointsYok={3} pointsEski={1.5} />
                          <ApplianceStatusItem label="Fırın / Ocak" icon={Flame} value={state.appliance_firin} onChange={(v: any) => set('appliance_firin', v)} pointsYok={2} pointsEski={1} />
                          <ApplianceStatusItem label="Bulaşık Makinesi" icon={Sparkles} value={state.appliance_bulasik} onChange={(v: any) => set('appliance_bulasik', v)} pointsYok={1} pointsEski={0.5} />
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
                      <h2 className="text-xl font-black text-white">F. Sosyal Kırılganlık</h2>
                      <p className="text-slate-400 text-xs mt-1">Sosyal kırılganlık durumları (Literatürce Genişletilmiş Seçenekler)</p>
                    </div>
                    <div className="text-slate-900">
                      <SectionCard title="Sosyal Kırılganlık" maxScore={15} currentScore={calc.scoreF} hideScore={true}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 sm:col-span-2">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                              Hane Nüfusu Etkisi ({state.householdSize || 1} Kişi)
                            </span>
                            <span className="bg-blue-100 text-blue-900 font-extrabold px-3 py-1 rounded-md">
                              {(state.householdSize || 1) >= 5 ? 'Kalabalık Hane' : 'Standart Hane'}
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
                      <h2 className="text-xl font-black text-white">G. Sosyal İnceleme Kanaati</h2>
                      <p className="text-slate-400 text-xs mt-1">Görevlinin saha gözlemine dayalı kanaat değerlendirmesi</p>
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

                    <div className="text-slate-900">
                      <SectionCard title="Kanaat Notları" maxScore={20} currentScore={calc.scoreG} hideScore={true}>
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
                      <h2 className="text-xl font-black text-white">Sistem Kontrolleri</h2>
                      <p className="text-slate-400 text-xs mt-1">Kayıt öncesi zorunlu kurum veritabanı inceleme başlıkları.</p>
                    </div>

                    <div className="text-slate-900">
                      <SectionCard title="Kontrol Listesi" maxScore={0} currentScore={0} hideScore={true}>
                         <div className="mb-6 space-y-3">
                            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${state.systemChecksDone ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-4"
                                checked={state.systemChecksDone}
                                onChange={(e) => set('systemChecksDone', e.target.checked)}
                              />
                              <span className={`font-bold text-sm ${state.systemChecksDone ? 'text-emerald-900' : 'text-slate-800'}`}>
                                Zorunlu sistem kontrollerini (Araç, Tapu, SGK vb.) yaptım.
                              </span>
                            </label>

                            {!state.systemChecksDone && (
                              <p className="text-amber-600 text-xs font-bold flex items-center gap-1"><AlertTriangle size={14}/> Sonraki adıma geçmek için onaylamanız gereklidir.</p>
                            )}
                         </div>
                         
                         <div className="pt-4 border-t border-red-100">
                           <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${state.falseStatement ? 'bg-red-50 border-red-400 ring-2 ring-red-400/30' : 'bg-white border-slate-200 hover:bg-red-50/50'}`}>
                             <input
                               type="checkbox"
                               className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 mt-0.5"
                               checked={state.falseStatement}
                               onChange={(e) => set('falseStatement', e.target.checked)}
                             />
                             <div className="ml-3 flex flex-col">
                               <span className="text-sm font-bold text-red-700">DİKKAT: Gerçeğe Aykırı Beyan TESPİT EDİLDİ!</span>
                               <span className="text-xs font-semibold text-red-500 mt-0.5">
                                 (İşaretlenirse başvuruyu doğrudan reddeder ve onay sürecinde işleme alınmaz)
                               </span>
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
                      className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center w-full max-w-lg space-y-6"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20">
                        <Save size={36} />
                      </div>

                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">İncelemeyi Tamamla & Kaydet</h2>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">
                          Tüm adımlar tamamlandı. Formu sisteme kaydederek Vakıf onay sürecine sunabilirsiniz.
                        </p>
                      </div>
                      
                      <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-3 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                          <ShieldCheck size={16} /> Saha Güvenlik Protokolü Etkin
                        </div>
                        <h3 className="text-sm font-extrabold text-white">Gizli Değerlendirme Modu</h3>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                          Saha ziyareti sırasında hane halkı gizliliği gereği puan sonucu ekranda gösterilmemektedir. Form kaydedildikten sonra detay ve yönetim ekranlarından puan kümülasyonunu inceleyebilirsiniz.
                        </p>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-950/50 flex justify-center items-center gap-2"
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
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-3 sm:p-4 shadow-2xl z-40 flex items-center justify-between gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`flex items-center justify-center px-4 py-3 rounded-2xl font-bold text-sm min-h-[48px] transition-all touch-manipulation ${
            step === 0 
              ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" /> Geri
        </motion.button>
        
        <div className="text-center">
          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-widest">Saha Formu</span>
          <span className="text-xs sm:text-sm font-black text-slate-300">Adım {step + 1} / {stepsCount}</span>
        </div>

        {step < stepsCount - 1 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setStep(s => Math.min(stepsCount - 1, s + 1))}
            disabled={!canProceed}
            className={`flex items-center justify-center px-5 py-3 rounded-2xl font-black text-sm min-h-[48px] transition-all shadow-lg touch-manipulation ${
              !canProceed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
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
            className="flex items-center justify-center px-5 py-3 rounded-2xl font-black text-sm min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all touch-manipulation"
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
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center font-bold">Form yükleniyor...</div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}

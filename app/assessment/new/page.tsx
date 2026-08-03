"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, ChevronRight, ChevronLeft, Save, AlertTriangle, ArrowLeft, CheckCircle2,
  Tv, Smartphone, Wind, Flame, Box, Shirt, Sparkles, Plug
} from 'lucide-react';
import { saveAssessment } from '@/lib/db';
import { SectionCard, CheckboxItem, RadioItem, ScoreButtons, CounterItem, ApplianceStatusItem } from '@/components/ui-components';
import Link from 'next/link';

export default function NewAssessmentWizard() {
  const router = useRouter();
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
    // C
    c_0_6yas: 0,
    c_ilkokul: 0,
    c_ortaokul: 0,
    c_lise: 0,
    c_uni: 0,
    // D
    d_evsiz: false,
    d_afetzede: false,
    d_kiraci: false,
    d_agirHasarli: false,
    d_sagliksiz: false,
    // E - Beyaz Eşya
    appliance_buzdolabi: 'yeni',
    appliance_camasir: 'yeni',
    appliance_bulasik: 'yeni',
    appliance_firin: 'yeni',
    appliance_tv: 'yeni',
    appliance_telefon: 'yeni',
    appliance_klima: 'yeni',
    appliance_diger: 'yeni',
    // F - Sosyal Kırılganlık
    e_kadinReis: false,
    e_bosanmis: false,
    e_esiCezaevinde: false,
    e_siddetMagduru: false,
    e_afetGelirKaybi: false,
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
    // Section A
    let scoreA = state.income;
    if (state.noWorker) scoreA += 10;
    if (state.noRegularIncome) scoreA += 5;
    if (state.noSgk) scoreA += 5;
    scoreA = Math.min(scoreA, 40);

    // Section B
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
    scoreB = Math.min(scoreB, 30);

    // Section C
    let scoreC = 0;
    scoreC += state.c_0_6yas * 2;
    scoreC += state.c_ilkokul * 1;
    scoreC += state.c_ortaokul * 2;
    scoreC += state.c_lise * 3;
    scoreC += state.c_uni * 4;
    scoreC = Math.min(scoreC, 10);

    // Section D
    let scoreD = 0;
    if (state.d_evsiz) scoreD += 10;
    if (state.d_afetzede) scoreD += 10;
    if (state.d_kiraci) scoreD += 5;
    if (state.d_agirHasarli) scoreD += 8;
    if (state.d_sagliksiz) scoreD += 6;
    scoreD = Math.min(scoreD, 10);

    // Section E: Beyaz Eşya Durumu (Maks 10 Puan)
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

    // Section F: Sosyal Kırılganlık (Maks 10 Puan)
    let scoreF = 0;
    if (state.e_kadinReis) scoreF += 5;
    if (state.e_bosanmis) scoreF += 3;
    if (state.e_esiCezaevinde) scoreF += 5;
    if (state.e_siddetMagduru) scoreF += 6;
    if (state.e_afetGelirKaybi) scoreF += 5;
    scoreF = Math.min(scoreF, 10);

    // Section G: Sosyal İnceleme Kanaati (Maks 20 Puan)
    let scoreG = state.f_yasamKosullari + state.f_aciliyet + state.f_sosyalDestek + state.f_risk;
    scoreG = Math.min(scoreG, 20);

    let totalScore = state.falseStatement ? 0 : (scoreA + scoreB + scoreC + scoreD + scoreE + scoreF + scoreG);

    let assistance = { text: "Yardım uygun görülmez (veya Ayni)", amount: 0 };
    if (!state.falseStatement) {
      if (totalScore >= 91) assistance = { text: "10.000 TL Nakdi Yardım", amount: 10000 };
      else if (totalScore >= 71) assistance = { text: "7.500 TL Nakdi Yardım", amount: 7500 };
      else if (totalScore >= 51) assistance = { text: "5.000 TL Nakdi Yardım", amount: 5000 };
      else if (totalScore >= 31) assistance = { text: "2.500 TL Nakdi Yardım", amount: 2500 };
    } else {
      assistance = { text: "REDDEDİLDİ", amount: 0 };
    }

    const priorities = [];
    if (state.b_agirEngelli) priorities.push("Ağır engelli bulunan hane");
    if (state.b_yetim) priorities.push("Yetim çocuk bulunan hane");
    if (state.b_sehitYakini || state.b_gazi) priorities.push("Şehit / Gazi Ailesi");
    if (state.d_afetzede || state.e_afetGelirKaybi) priorities.push("Afet Mağduru");
    if (state.b_yasliYalniz) priorities.push("Yaşlı ve Yalnız Yaşayan");
    if (state.appliance_buzdolabi === 'yok' || state.appliance_camasir === 'yok') {
      priorities.push("Temel Ev Eşyası Eksikliği (Buzdolabı / Çamaşır M.)");
    }

    return { scoreA, scoreB, scoreC, scoreD, scoreE, scoreF, scoreG, totalScore, assistance, priorities, isRejected: state.falseStatement };
  }, [state]);

  const stepsCount = 10;
  const isIdentityValid = state.applicantName.trim() !== "" && state.applicantTc.length === 11;
  const canProceed = step === 0 ? isIdentityValid : (step === 8 ? state.systemChecksDone : true);

  const handleSave = async () => {
    if (!user) return;
    try {
      const assessmentData = {
        id: crypto.randomUUID(),
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
    <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-2">
            <ArrowLeft size={20} />
          </Link>
          <div className="bg-blue-600 p-2 rounded hidden sm:block">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">YENİ İNCELEME OLUŞTUR</h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Adım {step + 1} / {stepsCount}</p>
          </div>
        </div>
        <div className="text-right border-l border-slate-700 pl-4">
          <p className="text-xs text-slate-400">İnceleyen Personel</p>
          <p className="text-sm font-semibold">{user.name}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 shrink-0">
        <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${((step + 1) / stepsCount) * 100}%` }}></div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center">
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            
            {step === 0 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Başvuru Sahibi Bilgileri</h2>
                  <p className="text-slate-500 mt-1">İncelemesi yapılan kişinin kimlik bilgileri.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Başvuru Sahibinin Adı Soyadı</label>
                      <input 
                        type="text" 
                        value={state.applicantName}
                        onChange={e => set('applicantName', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Örn: Ayşe Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">T.C. Kimlik Numarası</label>
                      <input 
                        type="text" 
                        maxLength={11}
                        value={state.applicantTc}
                        onChange={e => set('applicantTc', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full border border-slate-300 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="11 Haneli TC No"
                      />
                      {state.applicantTc.length > 0 && state.applicantTc.length < 11 && (
                        <p className="text-red-500 text-sm mt-2 flex items-center"><AlertTriangle size={14} className="mr-1"/> TC Kimlik 11 hane olmalıdır.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefon Numarası</label>
                      <input 
                        type="tel" 
                        value={state.phoneNumber}
                        onChange={e => set('phoneNumber', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Örn: 0555 555 5555"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hane Numarası (Sistem Ref)</label>
                      <input 
                        type="text" 
                        value={state.householdNo}
                        onChange={e => set('householdNo', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Örn: HN-12345"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hanedeki Kişi Sayısı</label>
                      <input 
                        type="number" 
                        min="1"
                        value={state.householdSize}
                        onChange={e => set('householdSize', parseInt(e.target.value) || 1)}
                        className="w-full border border-slate-300 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Açık Adres</label>
                      <textarea 
                        value={state.applicantAddress}
                        onChange={e => set('applicantAddress', e.target.value)}
                        rows={2}
                        className="w-full border border-slate-300 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Mahalle, Sokak, Kapı No vb."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">A. Ekonomik Durum</h2>
                  <p className="text-slate-500 mt-1">Hane halkı gelir ve sigorta durumuna göre puanlama (Maksimum 40 Puan)</p>
                </div>
                <SectionCard title="Gelir Seviyesi" maxScore={40} currentScore={calc.scoreA}>
                  <div className="space-y-3">
                    <RadioItem label="Kişi başına gelir açlık sınırının %25 altında" name="income" checked={state.income === 40} onChange={() => set('income', 40)} points={40} />
                    <RadioItem label="Açlık sınırının %25 – 50 arasında" name="income" checked={state.income === 35} onChange={() => set('income', 35)} points={35} />
                    <RadioItem label="Açlık sınırının %50 – 75 arasında" name="income" checked={state.income === 25} onChange={() => set('income', 25)} points={25} />
                    <RadioItem label="Açlık sınırının %75 – 100 arasında" name="income" checked={state.income === 15} onChange={() => set('income', 15)} points={15} />
                    <RadioItem label="Açlık sınırı üzerinde" name="income" checked={state.income === 0} onChange={() => set('income', 0)} points={0} />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">İlave Puanlar</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <CheckboxItem label="Hanede çalışan yok" checked={state.noWorker} onChange={(v:any) => set('noWorker', v)} points={10} />
                      <CheckboxItem label="Düzenli gelir bulunmuyor" checked={state.noRegularIncome} onChange={(v:any) => set('noRegularIncome', v)} points={5} />
                      <CheckboxItem label="SGK kaydı yok" checked={state.noSgk} onChange={(v:any) => set('noSgk', v)} points={5} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">B. Dezavantajlı Bireyler</h2>
                  <p className="text-slate-500 mt-1">Hanedeki sağlık ve durum özellikleri (Maksimum 30 Puan)</p>
                </div>
                <SectionCard title="Hanehalkı Durumları" maxScore={30} currentScore={calc.scoreB}>
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
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">C. Çocuk ve Eğitim</h2>
                  <p className="text-slate-500 mt-1">Hanedeki eğitim gören bireyler (Maksimum 10 Puan)</p>
                </div>
                <SectionCard title="Eğitim Durumu" maxScore={10} currentScore={calc.scoreC}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CounterItem label="0-6 yaş çocuk" value={state.c_0_6yas} onChange={(v:any) => set('c_0_6yas', v)} pointsPerItem={2} />
                    <CounterItem label="İlkokul öğrencisi" value={state.c_ilkokul} onChange={(v:any) => set('c_ilkokul', v)} pointsPerItem={1} />
                    <CounterItem label="Ortaokul öğrencisi" value={state.c_ortaokul} onChange={(v:any) => set('c_ortaokul', v)} pointsPerItem={2} />
                    <CounterItem label="Lise öğrencisi" value={state.c_lise} onChange={(v:any) => set('c_lise', v)} pointsPerItem={3} />
                    <CounterItem label="Üniversite öğrencisi" value={state.c_uni} onChange={(v:any) => set('c_uni', v)} pointsPerItem={4} />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">D. Barınma Durumu</h2>
                  <p className="text-slate-500 mt-1">Fiziki yaşam alanları (Maksimum 10 Puan)</p>
                </div>
                <SectionCard title="Barınma Şartları" maxScore={10} currentScore={calc.scoreD}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CheckboxItem label="Evsiz" checked={state.d_evsiz} onChange={(v:any) => set('d_evsiz', v)} points={10} />
                    <CheckboxItem label="Afetzede" checked={state.d_afetzede} onChange={(v:any) => set('d_afetzede', v)} points={10} />
                    <CheckboxItem label="Konut ağır hasarlı" checked={state.d_agirHasarli} onChange={(v:any) => set('d_agirHasarli', v)} points={8} />
                    <CheckboxItem label="Sağlıksız konut" checked={state.d_sagliksiz} onChange={(v:any) => set('d_sagliksiz', v)} points={6} />
                    <CheckboxItem label="Kiracı" checked={state.d_kiraci} onChange={(v:any) => set('d_kiraci', v)} points={5} />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 5 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">E. Beyaz Eşya ve Ev Aletleri Durumu</h2>
                  <p className="text-slate-500 mt-1">Hanedeki temel ev eşyalarının varlık ve yıpranma durumu (Maksimum 10 Puan)</p>
                </div>
                <SectionCard title="Beyaz Eşya ve Cihaz Kontrolü" maxScore={10} currentScore={calc.scoreE}>
                  <p className="text-xs text-slate-500 mb-4 font-medium">
                    Her bir eşya için hanedeki mevcudiyet durumunu "Yok", "Var (Eski/Arızalı)" veya "Var (Yeni/İyi)" olarak belirleyiniz.
                  </p>
                  <div className="space-y-3">
                    <ApplianceStatusItem 
                      label="Buzdolabı" 
                      icon={Box} 
                      value={state.appliance_buzdolabi} 
                      onChange={(v: any) => set('appliance_buzdolabi', v)} 
                      pointsYok={3} 
                      pointsEski={1.5} 
                    />
                    <ApplianceStatusItem 
                      label="Çamaşır Makinesi" 
                      icon={Shirt} 
                      value={state.appliance_camasir} 
                      onChange={(v: any) => set('appliance_camasir', v)} 
                      pointsYok={3} 
                      pointsEski={1.5} 
                    />
                    <ApplianceStatusItem 
                      label="Fırın / Ocak" 
                      icon={Flame} 
                      value={state.appliance_firin} 
                      onChange={(v: any) => set('appliance_firin', v)} 
                      pointsYok={2} 
                      pointsEski={1} 
                    />
                    <ApplianceStatusItem 
                      label="Bulaşık Makinesi" 
                      icon={Sparkles} 
                      value={state.appliance_bulasik} 
                      onChange={(v: any) => set('appliance_bulasik', v)} 
                      pointsYok={1} 
                      pointsEski={0.5} 
                    />
                    <ApplianceStatusItem 
                      label="Televizyon (TV)" 
                      icon={Tv} 
                      value={state.appliance_tv} 
                      onChange={(v: any) => set('appliance_tv', v)} 
                      pointsYok={1} 
                      pointsEski={0.5} 
                    />
                    <ApplianceStatusItem 
                      label="Akıllı / Sabit Telefon" 
                      icon={Smartphone} 
                      value={state.appliance_telefon} 
                      onChange={(v: any) => set('appliance_telefon', v)} 
                      pointsYok={1} 
                      pointsEski={0.5} 
                    />
                    <ApplianceStatusItem 
                      label="Klima / Isıtıcı" 
                      icon={Wind} 
                      value={state.appliance_klima} 
                      onChange={(v: any) => set('appliance_klima', v)} 
                      pointsYok={1} 
                      pointsEski={0.5} 
                    />
                    <ApplianceStatusItem 
                      label="Diğer Temel Ev Aletleri (Süpürge vb.)" 
                      icon={Plug} 
                      value={state.appliance_diger} 
                      onChange={(v: any) => set('appliance_diger', v)} 
                      pointsYok={1} 
                      pointsEski={0.5} 
                    />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 6 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">F. Sosyal Kırılganlık</h2>
                  <p className="text-slate-500 mt-1">Aile içi kırılganlık durumları (Maksimum 10 Puan)</p>
                </div>
                <SectionCard title="F. Sosyal Kırılganlık" maxScore={10} currentScore={calc.scoreF}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CheckboxItem label="Aile içi şiddet mağduru" checked={state.e_siddetMagduru} onChange={(v:any) => set('e_siddetMagduru', v)} points={6} />
                    <CheckboxItem label="Kadın hane reisi" checked={state.e_kadinReis} onChange={(v:any) => set('e_kadinReis', v)} points={5} />
                    <CheckboxItem label="Eşi cezaevinde" checked={state.e_esiCezaevinde} onChange={(v:any) => set('e_esiCezaevinde', v)} points={5} />
                    <CheckboxItem label="Afet nedeniyle gelir kaybı" checked={state.e_afetGelirKaybi} onChange={(v:any) => set('e_afetGelirKaybi', v)} points={5} />
                    <CheckboxItem label="Boşanmış" checked={state.e_bosanmis} onChange={(v:any) => set('e_bosanmis', v)} points={3} />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 7 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">G. Sosyal İnceleme Kanaati</h2>
                  <p className="text-slate-500 mt-1">Personelin genel kanaat puanları (Maksimum 20 Puan)</p>
                </div>
                <SectionCard title="Kanaat Notları" maxScore={20} currentScore={calc.scoreG}>
                   <p className="text-sm text-slate-500 mb-4 font-medium">Sosyal inceleme görevlisinin hanedeki genel kanaatine göre her alan için 0 ile 5 arası puanlama yapınız.</p>
                   <div className="space-y-1">
                     <ScoreButtons label="Yaşam Koşulları (Fiziki vb.)" value={state.f_yasamKosullari} onChange={(v:any) => set('f_yasamKosullari', v)} />
                     <ScoreButtons label="Aciliyet Durumu" value={state.f_aciliyet} onChange={(v:any) => set('f_aciliyet', v)} />
                     <ScoreButtons label="Sosyal Destek Yetersizliği" value={state.f_sosyalDestek} onChange={(v:any) => set('f_sosyalDestek', v)} />
                     <ScoreButtons label="Risk Değerlendirmesi" value={state.f_risk} onChange={(v:any) => set('f_risk', v)} />
                   </div>
                </SectionCard>
              </div>
            )}

            {step === 8 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Sistem Kontrolleri</h2>
                  <p className="text-slate-500 mt-1">Kayıt öncesi zorunlu inceleme başlıkları.</p>
                </div>
                <SectionCard title="Kontrol Listesi" maxScore={0} currentScore={0} className="border-orange-200">
                   <p className="text-sm text-slate-500 mb-4">Yardım yapılmadan önce ilgili kurumlardan (Araç, Tapu, SGK vb.) zorunlu kontrollerin yapılması gerekmektedir.</p>
                   <div className="mb-6">
                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${state.systemChecksDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-4"
                          checked={state.systemChecksDone}
                          onChange={(e) => set('systemChecksDone', e.target.checked)}
                        />
                        <span className={`font-bold ${state.systemChecksDone ? 'text-emerald-800' : 'text-slate-700'}`}>Zorunlu sistem kontrollerini (Araç, Tapu, SGK vb.) yaptım.</span>
                      </label>
                      {!state.systemChecksDone && (
                        <p className="text-red-500 text-xs font-bold mt-2 ml-1">* Sonraki adıma geçmek için onaylamanız gereklidir.</p>
                      )}
                      {state.systemChecksDone && (
                        <p className="text-red-600 text-sm font-bold mt-2 flex items-center ml-1">
                          <CheckCircle2 size={16} className="mr-1" /> Sistem kontrolleri yapıldı
                        </p>
                      )}
                   </div>
                   
                   <div className="pt-4 border-t border-red-100">
                     <div className="flex flex-col">
                       <label className="flex items-start p-4 border border-red-200 rounded-xl cursor-pointer bg-white hover:bg-red-50/50 transition-colors">
                         <input
                           type="checkbox"
                           className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 mt-0.5"
                           checked={state.falseStatement}
                           onChange={(e) => set('falseStatement', e.target.checked)}
                         />
                         <div className="ml-3 flex flex-col">
                           <span className="text-sm font-bold text-red-700">DİKKAT: Gerçeğe Aykırı Beyan TESPİT EDİLDİ!</span>
                           <span className="text-xs font-semibold text-red-500 mt-1">
                             (İşaretlenirse başvuruyu doğrudan reddeder ve tüm puanı sıfırlar)
                           </span>
                         </div>
                       </label>
                     </div>
                   </div>
                </SectionCard>
              </div>
            )}

            {step === 9 && (
              <div className="flex-1 flex flex-col justify-center items-center py-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center w-full max-w-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
                    <Save size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">İncelemeyi Kaydet</h2>
                  <p className="text-slate-500 mb-8">
                    Tüm adımları tamamladınız. Formu sisteme kaydederek değerlendirme sürecine sunabilirsiniz.
                  </p>
                  
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hesaplanan Puan</p>
                    <div className={`text-5xl font-black ${state.falseStatement ? 'text-red-500' : 'text-slate-800'}`}>{calc.totalScore}</div>
                    <p className={`text-sm font-bold mt-2 uppercase ${state.falseStatement ? 'text-red-500' : 'text-blue-600'}`}>
                      {state.falseStatement ? 'REDDEDİLDİ' : calc.assistance.text}
                    </p>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex justify-center items-center"
                  >
                    Kaydet ve Bitir
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center pb-8">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${step === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200 bg-slate-100'}`}
              >
                <ChevronLeft size={20} className="mr-2" /> Geri
              </button>
              
              {step < stepsCount - 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(stepsCount - 1, s + 1))}
                  disabled={!canProceed}
                  className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${!canProceed ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                >
                  Sonraki Adım <ChevronRight size={20} className="ml-2" />
                </button>
              )}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}

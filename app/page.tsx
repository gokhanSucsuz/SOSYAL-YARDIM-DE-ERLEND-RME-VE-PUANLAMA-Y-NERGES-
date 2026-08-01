"use client";

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert, Calculator, CheckSquare, Users, Home,
  GraduationCap, Activity, FileText, Printer, CheckCircle2,
  AlertOctagon, AlertTriangle, ShieldCheck, Info
} from 'lucide-react';

// --- Reusable UI Components ---

const SectionCard = ({ title, icon: Icon, maxScore, currentScore, children, className = "" }: any) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6 print:border-slate-300 print:shadow-none print:mb-4 ${className}`}>
    <div className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between print:bg-white">
      <div className="flex items-center space-x-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bölüm Puanı</span>
        <span className={`bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold ${currentScore === maxScore ? 'bg-blue-100 text-blue-700' : ''} print:bg-transparent print:p-0`}>
          {currentScore} / {maxScore}
        </span>
      </div>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

const CheckboxItem = ({ label, checked, onChange, isAlert = false, points = null }: any) => (
  <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors group ${
    checked
      ? (isAlert ? 'bg-red-50 border-red-200' : 'bg-blue-50/30 border-blue-200')
      : 'bg-white border-slate-100 hover:bg-slate-50'
  } print:border-slate-300 print:bg-white print:p-2`}>
    <div className="flex-shrink-0 mt-0.5">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border-slate-300 ${isAlert ? 'text-red-600 focus:ring-red-500' : 'text-blue-600 focus:ring-blue-500'}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    <div className="ml-3 flex-1 flex justify-between items-center">
      <span className={`text-sm font-medium leading-snug ${checked && isAlert ? 'text-red-800' : 'text-slate-700'}`}>
        {label}
      </span>
      {points && (
        <span className={`text-[10px] font-bold ${checked ? 'text-blue-600' : 'text-slate-400'}`}>+{points} Puan</span>
      )}
    </div>
  </label>
);

const RadioItem = ({ label, name, checked, onChange, points }: any) => (
  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors group ${
    checked ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'
  } print:border-slate-300 print:bg-white print:p-2`}>
    <div className="flex items-center space-x-3 flex-1">
      <input
        type="radio"
        name={name}
        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
        checked={checked}
        onChange={() => onChange()}
      />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <span className={`text-[10px] font-bold ${checked ? 'text-blue-600' : 'text-slate-400'}`}>+{points} Puan</span>
  </label>
);

const ScoreButtons = ({ value, onChange, label }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 last:border-0 print:border-slate-300">
    <span className="text-sm font-medium text-slate-700 mb-2 sm:mb-0">{label}</span>
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`w-10 h-10 rounded-md text-sm font-bold transition-colors border ${
            value === num
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          } print:border-slate-400 print:text-black print:${value === num ? 'bg-slate-200' : 'bg-white'}`}
        >
          {num}
        </button>
      ))}
    </div>
  </div>
);

const CounterItem = ({ label, value, onChange, pointsPerItem }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white print:border-slate-300 print:p-2">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-[10px] font-bold text-slate-400">+{pointsPerItem} Puan / Kişi</span>
    </div>
    <div className="flex items-center space-x-3">
      <button 
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold"
      >-</button>
      <span className="w-6 text-center font-bold text-slate-800">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold"
      >+</button>
    </div>
  </div>
);

export default function SocialAssistanceForm() {
  const [state, setState] = useState({
    applicantName: "",
    applicantTc: "",
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
    // E
    e_kadinReis: false,
    e_bosanmis: false,
    e_esiCezaevinde: false,
    e_siddetMagduru: false,
    e_afetGelirKaybi: false,
    // F
    f_yasamKosullari: 0,
    f_aciliyet: 0,
    f_sosyalDestek: 0,
    f_risk: 0,
    // Check
    check_arac: false,
    check_tapu: false,
    check_sgk: false,
    check_vergi: false,
    check_maas: false,
    check_oncekiYardim: false,
    check_sosyalInceleme: false,
    falseStatement: false,
  });

  // Handle complex state updates
  const set = (key: string, value: any) => setState(s => ({ ...s, [key]: value }));

  // Calculation Logic
  const calc = useMemo(() => {
    // Section A (Max 40)
    let scoreA = state.income;
    if (state.noWorker) scoreA += 10;
    if (state.noRegularIncome) scoreA += 5;
    if (state.noSgk) scoreA += 5;
    scoreA = Math.min(scoreA, 40);

    // Section B (Max 30)
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

    // Section C (Max 10)
    let scoreC = 0;
    scoreC += state.c_0_6yas * 2;
    scoreC += state.c_ilkokul * 1;
    scoreC += state.c_ortaokul * 2;
    scoreC += state.c_lise * 3;
    scoreC += state.c_uni * 4;
    scoreC = Math.min(scoreC, 10);

    // Section D (Max 10)
    let scoreD = 0;
    if (state.d_evsiz) scoreD += 10;
    if (state.d_afetzede) scoreD += 10;
    if (state.d_kiraci) scoreD += 5;
    if (state.d_agirHasarli) scoreD += 8;
    if (state.d_sagliksiz) scoreD += 6;
    scoreD = Math.min(scoreD, 10);

    // Section E (Max 10)
    let scoreE = 0;
    if (state.e_kadinReis) scoreE += 5;
    if (state.e_bosanmis) scoreE += 3;
    if (state.e_esiCezaevinde) scoreE += 5;
    if (state.e_siddetMagduru) scoreE += 6;
    if (state.e_afetGelirKaybi) scoreE += 5;
    scoreE = Math.min(scoreE, 10);

    // Section F (Max 20)
    let scoreF = state.f_yasamKosullari + state.f_aciliyet + state.f_sosyalDestek + state.f_risk;
    scoreF = Math.min(scoreF, 20);

    // False statement zeros everything
    let totalScore = state.falseStatement ? 0 : (scoreA + scoreB + scoreC + scoreD + scoreE + scoreF);

    // Assistance Amount Logic
    let assistance = { text: "Yardım uygun görülmez (veya Ayni)", amount: 0 };
    if (!state.falseStatement) {
      if (totalScore >= 91) assistance = { text: "10.000 TL Nakdi Yardım", amount: 10000 };
      else if (totalScore >= 71) assistance = { text: "7.500 TL Nakdi Yardım", amount: 7500 };
      else if (totalScore >= 51) assistance = { text: "5.000 TL Nakdi Yardım", amount: 5000 };
      else if (totalScore >= 31) assistance = { text: "2.500 TL Nakdi Yardım", amount: 2500 };
    } else {
      assistance = { text: "REDDEDİLDİ (Gerçeğe Aykırı Beyan)", amount: 0 };
    }

    // Priorities
    const priorities = [];
    if (state.b_agirEngelli) priorities.push("Ağır engelli bulunan hane");
    if (state.b_yetim) priorities.push("Yetim çocuk bulunan hane");
    if (state.b_sehitYakini || state.b_gazi) priorities.push("Şehit / Gazi Ailesi");
    if (state.d_afetzede || state.e_afetGelirKaybi) priorities.push("Afet Mağduru");
    if (state.b_yasliYalniz) priorities.push("Yaşlı ve Yalnız Yaşayan");

    return { scoreA, scoreB, scoreC, scoreD, scoreE, scoreF, totalScore, assistance, priorities };
  }, [state]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Print Styles Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: #ffffff; height: auto !important; overflow: visible !important; }
          .h-screen { height: auto !important; overflow: visible !important; display: block !important; }
          .overflow-hidden { overflow: visible !important; }
          .overflow-y-auto { overflow: visible !important; }
          .no-print { display: none !important; }
          .print-full { width: 100% !important; max-width: 100% !important; border: none !important; padding: 0 !important; }
          .print-break-inside-avoid { break-inside: avoid; }
        }
      `}} />

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10 no-print">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">SOSYAL YARDIM DEĞERLENDİRME SİSTEMİ</h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Yönerge Uygulama Taslağı v1.4</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-amber-500/20 text-amber-500 text-xs px-3 py-1 rounded-full border border-amber-500/30 font-bold uppercase hidden sm:block">
            GİZLİ / DAHİLİ PAYLAŞIM
          </span>
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium shadow-sm"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">PDF / Yazdır</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden print-full">
        
        {/* Selection Area (Left Form) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col items-center print-full">
          <div className="w-full max-w-3xl print-full">
            
          {/* Applicant Identity Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 print:border-slate-300 flex flex-col sm:flex-row gap-4">
             <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Başvuru Sahibinin Adı Soyadı</label>
               <input 
                 type="text" 
                 value={state.applicantName}
                 onChange={e => set('applicantName', e.target.value)}
                 className="w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 px-0 text-lg font-semibold text-slate-900 focus:ring-0 focus:border-blue-600 transition-colors placeholder-slate-300"
                 placeholder="Örn: Ayşe Yılmaz"
               />
             </div>
             <div className="flex-1">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">T.C. Kimlik Numarası</label>
               <input 
                 type="text" 
                 maxLength={11}
                 value={state.applicantTc}
                 onChange={e => set('applicantTc', e.target.value)}
                 className="w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 px-0 text-lg font-semibold text-slate-900 focus:ring-0 focus:border-blue-600 transition-colors placeholder-slate-300"
                 placeholder="11 Haneli TC No"
               />
             </div>
          </div>

          {/* SECTION A */}
          <SectionCard title="A. Ekonomik Durum" icon={Activity} maxScore={40} currentScore={calc.scoreA}>
            <div className="space-y-3">
              <RadioItem label="Kişi başına gelir açlık sınırının %25 altında" name="income" checked={state.income === 40} onChange={() => set('income', 40)} points={40} />
              <RadioItem label="Açlık sınırının %25 – 50 arasında" name="income" checked={state.income === 35} onChange={() => set('income', 35)} points={35} />
              <RadioItem label="Açlık sınırının %50 – 75 arasında" name="income" checked={state.income === 25} onChange={() => set('income', 25)} points={25} />
              <RadioItem label="Açlık sınırının %75 – 100 arasında" name="income" checked={state.income === 15} onChange={() => set('income', 15)} points={15} />
              <RadioItem label="Açlık sınırı üzerinde" name="income" checked={state.income === 0} onChange={() => set('income', 0)} points={0} />
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">İlave Puanlar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CheckboxItem label="Hanede çalışan yok" checked={state.noWorker} onChange={(v:any) => set('noWorker', v)} points={10} />
                <CheckboxItem label="Düzenli gelir bulunmuyor" checked={state.noRegularIncome} onChange={(v:any) => set('noRegularIncome', v)} points={5} />
                <CheckboxItem label="SGK kaydı yok" checked={state.noSgk} onChange={(v:any) => set('noSgk', v)} points={5} />
              </div>
            </div>
          </SectionCard>

          {/* SECTION B */}
          <SectionCard title="B. Hanedeki Dezavantajlı Bireyler" icon={Users} maxScore={30} currentScore={calc.scoreB} className="print-break-inside-avoid">
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

          {/* SECTION C */}
          <SectionCard title="C. Çocuk ve Eğitim" icon={GraduationCap} maxScore={10} currentScore={calc.scoreC} className="print-break-inside-avoid">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CounterItem label="0-6 yaş çocuk" value={state.c_0_6yas} onChange={(v:any) => set('c_0_6yas', v)} pointsPerItem={2} />
              <CounterItem label="İlkokul öğrencisi" value={state.c_ilkokul} onChange={(v:any) => set('c_ilkokul', v)} pointsPerItem={1} />
              <CounterItem label="Ortaokul öğrencisi" value={state.c_ortaokul} onChange={(v:any) => set('c_ortaokul', v)} pointsPerItem={2} />
              <CounterItem label="Lise öğrencisi" value={state.c_lise} onChange={(v:any) => set('c_lise', v)} pointsPerItem={3} />
              <CounterItem label="Üniversite öğrencisi" value={state.c_uni} onChange={(v:any) => set('c_uni', v)} pointsPerItem={4} />
            </div>
          </SectionCard>

          {/* SECTION D */}
          <SectionCard title="D. Barınma" icon={Home} maxScore={10} currentScore={calc.scoreD} className="print-break-inside-avoid">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckboxItem label="Evsiz" checked={state.d_evsiz} onChange={(v:any) => set('d_evsiz', v)} points={10} />
              <CheckboxItem label="Afetzede" checked={state.d_afetzede} onChange={(v:any) => set('d_afetzede', v)} points={10} />
              <CheckboxItem label="Konut ağır hasarlı" checked={state.d_agirHasarli} onChange={(v:any) => set('d_agirHasarli', v)} points={8} />
              <CheckboxItem label="Sağlıksız konut" checked={state.d_sagliksiz} onChange={(v:any) => set('d_sagliksiz', v)} points={6} />
              <CheckboxItem label="Kiracı" checked={state.d_kiraci} onChange={(v:any) => set('d_kiraci', v)} points={5} />
            </div>
          </SectionCard>

          {/* SECTION E */}
          <SectionCard title="E. Sosyal Kırılganlık" icon={AlertTriangle} maxScore={10} currentScore={calc.scoreE} className="print-break-inside-avoid">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CheckboxItem label="Aile içi şiddet mağduru" checked={state.e_siddetMagduru} onChange={(v:any) => set('e_siddetMagduru', v)} points={6} />
              <CheckboxItem label="Kadın hane reisi" checked={state.e_kadinReis} onChange={(v:any) => set('e_kadinReis', v)} points={5} />
              <CheckboxItem label="Eşi cezaevinde" checked={state.e_esiCezaevinde} onChange={(v:any) => set('e_esiCezaevinde', v)} points={5} />
              <CheckboxItem label="Afet nedeniyle gelir kaybı" checked={state.e_afetGelirKaybi} onChange={(v:any) => set('e_afetGelirKaybi', v)} points={5} />
              <CheckboxItem label="Boşanmış" checked={state.e_bosanmis} onChange={(v:any) => set('e_bosanmis', v)} points={3} />
            </div>
          </SectionCard>

          {/* SECTION F */}
          <SectionCard title="F. Sosyal İnceleme Kanaati" icon={FileText} maxScore={20} currentScore={calc.scoreF} className="print-break-inside-avoid">
             <p className="text-sm text-slate-500 mb-4 font-medium">Sosyal inceleme görevlisinin hanedeki genel kanaatine göre 0 ile 5 arası puanlama yapınız.</p>
             <div className="space-y-1">
               <ScoreButtons label="Yaşam Koşulları (Fiziki vb.)" value={state.f_yasamKosullari} onChange={(v:any) => set('f_yasamKosullari', v)} />
               <ScoreButtons label="Aciliyet Durumu" value={state.f_aciliyet} onChange={(v:any) => set('f_aciliyet', v)} />
               <ScoreButtons label="Sosyal Destek Yetersizliği" value={state.f_sosyalDestek} onChange={(v:any) => set('f_sosyalDestek', v)} />
               <ScoreButtons label="Risk Değerlendirmesi" value={state.f_risk} onChange={(v:any) => set('f_risk', v)} />
             </div>
          </SectionCard>

          {/* CONTROL SECTION */}
          <SectionCard title="Sistem Kontrolleri ve Suistimali Önleme" icon={CheckSquare} maxScore={0} currentScore={0} className="print-break-inside-avoid border-orange-200">
             <p className="text-sm text-slate-500 mb-4">Yardım yapılmadan önce ilgili kurumlardan/sistemlerden aşağıdaki hususların kontrol edilmesi zorunludur.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                <CheckboxItem label="Araç Kaydı Kontrolü" checked={state.check_arac} onChange={(v:any)=>set('check_arac', v)} />
                <CheckboxItem label="Taşınmaz (Tapu) Kontrolü" checked={state.check_tapu} onChange={(v:any)=>set('check_tapu', v)} />
                <CheckboxItem label="SGK Hizmet Dökümü" checked={state.check_sgk} onChange={(v:any)=>set('check_sgk', v)} />
                <CheckboxItem label="Vergi Mükellefiyeti" checked={state.check_vergi} onChange={(v:any)=>set('check_vergi', v)} />
                <CheckboxItem label="Düzenli Maaş / Emeklilik" checked={state.check_maas} onChange={(v:any)=>set('check_maas', v)} />
                <CheckboxItem label="Önceki Yardım Kayıtları" checked={state.check_oncekiYardim} onChange={(v:any)=>set('check_oncekiYardim', v)} />
             </div>
             
             <div className="pt-4 border-t border-red-100">
               <CheckboxItem 
                 label="DİKKAT: Gerçeğe aykırı beyan TESPİT EDİLDİ! (İşaretlenirse başvuruyu doğrudan reddeder ve tüm puanı sıfırlar)" 
                 checked={state.falseStatement} 
                 onChange={(v:any)=>set('falseStatement', v)} 
                 isAlert={true} 
               />
             </div>
          </SectionCard>
          </div>
        </main>

        {/* Summary Panel */}
        <aside className="w-80 bg-slate-100 border-l border-slate-200 p-6 flex flex-col overflow-y-auto print:w-full print:border-none print:p-0 print:overflow-visible shrink-0 print-full">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 print:mt-8">DEĞERLENDİRME ÖZETİ</h3>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center mb-6 print:border-slate-300 print:shadow-none">
            <p className="text-xs font-medium text-slate-400 uppercase mb-1">TOPLAM PUAN</p>
            <div className={`text-6xl font-black ${state.falseStatement ? 'text-red-500' : 'text-blue-600'} print:text-black`}>{calc.totalScore}</div>
            <p className={`text-xs font-bold mt-2 uppercase ${state.falseStatement ? 'text-red-500' : (calc.totalScore > 70 ? 'text-blue-500' : (calc.totalScore > 30 ? 'text-amber-500' : 'text-slate-400'))} print:text-black`}>
              {state.falseStatement ? 'REDDEDİLDİ' : (calc.totalScore > 70 ? 'YÜKSEK İHTİYAÇ' : (calc.totalScore > 30 ? 'ORTA İHTİYAÇ' : 'DÜŞÜK İHTİYAÇ'))}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 print:border-slate-300">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">ÖNGÖRÜLEN YARDIM TUTARI</p>
              <p className={`text-2xl font-bold ${state.falseStatement ? 'text-red-600' : 'text-slate-800'}`}>
                {calc.assistance.amount > 0 ? `${calc.assistance.amount.toLocaleString('tr-TR')} TL` : calc.assistance.text}
              </p>
              {!state.falseStatement && calc.totalScore > 30 && (
                <p className="text-[11px] text-slate-500 mt-1">Sistem hesaplaması referans tutarıdır</p>
              )}
            </div>

            {calc.priorities.length > 0 && !state.falseStatement && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 print:border-slate-300">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">ÖNCELİK DURUMU</p>
                <ul className="space-y-1.5">
                  {calc.priorities.map((p, i) => (
                    <li key={i} className="flex items-center text-[11px] text-slate-600 font-bold">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 shrink-0 print:bg-slate-400"></div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className={`p-4 rounded-xl border ${state.falseStatement ? 'bg-red-50 border-red-200' : 'bg-slate-200/50 border-slate-200'} print:bg-white print:border-slate-300`}>
              <p className={`text-[10px] font-bold uppercase mb-2 ${state.falseStatement ? 'text-red-600' : 'text-slate-500'} print:text-black`}>GÜVENLİK KONTROLÜ</p>
              <div className="space-y-1.5">
                <div className={`flex justify-between text-[11px] ${state.falseStatement ? 'text-red-800' : 'text-slate-600'} print:text-black`}>
                  <span>Gerçeğe Aykırı Beyan:</span>
                  <span className="font-bold">{state.falseStatement ? 'TESPİT EDİLDİ' : 'YOK'}</span>
                </div>
              </div>
            </div>

            {/* System Info Notice (Hidden on Print) */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3 no-print mt-6">
               <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
               <p className="text-xs text-blue-800 leading-relaxed">
                 Bu araç, belirtilen yönerge kriterlerini matematiksel bir modele dökerek inceleme görevlilerine <strong>zaman kazandırmak</strong> ve kararlarda <strong>standart sağlamak</strong> için oluşturulmuş interaktif bir simülasyondur. Puanlar bağlayıcı değil, tavsiye niteliğindedir.
               </p>
            </div>
          </div>
          
          {/* Print Only Signature Block */}
          <div className="hidden print:block border border-slate-300 rounded-xl p-6 mt-12 bg-white">
            <h4 className="font-bold text-slate-800 mb-8 border-b border-slate-200 pb-2">Onay ve İmzalar</h4>
            <div className="flex justify-between items-end pt-12 px-4">
               <div className="text-center">
                 <div className="w-40 border-b border-slate-400 mb-2"></div>
                 <span className="text-sm font-medium text-slate-600">Sosyal İnceleme Görevlisi</span>
               </div>
               <div className="text-center">
                 <div className="w-40 border-b border-slate-400 mb-2"></div>
                 <span className="text-sm font-medium text-slate-600">Vakıf Müdürü</span>
               </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

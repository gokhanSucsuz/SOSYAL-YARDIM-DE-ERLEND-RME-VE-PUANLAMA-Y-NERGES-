"use client";

export const dynamic = "force-dynamic";
import { useDialog } from '@/components/DialogProvider';


import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ShieldCheck, ChevronRight, ChevronLeft, Save, AlertTriangle, CheckCircle2, Info,
  Tv, Smartphone, Wind, Flame, Box, Shirt, Sparkles, Plug, Minus, Plus
} from 'lucide-react';
import { saveAssessment, getAssessmentById, calculateAssistanceFromScore, getAllMeetings, isMeetingLocked } from '@/lib/db';
import { SectionCard, CheckboxItem, RadioItem, ScoreButtons, CounterItem, ApplianceStatusItem } from '@/components/ui-components';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { calculateNewSystemScore } from '@/lib/scoring';

export default function EditAssessmentWizard() {
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

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
    b_dusukEngelli: false,
    b_ozelSebepMetin: "",
    b_ozelSebepPuan: 0,
    b_cokluOzelDurumluBirey: false,
    // C
    c_0_6yas: 0,
    c_ilkokul: 0,
    c_ortaokul: 0,
    c_lise: 0,
    c_meslekiEgitim: 0,
    c_acikLise: 0,
    c_uni: 0,
    // D
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
    // F - Sosyal Kırılganlık
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
    a_aracSahibi: false,
    a_birdenFazlaTasinmaz: false,
    a_aktifSgkPrim: false,
    // Yardım Yığılması (Mükerrerlik)
    a_son3AyYardimAldi: false,
    a_son3AyYardimKisi: 0,
    // Check
    systemChecksDone: false,
    falseStatement: false,
  });

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    setUser(currentUser);

    const loadData = async () => {
      try {
        const id = params?.id as string;
        if (!id) return;
        const data = await getAssessmentById(id);
        if (data) {
          const meetings = await getAllMeetings();
          const meeting = meetings.find(m => m.id === data.meetingId);
          if (meeting && isMeetingLocked(meeting, currentUser.role)) {
            await showAlert('Bu incelemenin bağlı olduğu toplantı sonlandırılmış veya kilitlenmiş olduğu için düzenleme yapılamaz.');
            router.push('/');
            return;
          }
          if (data.status === 'approved') {
            await showAlert('Onaylanmış inceleme kayıtlarında düzenleme yapılamaz. Düzenleme yapabilmek için öncelikle müdürün onayı kaldırması gerekmektedir.');
            router.push('/');
            return;
          }
          if (currentUser.role === 'manager') {
            await showAlert('Müdürler incelemeleri düzenleyemez, sadece onaylayabilir.');
            router.push('/');
            return;
          }
          setAssessmentId(data.id);
          setState(s => ({
            ...s,
            ...data.data,
            applicantName: data.applicantName,
            applicantTc: data.applicantTc,
            applicantAddress: data.applicantAddress || "",
            householdSize: data.householdSize || 1,
            phoneNumber: data.phoneNumber || "",
            householdNo: data.householdNo || ""
          }));
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router, params?.id]);

  const set = (key: string, value: any) => setState(s => ({ ...s, [key]: value }));

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
    if (!user || !assessmentId) return;
    try {
      const assessmentData = {
        id: assessmentId,
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
          totalScore: calc.totalScore,
          assistance: calc.assistance,
          priorities: calc.priorities,
          isRejected: calc.isRejected
        }
      };
      await saveAssessment(assessmentData);
      await showAlert("İnceleme hane kaydı başarıyla güncellendi.");
      router.push('/');
    } catch (err) {
      console.error(err);
      await showAlert("Kayıt sırasında hata oluştu! " + (err instanceof Error ? err.message : ''), 'warning');
    }
  };

  if (loading || !user) return <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">Yükleniyor...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col">
      <AppHeader
        subtitle={`✏️ İnceleme Düzenle • Adım ${step + 1} / ${stepsCount}: ${stepNames[step]}`}
      />

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 shrink-0">
        <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${((step + 1) / stepsCount) * 100}%` }}></div>
      </div>

      {/* Touch-Friendly Step Pill Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 shadow-inner">
        {stepNames.map((name, idx) => {
          const isActive = step === idx;
          const isPassed = step > idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (idx === 0 || isPassed || canProceed) setStep(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all touch-manipulation shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : isPassed
                  ? 'bg-slate-800 text-blue-300 hover:bg-slate-700'
                  : 'bg-slate-850 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 flex flex-col pb-28">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col items-center">
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            
            {step === 0 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Başvuru Sahibi Bilgileri</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">İncelemesi yapılan kişinin kimlik bilgileri.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Başvuru Sahibinin Adı Soyadı</label>
                      <input 
                        type="text" 
                        value={state.applicantName}
                        onChange={e => set('applicantName', e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Örn: Ayşe Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">T.C. Kimlik Numarası</label>
                      <input 
                        type="text" 
                        maxLength={11}
                        value={state.applicantTc}
                        onChange={e => set('applicantTc', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="11 Haneli TC No"
                      />
                      {state.applicantTc.length > 0 && state.applicantTc.length < 11 && (
                        <p className="text-red-500 text-sm mt-2 flex items-center"><AlertTriangle size={14} className="mr-1"/> TC Kimlik 11 hane olmalıdır.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Telefon Numarası</label>
                      <input 
                        type="tel" 
                        value={state.phoneNumber}
                        onChange={e => set('phoneNumber', e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Örn: 0555 555 5555"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hane Numarası (Sistem Ref)</label>
                      <input 
                        type="text" 
                        value={state.householdNo}
                        onChange={e => set('householdNo', e.target.value)}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="Örn: HN-12345"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hanedeki Kişi Sayısı</label>
                      <div className="flex items-center w-full border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <button
                          type="button"
                          onClick={() => set('householdSize', Math.max(1, (state.householdSize || 1) - 1))}
                          className="px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 transition-colors bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700"
                        >
                          <Minus size={20} />
                        </button>
                        <input 
                          type="number" 
                          min="1"
                          value={state.householdSize || ''}
                          onChange={e => set('householdSize', parseInt(e.target.value) || 1)}
                          onFocus={e => e.target.select()}
                          className="flex-1 w-full bg-white dark:bg-slate-800 py-3 px-2 text-center text-lg font-medium text-slate-900 dark:text-slate-100 outline-none appearance-none"
                          style={{ MozAppearance: 'textfield' }}
                        />
                        <button
                          type="button"
                          onClick={() => set('householdSize', (state.householdSize || 1) + 1)}
                          className="px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50 transition-colors bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Açık Adres</label>
                      <textarea 
                        value={state.applicantAddress}
                        onChange={e => set('applicantAddress', e.target.value)}
                        rows={2}
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-lg font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
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
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">A. Ekonomik Durum</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Hane halkı gelir ve sigorta durumuna göre değerlendirme</p>
                </div>
                <SectionCard title="Gelir Seviyesi" maxScore={25} currentScore={calc.scoreA} hideScore={true}>
                  <div className="space-y-3">
                    <RadioItem label="Kişi başına gelir muhtaçlık sınırının %25 altında" name="income" checked={state.income === 20} onChange={() => set('income', 20)} points={20} />
                    <RadioItem label="Muhtaçlık sınırının %25 – 50 arasında" name="income" checked={state.income === 15} onChange={() => set('income', 15)} points={15} />
                    <RadioItem label="Muhtaçlık sınırının %50 – 75 arasında" name="income" checked={state.income === 10} onChange={() => set('income', 10)} points={10} />
                    <RadioItem label="Muhtaçlık sınırının %75 – 100 arasında" name="income" checked={state.income === 5} onChange={() => set('income', 5)} points={5} />
                    <RadioItem label="Muhtaçlık sınırı üzerinde" name="income" checked={state.income === 0} onChange={() => set('income', 0)} points={0} />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">İlave / Düzeltme Kriterleri</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <CheckboxItem label="Hanede çalışan yok" checked={state.noWorker} onChange={(v:any) => set('noWorker', v)} points={3} />
                      <CheckboxItem label="Düzenli gelir bulunmuyor" checked={state.noRegularIncome} onChange={(v:any) => set('noRegularIncome', v)} points={2} />
                      <CheckboxItem label="SGK kaydı yok" checked={state.noSgk} onChange={(v:any) => set('noSgk', v)} points={2} />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">B. Dezavantajlı Bireyler</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Hanedeki sağlık ve özel sosyal kırılganlık durumları</p>
                </div>
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

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Özel Sebep / Özel Durum Tanımlama
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Standart kriterlerin dışındaki özel durumlara ilave değer ekleyebilirsiniz.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Özel Sebep Açıklaması
                        </label>
                        <input
                          type="text"
                          value={state.b_ozelSebepMetin || ''}
                          onChange={(e) => set('b_ozelSebepMetin', e.target.value)}
                          placeholder="Örn: Organ nakli, nadir hastalık vb."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          İlave Değer
                        </label>
                        <select
                          value={state.b_ozelSebepPuan || 0}
                          onChange={(e) => set('b_ozelSebepPuan', Number(e.target.value))}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200"
                        >
                          <option value={0}>Ekleme Yok</option>
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
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">C. Çocuk ve Eğitim</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Hanedeki eğitim gören tüm kademelerdeki çocuklar ve öğrenciler (Tüm Kademeler Eşit)</p>
                </div>
                <SectionCard title="Eğitim Durumu" maxScore={15} currentScore={calc.scoreD} hideScore={true}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CounterItem label="0-6 yaş çocuk" value={state.c_0_6yas} onChange={(v:any) => set('c_0_6yas', v)} pointsPerItem={2} />
                    <CounterItem label="İlkokul öğrencisi" value={state.c_ilkokul} onChange={(v:any) => set('c_ilkokul', v)} pointsPerItem={2} />
                    <CounterItem label="Ortaokul öğrencisi" value={state.c_ortaokul} onChange={(v:any) => set('c_ortaokul', v)} pointsPerItem={2} />
                    <CounterItem label="Lise öğrencisi" value={state.c_lise} onChange={(v:any) => set('c_lise', v)} pointsPerItem={3} />
                    <CounterItem label="Mesleki Eğitim Merkezi" value={state.c_meslekiEgitim || 0} onChange={(v:any) => set('c_meslekiEgitim', v)} pointsPerItem={3} />
                    <CounterItem label="Açık Lise öğrencisi" value={state.c_acikLise || 0} onChange={(v:any) => set('c_acikLise', v)} pointsPerItem={2} />
                    <CounterItem label="Üniversite öğrencisi" value={state.c_uni} onChange={(v:any) => set('c_uni', v)} pointsPerItem={4} />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">D. Barınma Durumu</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Fiziki yaşam alanları ve konut şartları (Genişletilmiş Kriterler)</p>
                </div>
                <SectionCard title="Barınma Şartları" maxScore={10} currentScore={calc.scoreE} hideScore={true}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CheckboxItem label="Evsiz / Barınaksız / Geçici Sığınma" checked={state.d_evsiz} onChange={(v:any) => set('d_evsiz', v)} points={8} />
                    <CheckboxItem label="Afetzede (Yangın / Deprem / Su Baskını)" checked={state.d_afetzede} onChange={(v:any) => set('d_afetzede', v)} points={8} />
                    <CheckboxItem label="Konut ağır hasarlı / Yıkılma riski var" checked={state.d_agirHasarli} onChange={(v:any) => set('d_agirHasarli', v)} points={6} />
                    <CheckboxItem label="Sağlıksız konut (Rutubetli / Havalandırmasız)" checked={state.d_sagliksiz} onChange={(v:any) => set('d_sagliksiz', v)} points={4} />
                    <CheckboxItem label="Bodrum kat / Sığınak / Dere yatağı" checked={state.d_dereYatagi} onChange={(v:any) => set('d_dereYatagi', v)} points={4} />
                    <CheckboxItem label="Kiracı (Kira ödemekte zorlanan)" checked={state.d_kiraci} onChange={(v:any) => set('d_kiraci', v)} points={3} />
                    <CheckboxItem label="Ev sahibinin tahliye / icra baskısı altında" checked={state.d_tahliyeBaskisi} onChange={(v:any) => set('d_tahliyeBaskisi', v)} points={3} />
                    <CheckboxItem label="Sobalı / Isınma ve yakacak sıkıntısı var" checked={state.d_isinmaProblem} onChange={(v:any) => set('d_isinmaProblem', v)} points={2} />
                    <CheckboxItem label="Gecekondu / İmar sıkıntılı / Hisseli tapu" checked={state.d_gecekondu} onChange={(v:any) => set('d_gecekondu', v)} points={2} />
                    <CheckboxItem label="Asansörsüz yüksek kat (Engelli/Yaşlı/Bakıma muhtaç)" checked={state.d_asansorsuzYuksek} onChange={(v:any) => set('d_asansorsuzYuksek', v)} points={2} />
                    <CheckboxItem label="Hijyen / Islak hacim (Banyo/Tuvalet) ortak veya yetersiz" checked={state.d_tuvaletBanyoYetersiz} onChange={(v:any) => set('d_tuvaletBanyoYetersiz', v)} points={2} />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 5 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">E. Beyaz Eşya ve Ev Aletleri Durumu</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Hanedeki temel ev eşyalarının varlık ve yıpranma durumu</p>
                </div>
                <SectionCard title="Beyaz Eşya ve Cihaz Kontrolü" maxScore={10} currentScore={calc.scoreE} hideScore={true}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
                    Her bir eşya için hanedeki mevcudiyet durumunu &quot;Yok&quot;, &quot;Var (Eski/Arızalı)&quot; veya &quot;Var (Yeni/İyi)&quot; olarak belirleyiniz.
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
                      onChange={(v: any) => set('appliance_bulasik', v)} pointsYok={0} pointsEski={0} 
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
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">F. Sosyal Kırılganlık</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Sosyal kırılganlık durumları (Literatürce Genişletilmiş Seçenekler)</p>
                </div>
                <SectionCard title="Sosyal Kırılganlık ve Nüfus" maxScore={15} currentScore={calc.scoreC} hideScore={true}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 sm:col-span-2">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        Hane Nüfusu Etkisi — {state.householdSize || 1} Kişi
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-extrabold px-3 py-1 rounded-md">
                        {(state.householdSize || 1) >= 7 ? `Çok Kalabalık (+4)` :
                         (state.householdSize || 1) >= 5 ? `Kalabalık (+3)` :
                         (state.householdSize || 1) >= 3 ? `Orta Büyüklük (+2)` : `Küçük Hane (+1)`}
                      </span>
                    </div>
                    <CheckboxItem label="Aile içi şiddet mağduru" checked={state.e_siddetMagduru} onChange={(v:any) => set('e_siddetMagduru', v)} points={5} />
                    <CheckboxItem label="Kadın hane reisi" checked={state.e_kadinReis} onChange={(v:any) => set('e_kadinReis', v)} points={4} />
                    <CheckboxItem label="Eşi / Bakmakla yükümlü kişi cezaevinde" checked={state.e_esiCezaevinde} onChange={(v:any) => set('e_esiCezaevinde', v)} points={4} />
                    <CheckboxItem label="Afet / Kaza nedeniyle gelir kaybı" checked={state.e_afetGelirKaybi} onChange={(v:any) => set('e_afetGelirKaybi', v)} points={4} />
                    <CheckboxItem label="Hane içinde madde / alkol bağımlısı birey" checked={state.e_maddeBagimliligi} onChange={(v:any) => set('e_maddeBagimliligi', v)} points={4} />
                    <CheckboxItem label="Sosyal güvencesiz ve aile desteğinden yoksun" checked={state.e_sosyalGuvencesiz} onChange={(v:any) => set('e_sosyalGuvencesiz', v)} points={4} />
                    <CheckboxItem label="Yüksek borç / icra / haciz baskısı altında" checked={state.e_icraBorcBaskisi} onChange={(v:any) => set('e_icraBorcBaskisi', v)} points={3} />
                    <CheckboxItem label="Bakıma muhtaç bebek (0-1 Yaş) veya riskli gebelik" checked={state.e_gebelikBebek} onChange={(v:any) => set('e_gebelikBebek', v)} points={3} />
                    <CheckboxItem label="Boşanmış / Terk edilmiş eş" checked={state.e_bosanmis} onChange={(v:any) => set('e_bosanmis', v)} points={2} />
                    <CheckboxItem label="Dul (Eşi vefat etmiş)" checked={state.e_dul} onChange={(v:any) => set('e_dul', v)} points={2} />
                    <CheckboxItem label="Denetimli serbestlik / Eski hükümlü ikameti" checked={state.e_hukumluYakin} onChange={(v:any) => set('e_hukumluYakin', v)} points={2} />
                  </div>
                </SectionCard>
              </div>
            )}

            {step === 7 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">G. Sosyal İnceleme Kanaati</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Sosyal inceleme görevlisinin saha gözlemine dayalı kanaat puanları (Maksimum 20 Puan)</p>
                </div>

                {/* Detailed Guidance Scale Card */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 mb-6 text-xs text-blue-950 space-y-2">
                  <div className="flex items-center gap-2 font-black text-blue-900 text-sm">
                    <Info size={18} className="text-blue-700 shrink-0" />
                    <span>0 - 5 Puanlama Mantığı ve Anlam Rehberi</span>
                  </div>
                  <p className="leading-relaxed">
                    Bu bölümde verilen puanlar hanenin <strong>muhtaçlık ve yardım alma ihtiyacını doğrudan artırır</strong>. Bu nedenle:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-blue-200">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">0 PUAN: İYİ / YETERLİ (İHTİYAÇ YOK)</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Hanenin durumu olumlu, yeterli ve stabildir. İlave yardım puanına ihtiyaç duyulmamaktadır.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-blue-200">
                      <span className="font-extrabold text-red-800 block text-xs">5 PUAN: ÇOK KÖTÜ / KRİTİK ACİL İHTİYAÇ</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Hane şartları aşırı olumsuz, kritik, acil veya risksizdir. Maksimum +5 puan eklenerek yardım önceliği yükseltilir.</p>
                    </div>
                  </div>
                </div>

                <SectionCard title="Kanaat Notları" maxScore={10} currentScore={calc.scoreF} hideScore={true}>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-semibold">Lütfen aşağıdaki 4 kriter için hanedeki saha gözleminize uygun olan 0 (İyi) ile 5 (Çok Kötü / Kritik) arası değeri seçiniz:</p>
                   <div className="space-y-3">
                     <ScoreButtons 
                       label="1. Yaşam Koşulları (Fiziki Şartlar, Hijyen, Eşya)" 
                       description="0 = Lüks/Yeterli Hijyenik Ev Koşulları • 5 = Aşırı Kötü/Harabe/Sağlıksız"
                       value={state.f_yasamKosullari} 
                       onChange={(v:any) => set('f_yasamKosullari', v)} 
                     />
                     <ScoreButtons 
                       label="2. Aciliyet Durumu (İvedilik ve Kriz Hali)" 
                       description="0 = Aciliyet Yok/Rutin • 5 = Çok Acil/Kritik Derhal Müdahale"
                       value={state.f_aciliyet} 
                       onChange={(v:any) => set('f_aciliyet', v)} 
                     />
                     <ScoreButtons 
                       label="3. Sosyal Destek Yetersizliği (Akraba / Çevre Desteği)" 
                       description="0 = Güçlü Akraba/Çevre Desteği Var • 5 = Tamamen Kimsesiz/Sıfır Destek"
                       value={state.f_sosyalDestek} 
                       onChange={(v:any) => set('f_sosyalDestek', v)} 
                     />
                     <ScoreButtons 
                       label="4. Risk Değerlendirmesi (Güvenlik / İstismar / Kırılganlık)" 
                       description="0 = Güvenli/Risk Yok • 5 = Hayati Risk/Tehlikeli Ortam/İhmal"
                       value={state.f_risk} 
                       onChange={(v:any) => set('f_risk', v)} 
                     />
                   </div>
                </SectionCard>
              </div>
            )}

            {step === 8 && (
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Sistem Kontrolleri</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Kayıt öncesi zorunlu inceleme başlıkları.</p>
                </div>
                <SectionCard title="Kontrol Listesi" maxScore={0} currentScore={0} className="border-orange-200" hideScore={true}>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Yardım yapılmadan önce ilgili kurumlardan (Araç, Tapu, SGK vb.) zorunlu kontrollerin yapılması gerekmektedir.</p>
                   <div className="mb-6">
                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${state.systemChecksDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900'}`}>
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 mr-4"
                          checked={state.systemChecksDone}
                          onChange={(e) => set('systemChecksDone', e.target.checked)}
                        />
                        <span className={`font-bold ${state.systemChecksDone ? 'text-emerald-800' : 'text-slate-700 dark:text-slate-300'}`}>Zorunlu sistem kontrollerini (Araç, Tapu, SGK vb.) yaptım.</span>
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
                   
                   {/* Varlık Testi Sonuçları */}
                   <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5 space-y-3">
                     <h4 className="text-sm font-extrabold text-orange-900 flex items-center gap-2">
                       <AlertTriangle size={16} className="text-orange-600" />
                       Sorgu Sonuçları — Ceza Puanları Uygulanır
                     </h4>
                     <CheckboxItem label="Araç tescil kaydı tespit edildi (−15 Puan)" checked={state.a_aracSahibi} onChange={(v:any) => set('a_aracSahibi', v)} isAlert={true} points={null} />
                     <CheckboxItem label="Birden fazla taşınmaz (gayrimenkul) kaydı var (−20 Puan)" checked={state.a_birdenFazlaTasinmaz} onChange={(v:any) => set('a_birdenFazlaTasinmaz', v)} isAlert={true} points={null} />
                     <CheckboxItem label="Aktif SGK prim ödemesi tespit edildi" checked={state.a_aktifSgkPrim} onChange={(v:any) => set('a_aktifSgkPrim', v)} isAlert={true} points={-5} />
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
                     <div className="flex flex-col">
                       <label className="flex items-start p-4 border border-red-200 rounded-xl cursor-pointer bg-white dark:bg-slate-800 hover:bg-red-50/50 transition-colors">
                         <input
                           type="checkbox"
                           className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 mt-0.5"
                           checked={state.falseStatement}
                           onChange={(e) => set('falseStatement', e.target.checked)}
                         />
                         <div className="ml-3 flex flex-col">
                           <span className="text-sm font-bold text-red-700">DİKKAT: Gerçeğe Aykırı Beyan TESPİT EDİLDİ!</span>
                           <span className="text-xs font-semibold text-red-500 mt-1">
                             (İşaretlenirse başvuruyu doğrudan reddeder ve onay sürecinde işleme alınmaz)
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
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center w-full max-w-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
                    <Save size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Güncellemeleri Kaydet</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Değişiklikleri kaydederek inceleme bilgilerini güncelleyebilirsiniz.
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 mb-8 text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      <ShieldCheck size={16} /> Saha Güvenlik Protokolü Etkin
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Gizli Değerlendirme Modu</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                      Saha ziyareti sırasında hane halkı gizliliği gereği puan sonucu ekranda gösterilmemektedir.
                    </p>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex justify-center items-center"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Sticky Bottom Navigation Bar for Mobile Ergonomics */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-xl z-30 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm min-h-[48px] transition-all active:scale-95 touch-manipulation ${
            step === 0 ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" /> Geri
        </button>
        
        <div className="text-center">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">İnceleme Düzenleme</span>
          <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">Adım {step + 1} / {stepsCount}</span>
        </div>

        {step < stepsCount - 1 ? (
          <button
            type="button"
            onClick={() => setStep(s => Math.min(stepsCount - 1, s + 1))}
            disabled={!canProceed}
            className={`flex items-center justify-center px-5 py-3 rounded-xl font-extrabold text-sm min-h-[48px] transition-all shadow-md active:scale-95 touch-manipulation ${
              !canProceed
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            Sonraki Adım <ChevronRight size={20} className="ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center px-5 py-3 rounded-xl font-extrabold text-sm min-h-[48px] bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md active:scale-95 touch-manipulation"
          >
            <Save size={18} className="mr-1.5" /> Değişiklikleri Kaydet
          </button>
        )}
      </div>
    </div>
  );
}

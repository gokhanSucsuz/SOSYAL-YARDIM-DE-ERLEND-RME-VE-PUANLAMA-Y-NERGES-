"use client";
/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";


import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAssessmentById, Assessment, saveAssessment, deleteAssessment } from '@/lib/db';
import { ShieldCheck, Printer, ArrowLeft, CheckCircle2, Info, AlertTriangle, Check, X, FileText, RotateCcw, Lock, Unlock, Trash2 } from 'lucide-react';
import { useDialog } from '@/components/DialogProvider';
import Link from 'next/link';
import { LogoImage } from '@/components/logo-image';

export default function AssessmentDetail() {
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    
    const loadData = async () => {
      try {
        const id = params?.id as string;
        if (!id) return;
        const data = await getAssessmentById(id);
        if (data) setAssessment(data);
        else router.push('/');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router, params?.id]);

  const handleApprove = async () => {
    if (!assessment) return;
    setApproving(true);
    try {
      const updated = { 
        ...assessment, 
        status: 'approved' as const,
        managerName: user?.name || 'Vakıf Müdürü'
      };
      await saveAssessment(updated);
      setAssessment(updated);
    } catch (err) {
      await showAlert('Onaylama sırasında bir hata oluştu.');
    } finally {
      setApproving(false);
    }
  };

  const handleRevokeApproval = async () => {
    if (!assessment) return;
    if (!(await showConfirm('Bu inceleme kaydının onayını kaldırmak istediğinizden emin misiniz? Onay kaldırıldığında personel tarafından tekrar düzenleme yapılabilecektir.'))) return;
    
    setApproving(true);
    try {
      const updated = { 
        ...assessment, 
        status: 'pending' as const,
        managerName: undefined
      };
      await saveAssessment(updated);
      setAssessment(updated);
      await showAlert('Müdür onayı kaldırıldı. Kayıt tekrar düzenlenebilir duruma getirildi.');
    } catch (err) {
      await showAlert('Onay kaldırma sırasında bir hata oluştu.');
    } finally {
      setApproving(false);
    }
  };

  const handleDelete = async () => {
    if (!assessment) return;
    if (assessment.status === 'approved') {
      await showAlert('Onaylanmış sosyal inceleme kayıtları silinemez.');
      return;
    }

    if (!(await showConfirm(`"${assessment.applicantName}" isimli başvuru sahibine ait sosyal inceleme kaydını SILMEK istediğinizden emin misiniz?\n\nBu işlem kalıcıdır ve geri alınamaz!`))) {
      return;
    }

    setDeleting(true);
    try {
      await deleteAssessment(assessment.id);
      await showAlert('Sosyal inceleme kaydı başarıyla silindi.');
      router.push('/');
    } catch (err) {
      console.error('Silme işlemi sırasında hata oluştu:', err);
      await showAlert('Kayıt silinirken bir hata oluştu.');
      setDeleting(false);
    }
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse font-medium text-slate-500">İnceleme detayları yükleniyor...</div>
    </div>
  );

  if (!assessment || !user) return <div className="p-8 text-center text-slate-600">İnceleme kaydı bulunamadı.</div>;

  const { data: state, result: calc } = assessment;

  // Helper arrays for options checked
  const getIncomeText = (val: number) => {
    if (val === 40) return "Kişi başına gelir muhtaçlık sınırının %25 altında (+40 Puan)";
    if (val === 35) return "Muhtaçlık sınırının %25 – 50 arasında (+35 Puan)";
    if (val === 25) return "Muhtaçlık sınırının %50 – 75 arasında (+25 Puan)";
    if (val === 15) return "Muhtaçlık sınırının %75 – 100 arasında (+15 Puan)";
    return "Muhtaçlık sınırı üzerinde (0 Puan)";
  };

  const selectedDisadvantages = [];
  if (state.b_agirEngelli) selectedDisadvantages.push("Ağır engelli (%70+) (+15 Puan)");
  if (state.b_engelli) selectedDisadvantages.push("Engelli (%40-69) (+10 Puan)");
  if (state.b_evdeBakim) selectedDisadvantages.push("Evde bakım hastası (+10 Puan)");
  if (state.b_kanser) selectedDisadvantages.push("Kanser tedavisi gören (+10 Puan)");
  if (state.b_kronik) selectedDisadvantages.push("Kronik hastalık (+6 Puan)");
  if (state.b_yasliYalniz) selectedDisadvantages.push("65 yaş üstü yalnız yaşayan (+8 Puan)");
  if (state.b_sehitYakini) selectedDisadvantages.push("Şehit yakını (+8 Puan)");
  if (state.b_gazi) selectedDisadvantages.push("Gazi (+8 Puan)");
  if (state.b_yetim) selectedDisadvantages.push("Yetim / Öksüz çocuk (+5 Puan)");
  if (state.b_koruyucuAile) selectedDisadvantages.push("Koruyucu aile (+5 Puan)");
  if (state.b_yabanciUyruklu) selectedDisadvantages.push("Yabancı uyruklu / Sığınmacı (Suriyeli, Afgan vb.) (+3 Puan)");
  if (state.b_ozelSebepPuan && Number(state.b_ozelSebepPuan) > 0) {
    const reasonText = state.b_ozelSebepMetin ? `: ${state.b_ozelSebepMetin}` : "";
    selectedDisadvantages.push(`Özel Sebep${reasonText} (+${state.b_ozelSebepPuan} Puan)`);
  }

  const selectedEducation = [];
  if (state.c_0_6yas > 0) selectedEducation.push(`0-6 Yaş Çocuk: ${state.c_0_6yas} kişi (+${state.c_0_6yas * 2} Puan)`);
  if (state.c_ilkokul > 0) selectedEducation.push(`İlkokul Öğrencisi: ${state.c_ilkokul} kişi (+${state.c_ilkokul * 1} Puan)`);
  if (state.c_ortaokul > 0) selectedEducation.push(`Ortaokul Öğrencisi: ${state.c_ortaokul} kişi (+${state.c_ortaokul * 2} Puan)`);
  if (state.c_lise > 0) selectedEducation.push(`Lise Öğrencisi: ${state.c_lise} kişi (+${state.c_lise * 3} Puan)`);
  if (state.c_meslekiEgitim > 0) selectedEducation.push(`Mesleki Eğitim Merkezi Öğrencisi: ${state.c_meslekiEgitim} kişi (+${state.c_meslekiEgitim * 3} Puan)`);
  if (state.c_acikLise > 0) selectedEducation.push(`Açık Lise Öğrencisi: ${state.c_acikLise} kişi (+${state.c_acikLise * 3} Puan)`);
  if (state.c_uni > 0) selectedEducation.push(`Üniversite Öğrencisi: ${state.c_uni} kişi (+${state.c_uni * 4} Puan)`);

  const selectedHousing = [];
  if (state.d_evsiz) selectedHousing.push("Evsiz (+10 Puan)");
  if (state.d_afetzede) selectedHousing.push("Afetzede (+10 Puan)");
  if (state.d_agirHasarli) selectedHousing.push("Konut ağır hasarlı (+8 Puan)");
  if (state.d_sagliksiz) selectedHousing.push("Sağlıksız konut (+6 Puan)");
  if (state.d_kiraci) selectedHousing.push("Kiracı (+5 Puan)");

  const selectedFragility = [];
  if (state.e_siddetMagduru) selectedFragility.push("Aile içi şiddet mağduru (+6 Puan)");
  if (state.e_kadinReis) selectedFragility.push("Kadın hane reisi (+5 Puan)");
  if (state.e_esiCezaevinde) selectedFragility.push("Eşi cezaevinde (+5 Puan)");
  if (state.e_afetGelirKaybi) selectedFragility.push("Afet nedeniyle gelir kaybı (+5 Puan)");
  if (state.e_bosanmis) selectedFragility.push("Boşanmış (+3 Puan)");
  if (state.e_dul) selectedFragility.push("Dul (Eşi vefat etmiş) (+3 Puan)");

  const hhSize = state.householdSize || 1;
  if (hhSize >= 5) {
    selectedFragility.push(`Hane Nüfusu (${hhSize} kişi): +3 Puan`);
  } else if (hhSize >= 1) {
    selectedFragility.push(`Hane Nüfusu (${hhSize} kişi): +1 Puan`);
  }

  const appliancesList = [
    { label: 'Buzdolabı', val: state.appliance_buzdolabi || 'yeni' },
    { label: 'Çamaşır Makinesi', val: state.appliance_camasir || 'yeni' },
    { label: 'Fırın / Ocak', val: state.appliance_firin || 'yeni' },
    { label: 'Bulaşık Makinesi', val: state.appliance_bulasik || 'yeni' },
    { label: 'Televizyon (TV)', val: state.appliance_tv || 'yeni' },
    { label: 'Telefon', val: state.appliance_telefon || 'yeni' },
    { label: 'Klima / Isıtıcı', val: state.appliance_klima || 'yeni' },
    { label: 'Diğer Ev Aletleri', val: state.appliance_diger || 'yeni' },
  ];

  const formatApplianceVal = (val: string) => {
    if (val === 'yok') return { text: 'YOK', class: 'bg-red-100 text-red-800 border-red-200' };
    if (val === 'eski') return { text: 'VAR (ESKİ/ARIZALI)', class: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { text: 'VAR (YENİ/İYİ)', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const managerDisplayName = user.role === 'manager' 
    ? user.name 
    : (assessment.managerName || 'Vakıf Müdürü');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Print Specific CSS to enforce single page clean official document */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 10px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-compact-table td, .print-compact-table th {
            padding: 3px 6px !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      {/* SCREEN NAVBAR */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10 no-print">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-1">
            <ArrowLeft size={20} />
          </Link>
          <LogoImage 
            className="w-10 h-10 rounded-2xl shadow-md border-2 border-slate-700 object-cover shrink-0 hidden sm:block" 
          />
          <div>
            <h1 className="text-lg font-bold leading-tight flex items-center gap-2">
              SOSYAL İNCELEME DETAYLARI
              {user.role === 'manager' && (
                <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                  Müdür İnceleme Modu
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
              Ref ID: {assessment.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'personnel' && assessment.status !== 'approved' && (
            <Link 
              href={`/assessment/${assessment.id}/edit`}
              className="flex items-center space-x-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-semibold shadow-sm"
            >
              <span>Düzenle</span>
            </Link>
          )}

          {user.role === 'personnel' && assessment.status === 'approved' && (
            <div className="flex items-center space-x-2 bg-slate-100 text-slate-500 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-bold" title="Bu kayıt müdür tarafından onaylandığı için düzenlenemez.">
              <Lock size={15} />
              <span>Onaylı Kayıt (Düzenlenemez)</span>
            </div>
          )}

          {user.role === 'manager' && assessment.status !== 'approved' && (
            <button 
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center space-x-2 bg-emerald-600 text-white border border-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-bold shadow-md shadow-emerald-900/20 active:scale-95"
            >
              <CheckCircle2 size={18} />
              <span>{approving ? 'Onaylanıyor...' : 'İncelemeyi Onayla'}</span>
            </button>
          )}

          {user.role === 'manager' && assessment.status === 'approved' && (
            <button 
              onClick={handleRevokeApproval}
              disabled={approving}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-md shadow-amber-900/20 active:scale-95"
              title="Müdür Onayını Kaldır ve Düzenlemeye Aç"
            >
              <RotateCcw size={18} />
              <span>{approving ? 'İşleniyor...' : 'Müdür Onayını Geri Al (Düzenlemeye Aç)'}</span>
            </button>
          )}

          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-md shadow-blue-900/20"
          >
            <Printer size={18} />
            <span>Resmi Çıktı / Yazdır</span>
          </button>

          {/* Delete Record Button */}
          {assessment.status !== 'approved' ? (
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white border border-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-md shadow-red-900/20 active:scale-95"
              title="Onaylanmamış inceleme kaydını kalıcı olarak sil"
            >
              <Trash2 size={18} />
              <span>{deleting ? 'Siliniyor...' : 'Kaydı Sil'}</span>
            </button>
          ) : (
            <div 
              className="flex items-center space-x-1.5 bg-slate-800 text-slate-400 border border-slate-700 px-3 py-2 rounded-lg text-xs font-bold cursor-not-allowed" 
              title="Onaylı sosyal inceleme kayıtları silinemez. Silme işlemi için öncelikle müdür onayının kaldırılması gerekir."
            >
              <Lock size={14} />
              <span>Onaylı (Silinemez)</span>
            </div>
          )}
        </div>
      </header>

      {/* SCREEN MAIN CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-8 space-y-6 no-print">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900">{assessment.applicantName}</h2>
              {assessment.status === 'approved' ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-extrabold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={14} /> ONAYLANDI
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-extrabold border border-amber-200 flex items-center gap-1">
                  <Info size={14} /> MÜDÜR ONAYI BEKLİYOR
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600 pt-1">
              <div><span className="font-bold text-slate-400 block text-xs uppercase">T.C. Kimlik</span>{assessment.applicantTc}</div>
              <div><span className="font-bold text-slate-400 block text-xs uppercase">Telefon</span>{assessment.phoneNumber || '-'}</div>
              <div><span className="font-bold text-slate-400 block text-xs uppercase">Hane Kişi Sayısı</span>{assessment.householdSize} kişi</div>
              <div><span className="font-bold text-slate-400 block text-xs uppercase">Hane No (Ref)</span>{assessment.householdNo || '-'}</div>
            </div>

            {assessment.applicantAddress && (
              <p className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                <strong className="text-slate-800 font-semibold">Adres:</strong> {assessment.applicantAddress}
              </p>
            )}
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-xl text-right shrink-0 min-w-[200px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hesaplanan Puan</p>
            <p className={`text-4xl font-black ${calc.isRejected ? 'text-red-400' : 'text-blue-400'}`}>{calc.totalScore} <span className="text-xs text-slate-400 font-normal">/ 130</span></p>
            <p className="text-xs font-bold mt-2 uppercase text-slate-300">
              {calc.isRejected ? 'REDDEDİLDİ' : calc.assistance.text}
            </p>
          </div>
        </div>

        {/* Manager Banner Alert if pending */}
        {user.role === 'manager' && assessment.status !== 'approved' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg"><AlertTriangle size={20} /></div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">Müdür Onayı Bekleniyor</h3>
                <p className="text-xs text-amber-700">İncelemeyi yapan personel tarafından hazırlanan formu kontrol ettikten sonra yukarıdaki &quot;İncelemeyi Onayla&quot; butonuna basarak onaylayabilirsiniz.</p>
              </div>
            </div>
            <button 
              onClick={handleApprove}
              disabled={approving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              Onayla
            </button>
          </div>
        )}

        {/* Detailed Sections View (All Marked Options) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* A. Ekonomik Durum */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">A. EKONOMİK DURUM DETAYLARI</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreA} / 40 Puan
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gelir Seviyesi Beyanı</p>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    {getIncomeText(state.income)}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">İlave Gelir / Çalışma / Yardım Geçmişi Durumları</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-between ${state.noWorker ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>Hanede Çalışan Yok</span>
                      {state.noWorker ? <Check size={16} className="text-amber-600" /> : <X size={14} />}
                    </div>
                    <div className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-between ${state.noRegularIncome ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>Düzenli Gelir Yok</span>
                      {state.noRegularIncome ? <Check size={16} className="text-amber-600" /> : <X size={14} />}
                    </div>
                    <div className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-between ${state.noSgk ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>SGK Kaydı Yok</span>
                      {state.noSgk ? <Check size={16} className="text-amber-600" /> : <X size={14} />}
                    </div>
                    <div className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-between ${state.a_son3AyYardimKisi > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span>Son 3 Ayda Vakıf Yardımı: {state.a_son3AyYardimKisi || 0} Kişi (-{(state.a_son3AyYardimKisi || 0) * 5} Pn)</span>
                      {state.a_son3AyYardimKisi > 0 ? <Check size={16} className="text-red-600" /> : <X size={14} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B. Dezavantajlı Bireyler */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">B. DEZAVANTAJLI BİREY SEÇENEKLERİ</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreB} / 30 Puan
                </span>
              </div>
              <div className="p-5">
                {selectedDisadvantages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedDisadvantages.map((item, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-blue-600" /> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic">Dezavantajlı birey kriteri bulunmuyor (0 Puan).</p>
                )}
              </div>
            </div>

            {/* C. Çocuk ve Eğitim */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">C. ÇOCUK VE EĞİTİM DURUMU</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreC} / 10 Puan
                </span>
              </div>
              <div className="p-5">
                {selectedEducation.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedEducation.map((item, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-900 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-indigo-600" /> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic">Eğitim gören çocuk kaydı işaretlenmedi (0 Puan).</p>
                )}
              </div>
            </div>

            {/* D. Barınma Durumu */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">D. BARINMA DURUMU SEÇENEKLERİ</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreD} / 10 Puan
                </span>
              </div>
              <div className="p-5">
                {selectedHousing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedHousing.map((item, idx) => (
                      <span key={idx} className="bg-teal-50 text-teal-900 border border-teal-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-teal-600" /> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic">Barınma kriteri işaretlenmedi (0 Puan).</p>
                )}
              </div>
            </div>

            {/* E. Beyaz Eşya ve Ev Aletleri */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">E. BEYAZ EŞYA VE EV ALETLERİ KONTROLÜ</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreE} / 10 Puan
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appliancesList.map((app, idx) => {
                  const status = formatApplianceVal(app.val);
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-slate-700">{app.label}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${status.class}`}>
                        {status.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* F. Sosyal Kırılganlık */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">F. SOSYAL KIRILGANLIK VE NÜFUS</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreF} / 30 Puan
                </span>
              </div>
              <div className="p-5">
                {selectedFragility.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFragility.map((item, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-purple-600" /> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic">Sosyal kırılganlık maddesi işaretlenmedi (0 Puan).</p>
                )}
              </div>
            </div>

            {/* G. Sosyal İnceleme Kanaati */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">G. PERSONEL İNCELEME KANAAT PUANLARI</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {calc.scoreG ?? 0} / 20 Puan
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">1. Yaşam Koşulları</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {state.f_yasamKosullari === 0 ? 'İyi / Yeterli Ev Koşulları' : state.f_yasamKosullari === 5 ? 'Aşırı Kötü / Harabe / Bakımsız' : `${state.f_yasamKosullari} Puan Kırılganlık`}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-sm font-extrabold border ${state.f_yasamKosullari >= 4 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {state.f_yasamKosullari || 0} / 5 Puan
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">2. Aciliyet Durumu</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {state.f_aciliyet === 0 ? 'Aciliyet Yok / Rutin' : state.f_aciliyet === 5 ? 'Çok Acil / Kritik Kriz Hali' : `${state.f_aciliyet} Puan Aciliyet`}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-sm font-extrabold border ${state.f_aciliyet >= 4 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {state.f_aciliyet || 0} / 5 Puan
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">3. Sosyal Destek Yetersizliği</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {state.f_sosyalDestek === 0 ? 'Akraba/Çevre Desteği Var' : state.f_sosyalDestek === 5 ? 'Tamamen Kimsesiz / Desteksiz' : `${state.f_sosyalDestek} Puan Yetersizlik`}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-sm font-extrabold border ${state.f_sosyalDestek >= 4 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {state.f_sosyalDestek || 0} / 5 Puan
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">4. Risk Değerlendirmesi</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {state.f_risk === 0 ? 'Güvenli / Risk Tespit Edilmedi' : state.f_risk === 5 ? 'Hayati Risk / Yüksek Tehlike' : `${state.f_risk} Puan Risk`}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-sm font-extrabold border ${state.f_risk >= 4 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {state.f_risk || 0} / 5 Puan
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Summary & System Checks */}
          <div className="space-y-6">
            
            {/* System Check & Integrity */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
                Zorunlu Kontroller
              </h4>
              
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900">
                <span>Kurum Sorgulamaları (SGK/Tapu/Araç)</span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 size={16} /> YAPILDI
                </span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg border text-xs font-bold ${state.falseStatement ? 'bg-red-100 border-red-300 text-red-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <span>Gerçeğe Aykırı Beyan</span>
                <span>{state.falseStatement ? 'DİKKAT: TESPİT EDİLDİ' : 'Yok (Sorunsuz)'}</span>
              </div>
            </div>

            {/* Summary & Priority Rules */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Değerlendirme Sonucu</p>
                <p className={`text-2xl font-black mt-1 ${calc.isRejected ? 'text-red-400' : 'text-emerald-400'}`}>
                  {calc.isRejected ? 'BAŞVURU REDDEDİLDİ' : calc.assistance.text.toUpperCase()}
                </p>
              </div>

              {calc.priorities && calc.priorities.length > 0 && !calc.isRejected && (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Öncelikli Durum Başlıkları</p>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {calc.priorities.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Personnel & Manager Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">İşlem Yapan Görevliler</h4>
              
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">İnceleyen Personel:</span>
                  <span className="font-bold text-slate-800">{assessment.personnelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ziyaret Tarihi:</span>
                  <span className="font-bold text-slate-800">{new Date(assessment.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Müdür Onayı:</span>
                  <span className="font-bold text-slate-800">{managerDisplayName}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* PRINT-ONLY OFFICIAL DOCUMENT TEMPLATE (EXACT SINGLE A4 PAGE FORMAT)        */}
      {/* ========================================================================= */}
      <div className="print-only w-full bg-white text-black p-0 m-0 leading-tight">
        
        {/* Official Letterhead */}
        <div className="text-center border-b-2 border-black pb-2 mb-3">
          <p className="text-xs font-bold uppercase tracking-widest">T.C.</p>
          <p className="text-sm font-black uppercase tracking-wider">SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</p>
          <p className="text-xs font-extrabold tracking-widest uppercase mt-0.5">RESMİ SOSYAL İNCELEME VE DEĞERLENDİRME RAPORU</p>
        </div>

        {/* Top Info Table */}
        <table className="w-full border-collapse border border-black text-[10px] mb-3 print-compact-table">
          <tbody>
            <tr className="border-b border-black bg-slate-100">
              <td className="border-r border-black font-bold p-1 w-1/4">T.C. KİMLİK NO:</td>
              <td className="border-r border-black p-1 w-1/4">{assessment.applicantTc}</td>
              <td className="border-r border-black font-bold p-1 w-1/4">BAŞVURU SAHİBİ:</td>
              <td className="p-1 w-1/4 font-bold">{assessment.applicantName}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black font-bold p-1">TELEFON:</td>
              <td className="border-r border-black p-1">{assessment.phoneNumber || '-'}</td>
              <td className="border-r border-black font-bold p-1">HANE KİŞİ SAYISI:</td>
              <td className="p-1">{assessment.householdSize} kişi</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black font-bold p-1">HANE REF NO:</td>
              <td className="border-r border-black p-1">{assessment.householdNo || '-'}</td>
              <td className="border-r border-black font-bold p-1">ZİYARET TARİHİ:</td>
              <td className="p-1">{new Date(assessment.date).toLocaleDateString('tr-TR')}</td>
            </tr>
            <tr>
              <td className="border-r border-black font-bold p-1">İKAMET ADRESİ:</td>
              <td colSpan={3} className="p-1">{assessment.applicantAddress || '-'}</td>
            </tr>
          </tbody>
        </table>

        {/* Evaluation Criteria Matrix */}
        <div className="mb-3">
          <div className="bg-slate-200 border border-black font-bold p-1 text-[10px] text-center uppercase tracking-wide mb-1">
            SOSYAL İNCELEME SEÇENEKLERİ VE PUANLAMA KRİTERLERİ DETAYI
          </div>

          <table className="w-full border-collapse border border-black text-[9px] print-compact-table">
            <thead>
              <tr className="bg-slate-100 border-b border-black">
                <th className="border-r border-black p-1 text-left w-1/5">KATEGORİ</th>
                <th className="border-r border-black p-1 text-left">İŞARETLENEN / TESPİT EDİLEN SEÇENEKLER</th>
                <th className="p-1 text-center w-16">PUAN</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">A. Ekonomik Durum</td>
                <td className="border-r border-black p-1">
                  {getIncomeText(state.income)}
                  {state.noWorker && " • Hanede çalışan yok (+10)"}
                  {state.noRegularIncome && " • Düzenli gelir yok (+5)"}
                  {state.noSgk && " • SGK kaydı yok (+5)"}
                  {state.a_son3AyYardimKisi > 0 && ` • Son 3 ayda Vakıf yardımı alan: ${state.a_son3AyYardimKisi} kişi (-${state.a_son3AyYardimKisi * 5})`}
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreA} / 40</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">B. Dezavantajlılık</td>
                <td className="border-r border-black p-1">
                  {selectedDisadvantages.length > 0 ? selectedDisadvantages.join(" • ") : "Mevcut Değil"}
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreB} / 30</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">C. Çocuk ve Eğitim</td>
                <td className="border-r border-black p-1">
                  {selectedEducation.length > 0 ? selectedEducation.join(" • ") : "Eğitim gören çocuk kaydı yok"}
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreC} / 10</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">D. Barınma Durumu</td>
                <td className="border-r border-black p-1">
                  {selectedHousing.length > 0 ? selectedHousing.join(" • ") : "Standart konut"}
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreD} / 10</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">E. Ev Eşyaları</td>
                <td className="border-r border-black p-1">
                  {appliancesList.map(a => `${a.label}: ${a.val === 'yok' ? 'YOK' : (a.val === 'eski' ? 'ESKİ' : 'TAM')}`).join(" | ")}
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreE} / 10</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">F. Kırılganlık</td>
                <td className="border-r border-black p-1">
                  {selectedFragility.length > 0 ? selectedFragility.join(" • ") : "Özel kırılganlık maddesi bulunmuyor"}
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreF} / 30</td>
              </tr>

              <tr className="border-b border-black">
                <td className="border-r border-black p-1 font-bold">G. İnceleme Kanaati</td>
                <td className="border-r border-black p-1">
                  Yaşam Koşulları: {state.f_yasamKosullari || 0}/5 • Aciliyet: {state.f_aciliyet || 0}/5 • Sosyal Destek: {state.f_sosyalDestek || 0}/5 • Risk: {state.f_risk || 0}/5
                </td>
                <td className="p-1 text-center font-bold">{calc.scoreG ?? 0} / 20</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* System Check & Final Decision Box */}
        <table className="w-full border-collapse border border-black text-[10px] mb-4 print-compact-table">
          <tbody>
            <tr className="border-b border-black bg-slate-100">
              <td className="border-r border-black font-bold p-1 w-1/3">ZORUNLU KONTROLLER (SGK/TAPU/ARAÇ):</td>
              <td className="border-r border-black p-1 font-bold text-emerald-800">YAPILDI (EKSİKSİZ)</td>
              <td className="border-r border-black font-bold p-1 w-1/4">GERÇEĞE AYKIRI BEYAN:</td>
              <td className="p-1 font-bold">{state.falseStatement ? 'TESPİT EDİLDİ (RED)' : 'YOK'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="border-r border-black font-bold p-1">HESAPLANAN TOPLAM PUAN:</td>
              <td className="border-r border-black p-1 text-base font-black">{calc.totalScore} / 130</td>
              <td className="border-r border-black font-bold p-1">TAVSİYE EDİLEN KARAR:</td>
              <td className="p-1 font-extrabold text-sm">{calc.isRejected ? 'REDDEDİLDİ' : calc.assistance.text.toUpperCase()}</td>
            </tr>
          </tbody>
        </table>

        {/* Official Note */}
        <p className="text-[9px] italic text-slate-700 mb-6">
          * Bu rapor, 3294 Sayılı Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu kapsamında SYDV Sosyal İnceleme Görevlisi tarafından yerinde yapılan ev ziyareti neticesinde düzenlenmiş resmi inceleme belgesidir.
        </p>

        {/* OFFICIAL SIGNATURE BLOCK AT THE BOTTOM */}
        <div className="border border-black p-3 rounded-none mt-auto">
          <div className="flex justify-between items-start text-[10px] pt-1 px-6">
            
            {/* Personnel Signature */}
            <div className="text-center w-5/12">
              <p className="font-bold uppercase tracking-wider">SOSYAL YARDIM VE İNCELEME GÖREVLİSİ</p>
              <p className="font-semibold text-slate-800 mt-1">Adı Soyadı: <span className="inline-block border-b border-black w-36 text-left">&nbsp;</span></p>
              <p className="text-[9px] text-slate-600">Unvan: Sosyal Yardım ve İnceleme Görevlisi</p>
              <p className="text-[9px] text-slate-600 mt-0.5">Tarih: {new Date(assessment.date).toLocaleDateString('tr-TR')}</p>
              <div className="mt-8 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[9px] font-bold">
                İmza / Mühür
              </div>
            </div>

            {/* Manager Signature */}
            <div className="text-center w-5/12">
              <p className="font-bold uppercase tracking-wider">VAKIF MÜDÜRÜ</p>
              <p className="font-semibold text-slate-800 mt-1">Adı Soyadı: <span className="inline-block border-b border-black w-36 text-left">&nbsp;</span></p>
              <p className="text-[9px] text-slate-600">Unvan: SYDV Vakıf Müdürü</p>
              <p className="text-[9px] text-slate-600 mt-0.5">Onay Durumu: {assessment.status === 'approved' ? 'ONAYLANDI' : 'ONAY BEKLİYOR'}</p>
              <div className="mt-8 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[9px] font-bold">
                İmza / Mühür
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAssessments, getAssessmentsByPersonnel, Assessment, saveAssessment } from '@/lib/db';
import { 
  FileText, Plus, LogOut, Users, CheckCircle2, ShieldCheck, 
  Printer, Clock, BookOpen, Presentation, RotateCcw, 
  Lock, RefreshCw, Edit3, Search, ArrowUpDown, ArrowUp, ArrowDown, X, Filter, Check, CheckSquare 
} from 'lucide-react';
import Link from 'next/link';

interface BatchModalState {
  isOpen: boolean;
  type: 'approve_all' | 'approve_selected' | 'revoke_all' | 'revoke_selected';
  title: string;
  description: string;
  targetItems: Assessment[];
  step: 'confirm' | 'processing' | 'done';
  progress: number;
  processedCount: number;
  totalCount: number;
}

type SortField = 'date' | 'applicantTc' | 'applicantName' | 'householdSize' | 'personnelName' | 'totalScore' | 'status' | 'decision';
type SortOrder = 'asc' | 'desc';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [filterDecision, setFilterDecision] = useState<'all' | 'accepted' | 'rejected'>('all');
  
  // Sort States
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Multi-selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printOnlySelected, setPrintOnlySelected] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<'summary' | 'detailed'>('summary');

  // Modal State for Batch Approval / Revocation
  const [batchModal, setBatchModal] = useState<BatchModalState>({
    isOpen: false,
    type: 'approve_all',
    title: '',
    description: '',
    targetItems: [],
    step: 'confirm',
    progress: 0,
    processedCount: 0,
    totalCount: 0,
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
        if (currentUser.role === 'manager') {
          setAssessments(await getAllAssessments());
        } else {
          setAssessments(await getAssessmentsByPersonnel(currentUser.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse flex items-center gap-2">
          <RefreshCw className="animate-spin text-blue-600" size={20} />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const reloadAssessments = async () => {
    if (user.role === 'manager') {
      setAssessments(await getAllAssessments());
    } else {
      setAssessments(await getAssessmentsByPersonnel(user.id));
    }
  };

  const total = assessments.length;
  const pendingList = assessments.filter(a => a.status !== 'approved');
  const pendingCount = pendingList.length;
  const approvedList = assessments.filter(a => a.status === 'approved');
  const approvedCount = approvedList.length;

  // Search & Filter & Sort Pipeline
  const filteredAndSortedAssessments = assessments
    .filter(item => {
      // Status Filter
      if (filterStatus === 'pending' && item.status === 'approved') return false;
      if (filterStatus === 'approved' && item.status !== 'approved') return false;

      // Decision Filter
      if (filterDecision === 'accepted' && item.result.isRejected) return false;
      if (filterDecision === 'rejected' && !item.result.isRejected) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (item.applicantName || '').toLowerCase();
        const tc = (item.applicantTc || '').toLowerCase();
        const address = (item.applicantAddress || '').toLowerCase();
        const phone = (item.phoneNumber || '').toLowerCase();
        const personnel = (item.personnelName || '').toLowerCase();
        const decisionText = item.result.isRejected 
          ? 'reddedildi red kapsam dışı' 
          : (item.result.assistance?.text || '').toLowerCase();

        const isMatch = name.includes(q) || tc.includes(q) || address.includes(q) || phone.includes(q) || personnel.includes(q) || decisionText.includes(q);
        if (!isMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'applicantTc':
          aVal = a.applicantTc || '';
          bVal = b.applicantTc || '';
          break;
        case 'applicantName':
          aVal = (a.applicantName || '').toLowerCase();
          bVal = (b.applicantName || '').toLowerCase();
          break;
        case 'householdSize':
          aVal = a.householdSize || 0;
          bVal = b.householdSize || 0;
          break;
        case 'personnelName':
          aVal = (a.personnelName || '').toLowerCase();
          bVal = (b.personnelName || '').toLowerCase();
          break;
        case 'totalScore':
          aVal = a.result.totalScore || 0;
          bVal = b.result.totalScore || 0;
          break;
        case 'status':
          aVal = a.status === 'approved' ? 1 : 0;
          bVal = b.status === 'approved' ? 1 : 0;
          break;
        case 'decision':
          aVal = a.result.isRejected ? 'RED' : (a.result.assistance?.text || '');
          bVal = b.result.isRejected ? 'RED' : (b.result.assistance?.text || '');
          break;
        default:
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Sorting Helper
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="text-blue-600 font-black shrink-0" />
    ) : (
      <ArrowDown size={12} className="text-blue-600 font-black shrink-0" />
    );
  };

  // Multi-selection helper functions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedAssessments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedAssessments.map(a => a.id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Open Modals
  const openApproveAllModal = () => {
    if (pendingCount === 0) {
      alert('Onay bekleyen herhangi bir hane inceleme kaydı bulunmuyor.');
      return;
    }
    setBatchModal({
      isOpen: true,
      type: 'approve_all',
      title: 'Tüm Onay Bekleyenleri Onayla',
      description: `Onay bekleyen toplam ${pendingCount} adet hane inceleme kaydı toplu olarak ONAYLANACAKTIR. İşlemi onaylıyor musunuz?`,
      targetItems: pendingList,
      step: 'confirm',
      progress: 0,
      processedCount: 0,
      totalCount: pendingCount,
    });
  };

  const openRevokeAllModal = () => {
    if (approvedCount === 0) {
      alert('Onaylanmış herhangi bir hane inceleme kaydı bulunmuyor.');
      return;
    }
    setBatchModal({
      isOpen: true,
      type: 'revoke_all',
      title: 'Tüm Onayları Geri Al (Düzenlemeye Aç)',
      description: `Müdür tarafından onaylanmış toplam ${approvedCount} adet kaydın ONAYI KALDIRILACAKTIR. Kayıtlar tekrar inceleme ve düzenleme moduna alınacaktır. Emin misiniz?`,
      targetItems: approvedList,
      step: 'confirm',
      progress: 0,
      processedCount: 0,
      totalCount: approvedCount,
    });
  };

  const openApproveSelectedModal = () => {
    const selectedPending = assessments.filter(a => selectedIds.includes(a.id) && a.status !== 'approved');
    if (selectedPending.length === 0) {
      alert('Seçilenler arasında onay bekleyen kayıt bulunmuyor.');
      return;
    }
    setBatchModal({
      isOpen: true,
      type: 'approve_selected',
      title: 'Seçilen Kayıtları Onayla',
      description: `Seçmiş olduğunuz ${selectedPending.length} adet onay bekleyen hane inceleme kaydı ONAYLANACAKTIR. Onaylıyor musunuz?`,
      targetItems: selectedPending,
      step: 'confirm',
      progress: 0,
      processedCount: 0,
      totalCount: selectedPending.length,
    });
  };

  const openRevokeSelectedModal = () => {
    const selectedApproved = assessments.filter(a => selectedIds.includes(a.id) && a.status === 'approved');
    if (selectedApproved.length === 0) {
      alert('Seçilenler arasında onaylanmış kayıt bulunmuyor.');
      return;
    }
    setBatchModal({
      isOpen: true,
      type: 'revoke_selected',
      title: 'Seçilen Kayıtların Onayını Geri Al',
      description: `Seçmiş olduğunuz ${selectedApproved.length} adet onaylı kaydın müdür ONAYI KALDIRILACAK ve tekrar düzenlemeye açılacaktır. Emin misiniz?`,
      targetItems: selectedApproved,
      step: 'confirm',
      progress: 0,
      processedCount: 0,
      totalCount: selectedApproved.length,
    });
  };

  // Execute Batch Process with Animated Progress
  const executeBatchAction = async () => {
    const totalItems = batchModal.targetItems.length;
    if (totalItems === 0) return;

    setBatchModal(prev => ({
      ...prev,
      step: 'processing',
      progress: 0,
      processedCount: 0,
    }));

    const isApprove = batchModal.type === 'approve_all' || batchModal.type === 'approve_selected';

    for (let i = 0; i < totalItems; i++) {
      const item = batchModal.targetItems[i];
      const updated: Assessment = {
        ...item,
        status: isApprove ? 'approved' : 'pending',
        managerName: isApprove ? (user?.name || 'Vakıf Müdürü') : undefined,
      };

      await saveAssessment(updated);

      // Short delay for visual progress bar animation smoothing
      await new Promise(res => setTimeout(res, 100));

      const count = i + 1;
      const pct = Math.round((count / totalItems) * 100);

      setBatchModal(prev => ({
        ...prev,
        processedCount: count,
        progress: pct,
      }));
    }

    // Reload assessments after updates
    await reloadAssessments();

    // Mark completion
    setBatchModal(prev => ({
      ...prev,
      step: 'done',
      progress: 100,
    }));
  };

  // Quick Single Item Action
  const handleSingleApprove = async (item: Assessment) => {
    if (!confirm(`${item.applicantName} isimli başvuru sahibinin inceleme kaydını onaylamak istediğinizden emin misiniz?`)) return;
    try {
      const updated: Assessment = {
        ...item,
        status: 'approved',
        managerName: user?.name || 'Vakıf Müdürü',
      };
      await saveAssessment(updated);
      await reloadAssessments();
    } catch (err) {
      alert('Onaylama sırasında bir hata oluştu.');
    }
  };

  const handleSingleRevoke = async (item: Assessment) => {
    if (!confirm(`${item.applicantName} isimli başvuru sahibinin onayını kaldırmak istediğinizden emin misiniz? Kayıt tekrar düzenlemeye açılacaktır.`)) return;
    try {
      const updated: Assessment = {
        ...item,
        status: 'pending',
        managerName: undefined,
      };
      await saveAssessment(updated);
      await reloadAssessments();
    } catch (err) {
      alert('Onay kaldırma sırasında bir hata oluştu.');
    }
  };

  const getIncomeText = (val: number) => {
    if (val === 40) return "Kişi başına gelir muhtaçlık sınırının %25 altında (+40 Pn)";
    if (val === 35) return "Muhtaçlık sınırının %25 – 50 arasında (+35 Pn)";
    if (val === 25) return "Muhtaçlık sınırının %50 – 75 arasında (+25 Pn)";
    if (val === 15) return "Muhtaçlık sınırının %75 – 100 arasında (+15 Pn)";
    return "Muhtaçlık sınırı üzerinde (0 Pn)";
  };

  const getDisadvantagesList = (state: any) => {
    if (!state) return [];
    const list = [];
    if (state.b_agirEngelli) list.push("Ağır engelli (%70+) (+15 Pn)");
    if (state.b_engelli) list.push("Engelli (%40-69) (+10 Pn)");
    if (state.b_evdeBakim) list.push("Evde bakım hastası (+10 Pn)");
    if (state.b_kanser) list.push("Kanser tedavisi gören (+10 Pn)");
    if (state.b_kronik) list.push("Kronik hastalık (+6 Pn)");
    if (state.b_yasliYalniz) list.push("65 yaş üstü yalnız yaşayan (+8 Pn)");
    if (state.b_sehitYakini) list.push("Şehit yakını (+8 Pn)");
    if (state.b_gazi) list.push("Gazi (+8 Pn)");
    if (state.b_yetim) list.push("Yetim / Öksüz çocuk (+5 Pn)");
    if (state.b_koruyucuAile) list.push("Koruyucu aile (+5 Pn)");
    if (state.b_yabanciUyruklu) list.push("Yabancı uyruklu / Sığınmacı (+3 Pn)");
    if (state.b_ozelSebepPuan && Number(state.b_ozelSebepPuan) > 0) {
      const reasonText = state.b_ozelSebepMetin ? `: ${state.b_ozelSebepMetin}` : "";
      list.push(`Özel Sebep${reasonText} (+${state.b_ozelSebepPuan} Pn)`);
    }
    return list;
  };

  const getEducationList = (state: any) => {
    if (!state) return [];
    const list = [];
    if (state.c_0_6yas > 0) list.push(`0-6 Yaş: ${state.c_0_6yas} çck (+${state.c_0_6yas * 2} Pn)`);
    if (state.c_ilkokul > 0) list.push(`İlkokul: ${state.c_ilkokul} öğr (+${state.c_ilkokul * 1} Pn)`);
    if (state.c_ortaokul > 0) list.push(`Ortaokul: ${state.c_ortaokul} öğr (+${state.c_ortaokul * 2} Pn)`);
    if (state.c_lise > 0) list.push(`Lise: ${state.c_lise} öğr (+${state.c_lise * 3} Pn)`);
    if (state.c_meslekiEgitim > 0) list.push(`Mesleki Eğt: ${state.c_meslekiEgitim} öğr (+${state.c_meslekiEgitim * 3} Pn)`);
    if (state.c_acikLise > 0) list.push(`Açık Lise: ${state.c_acikLise} öğr (+${state.c_acikLise * 3} Pn)`);
    if (state.c_uni > 0) list.push(`Üniversite: ${state.c_uni} öğr (+${state.c_uni * 4} Pn)`);
    return list;
  };

  const getHousingList = (state: any) => {
    if (!state) return [];
    const list = [];
    if (state.d_evsiz) list.push("Evsiz (+10 Pn)");
    if (state.d_afetzede) list.push("Afetzede (+10 Pn)");
    if (state.d_agirHasarli) list.push("Konut ağır hasarlı (+8 Pn)");
    if (state.d_sagliksiz) list.push("Sağlıksız konut (+6 Pn)");
    if (state.d_kiraci) list.push("Kiracı (+5 Pn)");
    return list;
  };

  const getFragilityList = (state: any) => {
    if (!state) return [];
    const list = [];
    if (state.e_siddetMagduru) list.push("Şiddet mağduru (+6 Pn)");
    if (state.e_kadinReis) list.push("Kadın hane reisi (+5 Pn)");
    if (state.e_esiCezaevinde) list.push("Eşi cezaevinde (+5 Pn)");
    if (state.e_afetGelirKaybi) list.push("Afet gelir kaybı (+5 Pn)");
    if (state.e_bosanmis) list.push("Boşanmış (+3 Pn)");
    if (state.e_dul) list.push("Dul (+3 Pn)");
    const hhSize = state.householdSize || 1;
    if (hhSize >= 5) list.push(`Hane Nüfusu ${hhSize} kişi (+3 Pn)`);
    else if (hhSize >= 1) list.push(`Hane Nüfusu ${hhSize} kişi (+1 Pn)`);
    return list;
  };

  const getAppliancesText = (state: any) => {
    if (!state) return "Eşya bilgisi girilmedi";
    const items = [
      { name: 'Buzdolabı', val: state.appliance_buzdolabi },
      { name: 'Çamaşır M.', val: state.appliance_camasir },
      { name: 'Fırın', val: state.appliance_firin },
      { name: 'Bulaşık M.', val: state.appliance_bulasik },
      { name: 'TV', val: state.appliance_tv },
      { name: 'Telefon', val: state.appliance_telefon },
      { name: 'Klima/Isıtıcı', val: state.appliance_klima },
    ];
    return items.map(i => `${i.name}: ${i.val === 'yok' ? 'YOK' : (i.val === 'eski' ? 'ESKİ' : 'TAM')}`).join(" • ");
  };

  const handlePrintCurrentList = () => {
    setPrintMode('summary');
    setPrintOnlySelected(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintSelectedList = () => {
    if (selectedIds.length === 0) {
      alert('Lütfen liste çıktısını almak istediğiniz kayıtları listeden seçiniz.');
      return;
    }
    setPrintMode('summary');
    setPrintOnlySelected(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintSelectedDetailed = () => {
    if (selectedIds.length === 0) {
      alert('Lütfen tek sayfalık ayrıntılı raporunu almak istediğiniz kayıtları listeden seçiniz.');
      return;
    }
    setPrintMode('detailed');
    setPrintOnlySelected(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintSingleDetailed = (item: Assessment) => {
    setSelectedIds([item.id]);
    setPrintMode('detailed');
    setPrintOnlySelected(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintApprovedList = () => {
    setPrintMode('summary');
    setPrintOnlySelected(false);
    setFilterStatus('approved');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDecision('all');
    setSortField('date');
    setSortOrder('desc');
  };

  const selectedPendingCount = assessments.filter(a => selectedIds.includes(a.id) && a.status !== 'approved').length;
  const selectedApprovedCount = assessments.filter(a => selectedIds.includes(a.id) && a.status === 'approved').length;

  const printableRecords = printOnlySelected
    ? filteredAndSortedAssessments.filter(a => selectedIds.includes(a.id))
    : filteredAndSortedAssessments;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Print Specific Styles for Approved List / Detailed Report PDF */}
      <style>{`
        @media print {
          @page {
            size: ${printMode === 'detailed' ? 'A4 portrait' : 'A4 landscape'};
            margin: ${printMode === 'detailed' ? '6mm 8mm' : '10mm 12mm'};
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
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .page-break:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .print-table td, .print-table th {
            padding: 5px 8px !important;
            border: 1px solid #000000 !important;
          }
          .print-compact-table td, .print-compact-table th {
            padding: 3px 5px !important;
            border: 1px solid #000000 !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      {/* Screen Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 z-10 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold leading-tight">SOSYAL YARDIM DEĞERLENDİRME VE İNCELEME SİSTEMİ</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-widest uppercase">
              {user.role === 'manager' ? 'Müdür Yetkilisi Yönetim Paneli' : 'Personel Paneli'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <Link
            href="/presentation"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-sm"
            title="Proje Sunumu ve PDF Raporu"
          >
            <Presentation size={16} className="shrink-0" />
            <span>Proje Sunumu (PDF)</span>
          </Link>
          <Link
            href="/guide"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-slate-700"
            title="Puanlama ve İnceleme Kılavuzu"
          >
            <BookOpen size={16} className="text-blue-400 shrink-0" />
            <span>Kılavuz & Metodoloji</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right border-r border-slate-700 pr-3">
              <p className="text-[10px] text-slate-400">{user.role === 'manager' ? 'Müdür Yetkilisi' : 'İnceleyen Personel'}</p>
              <p className="text-xs sm:text-sm font-semibold truncate max-w-[120px]">{user.name}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors active:scale-95 touch-manipulation" title="Çıkış Yap">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Screen Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5 no-print">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Gösterge Paneli</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Hane inceleme ziyaretleri, gelişmiş arama/sıralama ve onay süreçleri.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {user.role === 'manager' && (
              <>
                {/* Batch Approve All Button */}
                <button
                  onClick={openApproveAllModal}
                  disabled={pendingCount === 0}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-blue-900/20 touch-manipulation"
                  title="Onay bekleyen tüm hane kayıtlarını toplu onayla"
                >
                  <CheckCircle2 size={18} />
                  <span>Tümünü Onayla ({pendingCount})</span>
                </button>

                {/* Batch Revoke All Button */}
                <button
                  onClick={openRevokeAllModal}
                  disabled={approvedCount === 0}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-amber-900/20 touch-manipulation"
                  title="Tüm onaylı kayıtların onayını kaldır ve düzenlemeye aç"
                >
                  <RotateCcw size={18} />
                  <span>Tüm Onayları Geri Al ({approvedCount})</span>
                </button>

                {/* Print PDF Button */}
                <button
                  onClick={handlePrintApprovedList}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-emerald-950/20 touch-manipulation"
                >
                  <Printer size={18} />
                  <span>Onaylı Liste PDF ({approvedCount})</span>
                </button>
              </>
            )}

            {user.role === 'personnel' && (
              <Link href="/assessment/new" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 font-extrabold text-sm transition-all shadow-md shadow-blue-200 touch-manipulation">
                <Plus size={18} />
                Yeni İnceleme Başlat
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-slate-100 text-slate-700 rounded-xl"><Users size={26} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Toplam İnceleme</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{total}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={26} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Müdür Tarafından Onaylanan</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">{approvedCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl"><Clock size={26} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Onay Bekleyen İnceleme</p>
              <p className="text-2xl font-black text-amber-600 leading-none">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Multi-Select Toolbar for Manager */}
        {/* Multi-Select Toolbar for Manager & Personnel */}
        {selectedIds.length > 0 && (
          <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-black">
                {selectedIds.length} Kayıt Seçildi
              </span>
              <span className="text-slate-300 text-xs font-normal hidden sm:inline">
                Seçilen kayıtların tek sayfalık ayrıntılı A4 raporunu veya özet listesini yazdırabilirsiniz.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrintSelectedDetailed}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                title="Seçilen her bir kaydın tek sayfalık resmi A4 detaylı raporunu yazdır"
              >
                <FileText size={15} />
                <span>Detaylı A4 Rapor Yazdır ({selectedIds.length})</span>
              </button>

              <button
                onClick={handlePrintSelectedList}
                className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Seçilen kayıtların özet tablosunu yazdır"
              >
                <Printer size={15} />
                <span>Özet Liste</span>
              </button>

              {user.role === 'manager' && selectedPendingCount > 0 && (
                <button
                  onClick={openApproveSelectedModal}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 size={15} />
                  <span>Seçilenleri Onayla ({selectedPendingCount})</span>
                </button>
              )}
              {user.role === 'manager' && selectedApprovedCount > 0 && (
                <button
                  onClick={openRevokeSelectedModal}
                  className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={15} />
                  <span>Onayı Kaldır ({selectedApprovedCount})</span>
                </button>
              )}
              <button
                onClick={() => setSelectedIds([])}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        )}

        {/* Filter, Search & Records Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Section Title & Primary Tabs */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Sosyal İnceleme Kayıtları
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Arama, filtreleme ve sütun bazlı sıralama ile tüm kayıtları inceleyip yönetebilirsiniz.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tümü ({total})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'pending' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Onay Bekleyenler ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Onaylananlar ({approvedCount})
              </button>
            </div>
          </div>

          {/* Search Bar & Secondary Filters */}
          <div className="p-4 border-b border-slate-200 bg-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ad soyad, TC kimlik, personel, karar..."
                className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Aramayı Temizle"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Decision Filter & Counter / Reset */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Filter size={14} className="text-slate-500 shrink-0" />
                <span>Karar Filtresi:</span>
                <select
                  value={filterDecision}
                  onChange={(e: any) => setFilterDecision(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="all">Tüm Kararlar</option>
                  <option value="accepted">Kapsam İçi (Kabul)</option>
                  <option value="rejected">Kapsam Dışı (Red)</option>
                </select>
              </div>

              {(searchQuery || filterDecision !== 'all' || filterStatus !== 'all' || sortField !== 'date' || sortOrder !== 'desc') && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold underline flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                >
                  <X size={12} /> Filtreleri Sıfırla
                </button>
              )}

              <button
                onClick={handlePrintSelectedDetailed}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Seçilen kayıtların (veya seçilen tek kaydın) 1 sayfalık resmi A4 ayrıntılı raporunu yazdır/PDF yap"
              >
                <FileText size={14} />
                <span>Seçilenlerin Detaylı Raporu (A4) {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={handlePrintSelectedList}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 animate-fadeIn"
                  title="Sadece seçilen kayıtların özet liste PDF çıktısını al"
                >
                  <CheckSquare size={14} />
                  <span>Seçilen Liste ({selectedIds.length})</span>
                </button>
              )}

              <button
                onClick={handlePrintCurrentList}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Mevcut sıralama ve filtreye göre tüm listeyi PDF / Yazıcı çıktısı al"
              >
                <Printer size={14} />
                <span>Tüm Listeyi Yazdır</span>
              </button>

              <div className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md">
                Gösterilen: <strong className="text-slate-900 font-extrabold">{filteredAndSortedAssessments.length}</strong> / {total}
              </div>

            </div>

          </div>

          {/* Selected Items Highlight Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-slate-900 text-white px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold animate-fadeIn border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} className="text-emerald-400" />
                <span>Toplam <strong className="text-emerald-300 text-sm">{selectedIds.length}</strong> adet kayıt seçildi</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrintSelectedDetailed}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1 rounded-md font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  title="Seçilen her bir kaydın tek sayfalık A4 ayrıntılı raporunu yazdır/PDF yap"
                >
                  <FileText size={14} />
                  <span>Seçilenlerin Ayrıntılı Raporunu Yazdır (A4) ({selectedIds.length})</span>
                </button>

                <button
                  onClick={handlePrintSelectedList}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1 rounded-md font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Printer size={14} />
                  <span>Özet Liste Yazdır ({selectedIds.length})</span>
                </button>

                {user.role === 'manager' && selectedPendingCount > 0 && (
                  <button
                    onClick={openApproveSelectedModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1 rounded-md font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle2 size={14} />
                    <span>Seçilen Bekleyenleri Onayla ({selectedPendingCount})</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedIds([])}
                  className="text-slate-400 hover:text-white underline px-2 py-0.5 transition-colors text-[11px]"
                >
                  Seçimi Temizle
                </button>
              </div>
            </div>
          )}

          {/* Single-Row Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider border-b border-slate-200">
                  <th className="px-3 py-3 font-black text-center w-10">
                    <input
                      type="checkbox"
                      checked={filteredAndSortedAssessments.length > 0 && selectedIds.length === filteredAndSortedAssessments.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      title="Tümünü Seç / Kaldır"
                    />
                  </th>

                  <th 
                    onClick={() => handleSort('date')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Ziyaret Tarihi</span>
                      {renderSortIcon('date')}
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('applicantTc')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>T.C. Kimlik</span>
                      {renderSortIcon('applicantTc')}
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('applicantName')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Başvuru Sahibi Adı Soyadı</span>
                      {renderSortIcon('applicantName')}
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('householdSize')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Hane Kişi</span>
                      {renderSortIcon('householdSize')}
                    </div>
                  </th>

                  {user.role === 'manager' && (
                    <th 
                      onClick={() => handleSort('personnelName')} 
                      className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        <span>İnceleyen Personel</span>
                        {renderSortIcon('personnelName')}
                      </div>
                    </th>
                  )}

                  <th 
                    onClick={() => handleSort('totalScore')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Toplam Puan</span>
                      {renderSortIcon('totalScore')}
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('status')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Onay Durumu</span>
                      {renderSortIcon('status')}
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('decision')} 
                    className="px-3 sm:px-4 py-3 font-extrabold cursor-pointer hover:bg-slate-200 transition-colors group select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Karar / Yardım Tipi</span>
                      {renderSortIcon('decision')}
                    </div>
                  </th>

                  <th className="px-3 sm:px-4 py-3 font-extrabold text-right whitespace-nowrap">
                    İşlem
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAndSortedAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={user.role === 'manager' ? 10 : 9} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50 font-medium">
                      Arama ve filtreleme kriterlerine uygun sosyal inceleme kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedAssessments.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isApproved = item.status === 'approved';

                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors ${isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50/80'}`}
                      >
                        <td className="px-3 py-3 text-center align-middle whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectId(item.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Date */}
                        <td className="px-3 sm:px-4 py-3 font-semibold text-slate-600 whitespace-nowrap align-middle">
                          {new Date(item.date).toLocaleDateString('tr-TR')}
                        </td>

                        {/* TC */}
                        <td className="px-3 sm:px-4 py-3 font-bold text-slate-700 tracking-wider whitespace-nowrap align-middle">
                          {item.applicantTc || '-'}
                        </td>

                        {/* Name - Max Width Truncate for Single Line */}
                        <td className="px-3 sm:px-4 py-3 font-extrabold text-slate-900 whitespace-nowrap align-middle max-w-[200px] truncate" title={item.applicantName}>
                          {item.applicantName}
                        </td>

                        {/* Household Size */}
                        <td className="px-3 sm:px-4 py-3 font-semibold text-slate-700 whitespace-nowrap text-center align-middle">
                          {item.householdSize} kişi
                        </td>

                        {/* Personnel Name */}
                        {user.role === 'manager' && (
                          <td className="px-3 sm:px-4 py-3 font-medium text-slate-700 whitespace-nowrap align-middle max-w-[150px] truncate" title={item.personnelName}>
                            {item.personnelName}
                          </td>
                        )}

                        {/* Total Score */}
                        <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap align-middle">
                          <span className={`inline-block px-2 py-0.5 rounded font-black text-xs ${item.result.isRejected ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-900'}`}>
                            {item.result.totalScore} Puan
                          </span>
                        </td>

                        {/* Approval Status */}
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap align-middle">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 size={12} /> ONAYLANDI
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock size={12} /> ONAY BEKLİYOR
                            </span>
                          )}
                        </td>

                        {/* Decision */}
                        <td className="px-3 sm:px-4 py-3 font-bold whitespace-nowrap align-middle max-w-[220px] truncate" title={item.result.isRejected ? 'REDDEDİLDİ' : item.result.assistance?.text}>
                          {item.result.isRejected ? (
                            <span className="text-red-600 uppercase">REDDEDİLDİ</span>
                          ) : (
                            <span className="text-emerald-700 uppercase">
                              {item.result.assistance?.text}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 sm:px-4 py-3 text-right whitespace-nowrap align-middle space-x-1.5">
                          {/* Manager Quick Actions */}
                          {user.role === 'manager' && (
                            <>
                              {!isApproved ? (
                                <button
                                  onClick={() => handleSingleApprove(item)}
                                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors shadow-sm active:scale-95"
                                  title="Bu Kaydı Hızlı Onayla"
                                >
                                  <Check size={14} /> Onayla
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSingleRevoke(item)}
                                  className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors shadow-sm active:scale-95"
                                  title="Müdür Onayını Kaldır ve Düzenlemeye Aç"
                                >
                                  <RotateCcw size={14} /> Onayı Kaldır
                                </button>
                              )}
                            </>
                          )}

                          {/* Personnel Edit / Locked status indicator */}
                          {user.role === 'personnel' && (
                            <>
                              {!isApproved ? (
                                <Link
                                  href={`/assessment/${item.id}/edit`}
                                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                  <Edit3 size={13} /> Düzenle
                                </Link>
                              ) : (
                                <span 
                                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded-md cursor-not-allowed"
                                  title="Onaylı veriler düzenlenemez. İzin için müdürün onayı kaldırması gerekmektedir."
                                >
                                  <Lock size={12} /> Onaylı (Kilitli)
                                </span>
                              )}
                            </>
                          )}

                          {/* Single Detailed Report Print Button */}
                          <button
                            onClick={() => handlePrintSingleDetailed(item)}
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors shadow-sm active:scale-95"
                            title="Bu kaydın tek sayfalık ayrıntılı A4 resmi raporunu yazdır/PDF yap"
                          >
                            <Printer size={13} /> Rapor (A4)
                          </button>

                          {/* View Detail Link */}
                          <Link 
                            href={`/assessment/${item.id}`} 
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            <FileText size={14} /> Detaylar
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* BATCH APPROVAL / REVOCATION ANIMATED PERCENTAGE PROGRESS MODAL OVERLAY   */}
      {/* ========================================================================= */}
      {batchModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 overflow-hidden relative">
            
            {/* STEP 1: CONFIRMATION DIALOG */}
            {batchModal.step === 'confirm' && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  {batchModal.type.startsWith('approve') ? (
                    <ShieldCheck size={32} className="text-blue-600" />
                  ) : (
                    <RotateCcw size={32} className="text-amber-600" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">{batchModal.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    {batchModal.description}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>İşlenecek Kayıt Sayısı:</span>
                  <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md font-black text-sm">
                    {batchModal.totalCount} Adet Kayıt
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    onClick={() => setBatchModal(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={executeBatchAction}
                    className={`flex-1 text-white py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 ${
                      batchModal.type.startsWith('approve')
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                        : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
                    }`}
                  >
                    Evet, İşlemi Başlat
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ANIMATED PERCENTAGE PROGRESS */}
            {batchModal.step === 'processing' && (
              <div className="space-y-5 text-center py-2">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <RefreshCw size={40} className="animate-spin text-blue-600" />
                  <span className="absolute text-xs font-black text-blue-900">
                    %{batchModal.progress}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">Toplu İşlem Gerçekleştiriliyor...</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Kayıtlar sırayla güncelleniyor. Lütfen tarayıcı penceresini kapatmayınız.
                  </p>
                </div>

                {/* Percentage Display & Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600">İlerleme Durumu</span>
                    <span className="text-blue-700 font-black text-sm">%{batchModal.progress}</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 border border-slate-200 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3 rounded-full transition-all duration-200 ease-out shadow-sm"
                      style={{ width: `${batchModal.progress}%` }}
                    />
                  </div>

                  <div className="text-[11px] font-semibold text-slate-500 text-right">
                    {batchModal.processedCount} / {batchModal.totalCount} Kayıt İşlendi
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DONE */}
            {batchModal.step === 'done' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={38} />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">İşlem Tamamlandı!</h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Toplam <strong className="text-slate-900">{batchModal.totalCount} adet</strong> sosyal inceleme kaydı için toplu güncelleme başarıyla gerçekleştirildi.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setBatchModal(prev => ({ ...prev, isOpen: false }));
                    setSelectedIds([]);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
                >
                  Tamam, Listeye Dön
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT-ONLY SECTIONS (SUMMARY LIST OR DETAILED SINGLE A4 REPORTS)          */}
      {/* ========================================================================= */}
      <div className="print-only w-full bg-white text-black p-0 m-0 leading-tight">
        {printMode === 'summary' ? (
          /* SUMMARY TABLE PRINT LAYOUT */
          <div>
            {/* Official Document Header */}
            <div className="text-center border-b-2 border-black pb-2 mb-3">
              <p className="text-xs font-bold uppercase tracking-widest">T.C.</p>
              <p className="text-sm font-black uppercase tracking-wider">SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</p>
              <p className="text-xs font-extrabold tracking-widest uppercase mt-0.5">
                {printOnlySelected
                  ? `SEÇİLEN SOSYAL İNCELEME KAYITLARI LİSTESİ (${printableRecords.length} KAYIT)`
                  : filterStatus === 'approved' 
                  ? 'MÜDÜR TARAFINDAN ONAYLANAN SOSYAL İNCELEME KAYITLARI LİSTESİ' 
                  : filterStatus === 'pending'
                  ? 'ONAY BEKLEYEN SOSYAL İNCELEME KAYITLARI LİSTESİ'
                  : 'SOSYAL İNCELEME KAYITLARI DİNAMİK LİSTESİ'}
              </p>
              <p className="text-[9px] text-slate-700 mt-1 flex items-center justify-center gap-3">
                <span>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</span>
                <span>•</span>
                <span>Toplam Kayıt: <strong>{printableRecords.length}</strong></span>
                <span>•</span>
                <span>
                  Sıralama Kriteri: <strong>
                    {sortField === 'date' ? 'Ziyaret Tarihi' :
                     sortField === 'applicantTc' ? 'T.C. Kimlik No' :
                     sortField === 'applicantName' ? 'Başvuru Sahibi Adı' :
                     sortField === 'householdSize' ? 'Hane Kişi Sayısı' :
                     sortField === 'personnelName' ? 'İnceleyen Personel' :
                     sortField === 'totalScore' ? 'Toplam Puan' :
                     sortField === 'status' ? 'Onay Durumu' : 'Karar / Yardım Tipi'} 
                    ({sortOrder === 'asc' ? 'Artan' : 'Azalan'})
                  </strong>
                </span>
                {printOnlySelected ? (
                  <>
                    <span>•</span>
                    <span>Filtre: <strong>Özel Seçilmiş Kayıtlar ({printableRecords.length})</strong></span>
                  </>
                ) : searchQuery ? (
                  <>
                    <span>•</span>
                    <span>Arama: <strong>"{searchQuery}"</strong></span>
                  </>
                ) : null}
              </p>
            </div>

            {/* Table - Strictly Single Row per record matching active screen order */}
            <table className="w-full border-collapse border border-black text-[9px] mb-6 print-table">
              <thead>
                <tr className="bg-slate-200 text-black font-extrabold uppercase border-b border-black">
                  <th className="p-1 text-center w-8">NO</th>
                  <th className="p-1 text-center w-24">T.C. KİMLİK NO</th>
                  <th className="p-1 text-left">BAŞVURU SAHİBİ ADI SOYADI</th>
                  <th className="p-1 text-center w-14">HANE KİŞİ</th>
                  <th className="p-1 text-left w-36">İNCELENEN ADRES / MAH.</th>
                  <th className="p-1 text-left w-32">İNCELEYEN PERSONEL</th>
                  <th className="p-1 text-center w-20">ZİYARET TARİHİ</th>
                  <th className="p-1 text-center w-16">PUAN</th>
                  <th className="p-1 text-center w-24">ONAY DURUMU</th>
                  <th className="p-1 text-left w-36">KARAR / YARDIM TİPİ</th>
                </tr>
              </thead>
              <tbody>
                {printableRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-4 text-center font-bold text-slate-500">
                      {printOnlySelected ? 'Seçilen herhangi bir sosyal inceleme kaydı bulunmamaktadır.' : 'Arama ve filtreleme kriterlerine uygun kayıt bulunmamaktadır.'}
                    </td>
                  </tr>
                ) : (
                  printableRecords.map((item, idx) => (
                    <tr key={item.id} className="border-b border-black">
                      <td className="p-1 text-center font-bold">{idx + 1}</td>
                      <td className="p-1 text-center font-bold">{item.applicantTc || '-'}</td>
                      <td className="p-1 font-black uppercase">{item.applicantName}</td>
                      <td className="p-1 text-center font-bold">{item.householdSize} kişi</td>
                      <td className="p-1 truncate max-w-[140px]">{item.applicantAddress || '-'}</td>
                      <td className="p-1 font-medium">{item.personnelName}</td>
                      <td className="p-1 text-center">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                      <td className="p-1 text-center font-black">{item.result.totalScore} Puan</td>
                      <td className="p-1 text-center font-bold uppercase">{item.status === 'approved' ? 'ONAYLANDI' : 'ONAY BEKLEYEN'}</td>
                      <td className="p-1 font-bold uppercase">{item.result.isRejected ? 'REDDEDİLDİ' : item.result.assistance?.text}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Signature Block at Bottom */}
            <div className="border border-black p-3 mt-8">
              <p className="text-[9px] italic text-slate-700 mb-4">
                * İşbu liste Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu kapsamında oluşturulan resmi özet inceleme belgesidir.
              </p>

              <div className="flex justify-between items-start text-[10px] px-8 pt-2">
                <div className="text-center w-5/12">
                  <p className="font-bold uppercase tracking-wider">SOSYAL YARDIM VE İNCELEME GÖREVLİSİ</p>
                  <p className="font-semibold mt-2">Adı Soyadı: <span className="inline-block border-b border-black w-36 text-left">&nbsp;</span></p>
                  <p className="text-[9px] text-slate-600 mt-1">Unvan: Sosyal Yardım ve İnceleme Görevlisi</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
                  <div className="mt-8 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[9px] font-bold">
                    İmza / Mühür
                  </div>
                </div>

                <div className="text-center w-5/12">
                  <p className="font-bold uppercase tracking-wider">VAKIF MÜDÜRÜ</p>
                  <p className="font-semibold mt-2">Adı Soyadı: <span className="inline-block border-b border-black w-36 text-left">&nbsp;</span></p>
                  <p className="text-[9px] text-slate-600 mt-1">Unvan: SYDV Vakıf Müdürü</p>
                  <div className="mt-8 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[9px] font-bold">
                    İmza / Mühür
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* DETAILED 1-PAGE PER RECORD PRINT LAYOUT */
          <div>
            {printableRecords.length === 0 ? (
              <div className="p-8 text-center font-bold text-slate-500">
                Detaylı raporu yazdırılacak seçili kayıt bulunmamaktadır.
              </div>
            ) : (
              printableRecords.map((item) => {
                const state = item.data || {};
                const calc = item.result || {};
                const disadvantages = getDisadvantagesList(state);
                const education = getEducationList(state);
                const housing = getHousingList(state);
                const fragility = getFragilityList(state);
                const appliances = getAppliancesText(state);

                return (
                  <div key={item.id} className="page-break w-full bg-white text-black p-0 m-0 leading-tight pb-4">
                    {/* Official Letterhead */}
                    <div className="text-center border-b-2 border-black pb-1.5 mb-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest">T.C.</p>
                      <p className="text-xs font-black uppercase tracking-wider">SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</p>
                      <p className="text-[10px] font-extrabold tracking-widest uppercase mt-0.5">RESMİ SOSYAL İNCELEME VE DEĞERLENDİRME RAPORU</p>
                    </div>

                    {/* Top Info Table */}
                    <table className="w-full border-collapse border border-black text-[9px] mb-2 print-compact-table">
                      <tbody>
                        <tr className="border-b border-black bg-slate-100">
                          <td className="border-r border-black font-bold p-1 w-1/4">T.C. KİMLİK NO:</td>
                          <td className="border-r border-black p-1 w-1/4 font-bold">{item.applicantTc || '-'}</td>
                          <td className="border-r border-black font-bold p-1 w-1/4">BAŞVURU SAHİBİ:</td>
                          <td className="p-1 w-1/4 font-black uppercase">{item.applicantName}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="border-r border-black font-bold p-1">TELEFON:</td>
                          <td className="border-r border-black p-1">{item.phoneNumber || '-'}</td>
                          <td className="border-r border-black font-bold p-1">HANE KİŞİ SAYISI:</td>
                          <td className="p-1 font-bold">{item.householdSize} kişi</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="border-r border-black font-bold p-1">HANE REF NO:</td>
                          <td className="border-r border-black p-1">{item.householdNo || '-'}</td>
                          <td className="border-r border-black font-bold p-1">ZİYARET TARİHİ:</td>
                          <td className="p-1 font-bold">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                        </tr>
                        <tr>
                          <td className="border-r border-black font-bold p-1">İKAMET ADRESİ:</td>
                          <td colSpan={3} className="p-1">{item.applicantAddress || '-'}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Evaluation Criteria Matrix */}
                    <div className="mb-2">
                      <div className="bg-slate-200 border border-black font-bold p-1 text-[8.5px] text-center uppercase tracking-wide mb-1">
                        SOSYAL İNCELEME SEÇENEKLERİ VE PUANLAMA KRİTERLERİ DETAYI
                      </div>

                      <table className="w-full border-collapse border border-black text-[8px] print-compact-table">
                        <thead>
                          <tr className="bg-slate-100 border-b border-black">
                            <th className="border-r border-black p-1 text-left w-1/5">KATEGORİ</th>
                            <th className="border-r border-black p-1 text-left">İŞARETLENEN / TESPİT EDİLEN SEÇENEKLER</th>
                            <th className="p-1 text-center w-14">PUAN</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-bold">A. Ekonomik Durum</td>
                            <td className="border-r border-black p-1">
                              {getIncomeText(state.income)}
                              {state.noWorker && " • Hanede çalışan yok"}
                              {state.noRegularIncome && " • Düzenli gelir yok"}
                              {state.noSgk && " • SGK kaydı yok"}
                              {state.a_son3AyYardimKisi > 0 && ` • Son 3 ayda yardım alan: ${state.a_son3AyYardimKisi} kişi (-${state.a_son3AyYardimKisi * 5})`}
                            </td>
                            <td className="p-1 text-center font-bold">{calc.scoreA} / 40</td>
                          </tr>

                          <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-bold">B. Dezavantajlılık</td>
                            <td className="border-r border-black p-1">
                              {disadvantages.length > 0 ? disadvantages.join(" • ") : "Mevcut Değil"}
                            </td>
                            <td className="p-1 text-center font-bold">{calc.scoreB} / 30</td>
                          </tr>

                          <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-bold">C. Çocuk ve Eğitim</td>
                            <td className="border-r border-black p-1">
                              {education.length > 0 ? education.join(" • ") : "Eğitim gören çocuk kaydı yok"}
                            </td>
                            <td className="p-1 text-center font-bold">{calc.scoreC} / 10</td>
                          </tr>

                          <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-bold">D. Barınma Durumu</td>
                            <td className="border-r border-black p-1">
                              {housing.length > 0 ? housing.join(" • ") : "Standart konut"}
                            </td>
                            <td className="p-1 text-center font-bold">{calc.scoreD} / 10</td>
                          </tr>

                          <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-bold">E. Ev Eşyaları</td>
                            <td className="border-r border-black p-1">
                              {appliances}
                            </td>
                            <td className="p-1 text-center font-bold">{calc.scoreE} / 10</td>
                          </tr>

                          <tr className="border-b border-black">
                            <td className="border-r border-black p-1 font-bold">F. Kırılganlık</td>
                            <td className="border-r border-black p-1">
                              {fragility.length > 0 ? fragility.join(" • ") : "Özel kırılganlık maddesi yok"}
                            </td>
                            <td className="p-1 text-center font-bold">{calc.scoreF} / 10</td>
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
                    <table className="w-full border-collapse border border-black text-[8.5px] mb-2 print-compact-table">
                      <tbody>
                        <tr className="border-b border-black bg-slate-100">
                          <td className="border-r border-black font-bold p-1 w-1/3">ZORUNLU KONTROLLER (SGK/TAPU/ARAÇ):</td>
                          <td className="border-r border-black p-1 font-bold text-emerald-800">YAPILDI (EKSİKSİZ)</td>
                          <td className="border-r border-black font-bold p-1 w-1/4">GERÇEĞE AYKIRI BEYAN:</td>
                          <td className="p-1 font-bold">{state.falseStatement ? 'TESPİT EDİLDİ (RED)' : 'YOK'}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="border-r border-black font-bold p-1">HESAPLANAN TOPLAM PUAN:</td>
                          <td className="border-r border-black p-1 text-xs font-black">{calc.totalScore} / 130</td>
                          <td className="border-r border-black font-bold p-1">TAVSİYE EDİLEN KARAR:</td>
                          <td className="p-1 font-extrabold text-[10px] uppercase">{calc.isRejected ? 'REDDEDİLDİ' : calc.assistance?.text}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Official Note */}
                    <p className="text-[7.5px] italic text-slate-700 mb-3">
                      * Bu rapor, 3294 Sayılı Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu kapsamında SYDV Sosyal İnceleme Görevlisi ({item.personnelName}) tarafından yerinde yapılan ev ziyareti neticesinde düzenlenmiş resmi inceleme belgesidir.
                    </p>

                    {/* OFFICIAL SIGNATURE BLOCK */}
                    <div className="border border-black p-2 rounded-none mt-2">
                      <div className="flex justify-between items-start text-[8.5px] pt-1 px-4">
                        
                        {/* Personnel Signature */}
                        <div className="text-center w-5/12">
                          <p className="font-bold uppercase tracking-wider">SOSYAL YARDIM VE İNCELEME GÖREVLİSİ</p>
                          <p className="font-semibold text-slate-800 mt-1">Adı Soyadı: <span className="font-bold uppercase">{item.personnelName}</span></p>
                          <p className="text-[7.5px] text-slate-600">Unvan: Sosyal Yardım ve İnceleme Görevlisi</p>
                          <p className="text-[7.5px] text-slate-600 mt-0.5">Tarih: {new Date(item.date).toLocaleDateString('tr-TR')}</p>
                          <div className="mt-5 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[8px] font-bold">
                            İmza / Mühür
                          </div>
                        </div>

                        {/* Manager Signature */}
                        <div className="text-center w-5/12">
                          <p className="font-bold uppercase tracking-wider">VAKIF MÜDÜRÜ</p>
                          <p className="font-semibold text-slate-800 mt-1">Adı Soyadı: <span className="font-bold uppercase">{item.managerName || 'VAKIF MÜDÜRÜ'}</span></p>
                          <p className="text-[7.5px] text-slate-600">Unvan: SYDV Vakıf Müdürü</p>
                          <p className="text-[7.5px] text-slate-600 mt-0.5">Onay Durumu: {item.status === 'approved' ? 'ONAYLANDI' : 'ONAY BEKLİYOR'}</p>
                          <div className="mt-5 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[8px] font-bold">
                            İmza / Mühür
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAssessments, getAssessmentsByPersonnel, Assessment, saveAssessment } from '@/lib/db';
import { 
  FileText, Plus, LogOut, Users, CheckCircle2, XCircle, ShieldCheck, 
  Printer, Clock, Filter, Check, BookOpen, Presentation, RotateCcw, 
  Lock, Unlock, AlertTriangle, CheckSquare, Square, RefreshCw, Edit3, Sparkles 
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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const filteredAssessments = assessments.filter(item => {
    if (filterStatus === 'pending') return item.status !== 'approved';
    if (filterStatus === 'approved') return item.status === 'approved';
    return true;
  });

  // Multi-selection helper functions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAssessments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssessments.map(a => a.id));
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
      await new Promise(res => setTimeout(res, 120));

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

  const handlePrintApprovedList = () => {
    setFilterStatus('approved');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const selectedPendingCount = assessments.filter(a => selectedIds.includes(a.id) && a.status !== 'approved').length;
  const selectedApprovedCount = assessments.filter(a => selectedIds.includes(a.id) && a.status === 'approved').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Print Specific Styles for Approved List PDF */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm 12mm;
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
          .print-table td, .print-table th {
            padding: 5px 8px !important;
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
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Hane inceleme ziyaretleri, onay süreçleri ve toplu yönetim araçları.</p>
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
        {user.role === 'manager' && selectedIds.length > 0 && (
          <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-black">
                {selectedIds.length} Kayıt Seçildi
              </span>
              <span className="text-slate-300 text-xs font-normal hidden sm:inline">
                Toplu onay veya onay geri alma işlemlerini uygulayabilirsiniz.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {selectedPendingCount > 0 && (
                <button
                  onClick={openApproveSelectedModal}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 size={15} />
                  <span>Seçilenleri Onayla ({selectedPendingCount})</span>
                </button>
              )}
              {selectedApprovedCount > 0 && (
                <button
                  onClick={openRevokeSelectedModal}
                  className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={15} />
                  <span>Seçilenlerin Onayını Kaldır ({selectedApprovedCount})</span>
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

        {/* Filter Tabs & List Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Sosyal İnceleme Kayıtları
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tüm inceleme detaylarını tek satırda görüntüleyebilir, detayına girebilir veya onay süreçlerini yönetebilirsiniz.</p>
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider border-b border-slate-200">
                  {user.role === 'manager' && (
                    <th className="px-3 py-3.5 font-extrabold text-center w-10">
                      <input
                        type="checkbox"
                        checked={filteredAssessments.length > 0 && selectedIds.length === filteredAssessments.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        title="Tümünü Seç / Kaldır"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">Tarih</th>
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">T.C. Kimlik</th>
                  <th className="px-4 py-3.5 font-extrabold">Başvuru Sahibi Adı Soyadı</th>
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">Hane Kişi</th>
                  {user.role === 'manager' && <th className="px-4 py-3.5 font-extrabold">İnceleyen Personel</th>}
                  <th className="px-4 py-3.5 font-extrabold text-center whitespace-nowrap">Toplam Puan</th>
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">Onay Durumu</th>
                  <th className="px-4 py-3.5 font-extrabold">Karar / Yardım Tipi</th>
                  <th className="px-4 py-3.5 font-extrabold text-right whitespace-nowrap">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={user.role === 'manager' ? 10 : 8} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50 font-medium">
                      Seçilen filtreye uygun sosyal inceleme kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isApproved = item.status === 'approved';

                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors ${isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'}`}
                      >
                        {user.role === 'manager' && (
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectId(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        )}
                        <td className="px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700 tracking-wider whitespace-nowrap">
                          {item.applicantTc || '-'}
                        </td>
                        <td className="px-4 py-3 font-extrabold text-slate-900 whitespace-nowrap">
                          {item.applicantName}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap text-center">
                          {item.householdSize} kişi
                        </td>
                        {user.role === 'manager' && (
                          <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                            {item.personnelName}
                          </td>
                        )}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded font-black text-xs ${item.result.isRejected ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-900'}`}>
                            {item.result.totalScore} Puan
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
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
                        <td className="px-4 py-3 font-bold whitespace-nowrap">
                          {item.result.isRejected ? (
                            <span className="text-red-600 uppercase">REDDEDİLDİ</span>
                          ) : (
                            <span className="text-emerald-700 uppercase">
                              {item.result.assistance.text}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
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
      {/* PRINT-ONLY APPROVED RECORDS SUMMARY LIST (LANDSCAPE OFFICIAL PDF OUTPUT)   */}
      {/* ========================================================================= */}
      <div className="print-only w-full bg-white text-black p-0 m-0 leading-tight">
        
        {/* Official Document Header */}
        <div className="text-center border-b-2 border-black pb-2 mb-3">
          <p className="text-xs font-bold uppercase tracking-widest">T.C.</p>
          <p className="text-sm font-black uppercase tracking-wider">SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</p>
          <p className="text-xs font-extrabold tracking-widest uppercase mt-0.5">MÜDÜR TARAFINDAN ONAYLANAN SOSYAL İNCELEME KAYITLARI TOPLU LİSTESİ</p>
          <p className="text-[9px] text-slate-600 mt-1">Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')} • Toplam Onaylı Kayıt: {approvedList.length}</p>
        </div>

        {/* Table - Strictly Single Row per record */}
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
              <th className="p-1 text-left w-36">ONAYLANAN DEĞERLENDİRME KARARI</th>
            </tr>
          </thead>
          <tbody>
            {approvedList.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center font-bold text-slate-500">
                  Onaylanmış sosyal inceleme kaydı bulunmamaktadır.
                </td>
              </tr>
            ) : (
              approvedList.map((item, idx) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="p-1 text-center font-bold">{idx + 1}</td>
                  <td className="p-1 text-center font-bold">{item.applicantTc}</td>
                  <td className="p-1 font-black uppercase">{item.applicantName}</td>
                  <td className="p-1 text-center font-bold">{item.householdSize} kişi</td>
                  <td className="p-1 truncate max-w-[150px]">{item.applicantAddress || '-'}</td>
                  <td className="p-1 font-medium">{item.personnelName}</td>
                  <td className="p-1 text-center">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                  <td className="p-1 text-center font-black">{item.result.totalScore} / 130</td>
                  <td className="p-1 font-bold uppercase">{item.result.isRejected ? 'REDDEDİLDİ' : item.result.assistance.text}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Signature Block at Bottom */}
        <div className="border border-black p-3 mt-8">
          <p className="text-[9px] italic text-slate-700 mb-4">
            * İşbu liste Sosyal Yardımlaşma ve Dayanışma Vakfı Yönetim Paneli üzerinden müdür yetkilisi tarafından onaylanan resmi hane inceleme sonuçlarını içermekte olup onaylı belgedir.
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

    </div>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";


import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllAssessments, getAssessmentsByPersonnel, Assessment, 
  saveAssessment, deleteAssessment, Meeting, getAllMeetings, 
  saveMeeting, deleteMeeting, isMeetingLocked 
} from '@/lib/db';
import { 
  FileText, Plus, LogOut, Users, CheckCircle2, ShieldCheck, 
  Printer, Clock, BookOpen, Presentation, RotateCcw, 
  Lock, Unlock, RefreshCw, Edit3, Search, ArrowUpDown, ArrowUp, ArrowDown, 
  X, Filter, Check, CheckSquare, ListOrdered, Trash2, FileSpreadsheet, Download, Calendar, ArrowLeft, ArrowRight, Settings,
  Building2, Phone, MapPin, Hash, ChevronDown, ChevronUp, AlertCircle, UserCheck, Smartphone, Wallet, Banknote, Pencil, BarChart3, Home, Menu
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { LogoImage } from '@/components/logo-image';
import { ManagerStatsView } from '@/components/manager-stats-view';

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

type SortField = 'customOrder' | 'date' | 'applicantTc' | 'applicantName' | 'householdSize' | 'personnelName' | 'totalScore' | 'status' | 'decision';
type SortOrder = 'asc' | 'desc';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);




  // New & Edit Meeting Modal State
  const [newAssessmentModalOpen, setNewAssessmentModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [newMeetingModalOpen, setNewMeetingModalOpen] = useState(false);
  const [newMeetingData, setNewMeetingData] = useState({ meetingNo: '', date: '', description: '', budgetTL: '' });

  const [editMeetingModalOpen, setEditMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [editMeetingData, setEditMeetingData] = useState({ meetingNo: '', date: '', description: '', budgetTL: '' });

  // Search & Filter States
  const [householdSearchQuery, setHouseholdSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [filterDecision, setFilterDecision] = useState<'all' | 'accepted' | 'rejected'>('all');
  const [filterMeetingId, setFilterMeetingId] = useState<string | null>(null);

  
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
        const loadedMeetings = await getAllMeetings();
        setMeetings(loadedMeetings);
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

  // Household search logic
  const householdSearchResults = useMemo(() => {
    if (!householdSearchQuery.trim()) return [];
    const q = householdSearchQuery.toLowerCase().trim();
    
    const map = new Map<string, {
      key: string;
      applicantName: string;
      applicantTc: string;
      householdNo: string;
      phoneNumber: string;
      applicantAddress: string;
      assessments: Assessment[];
    }>();

    assessments.forEach(item => {
      const tcMatch = (item.applicantTc || '').toLowerCase().includes(q);
      const nameMatch = (item.applicantName || '').toLowerCase().includes(q);
      const noMatch = (item.householdNo || '').toLowerCase().includes(q);

      if (tcMatch || nameMatch || noMatch) {
        const key = (item.applicantTc && item.applicantTc.length === 11) 
          ? item.applicantTc 
          : (item.householdNo || item.applicantName);

        if (!map.has(key)) {
          map.set(key, {
            key,
            applicantName: item.applicantName,
            applicantTc: item.applicantTc || '-',
            householdNo: item.householdNo || '-',
            phoneNumber: item.phoneNumber || '-',
            applicantAddress: item.applicantAddress || '-',
            assessments: [],
          });
        }
        map.get(key)!.assessments.push(item);
      }
    });

    return Array.from(map.values());
  }, [householdSearchQuery, assessments]);

  // Toplantı Bazlı Bütçe ve İstatistik Hesaplamaları
  const meetingStatsMap = useMemo(() => {
    const map = new Map<string, {
      totalCount: number;
      pendingCount: number;
      approvedCount: number;
      plannedAidTL: number;
      approvedAidTL: number;
      rejectedCount: number;
    }>();

    meetings.forEach(m => {
      const mAssessments = assessments.filter(a => a.meetingId === m.id);
      let plannedAidTL = 0;
      let approvedAidTL = 0;
      let pendingCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;

      mAssessments.forEach(a => {
        const aidAmount = a.result?.assistance?.amount || 0;
        if (a.result?.isRejected) {
          rejectedCount++;
        } else {
          plannedAidTL += aidAmount;
          if (a.status === 'approved') {
            approvedCount++;
            approvedAidTL += aidAmount;
          } else {
            pendingCount++;
          }
        }
      });

      map.set(m.id, {
        totalCount: mAssessments.length,
        pendingCount,
        approvedCount,
        plannedAidTL,
        approvedAidTL,
        rejectedCount,
      });
    });

    return map;
  }, [meetings, assessments]);

  // Genel Bütçe ve Yardım Özeti (Müdür Paneli için)
  const globalBudgetStats = useMemo(() => {
    let totalBudgetTL = 0;
    let totalPlannedAidTL = 0;
    let totalApprovedAidTL = 0;

    meetings.forEach(m => {
      totalBudgetTL += (m.budgetTL || 0);
    });

    assessments.forEach(a => {
      if (!a.result?.isRejected) {
        const aidAmount = a.result?.assistance?.amount || 0;
        totalPlannedAidTL += aidAmount;
        if (a.status === 'approved') {
          totalApprovedAidTL += aidAmount;
        }
      }
    });

    const isGlobalExceeded = totalBudgetTL > 0 && totalPlannedAidTL > totalBudgetTL;
    const globalExcessTL = isGlobalExceeded ? totalPlannedAidTL - totalBudgetTL : 0;

    return {
      totalBudgetTL,
      totalPlannedAidTL,
      totalApprovedAidTL,
      remainingBudgetTL: totalBudgetTL - totalPlannedAidTL,
      isGlobalExceeded,
      globalExcessTL,
    };
  }, [meetings, assessments]);

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

  const handleToggleMeetingStatus = async (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    today.setHours(0,0,0,0);
    const mDate = new Date(meeting.date);
    mDate.setHours(0,0,0,0);

    const isCurrentlyLocked = meeting.isClosed || (mDate < today && !meeting.forceOpen);

    const actionText = isCurrentlyLocked ? 'DÜZENLEMEYE AÇMAK' : 'SONLANDIRMAK';
    const confirmMsg = isCurrentlyLocked
      ? `"${meeting.meetingNo}" numaralı toplantıyı DÜZENLEMEYE AÇMAK istediğinizden emin misiniz?\n\nToplantı düzenlemeye açıldığında personel yeni kayıt ekleyebilir ve düzenleme yapabilir.`
      : `"${meeting.meetingNo}" numaralı toplantıyı SONLANDIRMAK istediğinizden emin misiniz?\n\nToplantı sonlandırıldığında personel bu toplantıya ait kayıtları değiştiremez.`;

    if (!confirm(confirmMsg)) return;

    try {
      const updatedMeeting: Meeting = {
        ...meeting,
        isClosed: isCurrentlyLocked ? false : true,
        forceOpen: isCurrentlyLocked ? true : false,
      };
      await saveMeeting(updatedMeeting);
      setMeetings(prev => prev.map(m => m.id === meeting.id ? updatedMeeting : m));
    } catch (err) {
      alert('Toplantı kilit durumu güncellenirken bir hata oluştu.');
    }
  };

  const handleOpenEditMeeting = (m: Meeting, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingMeeting(m);
    setEditMeetingData({
      meetingNo: m.meetingNo || '',
      date: m.date || '',
      description: m.description || '',
      budgetTL: m.budgetTL !== undefined && m.budgetTL !== null ? m.budgetTL.toString() : '',
    });
    setEditMeetingModalOpen(true);
  };

  const handleSaveEditMeeting = async () => {
    if (!editingMeeting) return;
    if (!editMeetingData.meetingNo || !editMeetingData.date) {
      alert('Lütfen toplantı dosya numarası ve tarihini giriniz.');
      return;
    }

    const updated: Meeting = {
      ...editingMeeting,
      meetingNo: editMeetingData.meetingNo,
      date: editMeetingData.date,
      description: editMeetingData.description,
      budgetTL: editMeetingData.budgetTL ? Number(editMeetingData.budgetTL) : 0,
    };

    try {
      await saveMeeting(updated);
      const allM = await getAllMeetings();
      setMeetings(allM);
      setEditMeetingModalOpen(false);
      setEditingMeeting(null);
    } catch (err) {
      alert('Toplantı güncellenirken hata oluştu.');
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

      // Meeting Filter
      if (filterMeetingId && filterMeetingId !== 'all' && item.meetingId !== filterMeetingId) return false;

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
        case 'customOrder':
          aVal = a.customOrder !== undefined && a.customOrder !== null ? a.customOrder : 999999;
          bVal = b.customOrder !== undefined && b.customOrder !== null ? b.customOrder : 999999;
          break;
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

  // Custom Order Handler Functions
  const handleUpdateCustomOrder = async (item: Assessment, newOrder: number | undefined) => {
    try {
      const updated: Assessment = {
        ...item,
        customOrder: newOrder,
      };
      await saveAssessment(updated);
      setAssessments(prev => prev.map(a => a.id === item.id ? updated : a));
    } catch (err) {
      console.error('Sıra numarası güncellenirken hata oluştu:', err);
    }
  };

  const handleAutoAssignCustomOrders = async () => {
    if (filteredAndSortedAssessments.length === 0) return;
    if (!confirm(`Ekranda listelenen ${filteredAndSortedAssessments.length} adet kayda 1'den başlayarak sırasıyla (1, 2, 3...) özel sıra numarası atansın mı?`)) return;

    try {
      const updatedMap = new Map<string, Assessment>();
      for (let i = 0; i < filteredAndSortedAssessments.length; i++) {
        const item = filteredAndSortedAssessments[i];
        const updatedItem: Assessment = {
          ...item,
          customOrder: i + 1,
        };
        await saveAssessment(updatedItem);
        updatedMap.set(item.id, updatedItem);
      }
      setAssessments(prev => prev.map(a => updatedMap.get(a.id) || a));
      setSortField('customOrder');
      setSortOrder('asc');
    } catch (err) {
      alert('Sıra numaraları atanırken hata oluştu.');
    }
  };

  const handleClearAllCustomOrders = async () => {
    if (!confirm('Tüm kayıtların özel sıra numaraları temizlenecektir. Emin misiniz?')) return;
    try {
      const updatedList = assessments.map(a => ({ ...a, customOrder: undefined }));
      for (const item of updatedList) {
        await saveAssessment(item);
      }
      setAssessments(updatedList);
    } catch (err) {
      alert('Sıra numaraları temizlenirken hata oluştu.');
    }
  };

  const handleDeleteSingle = async (item: Assessment) => {
    if (item.status === 'approved') {
      alert('Onaylanmış sosyal inceleme kayıtları silinemez.');
      return;
    }

    if (!confirm(`"${item.applicantName}" isimli başvuru sahibine ait sosyal inceleme kaydını SILMEK istediğinizden emin misiniz?\n\nBu işlem kalıcıdır ve geri alınamaz!`)) {
      return;
    }

    try {
      await deleteAssessment(item.id);
      setAssessments(prev => prev.filter(a => a.id !== item.id));
      setSelectedIds(prev => prev.filter(id => id !== item.id));
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Kayıt silinirken bir hata oluştu.');
    }
  };

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
    const meeting = meetings.find(m => m.id === item.meetingId);
    if (meeting && meeting.budgetTL && meeting.budgetTL > 0) {
      const stats = meetingStatsMap.get(meeting.id);
      const currentPlanned = stats?.plannedAidTL || 0;
      const mBudget = meeting.budgetTL;
      if (currentPlanned > mBudget) {
        const confirmExceeded = confirm(
          `🚨 BÜTÇE AŞIMI UYARISI:\n\nBu toplantı için ayrılan Vakıf bütçesi (${mBudget.toLocaleString('tr-TR')} ₺) aşılmaktadır. Toplam yapılacak yardım (${currentPlanned.toLocaleString('tr-TR')} ₺) bütçeyi ${(currentPlanned - mBudget).toLocaleString('tr-TR')} ₺ geçmektedir.\n\nYine de "${item.applicantName}" isimli kaydı onaylamak istediğinizden emin misiniz?`
        );
        if (!confirmExceeded) return;
      } else {
        if (!confirm(`${item.applicantName} isimli başvuru sahibinin inceleme kaydını onaylamak istediğinizden emin misiniz?`)) return;
      }
    } else {
      if (!confirm(`${item.applicantName} isimli başvuru sahibinin inceleme kaydını onaylamak istediğinizden emin misiniz?`)) return;
    }

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

  const handleExportExcel = async (exportOnlySelected: boolean = false) => {
    const targetRecords = exportOnlySelected
      ? filteredAndSortedAssessments.filter(a => selectedIds.includes(a.id))
      : filteredAndSortedAssessments;

    if (!targetRecords || targetRecords.length === 0) {
      alert('Dışa aktarılacak hane sosyal inceleme kaydı bulunamadı.');
      return;
    }

    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Sosyal Yardım ve İnceleme Sistemi';
      workbook.lastModifiedBy = user?.name || 'Sistem Görevlisi';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Hane Kayıtları', {
        pageSetup: { paperSize: 9, orientation: 'landscape' },
      });

      // Title
      worksheet.mergeCells('A1', 'M1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'T.C. SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI HANE SOSYAL İNCELEME KADROSU LİSTESİ';
      titleCell.font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' },
      };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      // Meta info
      worksheet.mergeCells('A2', 'M2');
      const metaCell = worksheet.getCell('A2');
      metaCell.value = `Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')} | Kayıt Sayısı: ${targetRecords.length} | Oluşturan: ${user?.name || 'Sistem Görevlisi'}`;
      metaCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF475569' } };
      metaCell.alignment = { horizontal: 'left', vertical: 'middle' };
      worksheet.getRow(2).height = 20;

      worksheet.getRow(3).height = 8;

      // Table Headers
      const headers = [
        'SIRA NO',
        'ZİYARET TARİHİ',
        'T.C. KİMLİK NO',
        'BAŞVURU SAHİBİ ADI SOYADI',
        'TELEFON NO',
        'HANE KİŞİ',
        'İKAMET ADRESİ',
        'HANE REF NO',
        'GÖREVLİ İNCELEYEN',
        'TOPLAM PUAN',
        'DEĞERLENDİRME KARARI',
        'ONAY DURUMU',
        'ONAYLAYAN MÜDÜR'
      ];

      const headerRow = worksheet.getRow(4);
      headerRow.values = headers;
      headerRow.height = 26;

      headerRow.eachCell((cell) => {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF334155' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF94A3B8' } },
          left: { style: 'thin', color: { argb: 'FF94A3B8' } },
          bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
          right: { style: 'thin', color: { argb: 'FF94A3B8' } },
        };
      });

      // Rows
      targetRecords.forEach((item, idx) => {
        const rowNum = idx + 5;
        const row = worksheet.getRow(rowNum);

        const isAccepted = item.result ? !item.result.isRejected : true;
        const isApproved = item.status === 'approved';
        const sequenceNo = item.customOrder !== undefined && item.customOrder !== null ? item.customOrder : idx + 1;

        row.values = [
          sequenceNo,
          new Date(item.date).toLocaleDateString('tr-TR'),
          item.applicantTc || '-',
          item.applicantName,
          item.phoneNumber || '-',
          `${item.householdSize} kişi`,
          item.applicantAddress || '-',
          item.householdNo || '-',
          item.personnelName,
          item.result?.totalScore ?? 0,
          isAccepted ? 'KAPSAM İÇİ (KABUL)' : 'KAPSAM DIŞI (RED)',
          isApproved ? 'ONAYLANDI' : 'ONAY BEKLİYOR',
          item.managerName || '-'
        ];

        row.height = 22;

        row.eachCell((cell, colNum) => {
          cell.font = { name: 'Calibri', size: 10 };
          cell.alignment = {
            vertical: 'middle',
            horizontal: (colNum === 4 || colNum === 7) ? 'left' : 'center',
            wrapText: colNum === 7,
          };

          const bgColor = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor },
          };

          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          };

          if (colNum === 1) {
            cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF4338CA' } };
          }
          if (colNum === 4) {
            cell.font = { name: 'Calibri', size: 10, bold: true };
          }
          if (colNum === 10) {
            cell.font = { name: 'Calibri', size: 10, bold: true };
          }
          if (colNum === 11) {
            cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: isAccepted ? 'FF15803D' : 'FFB91C1C' } };
          }
          if (colNum === 12) {
            cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: isApproved ? 'FF047857' : 'FFD97706' } };
          }
        });
      });

      worksheet.columns = [
        { width: 10 },
        { width: 14 },
        { width: 16 },
        { width: 28 },
        { width: 16 },
        { width: 13 },
        { width: 36 },
        { width: 15 },
        { width: 22 },
        { width: 13 },
        { width: 22 },
        { width: 16 },
        { width: 20 },
      ];

      worksheet.autoFilter = {
        from: { row: 4, column: 1 },
        to: { row: targetRecords.length + 4, column: 13 },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `Hane_Kayitlari_${exportOnlySelected ? 'Secilenler_' : ''}${dateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Excel indirilirken hata oluştu:', err);
      alert('Excel dosyası oluşturulurken bir hata oluştu.');
    }
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
      <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 z-20 no-print shadow-lg border-b border-red-900/60 relative">
        <div className="flex items-center gap-3 min-w-0">
          <LogoImage 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-md border-2 border-white/30 object-cover shrink-0" 
          />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-extrabold leading-tight tracking-wide">T.C. EDİRNE SYDV SOSYAL YARDIM DEĞERLENDİRME SİSTEMİ</h1>
            <p className="text-[10px] sm:text-xs text-red-200 font-semibold tracking-widest uppercase">
              {user.role === 'manager' ? '🔐 Müdür Yetkilisi Yönetim Paneli' : '👤 Personel İnceleme Paneli'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <div className="hidden md:block text-right border-r border-red-600/50 pr-3 mr-1">
            <p className="text-[10px] text-red-200 font-medium">{user.role === 'manager' ? 'Müdür Yetkilisi' : 'İnceleyen Personel'}</p>
            <p className="text-sm font-bold truncate max-w-[140px]">{user.name}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              title="Gezinti Menüsü"
            >
              <Menu size={16} className="shrink-0" />
              <span className="hidden sm:inline">Menü</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${isNavMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isNavMenuOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsNavMenuOpen(false)} />
            )}

            <AnimatePresence>
              {isNavMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                >
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Sistem Menüsü</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 md:hidden">{user.name}</p>
                  </div>

                  {user?.role === 'manager' && (
                    <Link
                      href="/settings"
                      onClick={() => setIsNavMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors border-b border-slate-100 group"
                    >
                      <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                        <Settings size={15} />
                      </div>
                      <span>Sistem Ayarları</span>
                    </Link>
                  )}

                  <Link
                    href="/guide"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors border-b border-slate-100 group"
                  >
                    <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <BookOpen size={15} />
                    </div>
                    <span>Kılavuz &amp; Metodoloji</span>
                  </Link>

                  <Link
                    href="/presentation"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-800 transition-colors group"
                  >
                    <div className="p-1.5 bg-red-100 text-red-700 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                      <Presentation size={15} />
                    </div>
                    <span>Proje Sunumu (PDF)</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-red-100 hover:text-white hover:bg-white/15 rounded-xl transition-all active:scale-95 touch-manipulation"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1920px] mx-auto p-3 sm:p-6 lg:p-8 space-y-5 no-print">
        
        <div className="space-y-3">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-2 border border-slate-300/70 shadow-xs">
            <div className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-default bg-white text-slate-900 shadow-md ring-1 ring-slate-950/5">
              <Home size={18} className="text-blue-600" />
              <span>İnceleme Listesi &amp; Hane İşlemleri</span>
            </div>

            <Link
              href="/statistics"
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white"
            >
              <BarChart3 size={18} className="text-blue-600" />
              <span>Detaylı İstatistik ve Bütçe Raporları</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Gösterge Paneli
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Hane inceleme ziyaretleri, gelişmiş arama/sıralama ve onay süreçleri.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {user.role === 'manager' && (
              <>
                <button
                  onClick={() => setNewMeetingModalOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-indigo-900/20 touch-manipulation"
                  title="Yeni bir toplantı oluştur"
                >
                  <Calendar size={18} />
                  <span>Yeni Toplantı Oluştur</span>
                </button>
                <button
                  onClick={openApproveAllModal}
                  disabled={pendingCount === 0}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-blue-900/20 touch-manipulation"
                  title="Onay bekleyen tüm hane kayıtlarını toplu onayla"
                >
                  <CheckCircle2 size={18} />
                  <span>Tümünü Onayla ({pendingCount})</span>
                </button>
              </>
            )}

            {user.role === 'personnel' && (
              <button 
                onClick={() => setNewAssessmentModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 font-extrabold text-sm transition-all shadow-md shadow-blue-200 touch-manipulation"
              >
                <Plus size={18} />
                Yeni İnceleme Başlat
              </button>
            )}
          </div>
        </div>

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

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Search className="text-blue-600" size={20} />
                Hane Arama & Değerlendirme Geçmişi Sorgulama
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                T.C. Kimlik No, Ad Soyad veya Hane Numarası ile arama yaparak haneye ait yapılmış tüm geçmiş değerlendirmeleri ve toplantı detaylarını inceleyebilirsiniz.
              </p>
            </div>
            {householdSearchQuery && (
              <button
                onClick={() => setHouseholdSearchQuery('')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 self-start sm:self-center bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <X size={14} /> Aramayı Temizle
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={householdSearchQuery}
              onChange={(e) => setHouseholdSearchQuery(e.target.value)}
              placeholder="Hane No (Örn: HN-123), T.C. Kimlik No (11 hane) veya Başvuru Sahibi Ad Soyad..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900 bg-slate-50/50 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {householdSearchQuery.trim() !== '' && (
            <div className="mt-5 space-y-4">
              {householdSearchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs font-semibold">
                  &quot;{householdSearchQuery}&quot; aramasına uygun hane veya değerlendirme kaydı bulunamadı.
                </div>
              ) : (
                householdSearchResults.map((hh) => (
                  <div key={hh.key} className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl font-bold">
                          <Building2 size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 leading-tight">{hh.applicantName}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium mt-0.5">
                            <span className="flex items-center gap-1"><Hash size={13} className="text-slate-400"/> TC: <strong className="text-slate-800">{hh.applicantTc}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Building2 size={13} className="text-slate-400"/> Hane No: <strong className="text-slate-800">{hh.householdNo}</strong></span>
                            {hh.phoneNumber && hh.phoneNumber !== '-' && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Phone size={13} className="text-slate-400"/> {hh.phoneNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-extrabold border border-blue-100 self-start md:self-center shrink-0">
                        Toplam {hh.assessments.length} Değerlendirme
                      </div>
                    </div>

                    <div className="space-y-2.5 pl-2 border-l-2 border-blue-300">
                      {hh.assessments.map((item) => {
                        const meeting = meetings.find(m => m.id === item.meetingId);
                        const isApproved = item.status === 'approved';
                        return (
                          <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black px-2.5 py-0.5 rounded-md border border-indigo-200">
                                  Dosya No: {meeting?.meetingNo || 'Toplantısız / Münferit'}
                                </span>
                                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                                  <Calendar size={13}/> {new Date(item.date).toLocaleDateString('tr-TR')}
                                </span>
                                {isApproved ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                                    MÜDÜR ONAYLADI
                                  </span>
                                ) : (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-200">
                                    ONAY BEKLİYOR
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1">
                                <span className="font-bold text-slate-700">Puan: <strong className={item.result.isRejected ? 'text-red-600' : 'text-blue-700'}>{item.result.totalScore} Puan</strong></span>
                                <span className="font-bold text-slate-700">Karar: <strong className={item.result.isRejected ? 'text-red-600' : 'text-emerald-700'}>{item.result.isRejected ? 'REDDEDİLDİ' : (item.result.assistance?.text || '-')}</strong></span>
                                <span className="text-slate-500">İnceleyen: {item.personnelName}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => handlePrintSingleDetailed(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <Printer size={13} /> Rapor (A4)
                              </button>
                              <Link
                                href={`/assessment/${item.id}`}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <FileText size={13} /> Detay
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {!filterMeetingId ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar className="text-indigo-600" size={24} />
                  Toplantı Dosyaları
                </h3>
                <p className="text-sm text-slate-500 mt-1">İşlem yapmak veya kayıtları görüntülemek için bir toplantı seçiniz.</p>
              </div>
            </div>

            {meetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Calendar size={28} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-bold text-slate-700 mb-2">Henüz Toplantı Bulunmuyor</h4>
                <p className="text-slate-500 max-w-md mx-auto text-sm">
                  {user?.role === 'manager' 
                    ? "Sistemde hiç toplantı kaydı yok. Hane incelemelerini başlatmak için sağ üstteki butondan yeni bir toplantı oluşturunuz."
                    : "Henüz bir toplantı oluşturulmamış. Lütfen müdür yetkilinizin bir toplantı oluşturmasını bekleyiniz."}
                </p>
                {user?.role === 'manager' && (
                  <button
                    onClick={() => setNewMeetingModalOpen(true)}
                    className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-900/20"
                  >
                    <Plus size={20} />
                    İlk Toplantıyı Oluştur
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {meetings.map((m) => {
                  const mAssessments = assessments.filter(a => a.meetingId === m.id);
                  const mPending = mAssessments.filter(a => a.status !== 'approved').length;
                  const mApproved = mAssessments.filter(a => a.status === 'approved').length;
                  
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const mDate = new Date(m.date);
                  mDate.setHours(0,0,0,0);
                  const isClosedByManager = m.isClosed;
                  const isExpiredDate = mDate < today && !m.forceOpen;
                  const isLockedForPersonnel = isClosedByManager || isExpiredDate;

                  return (
                    <div 
                      key={m.id}
                      onClick={() => setFilterMeetingId(m.id)}
                      className="group bg-white border-2 border-slate-100 hover:border-indigo-500 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:bg-indigo-100 transition-colors"></div>
                      
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                              <Calendar size={20} />
                            </div>
                            <span className="font-bold text-slate-800 text-lg">{m.meetingNo}</span>
                          </div>
                          
                          {isClosedByManager ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-md border border-red-200 shrink-0">
                              <Lock size={12} /> SONLANDIRILDI
                            </span>
                          ) : isExpiredDate ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                              <Lock size={12} /> KİLİTLİ (TARİHİ GEÇTİ)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                              <CheckCircle2 size={12} /> AKTİF TOPLANTI
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 font-semibold mb-2 flex items-center justify-between gap-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-slate-400" />
                            Toplantı Tarihi: <strong className="text-slate-800 font-extrabold">{new Date(m.date).toLocaleDateString('tr-TR')}</strong>
                          </span>
                          {user.role === 'manager' && (
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditMeeting(m, e)}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded-lg font-extrabold flex items-center gap-1 transition-colors border border-blue-200"
                              title="Toplantı Bütçesini ve Bilgilerini Düzenle"
                            >
                              <Pencil size={12} /> Bütçe / Düzenle
                            </button>
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2 h-8">
                          {m.description || "Açıklama girilmemiş."}
                        </p>

                        {user?.role === 'manager' && (() => {
                          const stats = meetingStatsMap.get(m.id);
                          const mBudget = m.budgetTL || 0;
                          const mPlanned = stats?.plannedAidTL || 0;
                          const isExceeded = mBudget > 0 && mPlanned > mBudget;
                          const excessTL = isExceeded ? mPlanned - mBudget : 0;
                          const pct = mBudget > 0 ? Math.min(100, Math.round((mPlanned / mBudget) * 100)) : 0;

                          return (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-3 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-500 flex items-center gap-1">
                                  <Wallet size={13} className="text-blue-600" /> Vakıf Bütçesi:
                                </span>
                                <span className="text-slate-900 font-extrabold">
                                  {mBudget > 0 ? `${mBudget.toLocaleString('tr-TR')} ₺` : 'Belirtilmedi'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-500 flex items-center gap-1">
                                  <Banknote size={13} className="text-indigo-600" /> Yapılacak Yardım:
                                </span>
                                <span className="text-indigo-900 font-extrabold">
                                  {mPlanned.toLocaleString('tr-TR')} ₺
                                </span>
                              </div>

                              {mBudget > 0 && (
                                <div className="space-y-1 pt-1">
                                  <div className="flex justify-between items-center text-[10px] font-extrabold">
                                    <span className={isExceeded ? 'text-red-600' : 'text-slate-500'}>
                                      Bütçe Kullanımı: %{pct}
                                    </span>
                                    <span className={isExceeded ? 'text-red-600 font-black' : 'text-emerald-700'}>
                                      {isExceeded ? `+${excessTL.toLocaleString('tr-TR')} ₺ Aşım` : `${(mBudget - mPlanned).toLocaleString('tr-TR')} ₺ Kalan`}
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        isExceeded ? 'bg-red-600' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {isExceeded && (
                                <div className="bg-red-100 text-red-800 text-[10px] font-black p-1.5 rounded-lg border border-red-300 text-center animate-pulse flex items-center justify-center gap-1">
                                  <AlertCircle size={12} /> VAKIF BÜTÇESİ AŞILIYOR!
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      <div>
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                          <div className="flex-1">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Toplam Kayıt</p>
                            <p className="text-base font-black text-slate-800">{mAssessments.length}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] uppercase font-bold text-amber-500 mb-0.5">Bekleyen</p>
                            <p className="text-base font-black text-amber-600">{mPending}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] uppercase font-bold text-emerald-500 mb-0.5">Onaylı</p>
                            <p className="text-base font-black text-emerald-600">{mApproved}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {user.role === 'manager' ? (
                            <button
                              type="button"
                              onClick={(e) => handleToggleMeetingStatus(m, e)}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                                isLockedForPersonnel 
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300' 
                                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              }`}
                            >
                              {isLockedForPersonnel ? (
                                <>
                                  <Unlock size={14} /> Toplantıyı Düzenlemeye Aç
                                </>
                              ) : (
                                <>
                                  <Lock size={14} /> Toplantıyı Sonlandır
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="w-full text-[11px] text-center font-bold">
                              {isLockedForPersonnel ? (
                                <span className="text-red-600 flex items-center justify-center gap-1 bg-red-50 py-1.5 rounded-lg border border-red-100">
                                  <Lock size={13} /> Değişiklik Yapılamaz (Kilitli)
                                </span>
                              ) : (
                                <span className="text-emerald-700 flex items-center justify-center gap-1 bg-emerald-50 py-1.5 rounded-lg border border-emerald-100">
                                  <CheckCircle2 size={13} /> Kayıt Girişine Açık
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 w-full bg-indigo-50 text-indigo-700 font-bold text-xs py-2 rounded-xl text-center group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                          <span>Dosyayı Aç</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-white space-y-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setFilterMeetingId(null)}
                   className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors shrink-0"
                   title="Toplantı Listesine Dön"
                 >
                   <ArrowLeft size={20} />
                 </button>
                 <div>
                   <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                     {meetings.find(m => m.id === filterMeetingId)?.meetingNo} <span className="text-slate-400 font-medium text-sm">Toplantı Kayıtları</span>
                   </h2>
                   <p className="text-xs text-slate-500">
                     Toplantı Tarihi: {meetings.find(m => m.id === filterMeetingId)?.date ? new Date(meetings.find(m => m.id === filterMeetingId)!.date).toLocaleDateString('tr-TR') : '-'}
                   </p>
                 </div>
               </div>

               {user.role === 'manager' && filterMeetingId && (
                 <button
                   onClick={() => {
                     const currentM = meetings.find(m => m.id === filterMeetingId);
                     if (currentM) handleOpenEditMeeting(currentM);
                   }}
                   className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 self-start md:self-center"
                 >
                   <Pencil size={15} />
                   <span>Toplantı Bütçesini Düzenle</span>
                 </button>
               )}
             </div>

             {(() => {
               const currentM = meetings.find(m => m.id === filterMeetingId);
               if (!currentM) return null;

               const stats = meetingStatsMap.get(currentM.id);
               const mBudget = currentM.budgetTL || 0;
               const mPlanned = stats?.plannedAidTL || 0;
               const mApproved = stats?.approvedAidTL || 0;
               const isExceeded = mBudget > 0 && mPlanned > mBudget;
               const excessTL = isExceeded ? mPlanned - mBudget : 0;
               const remainingTL = mBudget - mPlanned;

               if (user?.role !== 'manager') {
                 return (
                   <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-700">Toplantı Hane Durumu:</span>
                       <span className="text-xs font-extrabold text-slate-900">{stats?.totalCount || 0} İnceleme Dosyası</span>
                     </div>
                     <div className="text-xs font-bold text-emerald-700">
                       {stats?.approvedCount || 0} Onaylı / {stats?.pendingCount || 0} Bekleyen
                     </div>
                   </div>
                 );
               }

               return (
                 <div className={`p-4 rounded-2xl border transition-all ${
                   isExceeded ? 'bg-red-50/80 border-red-300' : 'bg-slate-50 border-slate-200'
                 }`}>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                     <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                       <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                         <Wallet size={12} className="text-blue-600" /> Vakıf Bütçesi
                       </span>
                       <p className="text-base font-black text-slate-900 mt-0.5">
                         {mBudget > 0 ? `${mBudget.toLocaleString('tr-TR')} ₺` : 'Bütçe Girilmemiş'}
                       </p>
                     </div>

                     <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                       <span className="text-[10px] uppercase font-bold text-indigo-500 flex items-center gap-1">
                         <Banknote size={12} className="text-indigo-600" /> Yapılacak Toplam Yardım
                       </span>
                       <p className="text-base font-black text-indigo-900 mt-0.5">
                         {mPlanned.toLocaleString('tr-TR')} ₺
                       </p>
                       <p className="text-[10px] text-slate-500 font-semibold">Onaylanan: {mApproved.toLocaleString('tr-TR')} ₺</p>
                     </div>

                     <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                       <span className="text-[10px] uppercase font-bold text-slate-400">Değerlendirilen Hane</span>
                       <p className="text-base font-black text-slate-800 mt-0.5">
                         {stats?.totalCount || 0} Hane
                       </p>
                       <p className="text-[10px] text-emerald-600 font-semibold">{stats?.approvedCount || 0} Onaylı / {stats?.pendingCount || 0} Bekleyen</p>
                     </div>

                     <div className={`p-3 rounded-xl border shadow-2xs ${
                       isExceeded ? 'bg-red-600 text-white border-red-700' : 'bg-white border-slate-200'
                     }`}>
                       <span className={`text-[10px] uppercase font-extrabold ${isExceeded ? 'text-red-100' : 'text-slate-400'}`}>
                         {isExceeded ? '🚨 Bütçe Aşım Miktarı' : 'Kalan Kullanılabilir Bütçe'}
                       </span>
                       <p className={`text-base font-black mt-0.5 ${isExceeded ? 'text-white' : 'text-emerald-700'}`}>
                         {mBudget === 0 
                           ? 'Sınırsız' 
                           : isExceeded 
                           ? `+${excessTL.toLocaleString('tr-TR')} ₺` 
                           : `${remainingTL.toLocaleString('tr-TR')} ₺`}
                       </p>
                     </div>
                   </div>

                   {isExceeded && (
                     <div className="mt-3 bg-red-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md animate-pulse">
                       <AlertCircle size={18} className="shrink-0" />
                       <div>
                         <p className="font-extrabold text-sm">🚨 VAKIF BÜTÇESİ AŞILIYOR UYARISI!</p>
                         <p className="text-red-100 font-medium text-xs mt-0.5">
                           Bu toplantı için belirlenen harcanabilir bütçe ({mBudget.toLocaleString('tr-TR')} ₺), yapılması planlanan toplam yardım tutarı ({mPlanned.toLocaleString('tr-TR')} ₺) nedeniyle <strong>{excessTL.toLocaleString('tr-TR')} ₺</strong> tutarında AŞILMAKTADIR.
                         </p>
                       </div>
                     </div>
                   )}
                 </div>
               );
             })()}
          </div>

          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Sosyal İnceleme Kayıtları
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Arama, filtreleme ve sütun bazlı sıralama ile tüm kayıtları inceleyip yönetebilirsiniz.</p>
            </div>
          </div>

          <div className="p-4 border-b border-slate-200 bg-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-3">
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

            <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Calendar size={14} className="text-slate-500 shrink-0" />
                <span>Toplantı:</span>
                <select
                  value={filterMeetingId || ''}
                  onChange={(e: any) => {
                    if (e.target.value === '') setFilterMeetingId(null);
                    else setFilterMeetingId(e.target.value);
                  }}
                  className="bg-white border border-slate-300 text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm max-w-[120px] truncate"
                >
                  <option value="" disabled>Seçiniz</option>
                  {meetings.map(m => (
                    <option key={m.id} value={m.id}>{m.meetingNo}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Filter size={14} className="text-slate-500 shrink-0" />
                <span>Karar:</span>
                <select
                  value={filterDecision}
                  onChange={(e: any) => setFilterDecision(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="all">Tümü</option>
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

              <button
                onClick={() => handleExportExcel(false)}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Mevcut filtrelenmiş ve sıralanmış hane listesini Excel (.xlsx) olarak indir"
              >
                <FileSpreadsheet size={15} />
                <span>Excel İndir (.xlsx)</span>
              </button>

              <button
                onClick={handlePrintCurrentList}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Mevcut sıralama ve filtreye göre tüm listeyi PDF / Yazıcı çıktısı al"
              >
                <Printer size={14} />
                <span>Tüm Listeyi Yazdır</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-indigo-50/70 border-b border-indigo-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                <ListOrdered size={15} className="text-indigo-600 shrink-0" />
                <span>Özel Sıralama Yönetimi:</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSortField('customOrder');
                  setSortOrder('asc');
                }}
                className={`px-2.5 py-1 rounded-md font-bold text-xs flex items-center gap-1 transition-all border ${
                  sortField === 'customOrder'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <ArrowUpDown size={12} />
                <span>Özel Sıraya Göre Listele</span>
              </button>

              <button
                onClick={handleAutoAssignCustomOrders}
                className="bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-300 px-2.5 py-1 rounded-md font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <ListOrdered size={13} />
                <span>1..N Otomatik Sıra Ver</span>
              </button>
            </div>
          </div>

          <div className="hidden md:block w-full overflow-x-auto xl:overflow-x-visible">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wider border-b border-slate-200">
                  <th className="px-2 py-2.5 font-black text-center w-8">
                    <input
                      type="checkbox"
                      checked={filteredAndSortedAssessments.length > 0 && selectedIds.length === filteredAndSortedAssessments.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-2 py-2.5 font-extrabold text-center w-16">Sıra</th>
                  <th className="px-3 py-2.5 font-extrabold">Tarih</th>
                  <th className="px-3 py-2.5 font-extrabold">T.C. Kimlik</th>
                  <th className="px-3 py-2.5 font-extrabold">Başvuru Sahibi Adı</th>
                  <th className="px-3 py-2.5 font-extrabold text-center">Hane</th>
                  {user.role === 'manager' && <th className="px-3 py-2.5 font-extrabold">Personel</th>}
                  <th className="px-3 py-2.5 font-extrabold text-center">Puan</th>
                  <th className="px-3 py-2.5 font-extrabold">Onay Durumu</th>
                  <th className="px-3 py-2.5 font-extrabold">Karar / Yardım</th>
                  <th className="px-3 py-2.5 font-extrabold text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAndSortedAssessments.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isApproved = item.status === 'approved';
                  return (
                    <tr key={item.id} className={`${isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-50/80'}`}>
                      <td className="px-3 py-3 text-center"><input type="checkbox" checked={isSelected} onChange={() => toggleSelectId(item.id)} className="rounded border-slate-300 text-blue-600" /></td>
                      <td className="px-2 py-2 text-center"><input type="number" value={item.customOrder ?? ''} onChange={(e) => handleUpdateCustomOrder(item, e.target.value ? parseInt(e.target.value) : undefined)} className="w-12 text-center border border-slate-300 rounded" /></td>
                      <td className="px-3 py-3">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                      <td className="px-3 py-3">{item.applicantTc}</td>
                      <td className="px-3 py-3 font-extrabold">{item.applicantName}</td>
                      <td className="px-3 py-3 text-center">{item.householdSize}</td>
                      {user.role === 'manager' && <td className="px-3 py-3">{item.personnelName}</td>}
                      <td className="px-3 py-3 text-center font-bold">{item.result.totalScore}</td>
                      <td className="px-3 py-3 font-black uppercase text-[10px]">{isApproved ? 'ONAYLI' : 'BEKLİYOR'}</td>
                      <td className="px-3 py-3 font-bold">{item.result.isRejected ? 'RED' : item.result.assistance?.text}</td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex gap-1">
                          {user.role === 'manager' && !isApproved && <button onClick={() => handleSingleApprove(item)} className="bg-emerald-600 text-white p-1 rounded">✓</button>}
                          <button onClick={() => handlePrintSingleDetailed(item)} className="bg-blue-600 text-white p-1 rounded">📄</button>
                          <Link href={`/assessment/${item.id}`} className="bg-slate-900 text-white p-1 rounded">👁️</Link>
                          {!isApproved && <button onClick={() => handleDeleteSingle(item)} className="bg-red-600 text-white p-1 rounded">🗑️</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </main>

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
                    {sortField === 'customOrder' ? 'Özel Sıra No' :
                     sortField === 'date' ? 'Ziyaret Tarihi' :
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
                    <span>Arama: <strong>&quot;{searchQuery}&quot;</strong></span>
                  </>
                ) : null}
              </p>
            </div>

            {/* Table - Strictly Single Row per record matching active screen order */}
            <table className="w-full border-collapse border border-black text-[9px] mb-6 print-table">
              <thead>
                <tr className="bg-slate-200 text-black font-extrabold uppercase border-b border-black">
                  <th className="p-1 text-center w-12">SIRA NO</th>
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
                      <td className="p-1 text-center font-bold">{item.customOrder !== undefined && item.customOrder !== null ? item.customOrder : idx + 1}</td>
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
                          <td className="border-r border-black font-bold p-1 w-1/6">SIRA NO:</td>
                          <td className="border-r border-black p-1 w-1/6 font-black">{item.customOrder !== undefined && item.customOrder !== null ? item.customOrder : '-'}</td>
                          <td className="border-r border-black font-bold p-1 w-1/6">T.C. KİMLİK NO:</td>
                          <td className="border-r border-black p-1 w-1/6 font-bold">{item.applicantTc || '-'}</td>
                          <td className="border-r border-black font-bold p-1 w-1/6">BAŞVURU SAHİBİ:</td>
                          <td className="p-1 w-1/6 font-black uppercase">{item.applicantName}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="border-r border-black font-bold p-1">TELEFON:</td>
                          <td className="border-r border-black p-1">{item.phoneNumber || '-'}</td>
                          <td className="border-r border-black font-bold p-1">HANE KİŞİ SAYISI:</td>
                          <td className="border-r border-black p-1 font-bold">{item.householdSize} kişi</td>
                          <td className="border-r border-black font-bold p-1">ZİYARET TARİHİ:</td>
                          <td className="p-1 font-bold">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="border-r border-black font-bold p-1">HANE REF NO:</td>
                          <td className="border-r border-black p-1">{item.householdNo || '-'}</td>
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

      {/* Create New Meeting Modal (Manager) */}
      <AnimatePresence>
        {newMeetingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={20} />
                  Yeni Toplantı Oluştur
                </h3>
                <button onClick={() => setNewMeetingModalOpen(false)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-indigo-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Toplantı No (Örn: 2026/01)</label>
                  <input
                    type="text"
                    value={newMeetingData.meetingNo}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, meetingNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold"
                    placeholder="2026/01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Toplantı Tarihi</label>
                  <input
                    type="date"
                    value={newMeetingData.date}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Wallet size={15} className="text-blue-600" />
                    <span>Harcanabilir Vakıf Bütçesi Tutarı (TL)</span>
                  </label>
                  <input
                    type="number"
                    value={newMeetingData.budgetTL}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, budgetTL: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-black text-slate-900"
                    placeholder="Örn: 250000"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Bu toplantı için ayrılan harcanabilir Vakıf kaynağı. Belirtilmezse sınırsız kabul edilir.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama (İsteğe Bağlı)</label>
                  <textarea
                    value={newMeetingData.description}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 min-h-[70px]"
                    placeholder="Toplantı içeriği vb."
                  />
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setNewMeetingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  onClick={async () => {
                    if (!newMeetingData.meetingNo || !newMeetingData.date) {
                      alert('Lütfen toplantı numarası ve tarihini giriniz.');
                      return;
                    }
                    const newMeeting: Meeting = {
                      id: Date.now().toString(),
                      meetingNo: newMeetingData.meetingNo,
                      date: newMeetingData.date,
                      createdAt: new Date().toISOString(),
                      managerName: user.name,
                      description: newMeetingData.description,
                      budgetTL: newMeetingData.budgetTL ? Number(newMeetingData.budgetTL) : 0,
                    };
                    await saveMeeting(newMeeting);
                    if (meetings.length === 0) {
                      const { migrateAssessmentsToMeeting } = await import('@/lib/db');
                      await migrateAssessmentsToMeeting(newMeeting.id);
                      await reloadAssessments();
                    }
                    const updated = await getAllMeetings();
                    setMeetings(updated);
                    setNewMeetingModalOpen(false);
                    setNewMeetingData({ meetingNo: '', date: '', description: '', budgetTL: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-900/20 active:scale-95 transition-all"
                >
                  Kaydet ve Oluştur
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Existing Meeting Modal (Manager) */}
      <AnimatePresence>
        {editMeetingModalOpen && editingMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 flex items-center justify-between text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Pencil size={18} />
                  Toplantı Bütçesi ve Bilgilerini Düzenle
                </h3>
                <button onClick={() => setEditMeetingModalOpen(false)} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Toplantı No (Örn: 2026/01)</label>
                  <input
                    type="text"
                    value={editMeetingData.meetingNo}
                    onChange={(e) => setEditMeetingData({ ...editMeetingData, meetingNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Toplantı Tarihi</label>
                  <input
                    type="date"
                    value={editMeetingData.date}
                    onChange={(e) => setEditMeetingData({ ...editMeetingData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Wallet size={15} className="text-blue-600" />
                    <span>Harcanabilir Vakıf Bütçesi Tutarı (TL)</span>
                  </label>
                  <input
                    type="number"
                    value={editMeetingData.budgetTL}
                    onChange={(e) => setEditMeetingData({ ...editMeetingData, budgetTL: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-black text-slate-900"
                    placeholder="Örn: 250000"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Toplantı boyunca onaylanacak veya planlanacak tüm yardım tutarlarının üst sınırı.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama</label>
                  <textarea
                    value={editMeetingData.description}
                    onChange={(e) => setEditMeetingData({ ...editMeetingData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 min-h-[70px]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setEditMeetingModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEditMeeting}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-900/20 active:scale-95 transition-all"
                >
                  Guncelle ve Kaydet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select Meeting & Start Assessment Modal (Personnel) */}
      <AnimatePresence>
        {newAssessmentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-blue-100"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between relative overflow-hidden">
                <div className="absolute -right-4 -top-12 opacity-10">
                  <ShieldCheck size={120} />
                </div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2 relative z-10 tracking-tight">
                  <Plus size={24} className="opacity-90" />
                  Yeni İnceleme Başlat
                </h3>
                <button onClick={() => setNewAssessmentModalOpen(false)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors relative z-10">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-600 font-medium">Hane inceleme kaydı oluşturmak için öncelikle bu kaydın hangi mütevelli heyeti toplantısında sunulacağını seçiniz.</p>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Hedef Toplantı Seçimi</label>
                  <select
                    value={selectedMeetingId}
                    onChange={(e) => setSelectedMeetingId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50 font-semibold text-slate-800 shadow-sm transition-colors"
                  >
                    <option value="" disabled>Toplantı Seçiniz...</option>
                    {meetings.map(m => (
                      <option key={m.id} value={m.id}>{m.meetingNo} - {new Date(m.date).toLocaleDateString('tr-TR')} ({m.managerName})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-5 flex flex-col gap-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (!selectedMeetingId) {
                      alert('Lütfen işleme devam etmek için bir toplantı seçiniz.');
                      return;
                    }
                    router.push(`/assessment/new?meetingId=${selectedMeetingId}`);
                  }}
                  disabled={!selectedMeetingId}
                  className="w-full px-5 py-3.5 rounded-xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  <Plus size={20} />
                  İnceleme Formunu Aç
                </button>
                <button
                  onClick={() => setNewAssessmentModalOpen(false)}
                  className="w-full px-5 py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                  Geri Dön
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}

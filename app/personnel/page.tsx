'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Users, CheckCircle2, AlertCircle, FileText, Calendar, Eye, UserPlus, Trash2, KeyRound, Download, Edit2, X, Loader2
} from 'lucide-react';
import { Meeting, Assessment, getAllMeetings, getAllAssessments } from '@/lib/db';
import Link from 'next/link';
import { SidebarLayout } from '@/components/sidebar';
import { useDialog } from '@/components/DialogProvider';
import { calculateNewSystemScore, isOldSystemRecord, isRejectedRecord } from '@/lib/scoring';

interface PersonnelStats {
  id: string;
  name: string;
  totalAssessments: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalScore: number;
  lastActive: string | null;
  assessments: Assessment[];
  uniqueMeetingIds: Set<string>;
}

export default function PersonnelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { showConfirm, showAlert } = useDialog();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Users from API
  const [systemUsers, setSystemUsers] = useState<any[]>([]);

  // View state: 'list' | 'detail' | 'manage'
  const [viewState, setViewState] = useState<'list' | 'detail' | 'manage'>('list');

  // States for personnel list view
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for detailed view
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelStats | null>(null);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [filterMeetingId, setFilterMeetingId] = useState<string>('all');

  // States for manage view
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('personnel');
  const [manageError, setManageError] = useState('');
  const [manageSuccess, setManageSuccess] = useState('');

  // States for edit user modal
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('personnel');

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsRes, assessmentsRes, usersRes] = await Promise.all([
        getAllMeetings(),
        getAllAssessments(),
        fetch('/api/users')
      ]);
      setMeetings(meetingsRes);
      setAssessments(assessmentsRes.data);
      if (usersRes.ok) {
        setSystemUsers(await usersRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPersonnel = async () => {
    if (!personnelStats || personnelStats.length === 0) {
      await showAlert('Dışa aktarılacak personel kaydı bulunamadı.', 'warning');
      return;
    }
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Personel Performans Listesi');
      worksheet.columns = [
        { header: 'Personel Adı', key: 'name', width: 30 },
        { header: 'Toplam İnceleme', key: 'totalAssessments', width: 20 },
        { header: 'Onaylanan', key: 'approvedCount', width: 15 },
        { header: 'Bekleyen', key: 'pendingCount', width: 15 },
        { header: 'Reddedilen', key: 'rejectedCount', width: 15 },
        { header: 'Ort. Puan', key: 'avgScore', width: 15 },
        { header: 'Son Aktivite', key: 'lastActive', width: 25 },
      ];
      worksheet.getRow(1).font = { bold: true };
      personnelStats.forEach(p => {
        worksheet.addRow({
          name: p.name || 'Bilinmiyor',
          totalAssessments: p.totalAssessments,
          approvedCount: p.approvedCount,
          pendingCount: p.pendingCount,
          rejectedCount: p.rejectedCount,
          avgScore: p.totalAssessments > 0 ? (p.totalScore / p.totalAssessments).toFixed(1) : 0,
          lastActive: p.lastActive ? new Date(p.lastActive).toLocaleString('tr-TR') : 'Hiç aktif olmadı'
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Personel_Performans_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      await showAlert('Excel oluşturulurken hata oluştu.', 'error');
    }
  };

  const handleExportPersonnelDetail = async () => {
    if (!filteredDetails || filteredDetails.length === 0) {
      await showAlert('Dışa aktarılacak detay kaydı bulunamadı.', 'warning');
      return;
    }
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Personel İncelemeleri');
      worksheet.columns = [
        { header: 'Ziyaret Tarihi', key: 'date', width: 20 },
        { header: 'Hane Ref No', key: 'householdNo', width: 15 },
        { header: 'T.C. Kimlik No', key: 'tc', width: 15 },
        { header: 'Başvuru Sahibi', key: 'name', width: 25 },
        { header: 'Hane Kişi', key: 'householdSize', width: 10 },
        { header: 'İkamet Adresi', key: 'address', width: 40 },
        { header: 'Durum', key: 'status', width: 15 },
        { header: 'Yeni Puan', key: 'score', width: 10 },
        { header: 'Eski Puan', key: 'oldScore', width: 10 },
      ];
      worksheet.getRow(1).font = { bold: true };
      filteredDetails.forEach(d => {
        let statusText = 'Bekliyor';
        if (d.status === 'approved') statusText = 'Onaylandı';
        if (d.result?.isRejected) statusText = 'Reddedildi';
        worksheet.addRow({
          date: new Date(d.date).toLocaleString('tr-TR'),
          householdNo: d.householdNo || '-',
          tc: d.applicantTc || '-',
          name: d.applicantName || '-',
          householdSize: d.householdSize || 1,
          address: d.applicantAddress || '-',
          status: statusText,
          score: isOldSystemRecord(d.result) ? calculateNewSystemScore(d.data).totalScore : (d.result?.totalScore || 0),
          oldScore: isOldSystemRecord(d.result) ? d.result?.totalScore || 0 : '-'
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Personel_Detay_${selectedPersonnel?.name || 'Rapor'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      await showAlert('Excel oluşturulurken hata oluştu.', 'error');
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    
    // Only managers and superadmins can access this page
    if (currentUser.role !== 'manager' && currentUser.role !== 'superadmin') {
      router.push('/');
      return;
    }
    
    if (currentUser.role === 'superadmin') {
      setViewState('manage');
    }
    
    setUser(currentUser);
    loadData();
  }, [router]);

  // Aggregate stats per personnel
  const personnelStats = (() => {
    const map = new Map<string, PersonnelStats>();

    assessments.forEach(a => {
      const pKey = a.personnelId || a.personnelName;
      if (!map.has(pKey)) {
        map.set(pKey, {
          id: pKey,
          name: a.personnelName,
          totalAssessments: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
          totalScore: 0,
          lastActive: null,
          assessments: [],
          uniqueMeetingIds: new Set()
        });
      }
      
      const p = map.get(pKey)!;
      p.totalAssessments++;
      
      const newSystemScore = isOldSystemRecord(a.result) 
        ? calculateNewSystemScore(a.data).totalScore 
        : (a.result?.totalScore || 0);
      
      p.totalScore += newSystemScore;
      p.assessments.push(a);
      if (a.meetingId) p.uniqueMeetingIds.add(a.meetingId);

      if (a.status === 'approved') p.approvedCount++;
      else p.pendingCount++;

      if (a.result?.isRejected) p.rejectedCount++;

      if (!p.lastActive || new Date(a.date) > new Date(p.lastActive)) {
        p.lastActive = a.date;
      }
    });

    return Array.from(map.values())
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      .sort((a, b) => b.totalAssessments - a.totalAssessments);
  })();

  const filteredDetails = (() => {
    if (!selectedPersonnel) return [];
    
    return selectedPersonnel.assessments
      .filter(a => {
        if (filterMeetingId !== 'all' && a.meetingId !== filterMeetingId) return false;
        if (detailSearchQuery.trim()) {
          const q = detailSearchQuery.toLowerCase().trim();
          return (a.applicantName || '').toLowerCase().includes(q) || 
                 (a.applicantTc || '').toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  const personnelMeetingStats = (() => {
    if (!selectedPersonnel) return [];
    const pMeetings = new Map<string, { id: string, meetingNo: string, date: string, total: number, approved: number }>();
    
    selectedPersonnel.assessments.forEach(a => {
      if (!a.meetingId) return;
      if (!pMeetings.has(a.meetingId)) {
        const mObj = meetings.find(m => m.id === a.meetingId);
        pMeetings.set(a.meetingId, {
          id: a.meetingId,
          meetingNo: mObj ? mObj.meetingNo : 'Bilinmeyen Toplantı',
          date: mObj ? mObj.date : a.date,
          total: 0,
          approved: 0
        });
      }
      const mStat = pMeetings.get(a.meetingId)!;
      mStat.total++;
      if (a.status === 'approved') mStat.approved++;
    });
    
    return Array.from(pMeetings.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setManageError('');
    setManageSuccess('');
    
    if (!newUserName || !newUserEmail || !newUserPassword) {
      setManageError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole })
      });
      const data = await res.json();
      if (res.ok) {
        setManageSuccess('Personel başarıyla eklendi.');
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('personnel');
        loadData();
      } else {
        setManageError(data.error || 'Eklenemedi');
      }
    } catch (err) {
      setManageError('Bir hata oluştu');
    }
  };

  const handleOpenEditModal = (u: any) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPassword('');
    setEditRole(u.role);
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setManageError('');
    setManageSuccess('');
    if (!editName || !editEmail || !editRole) {
      setManageError('Ad, E-posta ve Rol alanları zorunludur.');
      return;
    }
    
    try {
      const body: any = { name: editName, email: editEmail, role: editRole };
      if (editPassword) {
        body.password = editPassword;
      }
      
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setManageSuccess('Personel başarıyla güncellendi.');
        setEditingUser(null);
        loadData();
      } else {
        setManageError(data.error || 'Güncellenemedi');
      }
    } catch (err) {
      setManageError('Bir hata oluştu');
    }
  };

  const handleReset2FA = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!(await showConfirm('Bu personelin 2FA Google Authenticator kurulumunu sıfırlamak istediğinize emin misiniz? (Yeni cihaz için QR kodu tekrar gösterilecektir)'))) return;
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset2FA: true })
      });
      if (res.ok) {
        setManageSuccess('2FA Kurulumu sıfırlandı.');
        setEditingUser(null);
        loadData();
      } else {
        setManageError('Sıfırlama başarısız.');
      }
    } catch (err) {
      setManageError('Hata oluştu.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!(await showConfirm('Bu personeli silmek istediğinize emin misiniz?'))) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setManageSuccess('Personel silindi.');
        loadData();
      } else {
        setManageError('Silinemedi.');
      }
    } catch (err) {
      setManageError('Hata oluştu');
    }
  };

  const handleToggle2FA = async (id: string, newStatus: boolean) => {
    if (!(await showConfirm(`Bu kullanıcının 2FA sistemini ${newStatus ? 'açmak' : 'kapatmak'} istediğinize emin misiniz?`))) return;
    try {
      const res = await fetch(`/api/users/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTwoFactorEnabled: newStatus })
      });
      if (res.ok) {
        setManageSuccess(`2FA ${newStatus ? 'açıldı' : 'kapatıldı'}.`);
        loadData();
      } else {
        setManageError('2FA güncellenemedi.');
      }
    } catch (err) {
      setManageError('Hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-primary-500 animate-spin" />
          <div className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW SELECTOR */}
        {viewState !== 'detail' && (
          <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl mb-6 w-full max-w-sm">
            <button
              onClick={() => setViewState('list')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${viewState === 'list' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
            >
              Performans Özetleri
            </button>
            <button
              onClick={() => setViewState('manage')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${viewState === 'manage' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'}`}
            >
              Hesap Yönetimi
            </button>
          </div>
        )}

        {viewState === 'manage' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">Personel Hesap Yönetimi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sisteme yeni personel ekleyebilir veya silebilirsiniz.</p>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><UserPlus size={18}/> Yeni Personel Ekle</h3>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Ad Soyad</label>
                  <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full px-3 py-2 border rounded-xl" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Giriş Kullanıcı Adı</label>
                  <input type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full px-3 py-2 border rounded-xl" placeholder="E-posta veya kullanıcı adı" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Şifre</label>
                  <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full px-3 py-2 border rounded-xl" placeholder="En az 6 karakter" required />
                </div>
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">Ekle</button>
              </form>
              {manageError && <p className="text-red-600 text-sm mt-3">{manageError}</p>}
              {manageSuccess && <p className="text-emerald-600 text-sm mt-3">{manageSuccess}</p>}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-4 font-bold">Ad Soyad</th>
                    <th className="px-6 py-4 font-bold">Kullanıcı Adı</th>
                    <th className="px-6 py-4 font-bold">Rol</th>
                    {user?.role === 'superadmin' && <th className="px-6 py-4 font-bold text-center">2FA Durumu</th>}
                    <th className="px-6 py-4 font-bold text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {systemUsers.map(u => (
                    <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.role}</td>
                      {user?.role === 'superadmin' && (
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleToggle2FA(u.id, !u.isTwoFactorEnabled)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${u.isTwoFactorEnabled ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700'}`}
                          >
                            {u.isTwoFactorEnabled ? 'Açık (Kapat)' : 'Kapalı (Aç)'}
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleOpenEditModal(u)} className="text-primary-500 hover:bg-primary-50 p-2 rounded-lg" title="Düzenle">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Sil">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {systemUsers.length === 0 && (
                    <tr><td colSpan={4} className="text-center p-6 text-slate-500 dark:text-slate-400">Sistemde personel kaydı yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewState === 'list' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">Personel Performans Listesi</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sistemdeki personellerin genel inceleme özetleri.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportPersonnel}
                  className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg flex items-center gap-2 font-bold transition-colors"
                >
                  <Download size={18} /> Excel İndir
                </button>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Personel ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {personnelStats.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
                <Users size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Kayıt Bulunamadı</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Henüz inceleme yapan bir personel bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personnelStats.map(p => (
                  <div 
                    key={p.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-black text-lg">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg truncate w-40" title={p.name}>{p.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Sosyal İnceleme Görevlisi</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">İnceleme</p>
                          <p className="text-lg font-black text-slate-800 dark:text-slate-200">{p.totalAssessments}</p>
                        </div>
                        <div className="bg-primary-50 rounded-xl p-3 text-center border border-primary-100">
                          <p className="text-[10px] font-bold text-primary-600 uppercase tracking-tight">Ort. Puan</p>
                          <p className="text-lg font-black text-primary-700">{p.totalAssessments > 0 ? (p.totalScore / p.totalAssessments).toFixed(1) : '-'}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                          <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">Red Oranı</p>
                          <p className="text-lg font-black text-red-700">{p.totalAssessments > 0 ? ((p.rejectedCount / p.totalAssessments) * 100).toFixed(0) : '0'}%</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-tight">Toplantı</p>
                          <p className="text-lg font-black text-purple-700">{p.uniqueMeetingIds.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Son: {p.lastActive ? new Date(p.lastActive).toLocaleDateString('tr-TR') : '-'}
                      </div>
                      <button
                        onClick={() => { setSelectedPersonnel(p); setViewState('detail'); }}
                        className="text-primary-600 hover:text-primary-800 text-sm font-bold flex items-center gap-1 group-hover:underline"
                      >
                        Detayları Gör <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewState === 'detail' && selectedPersonnel && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedPersonnel(null);
                  setDetailSearchQuery('');
                  setFilterMeetingId('all');
                  setViewState('list');
                }}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:bg-slate-700 rounded-xl transition-colors bg-slate-100 dark:bg-slate-800/50"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">{selectedPersonnel.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Personelin geçmiş toplantılardaki tüm inceleme kayıtları.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl"><FileText size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Toplam Kayıt</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedPersonnel.totalAssessments}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Onaylanmış</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedPersonnel.approvedCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Onay Bekleyen</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedPersonnel.pendingCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Reddedilmiş</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedPersonnel.rejectedCount}</p>
                </div>
              </div>
            </div>

            {filterMeetingId === 'all' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Toplantı Dosyaları</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">İnceleme detaylarını görmek için bir toplantı seçin</p>
                </div>
                {personnelMeetingStats.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-10">Personelin henüz kayıtlı bir toplantı incelemesi bulunmuyor.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {personnelMeetingStats.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => setFilterMeetingId(m.id)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-primary-300 hover:shadow-lg cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-primary-50 text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors"><Calendar size={20} /></div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">{new Date(m.date).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg mb-4 group-hover:text-primary-700 transition-colors">
                          Toplantı No: {m.meetingNo}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-center border border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:border-slate-700 transition-colors">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">İnceleme</p>
                            <p className="text-lg font-black text-slate-700 dark:text-slate-300">{m.total}</p>
                          </div>
                          <div className="bg-emerald-50 p-2.5 rounded-xl text-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Onaylı</p>
                            <p className="text-lg font-black text-emerald-700">{m.approved}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Başvuru sahibi, TC no..."
                      value={detailSearchQuery}
                      onChange={(e) => setDetailSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <button 
                      onClick={() => setFilterMeetingId('all')}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center gap-2 font-bold transition-colors whitespace-nowrap shadow-sm"
                    >
                      <ArrowLeft size={16} /> Toplantılara Dön
                    </button>
                    <button 
                      onClick={handleExportPersonnelDetail}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg flex items-center gap-2 font-bold transition-colors whitespace-nowrap"
                    >
                      <Download size={18} /> Excel&apos;e Aktar
                    </button>
                  </div>
                </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 font-bold">Toplantı</th>
                      <th className="px-6 py-4 font-bold">Ziyaret Tarihi</th>
                      <th className="px-6 py-4 font-bold">Başvuru Sahibi / T.C.</th>
                      <th className="px-6 py-4 font-bold text-center">Puan</th>
                      <th className="px-6 py-4 font-bold text-center">Onay Durumu</th>
                      <th className="px-6 py-4 font-bold">Karar</th>
                      <th className="px-6 py-4 font-bold text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDetails.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                          Filtrelere uygun kayıt bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredDetails.map((a) => {
                        const m = meetings.find(meet => meet.id === a.meetingId);
                        const isApproved = a.status === 'approved';
                        return (
                          <tr key={a.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                              {m ? m.meetingNo : '-'}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                              {new Date(a.date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-extrabold text-slate-900 dark:text-slate-100">{a.applicantName}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{a.applicantTc}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                {isOldSystemRecord(a.result) && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-bold whitespace-nowrap">
                                    Eski Sistem: {a.result?.totalScore || 0}
                                  </span>
                                )}
                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-black ${a.result?.isRejected ? "bg-red-50 text-red-700" : "bg-primary-50 text-primary-700"}`}>
                                  {isOldSystemRecord(a.result) ? calculateNewSystemScore(a.data).totalScore : (a.result?.totalScore || 0)} Puan
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 size={14} /> ONAYLI
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-100 text-amber-800">
                                  <Clock size={14} /> BEKLİYOR
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold">
                              {a.result?.isRejected ? (
                                <span className="text-red-600">REDDEDİLDİ</span>
                              ) : (
                                <span className="text-slate-700 dark:text-slate-300">
                                  {isOldSystemRecord(a.result) ? calculateNewSystemScore(a.data).assistance.text : (a.result?.assistance?.text || '-')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/assessment/${a.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-xl transition-colors"
                                title="İnceleme Detayını Yeni Sekmede Aç"
                              >
                                <Eye size={18} />
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
            )}
          </div>
        )}
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Personel Düzenle</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  value={editName} onChange={e => setEditName(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">E-posta</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  value={editEmail} onChange={e => setEditEmail(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Yeni Şifre (Boş bırakırsanız değişmez)</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="••••••••" 
                />
              </div>
              {user?.role === 'superadmin' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Yetki Rolü</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={editRole} onChange={e => setEditRole(e.target.value)}
                  >
                    <option value="personnel">Personel</option>
                    <option value="manager">Müdür (Manager)</option>
                  </select>
                </div>
              )}
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                {user?.role === 'superadmin' && editingUser?.isTwoFactorEnabled ? (
                  <button type="button" onClick={handleReset2FA} className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors w-full sm:w-auto text-left">
                    2FA Kurulumunu Sıfırla (Yeni Cihaz)
                  </button>
                ) : <div />}
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800/50 font-bold rounded-lg transition-colors">
                    İptal
                  </button>
                  <button type="submit" className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
                    Kaydet
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Clock = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

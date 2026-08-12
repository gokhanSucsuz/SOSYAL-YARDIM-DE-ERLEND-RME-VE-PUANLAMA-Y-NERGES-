'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Users, CheckCircle2, AlertCircle, FileText, Calendar, Building2, Eye
} from 'lucide-react';
import { Meeting, Assessment, getAllMeetings, getAllAssessments } from '@/lib/db';
import { LogoImage } from '@/components/logo-image';
import Link from 'next/link';

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
}

export default function PersonnelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // States for personnel list view
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for detailed view
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelStats | null>(null);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [filterMeetingId, setFilterMeetingId] = useState<string>('all');

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    
    // Only managers can access this page
    if (currentUser.role !== 'manager') {
      router.push('/');
      return;
    }
    
    setUser(currentUser);

    const loadData = async () => {
      try {
        const [loadedMeetings, loadedAssessments] = await Promise.all([
          getAllMeetings(),
          getAllAssessments()
        ]);
        setMeetings(loadedMeetings);
        setAssessments(loadedAssessments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Aggregate stats per personnel
  const personnelStats = useMemo(() => {
    const map = new Map<string, PersonnelStats>();

    assessments.forEach(a => {
      // Use personnelName as key if personnelId is missing, though personnelId should be there
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
          assessments: []
        });
      }
      
      const p = map.get(pKey)!;
      p.totalAssessments++;
      p.totalScore += a.result?.totalScore || 0;
      p.assessments.push(a);

      if (a.status === 'approved') p.approvedCount++;
      else p.pendingCount++;

      if (a.result?.isRejected) p.rejectedCount++;

      // Track last active date based on meeting or assessment date
      if (!p.lastActive || new Date(a.date) > new Date(p.lastActive)) {
        p.lastActive = a.date;
      }
    });

    // Convert to array and filter by search query
    return Array.from(map.values())
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      .sort((a, b) => b.totalAssessments - a.totalAssessments);
  }, [assessments, searchQuery]);

  // Detailed view filtered assessments
  const filteredDetails = useMemo(() => {
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
  }, [selectedPersonnel, filterMeetingId, detailSearchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <LogoImage className="h-8 w-auto grayscale opacity-80" />
              <div className="h-4 w-px bg-slate-300"></div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Users className="text-blue-600" size={20} />
                Personel Yönetimi
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPersonnel ? (
          /* PERSONNEL LIST VIEW */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">Personel Listesi</h2>
                <p className="text-sm text-slate-500 mt-1">Sistemdeki tüm personellerin genel performans ve inceleme özetleri.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Personel ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {personnelStats.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <Users size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Kayıtlı Personel Bulunamadı</h3>
                <p className="text-slate-500 mt-2">Arama kriterlerine uygun personel kaydı mevcut değil.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personnelStats.map(p => (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-800 text-lg truncate w-40" title={p.name}>{p.name}</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Sosyal İnceleme Görevlisi</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-6">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Toplam</p>
                          <p className="text-lg font-black text-slate-800">{p.totalAssessments}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">Onaylı</p>
                          <p className="text-lg font-black text-emerald-700">{p.approvedCount}</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] font-bold text-amber-600 uppercase">Bekleyen</p>
                          <p className="text-lg font-black text-amber-700">{p.pendingCount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 flex items-center justify-between">
                      <div className="text-xs text-slate-500 font-medium">
                        Son Ziyaret: {p.lastActive ? new Date(p.lastActive).toLocaleDateString('tr-TR') : '-'}
                      </div>
                      <button
                        onClick={() => setSelectedPersonnel(p)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 group-hover:underline"
                      >
                        Detayları Gör <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* PERSONNEL DETAIL VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedPersonnel(null);
                  setDetailSearchQuery('');
                  setFilterMeetingId('all');
                }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors bg-slate-100"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800">{selectedPersonnel.name}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Personelin geçmiş toplantılardaki tüm inceleme kayıtları.</p>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Toplam Kayıt</p>
                  <p className="text-2xl font-black text-slate-800">{selectedPersonnel.totalAssessments}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Onaylanmış</p>
                  <p className="text-2xl font-black text-slate-800">{selectedPersonnel.approvedCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Onay Bekleyen</p>
                  <p className="text-2xl font-black text-slate-800">{selectedPersonnel.pendingCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={24} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Reddedilmiş</p>
                  <p className="text-2xl font-black text-slate-800">{selectedPersonnel.rejectedCount}</p>
                </div>
              </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Başvuru sahibi, TC no..."
                    value={detailSearchQuery}
                    onChange={(e) => setDetailSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <Calendar size={16} className="text-slate-500" />
                  <span>Toplantı:</span>
                  <select
                    value={filterMeetingId}
                    onChange={(e) => setFilterMeetingId(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-48"
                  >
                    <option value="all">Tüm Toplantılar</option>
                    {meetings.map(m => (
                      <option key={m.id} value={m.id}>{m.meetingNo} ({new Date(m.date).toLocaleDateString('tr-TR')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
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
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                          Filtrelere uygun kayıt bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredDetails.map((a) => {
                        const m = meetings.find(meet => meet.id === a.meetingId);
                        const isApproved = a.status === 'approved';
                        return (
                          <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">
                              {m ? m.meetingNo : '-'}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600">
                              {new Date(a.date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-extrabold text-slate-900">{a.applicantName}</div>
                              <div className="text-xs text-slate-500 font-medium mt-0.5">{a.applicantTc}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700">
                                {a.result?.totalScore || 0}
                              </span>
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
                                <span className="text-slate-700">{a.result?.assistance?.text || '-'}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/assessment/${a.id}`}
                                className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors"
                                title="İnceleme Detayına Git"
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
          </div>
        )}
      </main>
    </div>
  );
}

// Ensure proper arrow right icon is available
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

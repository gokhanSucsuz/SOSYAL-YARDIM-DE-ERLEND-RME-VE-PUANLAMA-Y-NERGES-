"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAssessments, getAssessmentsByPersonnel, Assessment } from '@/lib/db';
import { FileText, Plus, LogOut, Users, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!user || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-500 font-medium animate-pulse">Yükleniyor...</div></div>;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const total = assessments.length;
  const approved = assessments.filter(a => !a.result.isRejected && a.result.totalScore > 30).length;
  const rejected = assessments.filter(a => a.result.isRejected || a.result.totalScore <= 30).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">SOSYAL YARDIM DEĞERLENDİRME</h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
              {user.role === 'manager' ? 'Yönetici Paneli' : 'Personel Paneli'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right border-r border-slate-700 pr-4 mr-2">
            <p className="text-xs text-slate-400">{user.role === 'manager' ? 'Müdür' : 'İnceleyen Personel'}</p>
            <p className="text-sm font-semibold">{user.name}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors" title="Çıkış Yap">
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gösterge Paneli</h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Sisteme kayıtlı hane ziyaretleri ve istatistikler.</p>
          </div>
          {user.role === 'personnel' && (
            <Link href="/assessment/new" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-200">
              <Plus size={18} />
              Yeni İnceleme Başlat
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
            <div className="p-4 bg-slate-100 text-slate-600 rounded-xl"><Users size={28} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Toplam İnceleme</p>
              <p className="text-3xl font-black text-slate-800 leading-none">{total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><CheckCircle2 size={28} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Yardım Bağlanan</p>
              <p className="text-3xl font-black text-slate-800 leading-none">{approved}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
            <div className="p-4 bg-red-50 text-red-600 rounded-xl"><XCircle size={28} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reddedilen / Ayni</p>
              <p className="text-3xl font-black text-slate-800 leading-none">{rejected}</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">İnceleme Kayıtları</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4 font-bold">Tarih</th>
                  <th className="px-6 py-4 font-bold">Başvuru Sahibi</th>
                  <th className="px-6 py-4 font-bold">TC Kimlik</th>
                  {user.role === 'manager' && <th className="px-6 py-4 font-bold">İnceleyen</th>}
                  <th className="px-6 py-4 font-bold">Puan</th>
                  <th className="px-6 py-4 font-bold">Sonuç</th>
                  <th className="px-6 py-4 font-bold text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan={user.role === 'manager' ? 7 : 6} className="px-6 py-12 text-center text-slate-500 bg-slate-50/30 font-medium">
                      Kayıtlı inceleme bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  assessments.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.applicantName || 'Belirtilmedi'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium tracking-wide">{item.applicantTc || '-'}</td>
                      {user.role === 'manager' && (
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.personnelName}</td>
                      )}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${item.result.isRejected ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.result.totalScore} Puan
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        {item.result.isRejected ? (
                          <span className="text-red-600">REDDEDİLDİ</span>
                        ) : (
                          <span className={item.result.totalScore > 30 ? 'text-blue-600' : 'text-slate-600'}>
                            {item.result.assistance.text.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/assessment/${item.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center justify-end gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex">
                          <FileText size={16} /> İncele
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

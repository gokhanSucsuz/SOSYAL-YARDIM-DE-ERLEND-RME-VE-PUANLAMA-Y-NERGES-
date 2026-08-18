"use client";

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { ManagerNav } from '@/components/manager-nav';
import { ArrowLeft, ShieldAlert, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, totalPages: 1, total: 0 });

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    setUser(currentUser);

    if (currentUser.role !== 'superadmin') {
      setLoading(false);
      return;
    }

    fetchLogs(1);
  }, [router]);

  async function fetchLogs(page: number) {
    try {
      setLoading(true);
      const res = await fetch(`/api/audit-logs?page=${page}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
          total: data.total
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500 font-medium">Denetim Kayıtları yükleniyor...</div>
      </div>
    );
  }

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Yetkisiz Erişim Engellendi</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Bu alana yalnızca Süper Admin erişebilir.
          </p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md">
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <AppHeader subtitle="🔍 Sistem Denetim Kayıtları (Audit Logs)" />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 space-y-6">
        <ManagerNav />
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <h2 className="text-sm font-bold">İşlem Geçmişi (Toplam: {pagination.total})</h2>
            </div>
            <div className="text-xs font-medium text-slate-400">Sayfa {pagination.page} / {pagination.totalPages}</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Tarih</th>
                  <th className="px-6 py-3">İşlem</th>
                  <th className="px-6 py-3">Aktör</th>
                  <th className="px-6 py-3">Kaynak / ID</th>
                  <th className="px-6 py-3">IP Adresi</th>
                  <th className="px-6 py-3">Detaylar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{log.action}</td>
                    <td className="px-6 py-4">
                      <div>{log.actorName}</div>
                      <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">{log.targetResource}</span>
                      {log.targetId && <div className="text-[10px] mt-1 text-slate-400">{log.targetId}</div>}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">{log.ipAddress || '-'}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-500">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex justify-center gap-2 bg-slate-50">
              <button 
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium disabled:opacity-50"
              >
                Önceki
              </button>
              <button 
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

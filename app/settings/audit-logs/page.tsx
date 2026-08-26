"use client";

export const dynamic = "force-dynamic";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SidebarLayout } from "@/components/sidebar";
import {
  ArrowLeft, ShieldAlert, Activity, Search, RefreshCw,
  CheckCircle2, XCircle, AlertTriangle, Edit3, LogIn, Layers,
  ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import Link from "next/link";

const ACTION_STYLES: Record<string, { label: string; color: string }> = {
  LOGIN_SUCCESS:         { label: "Basarili Giris",      color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  LOGIN_FAILED_PASSWORD: { label: "Hatali Giris",        color: "bg-red-100 text-red-800 border-red-200" },
  LOGIN_RATE_LIMITED:    { label: "Hesap Kilitlendi",    color: "bg-red-200 text-red-900 border-red-300" },
  CREATE_ASSESSMENT:     { label: "Kayit Olusturuldu",   color: "bg-blue-100 text-blue-800 border-blue-200" },
  UPDATE_ASSESSMENT:     { label: "Kayit Guncellendi",   color: "bg-amber-100 text-amber-800 border-amber-200" },
  BATCH_UPDATE_STATUS:   { label: "Toplu Guncelleme",    color: "bg-purple-100 text-purple-800 border-purple-200" },
  DELETE_ASSESSMENT:     { label: "Kayit Silindi",       color: "bg-rose-100 text-rose-800 border-rose-200" },
};

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  manager:    "Mudur Yetkilisi",
  personnel:  "Personel",
};

function maskIp(ip: string | null | undefined): string {
  if (!ip || ip === "unknown") return "—";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return ip.substring(0, 6) + "…";
}

function formatDetails(details: any): string {
  if (!details) return "—";
  if (typeof details === "string") return details;
  try {
    const parts = [];
    if (details.applicantName) parts.push(`Aday: ${details.applicantName}`);
    if (details.newStatus) parts.push(`Durum: ${details.newStatus}`);
    if (details.finalScore !== undefined) parts.push(`Puan: ${details.finalScore}`);
    if (details.updatedCount) parts.push(`${details.updatedCount} kayıt güncellendi`);
    
    if (parts.length > 0) return parts.join(" | ");
    
    return Object.entries(details)
      .filter(([k]) => k !== "_id" && k !== "password")
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  } catch(e) {
    return "Detay görüntülenemiyor";
  }
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, totalPages: 1, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) { router.push("/login"); return; }
    const currentUser = JSON.parse(userStr);
    setUser(currentUser);
    if (currentUser.role !== "superadmin") { setLoading(false); return; }
    fetchLogs(1);
  }, [router]);

  async function fetchLogs(page: number) {
    try {
      setLoading(true);
      const res = await fetch(`/api/audit-logs?page=${page}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data);
        setPagination({ page: data.page, limit: data.limit, totalPages: data.totalPages, total: data.total });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }


  const filtered = logs.filter(log => {
    const matchAction = filterAction ? log.action === filterAction : true;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchAction;
    return matchAction && (
      (log.actorName || "").toLowerCase().includes(q) ||
      (log.action || "").toLowerCase().includes(q) ||
      (log.ipAddress || "").toLowerCase().includes(q) ||
      (log.targetId || "").toLowerCase().includes(q)
    );
  });

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
          <RefreshCw className="animate-spin text-red-600" size={20} />
          <span>Denetim Kayitlari yukleniyor...</span>
        </div>
      </div>
    );
  }

  if (user?.role !== "superadmin") {
    return (
      <SidebarLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full min-h-[80vh]">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 border border-red-200 shadow-xl max-w-md w-full space-y-5">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Yetkisiz Erisim Engellendi</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Bu alana yalnizca <strong>Super Admin</strong> erisebilir.
          </p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md">
            <ArrowLeft size={16} />Ana Sayfaya Don
          </Link>
        </div>
      </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-5 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Activity size={20} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-wide">Sistem Denetim Kayit Defteri</h2>
                <p className="text-xs text-slate-400 font-medium">
                  Toplam <strong className="text-white">{pagination.total}</strong> islem kaydi &mdash; Sayfa {pagination.page}/{pagination.totalPages}
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchLogs(pagination.page)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all border border-white/20 shadow-sm"
              aria-label="Kayitlari Yenile"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Yenile</span>
            </button>
          </div>
          {/* Filters */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Kullanici, islem, IP veya kayit ID ara..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white dark:bg-slate-800"
                aria-label="Denetim kayitlarinda ara"
              />
            </div>
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={filterAction}
                onChange={e => setFilterAction(e.target.value)}
                className="pl-8 pr-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 appearance-none"
                aria-label="Islem turune gore filtrele"
              >
                <option value="">Tum Islemler</option>
                {Object.entries(ACTION_STYLES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            {(searchQuery || filterAction) && (
              <button onClick={() => { setSearchQuery(""); setFilterAction(""); }} className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors">
                Temizle
              </button>
            )}
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 font-medium">{filtered.length} kayit</span>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" role="grid" aria-label="Sistem denetim kayitlari">
              <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="px-5 py-3">Tarih / Saat</th>
                  <th scope="col" className="px-5 py-3">Islem Turu</th>
                  <th scope="col" className="px-5 py-3">Aktor</th>
                  <th scope="col" className="px-5 py-3">Hedef</th>
                  <th scope="col" className="px-5 py-3">IP Adresi</th>
                  <th scope="col" className="px-5 py-3">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium text-sm">
                      <Activity size={28} className="mx-auto mb-3 text-slate-300" />
                      Eslesen kayit bulunamadi.
                    </td>
                  </tr>
                ) : filtered.map((log, idx) => {
                  const style = ACTION_STYLES[log.action];
                  return (
                    <tr key={log._id} className={`hover:bg-blue-50/20 transition-colors ${idx % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/40"}`}>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="font-semibold">{new Date(log.timestamp).toLocaleDateString("tr-TR")}</div>
                        <div className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString("tr-TR")}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${style ? style.color : "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`}>
                          {style ? style.label : log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">{log.actorName || "—"}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ROLE_LABELS[log.actorRole] || log.actorRole}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">{log.targetResource}</span>
                        {log.targetId && (
                          <div className="text-[10px] mt-1 text-slate-400 font-mono truncate max-w-[120px]" title={log.targetId}>
                            {log.targetId.substring(0, 16)}{log.targetId.length > 16 ? "…" : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">{maskIp(log.ipAddress)}</td>
                      <td className="px-5 py-3.5 max-w-[180px]">
                        {log.details && Object.keys(log.details).length > 0 ? (
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded truncate block" title={JSON.stringify(log.details)}>
                            {formatDetails(log.details).substring(0, 60)}{formatDetails(log.details).length > 60 ? "…" : ""}
                          </span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} kayit
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => fetchLogs(pagination.page - 1)} disabled={pagination.page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 dark:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Onceki Sayfa">
                  <ChevronLeft size={13} /> Onceki
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button onClick={() => fetchLogs(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 dark:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Sonraki Sayfa">
                  Sonraki <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

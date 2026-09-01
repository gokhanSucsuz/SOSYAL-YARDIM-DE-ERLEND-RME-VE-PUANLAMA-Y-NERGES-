"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Users, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ManagerNav() {
  const pathname = usePathname();
  const [isManager, setIsManager] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'manager' || user.role === 'superadmin') {
          setIsManager(true);
        }
        if (user.role === 'superadmin') {
          setIsSuperadmin(true);
        }
      } catch {}
    }
  }, []);

  if (!isManager) return null;

  return (
    <div className="space-y-3 mb-5 w-full no-print">
      <div className="bg-slate-200 dark:bg-slate-700/80 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-2 border border-slate-300 dark:border-slate-600/70 shadow-xs">
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
            pathname === '/' 
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-slate-950/5' 
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/70 hover:bg-white dark:bg-slate-800'
          }`}
        >
          <Home size={18} className="text-blue-700" />
          <span>İnceleme Listesi & Hane İşlemleri</span>
        </Link>

        <Link
          href="/statistics"
          className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
            pathname.startsWith('/statistics')
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-slate-950/5' 
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/70 hover:bg-white dark:bg-slate-800'
          }`}
        >
          <BarChart3 size={18} className="text-blue-700" />
          <span>Detaylı İstatistik ve Bütçe Raporları</span>
        </Link>

        <Link
          href="/personnel"
          className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
            pathname.startsWith('/personnel')
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-slate-950/5' 
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/70 hover:bg-white dark:bg-slate-800'
          }`}
        >
          <Users size={18} className="text-blue-700" />
          <span>Personel Yönetimi</span>
        </Link>
        
        {isManager && (
          <Link
            href="/settings"
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
              pathname === '/settings'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-slate-950/5' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/70 hover:bg-white dark:bg-slate-800'
            }`}
          >
            <Settings size={18} className="text-blue-700" />
            <span>Sistem Ayarları</span>
          </Link>
        )}

        {isSuperadmin && (
          <Link
            href="/settings/audit-logs"
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
              pathname.startsWith('/settings/audit-logs')
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md ring-1 ring-slate-950/5' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/70 hover:bg-white dark:bg-slate-800'
            }`}
          >
            <Settings size={18} className="text-amber-600" />
            <span>Denetim Kayıtları</span>
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ManagerNav() {
  const pathname = usePathname();
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'manager' || user.role === 'superadmin') {
          setIsManager(true);
        }
      } catch {}
    }
  }, []);

  if (!isManager) return null;

  return (
    <div className="space-y-3 mb-5 w-full no-print">
      <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-2 border border-slate-300/70 shadow-xs">
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
            pathname === '/' 
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-950/5' 
              : 'text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white'
          }`}
        >
          <Home size={18} className="text-blue-600" />
          <span>İnceleme Listesi & Hane İşlemleri</span>
        </Link>

        <Link
          href="/statistics"
          className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
            pathname.startsWith('/statistics')
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-950/5' 
              : 'text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white'
          }`}
        >
          <BarChart3 size={18} className="text-blue-600" />
          <span>Detaylı İstatistik ve Bütçe Raporları</span>
        </Link>

        <Link
          href="/personnel"
          className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
            pathname.startsWith('/personnel')
              ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-950/5' 
              : 'text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white'
          }`}
        >
          <Users size={18} className="text-blue-600" />
          <span>Personel Yönetimi</span>
        </Link>
      </div>
    </div>
  );
}

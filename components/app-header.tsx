'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Menu, ChevronDown, BookOpen, Presentation, Settings, Users, 
  BarChart3, Home, Eye, EyeOff
} from 'lucide-react';
import { LogoImage } from '@/components/logo-image';

interface AppHeaderProps {
  /** If provided, a "Puan/Karar Göster/Gizle" toggle button will appear for personnel */
  showScores?: boolean;
  onToggleScores?: () => void;
  /** Extra action buttons to render on the right side (e.g. Save, Excel, PDF) */
  actions?: React.ReactNode;
  /** Page subtitle / breadcrumb shown below the main title */
  subtitle?: string;
}

export function AppHeader({ showScores, onToggleScores, actions, subtitle }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  if (!user) return null;

  const isManager = user.role === 'manager';

  return (
    <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 z-20 no-print shadow-lg border-b border-red-900/60 relative">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <LogoImage
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-md border-2 border-white/30 object-cover shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-xs sm:text-base font-extrabold leading-tight tracking-wide">
            T.C. EDİRNE SYDV SOSYAL YARDIM DEĞERLENDİRME SİSTEMİ
          </h1>
          <p className="text-[10px] sm:text-xs text-red-200 font-semibold tracking-widest uppercase">
            {subtitle
              ? subtitle
              : isManager
              ? '🔐 Müdür Yetkilisi Yönetim Paneli'
              : '👤 Personel İnceleme Paneli'}
          </p>
        </div>
      </div>

      {/* Right: Actions + Menu + Logout */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {/* User info */}
        <div className="hidden md:block text-right border-r border-red-600/50 pr-3 mr-1">
          <p className="text-[10px] text-red-200 font-medium">
            {isManager ? 'Müdür Yetkilisi' : 'İnceleyen Personel'}
          </p>
          <p className="text-sm font-bold truncate max-w-[140px]">{user.name}</p>
        </div>

        {/* Extra action buttons */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Score toggle for personnel */}
        {!isManager && onToggleScores && (
          <button
            onClick={onToggleScores}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border focus:outline-none ${
              showScores
                ? 'bg-blue-600/30 border-blue-400/50 text-blue-100 hover:bg-blue-600/50'
                : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
            }`}
            title={showScores ? 'Puan ve Kararları Gizle' : 'Puan ve Kararları Göster'}
          >
            {showScores ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">
              {showScores ? 'Puan ve Kararları Gizle' : 'Puan ve Kararları Göster'}
            </span>
          </button>
        )}

        {/* Nav menu */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setIsNavMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            title="Gezinti Menüsü"
          >
            <Menu size={16} className="shrink-0" />
            <span className="hidden sm:inline">Menü</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${isNavMenuOpen ? 'rotate-180' : ''}`}
            />
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
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Sistem Menüsü
                  </p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5 md:hidden">{user.name}</p>
                </div>

                <Link
                  href="/"
                  onClick={() => setIsNavMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border-b border-slate-100 group"
                >
                  <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors shrink-0">
                    <Home size={15} />
                  </div>
                  <span>Ana Sayfa</span>
                </Link>

                {isManager && (
                  <>
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
                    <Link
                      href="/personnel"
                      onClick={() => setIsNavMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors border-b border-slate-100 group"
                    >
                      <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Users size={15} />
                      </div>
                      <span>Personel Yönetimi</span>
                    </Link>
                    <Link
                      href="/statistics"
                      onClick={() => setIsNavMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-colors border-b border-slate-100 group"
                    >
                      <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <BarChart3 size={15} />
                      </div>
                      <span>İstatistik Raporları</span>
                    </Link>
                  </>
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
  );
}

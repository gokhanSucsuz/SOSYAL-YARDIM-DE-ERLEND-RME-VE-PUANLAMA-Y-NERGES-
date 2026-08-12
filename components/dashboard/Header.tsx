"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, Settings, BookOpen, Presentation, LogOut } from 'lucide-react';
import { LogoImage } from '@/components/logo-image';

interface HeaderProps {
  user: { name: string; role: string } | null;
  handleLogout: () => void;
}

export function Header({ user, handleLogout }: HeaderProps) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-primary-900 text-white px-4 sm:px-6 py-4 flex justify-between items-center shrink-0 z-20 no-print shadow-md border-b border-primary-950 relative">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4 min-w-0">
        <LogoImage 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-sm border border-white/20 object-cover shrink-0" 
        />
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold leading-tight tracking-wide text-white">
            T.C. SOSYAL YARDIM DEĞERLENDİRME SİSTEMİ
          </h1>
          <p className="text-xs sm:text-sm text-primary-200 font-medium tracking-wide uppercase mt-0.5">
            {user.role === 'manager' ? 'Müdür Yetkilisi Yönetim Paneli' : 'Personel İnceleme Paneli'}
          </p>
        </div>
      </div>

      {/* Right: User Info + Nav Dropdown + Logout */}
      <div className="flex items-center gap-3 shrink-0 ml-3">
        {/* User Info - only visible on desktop */}
        <div className="hidden md:block text-right border-r border-primary-700 pr-4 mr-1">
          <p className="text-xs text-primary-300 font-medium">{user.role === 'manager' ? 'Müdür Yetkilisi' : 'İnceleyen Personel'}</p>
          <p className="text-sm font-semibold truncate max-w-[160px] text-white">{user.name}</p>
        </div>

        {/* Navigation Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
            className="flex items-center gap-1.5 bg-primary-800 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="Sistem Menüsü"
          >
            <Menu size={18} className="shrink-0" />
            <span className="hidden sm:inline">Menü</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isNavMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Backdrop */}
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
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sistem Menüsü</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1 md:hidden">{user.name}</p>
                </div>

                {user.role === 'manager' && (
                  <Link
                    href="/settings"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100 group"
                  >
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-md group-hover:bg-primary-600 group-hover:text-white transition-colors shrink-0">
                      <Settings size={16} />
                    </div>
                    <span>Sistem Ayarları</span>
                  </Link>
                )}

                <Link
                  href="/guide"
                  onClick={() => setIsNavMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100 group"
                >
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-md group-hover:bg-primary-600 group-hover:text-white transition-colors shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <span>Kılavuz & Metodoloji</span>
                </Link>

                <Link
                  href="/presentation"
                  onClick={() => setIsNavMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                >
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-md group-hover:bg-primary-600 group-hover:text-white transition-colors shrink-0">
                    <Presentation size={16} />
                  </div>
                  <span>Proje Sunumu (PDF)</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 text-primary-200 hover:text-white hover:bg-primary-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ml-1"
          title="Sistemden Çıkış Yap"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

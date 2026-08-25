'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BarChart3, Users, Settings, BookOpen, Presentation,
  LogOut, ChevronLeft, ChevronRight, Menu, X, Shield,
  FileText, ClipboardList, Sun, Moon
} from 'lucide-react';
import { LogoImage } from '@/components/logo-image';
import { googleLogout } from '@react-oauth/google';
import { useTheme } from 'next-themes';

interface SidebarProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
  badge?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Gösterge Paneli', icon: Home, roles: ['manager', 'superadmin', 'personnel'], section: 'Ana Menü' },
  { href: '/statistics', label: 'İstatistik Raporları', icon: BarChart3, roles: ['manager', 'superadmin'], section: 'Yönetim' },
  { href: '/personnel', label: 'Personel Yönetimi', icon: Users, roles: ['manager', 'superadmin'], section: 'Yönetim' },
  { href: '/settings', label: 'Sistem Ayarları', icon: Settings, roles: ['manager', 'superadmin'], section: 'Yönetim' },
  { href: '/settings/audit-logs', label: 'Denetim Kayıtları', icon: Shield, roles: ['superadmin'], section: 'Yönetim' },
  { href: '/guide', label: 'Kılavuz & Metodoloji', icon: BookOpen, roles: ['manager', 'superadmin', 'personnel'], section: 'Bilgi' },
  { href: '/presentation', label: 'Proje Sunumu', icon: Presentation, roles: ['manager', 'superadmin', 'personnel'], section: 'Bilgi' },
];

export function SidebarLayout({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch {}
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      googleLogout();
    } catch (e) {}
    localStorage.removeItem('currentUser');
    router.push('/gate');
  };

  if (!user) {
    return <>{children}</>;
  }

  const userRole = user.role || 'personnel';
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));
  const isManager = userRole === 'manager' || userRole === 'superadmin';

  // Group items by section
  const sections = filteredNavItems.reduce((acc, item) => {
    const section = item.section || 'Diğer';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const isActive = (href: string) => {
    return pathname === href;
  };

  const renderSidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.06] ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
        <LogoImage
          className="w-10 h-10 rounded-xl shadow-lg border border-white/10 object-cover shrink-0"
        />
        {(!isCollapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <h1 className="text-[11px] font-extrabold text-white leading-tight tracking-wide truncate">
              EDİRNE SYDV
            </h1>
            <p className="text-[9px] text-teal-400 font-semibold tracking-widest uppercase truncate">
              Sosyal Yardım Sistemi
            </p>
          </motion.div>
        )}
      </div>

      {/* User Profile Card */}
      <div className={`mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/5 border border-white/10 ${isCollapsed && !isMobile ? 'mx-2 p-2 flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed && !isMobile ? 'flex-col' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-w-0 flex-1"
            >
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {isManager ? (userRole === 'superadmin' ? 'Süper Yönetici' : 'Müdür Yetkilisi') : 'Personel'}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName}>
            {(!isCollapsed || isMobile) && (
              <p className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] px-3 pt-4 pb-1.5">
                {sectionName}
              </p>
            )}
            {isCollapsed && !isMobile && <div className="h-3" />}
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                    isCollapsed && !isMobile ? 'justify-center px-2' : ''
                  } ${
                    active
                      ? 'bg-teal-500/15 text-teal-400 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white dark:bg-slate-800/[0.06]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-teal-400 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon
                    size={19}
                    className={`shrink-0 transition-colors ${
                      active ? 'text-teal-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  {(!isCollapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: Collapse Toggle + Logout */}
      <div className="border-t border-white/[0.06] p-3 space-y-1">
        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(prev => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
            title={isCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
          >
            {isCollapsed ? (
              <ChevronRight size={19} className="mx-auto" />
            ) : (
              <>
                <ChevronLeft size={19} className="shrink-0" />
                <span>Daralt</span>
              </>
            )}
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 transition-all ${
            isCollapsed && !isMobile ? 'justify-center px-2' : ''
          }`}
          title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
        >
          {theme === 'dark' ? <Sun size={19} className="shrink-0" /> : <Moon size={19} className="shrink-0" />}
          {(!isCollapsed || isMobile) && <span>{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${
            isCollapsed && !isMobile ? 'justify-center px-2' : ''
          }`}
          title="Çıkış Yap"
        >
          <LogOut size={19} className="shrink-0" />
          {(!isCollapsed || isMobile) && <span>Çıkış Yap</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={`sidebar-container hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 gradient-sidebar ${
          isCollapsed ? 'collapsed' : ''
        }`}
      >
        {renderSidebarContent({})}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-overlay fixed inset-0 z-50 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed top-0 left-0 h-screen w-[280px] z-50 md:hidden gradient-sidebar shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white dark:bg-slate-800/10 rounded-xl transition-colors z-10"
              >
                <X size={20} />
              </button>
              {renderSidebarContent({ isMobile: true })}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-[280px]'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-slate-200 dark:border-slate-700/50 no-print">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left: Mobile menu toggle + Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
                title="Menüyü Aç"
              >
                <Menu size={22} />
              </button>
              <div className="hidden sm:block">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {(() => {
                    if (pathname === '/') return 'Gösterge Paneli';
                    if (pathname.startsWith('/statistics')) return 'İstatistik Raporları';
                    if (pathname.startsWith('/personnel')) return 'Personel Yönetimi';
                    if (pathname.startsWith('/settings/audit-logs')) return 'Denetim Kayıtları';
                    if (pathname.startsWith('/settings')) return 'Sistem Ayarları';
                    if (pathname.startsWith('/guide')) return 'Kılavuz & Metodoloji';
                    if (pathname.startsWith('/presentation')) return 'Proje Sunumu';
                    if (pathname.startsWith('/assessment')) return 'İnceleme Detayı';
                    return 'Sosyal Yardım Sistemi';
                  })()}
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  T.C. Edirne Sosyal Yardımlaşma ve Dayanışma Vakfı
                </p>
              </div>
            </div>

            {/* Right: User info (mobile) */}
            <div className="flex items-center gap-3">
              <div className="text-right mr-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-[180px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {isManager ? (userRole === 'superadmin' ? 'Süper Yönetici' : 'Müdür') : 'Personel'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 main-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

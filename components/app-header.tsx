'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

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

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch {}
    }
  }, []);

  if (!user) return null;

  const isManager = user.role === 'manager' || user.role === 'superadmin';

  // The sidebar now handles main navigation and user info.
  // This component serves as a compact page-level action bar when extra controls are needed.
  return (
    <div className="no-print">
      {/* Action bar — only render if there are actions or score toggle */}
      {(actions || (!isManager && onToggleScores)) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
          {subtitle && (
            <div>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">{subtitle}</p>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Score toggle for personnel */}
            {!isManager && onToggleScores && (
              <button
                onClick={onToggleScores}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border focus:outline-none ${
                  showScores
                    ? 'bg-teal-50 border-teal-300 text-teal-700 hover:bg-teal-100'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }`}
                title={showScores ? 'Puan/Karar Gizle' : 'Puan/Karar Göster'}
              >
                {showScores ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="hidden md:inline">
                  {showScores ? 'Gizle' : 'Göster'}
                </span>
              </button>
            )}

            {/* Extra action buttons */}
            {actions && <div className="flex items-center gap-1.5 sm:gap-2">{actions}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

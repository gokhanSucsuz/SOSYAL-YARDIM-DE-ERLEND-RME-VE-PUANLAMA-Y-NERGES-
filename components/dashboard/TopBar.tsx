import { Home, BarChart3, Calendar, CheckCircle2, RotateCcw, Plus, Eye, EyeOff } from 'lucide-react';

interface TopBarProps {
  user: { role: string };
  activeViewTab: 'operations' | 'statistics';
  setActiveViewTab: (tab: 'operations' | 'statistics') => void;
  setNewMeetingModalOpen: (val: boolean) => void;
  openApproveAllModal: () => void;
  pendingCount: number;
  openRevokeAllModal: () => void;
  approvedCount: number;
  setNewAssessmentModalOpen: (val: boolean) => void;
  showScores: boolean;
  setShowScores: (val: boolean) => void;
}

export function TopBar({
  user,
  activeViewTab,
  setActiveViewTab,
  setNewMeetingModalOpen,
  openApproveAllModal,
  pendingCount,
  openRevokeAllModal,
  approvedCount,
  setNewAssessmentModalOpen,
  showScores,
  setShowScores
}: TopBarProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Primary View Segmented Navigation Bar - Only for Managers */}
      {user.role === 'manager' && (
        <div className="bg-white p-2 rounded-xl flex flex-wrap sm:flex-nowrap items-center gap-2 border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveViewTab('operations')}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg font-bold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
              activeViewTab === 'operations'
                ? 'bg-primary-50 text-primary-900 shadow-sm ring-1 ring-primary-500/20'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Home size={18} className={activeViewTab === 'operations' ? 'text-primary-600' : 'text-slate-400'} />
            <span>İnceleme Listesi & Hane İşlemleri</span>
          </button>

          <button
            onClick={() => setActiveViewTab('statistics')}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg font-bold text-xs sm:text-sm transition-all touch-manipulation cursor-pointer ${
              activeViewTab === 'statistics'
                ? 'bg-primary-900 text-white shadow-md ring-1 ring-primary-800'
                : 'text-slate-500 hover:text-slate-800 bg-transparent hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={18} className={activeViewTab === 'statistics' ? 'text-primary-200' : 'text-slate-400'} />
            <span>Detaylı İstatistik ve Bütçe Raporları</span>
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-secondary-900 tracking-tight">
            {activeViewTab === 'statistics' ? 'İstatistik ve Analiz Raporları' : 'Gösterge Paneli'}
          </h2>
          <p className="text-secondary-500 text-sm font-medium mt-1">
            {activeViewTab === 'statistics' 
              ? 'Mali bütçe verileri, hane risk dağılımları ve dönem raporlamaları.' 
              : 'Hane inceleme ziyaretleri, gelişmiş arama/sıralama ve onay süreçleri.'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {user.role === 'manager' && (
            <>
              <button
                onClick={() => setNewMeetingModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-secondary-800 hover:bg-secondary-900 text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation"
                title="Yeni bir toplantı oluştur"
              >
                <Calendar size={18} />
                <span>Yeni Toplantı</span>
              </button>
              
              <button
                onClick={openApproveAllModal}
                disabled={pendingCount === 0}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation"
                title="Onay bekleyen tüm hane kayıtlarını toplu onayla"
              >
                <CheckCircle2 size={18} />
                <span>Tümünü Onayla ({pendingCount})</span>
              </button>

              <button
                onClick={openRevokeAllModal}
                disabled={approvedCount === 0}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation"
                title="Tüm onaylı kayıtların onayını kaldır ve düzenlemeye aç"
              >
                <RotateCcw size={18} />
                <span>Onayları Geri Al ({approvedCount})</span>
              </button>
            </>
          )}

          {/* Show/Hide Scores Button for both (or just personnel, but useful for everyone) */}
          <button
            onClick={() => setShowScores(!showScores)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm touch-manipulation"
            title={showScores ? "Puanları Gizle" : "Puanları Göster"}
          >
            {showScores ? <EyeOff size={18} /> : <Eye size={18} />}
            {showScores ? "Puanları Gizle" : "Puanları Göster"}
          </button>

          {user.role === 'personnel' && (
            <button 
              onClick={() => setNewAssessmentModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm touch-manipulation"
            >
              <Plus size={18} />
              Yeni İnceleme
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

export const dynamic = "force-dynamic";
import { useDialog } from '@/components/DialogProvider';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getSystemSettings, saveSystemSettings, SystemSettings, AssistanceTier, 
  DEFAULT_ASSISTANCE_TIERS, DEFAULT_SETTINGS 
} from '@/lib/db';
import { 
  ShieldCheck, ArrowLeft, Plus, Trash2, Save, RotateCcw, 
  CheckCircle2, AlertTriangle, Settings, Sliders, Info, ShieldAlert, Award
} from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';

export default function SettingsPage() {
  const { showAlert, showConfirm } = useDialog();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    setUser(currentUser);

    // Load current system settings
    const loadedSettings = getSystemSettings();
    setSettings(loadedSettings);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500 font-medium">Sistem ayarları yükleniyor...</div>
      </div>
    );
  }

  // Security Check: Only Managers can access settings
  if (user?.role !== 'manager') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Yetkisiz Erişim Engellendi</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Sistem ve yardım kriter ayarları paneline yalnızca <strong>Müdür</strong> rolüne sahip yöneticiler erişebilir.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddTier = () => {
    const newTier: AssistanceTier = {
      id: `tier-${Date.now()}`,
      minScore: 0,
      maxScore: 30,
      text: 'Yeni Nakdi Yardım Tipi',
      amount: 1000,
      description: 'Yeni Tanımlanan Muhtaçlık Kademesi'
    };
    setSettings(prev => ({
      ...prev,
      assistanceTiers: [...prev.assistanceTiers, newTier]
    }));
  };

  const handleUpdateTier = (id: string, field: keyof AssistanceTier, value: any) => {
    setSettings(prev => ({
      ...prev,
      assistanceTiers: prev.assistanceTiers.map(tier => {
        if (tier.id !== id) return tier;
        return {
          ...tier,
          [field]: field === 'minScore' || field === 'maxScore' || field === 'amount' 
            ? Math.max(0, parseInt(value, 10) || 0) 
            : value
        };
      })
    }));
  };

  const handleDeleteTier = async (id: string) => {
    if (settings.assistanceTiers.length <= 1) {
      await showAlert('Sistemde en az 1 yardım kriter aralığı tanımlı bulunmalıdır.');
      return;
    }
    if (await showConfirm('Bu yardım kriter aralığını silmek istediğinizden emin misiniz?')) {
      setSettings(prev => ({
        ...prev,
        assistanceTiers: prev.assistanceTiers.filter(tier => tier.id !== id)
      }));
    }
  };

  const handleResetDefaults = async () => {
    if (await showConfirm('Tüm yardım kriterlerini ve miktarlarını varsayılan fabrika ayarlarına sıfırlamak istediğinizden emin misiniz?')) {
      setSettings(DEFAULT_SETTINGS);
      saveSystemSettings(DEFAULT_SETTINGS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleSave = () => {
    setErrorMessage(null);
    
    // Validate overlap or invalid min/max
    for (const tier of settings.assistanceTiers) {
      if (tier.minScore > tier.maxScore) {
        setErrorMessage(`"${tier.text}" için Minimum Puan (${tier.minScore}), Maksimum Puandan (${tier.maxScore}) büyük olamaz.`);
        return;
      }
      if (!tier.text || tier.text.trim() === '') {
        setErrorMessage('Tüm kademeler için geçerli bir yardım açıklama metni girilmelidir.');
        return;
      }
    }

    saveSystemSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <AppHeader
        subtitle="⚙️ Sistem ve Yardım Kriter Ayarları"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors border border-white/20"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
            >
              <Save size={14} />
              <span>Kaydet</span>
            </button>
          </div>
        }
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-8 space-y-6">
        
        {/* SUCCESS NOTIFICATION BANNER */}
        {savedSuccess && (
          <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} />
              <div>
                <h3 className="font-bold text-sm">Ayarlar Başarıyla Kaydedildi!</h3>
                <p className="text-xs text-emerald-100">Tanımlanan yeni yardım kriterleri ve miktarları tüm sosyal inceleme hesaplamalarında aktif olarak kullanılacaktır.</p>
              </div>
            </div>
            <button onClick={() => setSavedSuccess(false)} className="text-white hover:text-emerald-200 text-xs font-bold uppercase underline">Kapat</button>
          </div>
        )}

        {/* ERROR MESSAGE BANNER */}
        {errorMessage && (
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} />
              <div>
                <h3 className="font-bold text-sm">Ayar Kayıt Hatası</h3>
                <p className="text-xs text-red-100">{errorMessage}</p>
              </div>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-white hover:text-red-200 text-xs font-bold uppercase underline">Tamam</button>
          </div>
        )}

        {/* INFO CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
              <Sliders className="text-blue-600" size={22} />
              <h2>Sosyal İnceleme Puanı & Yardım Miktarı Kademeleri</h2>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-2xl">
              Aşağıdaki panelden istediğiniz sayıda puan aralığı ve bu aralıklara karşılık gelen nakdi/ayni yardım tutarlarını tanımlayabilirsiniz. Sistem, incelemede hesaplanan toplam puana denk gelen aralığı otomatik seçerek karar ve yardım miktarını belirler.
            </p>
          </div>

          <button
            onClick={handleAddTier}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus size={18} />
            <span>Yeni Kriter Aralığı Ekle</span>
          </button>
        </div>

        {/* TIERS LIST / TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
          <div className="bg-slate-900 text-white px-6 py-3.5 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              Aktif Yardım Kriter Aralıkları ({settings.assistanceTiers.length} Kademe)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Yüksek puandan alçak puana doğru kontrol edilir</span>
          </div>

          <div className="divide-y divide-slate-200">
            {settings.assistanceTiers.map((tier, index) => (
              <div key={tier.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center border border-blue-200">
                    #{index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1">
                  
                  {/* Min Score */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min Puan</label>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={tier.minScore}
                      onChange={(e) => handleUpdateTier(tier.id, 'minScore', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-black bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Max Score */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Maks Puan</label>
                    <input
                      type="number"
                      min={0}
                      max={200}
                      value={tier.maxScore}
                      onChange={(e) => handleUpdateTier(tier.id, 'maxScore', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-black bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Text / Title */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Yardım Açıklama Metni</label>
                    <input
                      type="text"
                      value={tier.text}
                      onChange={(e) => handleUpdateTier(tier.id, 'text', e.target.value)}
                      placeholder="Örn: 10.000 TL Nakdi Yardım"
                      className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Amount TL */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Miktar (TL)</label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={tier.amount}
                      onChange={(e) => handleUpdateTier(tier.id, 'amount', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-black bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-emerald-700"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kademe Açıklaması</label>
                    <input
                      type="text"
                      value={tier.description || ''}
                      onChange={(e) => handleUpdateTier(tier.id, 'description', e.target.value)}
                      placeholder="Örn: 1. Derece"
                      className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                </div>

                {/* Delete Tier Button */}
                <div className="flex justify-end sm:justify-center shrink-0">
                  <button
                    onClick={() => handleDeleteTier(tier.id)}
                    className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg border border-red-200 transition-colors"
                    title="Bu Kriter Aralığını Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: FALLBACK / REJECTION TEXT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Taban Kriter Kararı (Minimum Puan Altında Kalan Durumlar)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Toplanan toplam puan hiçbir aktif yardım kademesine ulaşmadığında veya yetersiz kaldığında sistemde görüntülenecek resmi karar metni.
            </p>
          </div>

          <div className="max-w-xl">
            <label className="block text-xs font-bold text-slate-700 mb-1">Taban Yardım Karar Metni</label>
            <input
              type="text"
              value={settings.rejectionText || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, rejectionText: e.target.value }))}
              placeholder="Örn: Yardım uygun görülmez (veya Ayni)"
              className="w-full px-4 py-2.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs"
          >
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
          >
            <Save size={18} />
            <span>Ayarları Kaydet ve Uygula</span>
          </button>
        </div>

      </main>
    </div>
  );
}

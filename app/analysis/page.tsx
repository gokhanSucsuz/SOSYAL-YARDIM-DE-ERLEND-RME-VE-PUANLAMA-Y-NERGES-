"use client";

export const dynamic = "force-dynamic";

import React from 'react';
import { SidebarLayout } from '@/components/sidebar';
import { 
  Building2, 
  Settings, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Smartphone,
  Cpu,
  Database
} from 'lucide-react';

export default function AnalysisPage() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="font-black text-lg text-slate-900 dark:text-slate-100">📋 Sistem ve Algoritma Analizi</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Kurumsal Mimari ve Teknik Altyapı Raporu</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-10 space-y-10">
          
          {/* Executive Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-0 opacity-70 transform translate-x-20 -translate-y-20"></div>
            
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                Yönetici Özeti (Executive Summary)
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                Sosyal Yardımlaşma ve Dayanışma Vakfı (SYDV) Karar Destek Sistemi, vatandaşların nakdi ve ayni yardım taleplerini değerlendirmek için geliştirilmiş <strong>PWA (Progressive Web App)</strong> tabanlı, çevrimdışı (offline-first) çalışabilen modern bir web uygulamasıdır.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                Uygulamanın temel amacı, sosyal inceleme görevlilerinin sahada topladığı verileri <strong className="text-indigo-600 dark:text-indigo-400">100 Puanlık matematiksel bir algoritmaya</strong> tabi tutarak insan inisiyatifinden ve kayırmacılıktan uzak, tamamen şeffaf, ölçülebilir ve adil bir muhtaçlık derecelendirmesi yapmaktır.
              </p>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Cpu className="text-blue-500" size={24} /> Teknik Mimari ve Bileşenler
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">
                  <Settings size={18} className="text-blue-500" /> Kullanılan Teknolojiler
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Altyapı (Framework):</strong> Next.js 14 (App Router)</li>
                  <li><strong>Programlama Dili:</strong> TypeScript (Tip güvenliği)</li>
                  <li><strong>Arayüz (UI):</strong> Tailwind CSS & Framer Motion</li>
                  <li><strong>Raporlama:</strong> ExcelJS (.xlsx) & Tarayıcı Print API (PDF)</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">
                  <Database size={18} className="text-blue-500" /> Mimari Akış ve Kararlar
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Offline-First Yaklaşım:</strong> Köy ve kırsal alanlarda internet koptuğunda sistem <em>IndexedDB</em> ile doğrudan tarayıcı belleğine kayıt yapar. İnternet geldiğinde sunucuya aktarılır.</li>
                  <li><strong>Anlık Motor:</strong> Form kaydedildiği an <code>scoring.ts</code> devreye girip 100 üzerinden muhtaçlık derecesini hesaplar.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Algorithm Breakdown */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Layers className="text-indigo-500" size={24} /> 100 Puanlık Değerlendirme Algoritması Analizi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sistemin merkezindeki <code>lib/scoring.ts</code> dosyası, Dünya Bankası ve OECD literatürüne göre ağırlıklandırılmış 6 modülden (Maks 100 Puan) oluşur:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 font-bold text-slate-800 dark:text-slate-200">Modül Kodu</th>
                    <th className="p-3 font-bold text-slate-800 dark:text-slate-200">Açıklama</th>
                    <th className="p-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Maks Puan</th>
                    <th className="p-3 font-bold text-slate-800 dark:text-slate-200">Literatür Dayanağı</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300 font-medium divide-y divide-slate-100 dark:divide-slate-700/50">
                  <tr>
                    <td className="p-3"><strong>A</strong></td>
                    <td className="p-3">Ekonomik Durum (Gelir, SGK)</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">25</td>
                    <td className="p-3 text-xs italic">Means Testing (Gelir Hedeflemesi)</td>
                  </tr>
                  <tr>
                    <td className="p-3"><strong>B</strong></td>
                    <td className="p-3">Dezavantajlı Bireyler (Engelli, Hasta)</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">25</td>
                    <td className="p-3 text-xs italic">BM Çoklu Kırılganlık İlkesi</td>
                  </tr>
                  <tr>
                    <td className="p-3"><strong>C</strong></td>
                    <td className="p-3">Sosyal Kırılganlık (Şiddet, Nüfus)</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">15</td>
                    <td className="p-3 text-xs italic">OECD Modifiye Eşdeğerlik Ölçeği</td>
                  </tr>
                  <tr>
                    <td className="p-3"><strong>D</strong></td>
                    <td className="p-3">Eğitim ve Çocuk (Kademeli)</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">15</td>
                    <td className="p-3 text-xs italic">Şartlı Eğitim Yardımı Prensipleri</td>
                  </tr>
                  <tr>
                    <td className="p-3"><strong>E</strong></td>
                    <td className="p-3">Barınma ve Eşya (Evsiz, Afetzede)</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">10</td>
                    <td className="p-3 text-xs italic">UNDP Barınma Endeksi</td>
                  </tr>
                  <tr>
                    <td className="p-3"><strong>F</strong></td>
                    <td className="p-3">Personel Kanaati</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">10</td>
                    <td className="p-3 text-xs italic">Professional Judgment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Security & Penalties */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/50 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-red-900 dark:text-red-400 flex items-center gap-2 border-b border-red-200 dark:border-red-900/50 pb-2">
              <AlertTriangle className="text-red-600" size={20} /> Güvenlik Filtreleri ve Ceza Mekanizması
            </h3>
            <p className="text-sm text-red-950 dark:text-red-200 leading-relaxed font-medium">
              Bir hanenin puanı 90 bile olsa, sistem adaletsizliği önlemek için aşağıdaki durumlarda &quot;Varlık Testi (Asset Test)&quot; cezaları uygular:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-red-900 dark:text-red-300 font-semibold">
              <li className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-red-200 dark:border-red-900/50">Araç Kaydı: <strong className="text-red-700 dark:text-red-400 ml-auto">-15 Puan</strong></li>
              <li className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-red-200 dark:border-red-900/50">Birden Fazla Tapu: <strong className="text-red-700 dark:text-red-400 ml-auto">-20 Puan</strong></li>
              <li className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-red-200 dark:border-red-900/50">Aktif SGK Kaydı: <strong className="text-red-700 dark:text-red-400 ml-auto">-5 Puan</strong></li>
              <li className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2.5 rounded-lg border border-red-200 dark:border-red-900/50">Mükerrer Yardım: <strong className="text-red-700 dark:text-red-400 ml-auto">-5 Puan (Kişi Başı)</strong></li>
              <li className="flex items-center gap-2 bg-red-100 dark:bg-red-900/50 p-2.5 rounded-lg border border-red-300 dark:border-red-800 sm:col-span-2">
                Gerçeğe Aykırı Beyan (Yalan Gelir Tespiti): <strong className="text-red-800 dark:text-red-300 ml-auto">Doğrudan RED (0 Puan)</strong>
              </li>
            </ul>
          </div>

          {/* Data Privacy & Security */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <ShieldCheck className="text-emerald-500" size={24} /> KVKK ve Veri Güvenliği
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                  <Lock size={16} className="text-emerald-500" /> Şifreleme (Encryption)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Tüm kişisel veriler (T.C., İsim, Adres) veritabanında AES-256 standardında şifrelenmiş (encrypted) olarak saklanır. İzinsiz erişim durumunda okunamayacak haldedir.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                  <Smartphone size={16} className="text-emerald-500" /> Erişim Güvenliği
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Yönetici hesapları için 2 Aşamalı Doğrulama (2FA) desteği sunulur. Oturumlar AES-GCM ile şifrelenen JWE tokenları ile XSS/CSRF saldırılarına karşı korunur.</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 text-white">
            <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-700 pb-3">
              <TrendingUp className="text-emerald-500" size={24} />
              Kurumsal Operasyonel Faydalar
            </h3>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block text-emerald-400 mb-1">Kanıta Dayalı Karar Alma:</strong>
                  <span className="text-sm text-slate-300">Toplantılarda kararlar tahmine dayalı değil, uygulamanın ürettiği somut ve detaylı 100 puanlık rapora dayalı verilir.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block text-emerald-400 mb-1">Denetime Hazır Altyapı:</strong>
                  <span className="text-sm text-slate-300">Müfettiş denetimlerinde, her vatandaşın neden o miktarda yardım aldığı saniyesinde loglardan PDF olarak belgelenebilir.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block text-emerald-400 mb-1">Bütçe Disiplini:</strong>
                  <span className="text-sm text-slate-300">Limit aşıldığında sistem müdürü anında uyarır, açık bütçe veya bütçesiz harcama yapılması engellenir.</span>
                </div>
              </li>
            </ul>
          </div>

        </main>
      </div>
    </SidebarLayout>
  );
}

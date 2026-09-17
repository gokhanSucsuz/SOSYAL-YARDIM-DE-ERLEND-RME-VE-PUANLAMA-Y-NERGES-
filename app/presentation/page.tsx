"use client";

export const dynamic = "force-dynamic";

import React from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/sidebar';
import { 
  Building2, 
  Printer, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Lock,
  Sparkles,
  PieChart
} from 'lucide-react';

export default function PresentationPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col print:bg-white dark:bg-slate-800 print:p-0">
        <style jsx global>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm 15mm 12mm 15mm;
            }
            body {
              background-color: #ffffff !important;
              color: #0f172a !important;
              font-size: 11pt !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print, .sidebar-container, .sidebar-overlay {
              display: none !important;
            }
            .print-break-before {
              page-break-before: always !important;
              break-before: page !important;
            }
            .print-break-inside-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .print-shadow-none {
              box-shadow: none !important;
              border: 1px solid #cbd5e1 !important;
            }
          }
        `}</style>

        {/* Screen Top Navigation / Bar */}
        <header className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 no-print sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="font-black text-lg text-slate-900 dark:text-slate-100">📊 SYD-NDS Proje Tanıtım ve Yönetim Sunumu</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/guide"
              className="bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileText size={15} className="text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Puan Kılavuzu</span>
            </Link>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Printer size={16} />
              <span>PDF İNDİR / YAZDIR</span>
            </button>
          </div>
        </header>

        {/* Main Presentation Container */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 lg:p-10 space-y-10 print:p-0 print:max-w-none print:space-y-8">
          
          {/* COVER SLIDE */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden print-shadow-none print:p-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-full blur-3xl -z-0 opacity-80 transform translate-x-20 -translate-y-20 no-print"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 pb-4">
                <div className="flex items-center gap-2 text-red-900 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
                  <Building2 size={15} className="text-red-700" />
                  T.C. EDİRNE SYDV
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Doküman No: SYD-NDS-2026-SUNUM
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                  Sosyal Yardım Değerlendirme ve Puanlama Sistemi
                </h1>
                <p className="text-lg font-extrabold text-red-700 leading-snug">
                  Şeffaf, Adil ve Bilimsel Karar Destek Yazılımı
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Sınırlı devlet bütçesi ile yüzlerce başvuru arasında adaletli dağıtım yapmak en büyük zorluktur. <strong>Kimin daha çok ihtiyacı var?</strong> İnsan hissiyatından arındırılmış, <strong>Dünya Bankası ve OECD standartlarına uygun matematiksel bir puanlama formülü</strong> ile ölçülebilir karar verme dönemi başlıyor.
              </p>
            </div>
          </section>

          {/* SLIDE 2 */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4">
              ⚙️ Sistem Nasıl Çalışıyor?
            </h2>
            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex gap-3 items-start">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                <span>Görevli personel, ailenin evine gider ve mobil cihazından detaylı bir anket doldurur (Çevrimdışı çalışabilir).</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                <span>Sistem arka planda bu verileri analiz eder ve anında <strong>100 üzerinden bir &quot;Muhtaçlık Puanı&quot;</strong> üretir.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                <span>Puan ne kadar yüksekse, aile o kadar acil yardıma muhtaçtır.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
                <span>Sistem aileyi sınıflandırır (Örn: 1. Derece Ağır Muhtaç) ve bütçeye göre sistem otomatik yardım tutarı önerir.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">5</span>
                <span>Vakıf Müdürü sistemi tek ekranda inceler, bütçe aşımını görür ve onaylar.</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 3 */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4">
              🧮 100 Puanlık Algoritmanın Bilimsel Temeli
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sistem 6 ana kriter üzerinden (Maks 100 Puan) ve Ceza Puanları ile değerlendirme yapar:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">1 & 2. Ekonomi ve Dezavantaj</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 space-y-1">
                  <li><strong>A. Ekonomik Durum (25 Pn):</strong> Gelir, SGK yokluğu.</li>
                  <li><strong>B. Dezavantajlı Bireyler (25 Pn):</strong> Ağır engelli (+12), kanser/bakım (+8), yalnız yaşlı (+6).</li>
                </ul>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">3 & 4. Sosyal Yapı ve Eğitim</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 space-y-1">
                  <li><strong>C. Sosyal Kırılganlık (15 Pn):</strong> Şiddet mağduru (+5), kadın hane reisi (+4), kalabalık nüfus.</li>
                  <li><strong>D. Eğitim ve Çocuk (15 Pn):</strong> Lise (+3), Üniversite (+4).</li>
                </ul>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 sm:col-span-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">5 & 6. Barınma ve Personel Kanaati</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 space-y-1">
                  <li><strong>E. Barınma ve Eşya (10 Pn):</strong> Evsiz/Afetzede (+8), temel eşya yokluğu.</li>
                  <li><strong>F. Personel Kanaati (10 Pn):</strong> Aciliyet ve hijyen için 0-10 puan arası inisiyatif.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SLIDE 4 */}
          <section className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-900/50 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
            <h2 className="text-xl font-extrabold text-red-900 dark:text-red-400 border-b border-red-200 dark:border-red-900/50 pb-4">
              🚫 Güvenlik ve Varlık Testi (Ceza Puanları)
            </h2>
            <p className="text-sm text-red-950 dark:text-red-200">Sistem sadece puan vermez, kaynakları korumak için adaletsizliği cezalandırır:</p>
            
            <ul className="space-y-3 text-sm text-red-900 dark:text-red-300 font-semibold">
              <li className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> <strong>Araç Sahibi:</strong> Toplam puandan -15 Puan düşer.</li>
              <li className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> <strong>Birden Fazla Gayrimenkul:</strong> -20 Puan düşer.</li>
              <li className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> <strong>Aktif SGK Kaydı:</strong> -5 Puan düşer.</li>
              <li className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> <strong>Mükerrer Yardım (Son 3 Ay):</strong> Kişi başı -5 Puan düşülerek yardım tabana yayılır.</li>
              <li className="flex items-center gap-2 bg-red-100 dark:bg-red-900 p-2 rounded"><Lock size={16} className="text-red-600 dark:text-red-400" /> <strong>Yalan Beyan:</strong> Gelir saklama tespit edilirse sistem muhtaçlık puanını SIFIRLAR (0) ve reddeder.</li>
            </ul>
          </section>

          {/* SLIDE 5 */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
              <PieChart className="text-emerald-500" /> Örnek Karar ve Derecelendirme Çıktısı
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 font-bold text-slate-800 dark:text-slate-200">Derece</th>
                    <th className="p-4 font-bold text-slate-800 dark:text-slate-200">Durum</th>
                    <th className="p-4 font-bold text-slate-800 dark:text-slate-200 text-right">Yardım Tutarı (Örnek)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300 font-medium">
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <td className="p-4"><strong className="text-emerald-700 dark:text-emerald-400">1. Derece</strong></td>
                    <td className="p-4">Kritik / Çok Yüksek İhtiyaç (86-100 Puan)</td>
                    <td className="p-4 text-right font-black text-emerald-800 dark:text-emerald-300">10.000 TL</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4"><strong className="text-slate-800 dark:text-slate-300">2. Derece</strong></td>
                    <td className="p-4">Yüksek İhtiyaç (71-85 Puan)</td>
                    <td className="p-4 text-right font-black text-slate-800 dark:text-slate-200">7.500 TL</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4"><strong className="text-slate-800 dark:text-slate-300">3. Derece</strong></td>
                    <td className="p-4">Orta Düzey İhtiyaç (56-70 Puan)</td>
                    <td className="p-4 text-right font-black text-slate-800 dark:text-slate-200">5.000 TL</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4"><strong className="text-slate-800 dark:text-slate-300">4. Derece</strong></td>
                    <td className="p-4">Düşük-Orta İhtiyaç (41-55 Puan)</td>
                    <td className="p-4 text-right font-black text-slate-800 dark:text-slate-200">4.000 TL</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4"><strong className="text-slate-800 dark:text-slate-300">5. Derece</strong></td>
                    <td className="p-4">Temel İhtiyaç (26-40 Puan)</td>
                    <td className="p-4 text-right font-black text-slate-800 dark:text-slate-200">3.000 TL</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4"><strong className="text-slate-800 dark:text-slate-300">6. Derece</strong></td>
                    <td className="p-4">Dönemsel / Sınır İhtiyaç (10-25 Puan)</td>
                    <td className="p-4 text-right font-black text-slate-800 dark:text-slate-200">2.000 TL</td>
                  </tr>
                  <tr className="bg-red-50/50 dark:bg-red-900/10">
                    <td className="p-4"><strong className="text-red-700 dark:text-red-400">RED</strong></td>
                    <td className="p-4">Kapsam Dışı (0-9 Puan)</td>
                    <td className="p-4 text-right font-black text-red-800 dark:text-red-300">0 TL</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 italic mt-2">* Puan aralıkları ve tutarlar Vakıf yönetimi tarafından bütçeye göre esnekçe değiştirilebilir.</p>
          </section>

          {/* SLIDE 6 */}
          <section className="bg-slate-900 dark:bg-black rounded-2xl p-8 shadow-sm space-y-6 text-white print:bg-white print:text-black print-shadow-none print-break-inside-avoid print:p-8 print:border print:border-slate-200">
            <h2 className="text-xl font-extrabold text-white print:text-black border-b border-slate-700 print:border-slate-300 pb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-400 print:text-slate-600" /> Kurumsal Kazanımlarımız
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle2 className="text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-lg mb-1">Şeffaflık ve Hesap Verilebilirlik</strong>
                  <p className="text-sm text-slate-300 print:text-slate-600">Her karar detaylı formüllerle ve pdf raporlarla ispatlanabilir.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-lg mb-1">Kayırmacılığın Önlenmesi</strong>
                  <p className="text-sm text-slate-300 print:text-slate-600">Objektif algoritma sayesinde sübjektif yargılar engellenir.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-lg mb-1">Hızlı Operasyon</strong>
                  <p className="text-sm text-slate-300 print:text-slate-600">Manuel hesaplama ve toplantı tartışmaları yerini saniyeler süren dijital analize bırakır.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-lg mb-1">Güvenlik ve KVKK</strong>
                  <p className="text-sm text-slate-300 print:text-slate-600">Çevrimdışı çalışabilen şifreli veritabanı ile vatandaşın verisi korunur.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 print:bg-slate-100 p-6 rounded-xl mt-6 text-center">
              <p className="text-xl font-black text-emerald-400 print:text-emerald-700">
                Sonuç: Devletin kısıtlı kaynakları, gerçekten *en çok ihtiyacı olana* ulaşır.
              </p>
            </div>
          </section>

        </main>
      </div>
    </SidebarLayout>
  );
}

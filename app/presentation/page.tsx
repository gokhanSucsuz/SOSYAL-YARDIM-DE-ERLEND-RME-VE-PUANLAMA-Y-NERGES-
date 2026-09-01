"use client";

export const dynamic = "force-dynamic";


import React from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/sidebar';
import { LogoImage } from '@/components/logo-image';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Building2, 
  Users, 
  Scale, 
  Award, 
  TrendingUp, 
  Target, 
  FileText, 
  Lock, 
  Zap, 
  Sparkles, 
  Home, 
  PieChart, 
  Clock, 
  AlertTriangle,
  Smartphone,
  BarChart3,
  Download
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
        
        {/* ==================== COVER / SLIDE 1 ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden print-shadow-none print:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-full blur-3xl -z-0 opacity-80 transform translate-x-20 -translate-y-20 no-print"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 pb-4">
              <div className="flex items-center gap-2 text-red-900 font-extrabold text-xs uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
                <Building2 size={15} className="text-red-700" />
                T.C. EDİRNE SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI (EDİRNE SYDV)
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Doküman No: SYD-NDS-2026-SUNUM
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi (SYD-NDS)
              </h1>
              <p className="text-lg font-extrabold text-red-700 leading-snug">
                Sosyal Adalet, Hakkaniyetli Kaynak Dağıtımı, Mobil Kurulum ve Grafikli İstatistik Dönüşümü
              </p>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Bu proje sunum dokümanı; Sosyal Yardımlaşma ve Dayanışma Vakıfları bünyesinde yürütülen hane sosyal inceleme, muhtaçlık tespit, müdür alanındaki grafikli toplantı istatistikleri ve nakdi/ayni yardım kararlarının <strong>subjektif değerlendirmelerden arındırılarak</strong>, 3294 Sayılı Kanun ruhuna uygun <strong>matematiksel, bilimsel ve denetlenebilir bir algoritmayla</strong> dijitalleştirilmesi amacını taşımaktadır. Ayrıca sistem responsive ve PWA mobil uyumlu olarak geliştirilmiştir.
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 block">%100</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Nesnel & Şeffaf Değerlendirme</span>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <span className="text-2xl font-black text-red-900 block">100 Puan</span>
                <span className="text-xs font-semibold text-red-700">6 Kategori Algoritmik Tavan</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl font-black text-emerald-900 block">%60</span>
                <span className="text-xs font-semibold text-emerald-700">İnceleme Süresi Tasarrufu</span>
              </div>
              <div className="p-4 rounded-xl bg-red-800 text-white text-center">
                <span className="text-2xl font-black block">PWA / Mobil</span>
                <span className="text-xs font-medium text-red-100">Telefondan Yüklenip Kullanılabilir</span>
              </div>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 2: WHY NEEDED ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">1. PROJEYE NEDEN İHTİYAÇ DUYULDU? (MEVCUT DURUM VE GEREKÇE)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Geleneksel yöntemlerde karşılaşılan temel darboğazlar ve çözüm gereksinimi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Geleneksel/Manuel Sistemlerin Sorunları:
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <div>
                    <strong>Subjektif (Öznel) Karar Riski:</strong> Farklı inceleme görevlilerinin aynı durumdaki iki haneyi farklı kanaatlerle değerlendirme ihtimali.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <div>
                    <strong>Kağıt Karmaşası ve İş Yükü:</strong> Manuel form doldurma, kağıt evrak arşivleme ve karmaşık puan hesaplamalarında vakit kaybı.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <div>
                    <strong>Bütçe Dağıtımında Odaklanma Güçlüğü:</strong> Sınırlı nakdi yardım bütçesinin &quot;en ağır durumdaki&quot; gerçek muhtaçlara ulaştırılmasında standart eksikliği.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <div>
                    <strong>Müfettiş ve Denetim Zorluğu:</strong> Kararların gerekçelerinin geriye dönük objektif parametrelerle kanıtlanmasında yaşanan güçlükler.
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SYD-NDS Çözüm Yaklaşımı:
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Matematiksel Algoritma Standartı:</strong> İnceleme görevlisinden bağımsız, herkes için aynı adil ve şeffaf ölçüt setinin işletilmesi.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Anlık ve Otomatik Puanlama:</strong> İşaretlenen parametrelerin anında hesaplanıp doğru yardım derecesine (1, 2, 3, 4. Derece) atanması.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>MPI Uyumlu Daraltılmış Tavan:</strong> En ağır kırılganlığa sahip haneleri (86-100 Puan) seçip 10.000 TL tavan yardıma ulaştıran sistem.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Tek Tıkla Islak İmzalı PDF / Raporlama:</strong> Müfettiş denetimlerine, müdür onayına ve arşivlere %100 uyumlu çıktı formatı.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 3: INSTITUTION BENEFITS ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="bg-blue-600/10 p-2.5 rounded-xl text-blue-600">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">2. KURUMA SAĞLADIĞI STRATEJİK VE OPERASYONEL FAYDALAR (SYDV AÇISINDAN)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vakıf yönetimi, inceleme görevlileri ve idari süreçler için katma değer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                <Target size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Kaynakların Doğru İhtiyaç Sahibine Yönlendirilmesi</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kamu bütçesinin ve vakıf nakdi yardım kaynaklarının, matematikle kanıtlanmış en mağdur hanelere adil ve öncelikli aktarılmasını sağlar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Operasyonel Verimlilik ve Hız</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                İnceleme raporunun hazırlanması, puanın hesaplanması ve onay kuruluna sunulma sürecini dakikalar seviyesine indirir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Tam Denetlenebilirlik ve Hukuki Güvence</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mülkiye Müfettişliği ve Sayıştay denetimlerinde, her yardım kararının arkasındaki 100 puanlık parametre dökümünü eksiksiz sunar.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
            <h4 className="text-sm font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={18} /> İdari Süreç Standartlaşması:
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Vakıf Müdürü ve Mütevelli Heyeti, önüne gelen değerlendirme raporlarında sadece soyut kanaatleri değil; <strong>Barınma, Gelir, Sağlık, Eğitim, Engellilik, Bağımlılık ve Özel Şartlar</strong> başlıklarında somutlaşmış puan kırılımlarını görür. Böylece karar alma süreçleri tartışmasız ve hızlı hale gelir.
            </p>
          </div>
        </section>


        {/* ==================== SECTION 4: PEOPLE BENEFITS ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="bg-emerald-600/10 p-2.5 rounded-xl text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">3. İNSANLARA VE İHTİYAÇ SAHİPLERİNE SAĞLADIĞI FAYDALAR (VATANDAŞ AÇISINDAN)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Toplumsal adalet, vicdani tatmin ve hakkaniyet mekanizmaları</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <Award size={18} className="text-emerald-700" />
                <span>Hak Hakkaniyeti ve Eşitlik Garantisi</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Vatandaşlar, sosyal durumlarının kişisel sempati veya taraflı kanaatlerle değil; önceden belirlenmiş adil standartlarla değerlendirildiğini bilir. Bu durum devlete ve vakfa olan güveni en üst seviyeye çıkarır.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                <Zap size={18} className="text-blue-700" />
                <span>Hızlı Yardım ve Mağduriyetin Giderilmesi</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Geleneksel bürokratik gecikmeler ortadan kalkar. Saha incelemesi tamamlanan hanelerin onay ve ödeme süreçleri hızlanarak mağduriyetleri vakit kaybetmeksizin giderilir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm">
                <Scale size={18} className="text-purple-700" />
                <span>Çoklu Kırılgan Hanelere Pozitif Ayrımcılık</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Yetim, engelli, kronik hasta, bakıma muhtaç yaşlı veya afetzede gibi çoklu dezavantajı bir arada barındıran en muhtaç haneler, daraltılmış tavan puan aralığı sayesinde en yüksek yardıma (10.000 TL) anında erişir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <ShieldCheck size={18} className="text-amber-700" />
                <span>Gerçek İhtiyaç Sahibinin Hakkının Korunması</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Yanıltıcı beyan veya gerçeğe aykırı durum tespitlerinde sistem otomatik RED/0 TL güvenlik kilidini devreye sokar. Böylece suistimaller engellenerek gerçek muhtaçların hakkı gasp edilmez.
              </p>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 5: METODOLOGY & SCORE SCALE ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-600">
              <PieChart size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">4. PUANLAMA VE YARDIM DERECELERİ METODOLOJİSİ</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">100 Puan Tavanı, Muhtaçlık Barajı ve Kademeli Yaklaşım</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-950 space-y-2">
            <strong className="text-blue-900 font-extrabold text-sm block">Uluslararası MPI Uyumlu Dağılım:</strong>
            <p className="leading-relaxed">
              Dünya literatürüne uygun şekilde 100 puan üzerinden hesaplanan modelde, sosyal yardım bütçesinin en muhtaçlara odaklanması sağlanmıştır. Yardım alma barajı 10 puana çekilmiş, gelir güvencesiz olan her hane bu barajı otomatik geçecek şekilde kurgulanmıştır.
            </p>
          </div>

          {/* Table / Cards of Degrees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between text-center space-y-2">
              <div>
                <span className="text-[9px] font-extrabold text-emerald-800 uppercase block">1. KADEME</span>
                <span className="text-lg font-black text-emerald-900 block mt-0.5">86 - 100</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 text-[11px] font-black text-emerald-900">
                10.000 TL
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex flex-col justify-between text-center space-y-2">
              <div>
                <span className="text-[9px] font-extrabold text-teal-800 uppercase block">2. KADEME</span>
                <span className="text-lg font-black text-teal-900 block mt-0.5">71 - 85</span>
              </div>
              <div className="pt-2 border-t border-teal-200 text-[11px] font-black text-teal-900">
                7.500 TL
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between text-center space-y-2">
              <div>
                <span className="text-[9px] font-extrabold text-blue-800 uppercase block">3. KADEME</span>
                <span className="text-lg font-black text-blue-900 block mt-0.5">56 - 70</span>
              </div>
              <div className="pt-2 border-t border-blue-200 text-[11px] font-black text-blue-900">
                5.000 TL
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between text-center space-y-2">
              <div>
                <span className="text-[9px] font-extrabold text-indigo-800 uppercase block">4. KADEME</span>
                <span className="text-lg font-black text-indigo-900 block mt-0.5">41 - 55</span>
              </div>
              <div className="pt-2 border-t border-indigo-200 text-[11px] font-black text-indigo-900">
                4.000 TL
              </div>
            </div>

            <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 flex flex-col justify-between text-center space-y-2">
              <div>
                <span className="text-[9px] font-extrabold text-violet-800 uppercase block">5. KADEME</span>
                <span className="text-lg font-black text-violet-900 block mt-0.5">26 - 40</span>
              </div>
              <div className="pt-2 border-t border-violet-200 text-[11px] font-black text-violet-900">
                3.000 TL
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between text-center space-y-2">
              <div>
                <span className="text-[9px] font-extrabold text-amber-800 uppercase block">6. KADEME</span>
                <span className="text-lg font-black text-amber-900 block mt-0.5">10 - 25</span>
              </div>
              <div className="pt-2 border-t border-amber-200 text-[11px] font-black text-amber-900">
                2.000 TL
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 flex flex-col justify-between text-center space-y-2 col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
              <div>
                <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300 uppercase block">UYGUN DEĞİL</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-200 block mt-0.5">0 - 9</span>
              </div>
              <div className="pt-2 border-t border-slate-300 dark:border-slate-600 text-[11px] font-black text-slate-800 dark:text-slate-200">
                RED
              </div>
            </div>
          </div>

          {/* 6 Categories Grid */}
          <div className="pt-2 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Puanlamayı Oluşturan 6 Ana İnceleme Kategorisi:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">A. Ekonomik Durum (25 Pn Tavan, Gelir, SGK & Son 3 Ay Vakıf Yardım Düşümü)</div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">B. Hastalık ve Engellilik Durumu (25 Pn Tavan, Ağır Engelli, Yalnız Yaşlı, Evde Bakım)</div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">C. Sosyal Kırılganlık ve Nüfus (15 Pn Tavan, Şiddet, Kadın Hane Reisi, Mahkum Yakını)</div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">D. Çocuk ve Eğitim Yükü (15 Pn Tavan, Örgün ve Mesleki Kademeler)</div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">E. Barınma ve Eşya Şartları (10 Pn Tavan, Afetzede, Ağır Hasar, Eşya Eksikliği)</div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">F. Sosyal İnceleme Görevlisi Kanaati (10 Pn Tavan, 4 İnisiyatif Kriteri)</div>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 6: KVKK & CYBER SECURITY ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="bg-red-600/10 p-2.5 rounded-xl text-red-600">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">5. KVKK UYUMLULUĞU VE İLERİ DÜZEY SİBER GÜVENLİK ALTYAPISI</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uçtan uca şifreleme, iki aşamalı doğrulama ve veri koruma katmanları</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-950 space-y-2">
            <strong className="text-red-900 font-extrabold text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> KVKK Mahremiyetine Tam Uyum (Kriptolojik Koruma)
            </strong>
            <p className="leading-relaxed">
              Sosyal yardım başvurusu yapan vatandaşların isim, soyisim, T.C. kimlik no, ev adresi ve iletişim bilgileri gibi tüm <strong>özel nitelikli kişisel verileri</strong> veritabanına kaydedilirken <strong>AES-256 (Banka Düzeyi)</strong> şifreleme algoritması ile korunmaktadır (Mongoose Field Encryption). Olası bir sızıntı durumunda dahi şifre anahtarı olmadan veriler okunamaz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <Smartphone size={16} className="text-blue-600" /> 
                <span>2FA Çift Aşamalı Doğrulama</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yüksek yetkili hesaplar (Süper Admin vb.) için sisteme girişler sadece şifre ile değil, cep telefonunda üretilen dinamik <strong>Google Authenticator (2FA)</strong> kodları ile sağlanır.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                <Zap size={16} className="text-emerald-600" /> 
                <span>JWE (JSON Web Encryption) Token</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kullanıcı oturumları (session) standart imzalı tokenlar yerine, içi tamamen şifrelenmiş olan <strong>JWE</strong> mimarisi ile korunur. Böylece oturum çalınma (Hijacking) riskleri sıfıra indirgenir.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 7: SUMMARY & CONCLUSION ==================== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="bg-purple-600/10 p-2.5 rounded-xl text-purple-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">6. SONUÇ VE VİZYON DEĞERLENDİRMESİ</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kurumsal vizyon, dijitalleşme vizyonu ve sürdürülebilirlik</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi (SYD-NDS)</strong>, sosyal yardım hizmetlerinde vizyoner bir adımı temsil etmektedir. Çağdaş kamu yönetimi ilkeleri olan <strong>şeffaflık, hesap verebilirlik, nesnellik ve verimlilik</strong> esaslarını doğrudan uygulamaya yansıtmaktadır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase text-blue-700">Sosyal Devlet İlkesine Katkı</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Kimsesizlerin kimsesi olan sosyal devlet anlayışını, kayırmacılıktan uzak tam şeffaf matematiksel güvenceye bağlar.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase text-emerald-700">Kurumsal Prestij ve Güven</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Vakfın yerel idareler, mülki idare amirlikleri ve vatandaş nezdindeki kurumsal güvenilirliğini en üst noktaya taşır.
                </p>
              </div>
            </div>
          </div>

          {/* Presentation Signature Block for Print */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">T.C. Sosyal Yardımlaşma ve Dayanışma Vakfı</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Sosyal İnceleme ve Dijital Dönüşüm Birimi &mdash; SYD-NDS v2026</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">Doküman No: SYD-NDS-2026-SUNUM</p>
            </div>
          </div>
        </section>

      </main>

      {/* Presentation References Section */}
      <footer className="bg-slate-900 dark:bg-slate-950 py-8 border-t border-slate-800 text-slate-400 no-print">
        <div className="max-w-5xl mx-auto w-full px-6 lg:px-10">
          <h3 className="text-sm font-black text-slate-100 mb-3">Model Kaynakçası (Literature & References)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] sm:text-xs">
            <div>
              <strong>[1] Alkire, S., & Foster, J. (2011).</strong> "Counting and multidimensional poverty measurement." <em>Journal of Public Economics</em>.
            </div>
            <div>
              <strong>[2] Coady, D. et al. (2004).</strong> "Targeting of Transfers in Developing Countries." <em>World Bank Publications</em>.
            </div>
            <div>
              <strong>[3] T.C. Aile ve Sosyal Hizmetler Bakanlığı (2023).</strong> Sosyal Yardım İstatistikleri ve Yoksulluk Ölçütleri Bülteni.
            </div>
            <div>
              <strong>[4] UNDP & OPHI (2022).</strong> "Global Multidimensional Poverty Index."
            </div>
          </div>
        </div>
      </footer>
    </div>
    </SidebarLayout>
  );
}

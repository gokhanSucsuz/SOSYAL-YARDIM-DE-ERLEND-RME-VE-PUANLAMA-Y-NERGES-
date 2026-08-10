"use client";

import React from 'react';
import Link from 'next/link';
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
  HelpCircle
} from 'lucide-react';

export default function PresentationPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col print:bg-white print:p-0">
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
          .no-print {
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
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0 shadow-md no-print sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white" title="Ana Sayfaya Dön">
            <ArrowLeft size={20} />
          </Link>
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold leading-tight">PROJE TANITIM VE YÖNETİM SUNUMU (PDF)</h1>
            <p className="text-[11px] text-slate-400 font-medium">
              SYD-NDS: Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/guide"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <FileText size={15} className="text-blue-400" />
            <span className="hidden sm:inline">Puan Kılavuzu</span>
          </Link>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <Home size={15} />
            <span className="hidden sm:inline">Panele Dön</span>
          </Link>
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-lg transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Printer size={16} />
            <span>PDF İNDİR / YAZDIR</span>
          </button>
        </div>
      </header>

      {/* Main Presentation Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 lg:p-10 space-y-10 print:p-0 print:max-w-none print:space-y-8">
        
        {/* ==================== COVER / SLIDE 1 ==================== */}
        <section className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden print-shadow-none print:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl -z-0 opacity-60 transform translate-x-20 -translate-y-20 no-print"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
                <Building2 size={15} className="text-blue-700" />
                T.C. SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI (SYDV)
              </div>
              <span className="text-xs font-bold text-slate-500">
                Doküman No: SYD-NDS-2026-SUNUM
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi (SYD-NDS)
              </h1>
              <p className="text-lg font-bold text-blue-700 leading-snug">
                Sosyal Adalet, Hakkaniyetli Kaynak Dağıtımı ve Dijital Dönüşüm Projesi
              </p>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Bu proje sunum dokümanı; Sosyal Yardımlaşma ve Dayanışma Vakıfları bünyesinde yürütülen hane sosyal inceleme, muhtaçlık tespit ve nakdi/ayni yardım kararlarının <strong>subjektif değerlendirmelerden arındırılarak</strong>, 3294 Sayılı Kanun ruhuna uygun <strong>matematiksel, bilimsel ve denetlenebilir bir algoritmayla</strong> dijitalleştirilmesi amacını taşımaktadır.
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-2xl font-black text-slate-900 block">%100</span>
                <span className="text-xs font-semibold text-slate-600">Nesnel & Şeffaf Değerlendirme</span>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-2xl font-black text-blue-900 block">130 Puan</span>
                <span className="text-xs font-semibold text-blue-700">7 Kategori Algoritmik Tavan</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl font-black text-emerald-900 block">%60</span>
                <span className="text-xs font-semibold text-emerald-700">İnceleme Süresi Tasarrufu</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-2xl font-black text-purple-900 block">Sıfır</span>
                <span className="text-xs font-semibold text-purple-700">Manuel Hesaplama Hatası</span>
              </div>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 2: WHY NEEDED ==================== */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">1. PROJEYE NEDEN İHTİYAÇ DUYULDU? (MEVCUT DURUM VE GEREKÇE)</h2>
              <p className="text-xs text-slate-500 font-medium">Geleneksel yöntemlerde karşılaşılan temel darboğazlar ve çözüm gereksinimi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Geleneksel/Manuel Sistemlerin Sorunları:
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
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
                    <strong>Bütçe Dağıtımında Odaklanma Güçlüğü:</strong> Sınırlı nakdi yardım bütçesinin "en ağır durumdaki" gerçek muhtaçlara ulaştırılmasında standart eksikliği.
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
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SYD-NDS Çözüm Yaklaşımı:
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
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
                    <strong>Daraltılmış Tavan & Kademeli Aralık:</strong> En ağır kırılganlığa sahip haneleri (116-130 Puan) seçip 10.000 TL tavan yardıma ulaştıran sistem.
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
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-blue-600/10 p-2.5 rounded-xl text-blue-600">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">2. KURUMA SAĞLADIĞI STRATEJİK VE OPERASYONEL FAYDALAR (SYDV AÇISINDAN)</h2>
              <p className="text-xs text-slate-500 font-medium">Vakıf yönetimi, inceleme görevlileri ve idari süreçler için katma değer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                <Target size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Kaynakların Doğru İhtiyaç Sahibine Yönlendirilmesi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kamu bütçesinin ve vakıf nakdi yardım kaynaklarının, matematikle kanıtlanmış en mağdur hanelere adil ve öncelikli aktarılmasını sağlar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Operasyonel Verimlilik ve Hız</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                İnceleme raporunun hazırlanması, puanın hesaplanması ve onay kuruluna sunulma sürecini dakikalar seviyesine indirir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Tam Denetlenebilirlik ve Hukuki Güvence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mülkiye Müfettişliği ve Sayıştay denetimlerinde, her yardım kararının arkasındaki 130 puanlık parametre dökümünü eksiksiz sunar.
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
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-emerald-600/10 p-2.5 rounded-xl text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">3. İNSANLARA VE İHTİYAÇ SAHİPLERİNE SAĞLADIĞI FAYDALAR (VATANDAŞ AÇISINDAN)</h2>
              <p className="text-xs text-slate-500 font-medium">Toplumsal adalet, vicdani tatmin ve hakkaniyet mekanizmaları</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <Award size={18} className="text-emerald-700" />
                <span>Hak Hakkaniyeti ve Eşitlik Garantisi</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Vatandaşlar, sosyal durumlarının kişisel sempati veya taraflı kanaatlerle değil; önceden belirlenmiş adil standartlarla değerlendirildiğini bilir. Bu durum devlete ve vakfa olan güveni en üst seviyeye çıkarır.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                <Zap size={18} className="text-blue-700" />
                <span>Hızlı Yardım ve Mağduriyetin Giderilmesi</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Geleneksel bürokratik gecikmeler ortadan kalkar. Saha incelemesi tamamlanan hanelerin onay ve ödeme süreçleri hızlanarak mağduriyetleri vakit kaybetmeksizin giderilir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm">
                <Scale size={18} className="text-purple-700" />
                <span>Çoklu Kırılgan Hanelere Pozitif Ayrımcılık</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Yetim, engelli, kronik hasta, bakıma muhtaç yaşlı veya afetzede gibi çoklu dezavantajı bir arada barındıran en muhtaç haneler, daraltılmış tavan puan aralığı sayesinde en yüksek yardıma (10.000 TL) anında erişir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <ShieldCheck size={18} className="text-amber-700" />
                <span>Gerçek İhtiyaç Sahibinin Hakkının Korunması</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Yanıltıcı beyan veya gerçeğe aykırı durum tespitlerinde sistem otomatik RED/0 TL güvenlik kilidini devreye sokar. Böylece suistimaller engellenerek gerçek muhtaçların hakkı gasp edilmez.
              </p>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 5: METODOLOGY & SCORE SCALE ==================== */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 print-shadow-none print-break-before print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-indigo-600/10 p-2.5 rounded-xl text-indigo-600">
              <PieChart size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">4. PUANLAMA VE YARDIM DERECELERİ METODOLOJİSİ</h2>
              <p className="text-xs text-slate-500 font-medium">130 Puan Tavanı, Daraltılmış Tavan ve Artan Aralık Yaklaşımı</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-950 space-y-2">
            <strong className="text-blue-900 font-extrabold text-sm block">Kademeli Aralık (Progressive Scoring) Mantığı:</strong>
            <p className="leading-relaxed">
              En yüksek derece olan 1. Derece (10.000 TL) için puan aralığı <strong>15 Puan (116 - 130 Puan)</strong> olarak dar tutulmuştur. Alt derecelere doğru inildikçe puan aralıkları kademeli olarak genişler (15 Pn → 20 Pn → 25 Pn → 40 Pn). Böylece sınırlı nakdi kaynaklar en yüksek kırılganlıktaki gruplara odaklanır.
            </p>
          </div>

          {/* Table / Cards of Degrees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between text-center space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">1. DERECE</span>
                <span className="text-xl font-black text-emerald-900 block mt-1">116 - 130</span>
                <p className="text-[10px] font-bold text-emerald-700">15 Puanlık Dar Tavan</p>
              </div>
              <div className="pt-2 border-t border-emerald-200 text-xs font-black text-emerald-900">
                10.000 TL Nakdi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between text-center space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-blue-800 uppercase block">2. DERECE</span>
                <span className="text-xl font-black text-blue-900 block mt-1">96 - 115</span>
                <p className="text-[10px] font-bold text-blue-700">20 Puanlık Aralık</p>
              </div>
              <div className="pt-2 border-t border-blue-200 text-xs font-black text-blue-900">
                7.500 TL Nakdi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between text-center space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-800 uppercase block">3. DERECE</span>
                <span className="text-xl font-black text-indigo-900 block mt-1">71 - 95</span>
                <p className="text-[10px] font-bold text-indigo-700">25 Puanlık Aralık</p>
              </div>
              <div className="pt-2 border-t border-indigo-200 text-xs font-black text-indigo-900">
                5.000 TL Nakdi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between text-center space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-amber-800 uppercase block">4. DERECE</span>
                <span className="text-xl font-black text-amber-900 block mt-1">31 - 70</span>
                <p className="text-[10px] font-bold text-amber-700">40 Puanlık Aralık</p>
              </div>
              <div className="pt-2 border-t border-amber-200 text-xs font-black text-amber-900">
                2.500 TL Nakdi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col justify-between text-center space-y-3">
              <div>
                <span className="text-[10px] font-extrabold text-slate-700 uppercase block">UYGUN DEĞİL</span>
                <span className="text-xl font-black text-slate-800 block mt-1">0 - 30</span>
                <p className="text-[10px] font-bold text-slate-600">Taban Puan Bandı</p>
              </div>
              <div className="pt-2 border-t border-slate-300 text-xs font-black text-slate-800">
                0 TL / Ayni Yardım
              </div>
            </div>
          </div>

          {/* 7 Categories Grid */}
          <div className="pt-2 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Puanlamayı Oluşturan 7 Ana İnceleme Kategorisi:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium">1. Barınma ve Konut (20 Pn)</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium">2. Gelir ve Ekonomik (25 Pn)</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium">3. Sağlık ve Kronik Hastalık (20 Pn)</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium">4. Eğitim Durumu (15 Pn)</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium">5. Engellilik / Yaşlılık (20 Pn)</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium">6. Nüfus ve Bağımlılık (15 Pn)</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium col-span-2 sm:col-span-2">7. Özel Kırılganlık Şartları (Afet, Yetim vb. - 15 Pn)</div>
            </div>
          </div>
        </section>


        {/* ==================== SECTION 6: SUMMARY & CONCLUSION ==================== */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 print-shadow-none print-break-inside-avoid print:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-purple-600/10 p-2.5 rounded-xl text-purple-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">5. SONUÇ VE VİZYON DEĞERLENDİRMESİ</h2>
              <p className="text-xs text-slate-500 font-medium">Kurumsal vizyon, dijitalleşme vizyonu ve sürdürülebilirlik</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Sosyal Yardım İnceleme ve Nesnel Değerlendirme Sistemi (SYD-NDS)</strong>, sosyal yardım hizmetlerinde vizyoner bir adımı temsil etmektedir. Çağdaş kamu yönetimi ilkeleri olan <strong>şeffaflık, hesap verebilirlik, nesnellik ve verimlilik</strong> esaslarını doğrudan uygulamaya yansıtmaktadır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase text-blue-700">Sosyal Devlet İlkesine Katkı</h4>
                <p className="text-xs text-slate-600">
                  Kimsesizlerin kimsesi olan sosyal devlet anlayışını, kayırmacılıktan uzak tam şeffaf matematiksel güvenceye bağlar.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase text-emerald-700">Kurumsal Prestij ve Güven</h4>
                <p className="text-xs text-slate-600">
                  Vakfın yerel idareler, mülki idare amirlikleri ve vatandaş nezdindeki kurumsal güvenilirliğini en üst noktaya taşır.
                </p>
              </div>
            </div>
          </div>

          {/* Presentation Signature Block for Print */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 font-semibold">
            <div>
              <p className="font-bold text-slate-900">T.C. Sosyal Yardımlaşma ve Dayanışma Vakfı</p>
              <p className="text-[11px] text-slate-500">Sosyal İnceleme ve Dijital Dönüşüm Birimi</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
              <p className="font-bold text-slate-900">Sunum ve Rapor Dokümanı</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

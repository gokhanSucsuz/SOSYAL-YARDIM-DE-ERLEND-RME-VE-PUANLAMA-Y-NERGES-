"use client";

export const dynamic = "force-dynamic";


import React from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/sidebar';
import { LogoImage } from '@/components/logo-image';
import { ShieldCheck, ArrowLeft, BookOpen, Scale, Award, AlertTriangle, FileText, CheckCircle2, Home, HeartHandshake, HelpCircle, Layers, Check, Presentation, BarChart3, Smartphone, Download, Printer, Lock } from 'lucide-react';

export default function GuidePage() {
  return (
    <SidebarLayout>
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col">
          <h1 className="font-black text-lg text-slate-900 dark:text-slate-100">📖 SYD-NDS v2026 Standart Metodoloji Rehberi</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Sosyal İnceleme ve Puanlama Kılavuzu</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/presentation"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Presentation size={16} /> Sunum
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10 space-y-10">
        
        {/* Banner Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-0 opacity-70 transform translate-x-20 -translate-y-20"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-red-200">
              <BookOpen size={14} className="text-red-700" /> RESMİ UYGULAMA MEVZUATI VE METODOLOJİ REHBERİ
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              Sosyal İnceleme Puanlama Sistemi ve Yardım Kriterleri
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-3xl">
              Bu kılavuz, <strong>3294 Sayılı Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu</strong> çerçevesinde, 
              Sosyal İnceleme Görevlileri tarafından hanelerde gerçekleştirilen saha ziyaretlerinde uygulanan 
              <strong> objektif, şeffaf ve bilimsel puanlama metodolojisini</strong> detaylandırmak amacıyla hazırlanmıştır.
            </p>
          </div>
        </div>

        {/* Mobile PWA Installation Guide Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Smartphone className="text-red-600" size={22} />
            1. Mobil Uygulama İndirme ve Telefondan Kurulum Kılavuzu (PWA)
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Sistem, akıllı cep telefonlarına ve tabletlere herhangi bir uygulama mağazasına (Google Play Store / App Store) ihtiyaç duymaksızın doğrudan <strong>PWA (Progressive Web App)</strong> olarak yüklenebilir. İnceleme görevlileri sahada <strong>internet bağlantısı olmadan</strong> da formu mobil uygulamada doldurabilir, bağlantı sağlandığında veriler otomatik senkronize edilir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Android Cihazlarda Kurulum (Google Chrome)</span>
              </div>
              <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-decimal pl-5 font-medium leading-relaxed">
                <li>Sitedeki <strong>&quot;Mobil Uygulamayı İndir&quot;</strong> butonuna veya Chrome sağ üstteki <strong>3 nokta (⋮)</strong> menüsüne dokunun.</li>
                <li>Açılan menüde <strong>&quot;Uygulamayı Yükle&quot;</strong> veya <strong>&quot;Ana Ekrana Ekle&quot;</strong> seçeneğini belirleyin.</li>
                <li>Ekrana gelen onay penceresinde <strong>&quot;Yükle&quot;</strong> butonuna basın. Uygulama telefonunuzun ana ekranına T.C. SYDV logosuyla eklenecektir.</li>
              </ol>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>iOS / iPhone Cihazlarda Kurulum (Safari)</span>
              </div>
              <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-decimal pl-5 font-medium leading-relaxed">
                <li>Safari tarayıcısında alt barda yer alan <strong>Paylaş (Share / Yukarı Ok)</strong> simgesine dokunun.</li>
                <li>Menüyü aşağı kaydırarak <strong>&quot;Ana Ekrana Ekle&quot; (Add to Home Screen)</strong> seçeneğini seçin.</li>
                <li>Sağ üstteki <strong>&quot;Ekle&quot;</strong> butonuna basarak kurulumu tamamlayın. Artık tam ekran mobil uygulama şeklinde kullanabilirsiniz.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Manager Stats & Printable PDF Report Guide */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <BarChart3 className="text-red-700" size={22} />
            2. Görsel Grafik Gösterimli PDF İstatistik ve Bütçe Raporlama Modülü
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Müdür Yetkilisi panelinde yer alan <strong>İstatistik & Analiz Merkezi</strong>; her bir toplantı dosyası için ayrı ayrı veya tüm toplantı dosyaları dahil konsolide olarak <strong>görsel grafiklerle zenginleştirilmiş PDF çıktısı</strong> üretir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
            <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-1.5">
              <h4 className="font-extrabold text-red-900 text-sm flex items-center gap-1.5">
                <Printer size={16} /> Grafik Gösterimli PDF
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                PDF çıktısında Bütçe Kullanım Çubukları, Karar Dağılım Oran Bantları, Kategori Dağılımları ve Hane Risk Puan Grafikleri tam renkli ve yüksek çözünürlüklü olarak basılır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Layers size={16} /> Özel ve Konsolide Raporlama
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Açılır menüden belirli bir toplantı dosyası seçilerek o toplantıya özel veya &quot;Tüm Toplantı Dosyaları&quot; seçilerek genel Vakıf performansı raporlanabilir.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <FileText size={16} /> Excel (.xlsx) Dışa Aktarım
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Çoklu sekme yapısında (Özet Metrikler, Kategori Kırılımları, Detaylı Hane Kayıtları) resmi formatlanmış Excel dosyası tek tıkla indirilebilir.
              </p>
            </div>
          </div>
        </div>

        {/* System Purpose */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Scale className="text-red-700" size={22} />
            3. Sistem Amacı ve Yasal Dayanak
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">Kurumsal Amaç</h4>
              <p>
                Ayni ve nakdi sosyal yardımların insan inisiyatifinden bağımsız, standartlaştırılmış matematiksel parametrelere dayalı olarak 
                en doğru ihtiyaç sahibine adil bir biçimde ulaştırılması amaçlanmaktadır. Sistem, hanelerin sosyo-ekonomik kırılganlık durumunu bütüncül olarak ölçer.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">Denetlenebilirlik ve Şeffaflık</h4>
              <p>
                Saha personelinin yaptığı her değerlendirme, işaretlenen detaylı seçenekler ile kayıt altına alınır ve Vakıf Müdürü onayına sunulur. Tüm veri ve puanlamalar resmi çıktı formatında imzalanabilir ve arşivlenebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Scale Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Award className="text-emerald-600" size={22} />
            4. Toplam Puan Tavanı ve Yardım Seviyeleri Skalası (MPI Uyumlu 100 Puan Sistemi)
          </h3>

          <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl text-xs text-red-950 space-y-2">
            <strong className="text-red-900 font-extrabold text-sm block">Uluslararası MPI Uyumlu Dağılım:</strong>
            <p>
              Sosyal yardım bütçesinin en ağır durumdaki ihtiyaç sahiplerine adil dağıtılması amacıyla geliştirilmiş 100 puanlık yoksulluk endeksi modelidir:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              <li><strong>Baraj İndirimi:</strong> Dünya literatürüne uyumlu olarak yardıma ulaşım barajı <strong>10 Puan</strong> seviyesine indirilmiş, 0-9 puan arası ise yardım alamaz (Red) kabul edilmiştir.</li>
              <li><strong>Gelir Güvencesi İstisnası:</strong> Kişi başı geliri muhtaçlık sınırının altında olan her hane <strong>otomatik olarak en az 10 puana ulaşmış sayılarak</strong> asgari düzeyde yardım ağına dahil edilir.</li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Form ana kategorilerde toplam <strong>Maksimum 100 Puan</strong> üzerinden hesaplanır. Yardım seviyeleri aşağıdadır:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">1. Kademe</span>
                <span className="text-2xl font-black text-emerald-900">86 - 100</span>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-sm font-extrabold text-emerald-800">
                10.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-800 uppercase block mb-1">2. Kademe</span>
                <span className="text-2xl font-black text-teal-900">71 - 85</span>
              </div>
              <div className="mt-4 pt-3 border-t border-teal-200 text-sm font-extrabold text-teal-800">
                7.500 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase block mb-1">3. Kademe</span>
                <span className="text-2xl font-black text-blue-900">56 - 70</span>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200 text-sm font-extrabold text-blue-800">
                5.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-800 uppercase block mb-1">4. Kademe</span>
                <span className="text-2xl font-black text-indigo-900">41 - 55</span>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200 text-sm font-extrabold text-indigo-800">
                4.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-violet-800 uppercase block mb-1">5. Kademe</span>
                <span className="text-2xl font-black text-violet-900">26 - 40</span>
              </div>
              <div className="mt-4 pt-3 border-t border-violet-200 text-sm font-extrabold text-violet-800">
                3.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase block mb-1">6. Kademe</span>
                <span className="text-2xl font-black text-amber-900">10 - 25</span>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-sm font-extrabold text-amber-800">
                2.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between sm:col-span-2 lg:col-span-3">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Uygun Değil / Red</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">0 - 9</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                Nakdi Yardıma Uygun Görülmedi
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Categories Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Layers className="text-indigo-600" size={22} />
            5. Değerlendirme Kriterleri ve Hesaplama Detayları (100 Puan)
          </h3>

          <div className="space-y-6">
            
            {/* Category A */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">A. EKONOMİK DURUM (Maksimum 25 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 25 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hanedeki kişi başına düşen aylık net gelirin resmi Muhtaçlık Sınırı oranlarına göre puanlanması:</p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-5 font-medium">
                <li><strong>Muhtaçlık Sınırının %25 Altı:</strong> +20 Puan</li>
                <li><strong>Muhtaçlık Sınırının %25 – %50 Arası:</strong> +15 Puan</li>
                <li><strong>Muhtaçlık Sınırının %50 – %75 Arası:</strong> +10 Puan</li>
                <li><strong>Muhtaçlık Sınırının %75 – %100 Arası:</strong> +5 Puan</li>
                <li><strong>İlave / Düzeltme Puanları:</strong> Hanede Çalışan Yok (+3 Puan) • Düzenli Gelir Yok (+2 Puan) • SGK Kaydı Yok (+2 Puan)</li>
                <li><strong>Son 3 Ayda Vakıf Nakdi Yardım Alınması:</strong> Kişi başı <strong>-5 Ceza Puanı</strong> düşülür.</li>
              </ul>
            </div>

            {/* Category B */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">B. HASTALIK VE ENGELLİLİK DURUMU (Maksimum 25 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 25 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hanede bakıma muhtaç, engelli veya özel hassasiyeti bulunan bireylerin mevcudiyeti:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Ağır Engelli (Tam Bağımlı): <strong>+12 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Engelli (Kısmi Bağımlı %40+): <strong>+8 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Evde Bakım veya Kanser Hastası: <strong>+8 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Kronik Hastalık: <strong>+5 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Yaşlı Yalnız veya Şehit Yakını/Gazi: <strong>+6 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Yetim veya Koruyucu Aile: <strong>+4 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 sm:col-span-2">Özel Sebep İlavesi (Müdür Yetkisi): <strong>+5 / +10 / +15 / +20 Puan</strong></div>
              </div>
            </div>

            {/* Category C */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">C. SOSYAL KIRILGANLIK VE NÜFUS (Maksimum 15 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 15 Puan</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-5 font-medium">
                <li><strong>Şiddet Mağduru:</strong> +5 Puan</li>
                <li><strong>Kadın Hane Reisi / Afet / Madde Bağımlılığı / Eşi Cezaevinde:</strong> +4 Puan</li>
                <li><strong>Borç İcra / Bakıma Muhtaç Bebek:</strong> +3 Puan</li>
                <li><strong>Hane Nüfusu Etkisi:</strong> 1-2 kişi <strong>+1 Pn</strong> | 3-4 kişi <strong>+2 Pn</strong> | 5-6 kişi <strong>+3 Pn</strong> | 7+ kişi <strong>+4 Pn</strong></li>
              </ul>
            </div>

            {/* Category D */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">D. ÇOCUK VE EĞİTİM YÜKÜ (Maksimum 15 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 15 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hanedeki öğrenim gören çocuk ve genç sayısı üzerinden kişi başı hesaplanır:</p>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-5 font-medium">
                <li><strong>0-6 Yaş / İlkokul / Ortaokul / Açık Lise:</strong> Kişi başı +2 Puan</li>
                <li><strong>Lise / Mesleki Eğitim:</strong> Kişi başı +3 Puan</li>
                <li><strong>Üniversite Öğrencisi:</strong> Kişi başı +4 Puan</li>
              </ul>
            </div>

            {/* Category E */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">E. BARINMA VE EŞYA ŞARTLARI (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Evsiz / Afetzede: <strong>+8 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Konut Ağır Hasarlı: <strong>+6 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 sm:col-span-2">Temel Beyaz Eşya Eksikliği (Buzdolabı, Çamaşır Mak. vs) de bu bölüme maksimum <strong>+3 Puan</strong> değerinde dahil edilir.</div>
              </div>
            </div>

            {/* Category F */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">F. PERSONEL İNCELEME KANAATİ (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-3 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              
              <div className="bg-red-50/80 border border-red-200 p-3.5 rounded-lg text-xs text-red-950 font-medium leading-relaxed">
                <strong className="text-red-900 font-extrabold block mb-1">4 Alt Kriter Üzerinden İnisiyatif Puanı:</strong>
                Sosyal incelemeyi yapan uzmanın kanaati hanenin puanını 10 puana kadar artırabilir. Yaşam koşulları, aciliyet, sosyal destek eksikliği ve risk durumu parametreleri baz alınır.
              </div>
            </div>

          </div>
        </div>

        {/* Security & Strict Rules */}
        <div className="bg-red-50 rounded-2xl p-8 border border-red-200 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-red-900 flex items-center gap-2 border-b border-red-200 pb-3">
            <AlertTriangle className="text-red-600" size={22} />
            6. Zorunlu Sistem Kontrolleri ve Beyan Aşımı
          </h3>

          <div className="space-y-3 text-sm text-red-950 leading-relaxed">
            <p>
              <strong>Gerçeğe Aykırı Beyan Tespiti:</strong> Başvuru sahibinin gelir, mülkiyet veya aile yapısına ilişkin gerçeğe aykırı beyanda bulunduğu tespit edilirse, sistem başvuruyu <strong>DOĞRUDAN REDDEDER</strong> (Tüm puan sıfırlanır).
            </p>

            <p>
              <strong>Otomatik Puan Düşüm Sistemi:</strong>
            </p>
            <ul className="text-xs space-y-1 text-red-900 list-disc pl-5 font-semibold">
              <li>Araç Tescil Kaydı Tespiti: <strong>-15 Puan</strong></li>
              <li>Birden Fazla Taşınmaz Mülkiyet: <strong>-20 Puan</strong></li>
              <li>Aktif SGK Prim Kaydı Tespiti: <strong>-5 Puan</strong></li>
              <li>Son 3 Ayda Mükerrer Vakıf Nakdi Yardımı: Kişi başı <strong>-5 Puan</strong></li>
            </ul>

            <p>
              <strong>Zorunlu Kurum Sorgulamaları:</strong> SGK sigorta dökümü, Tapu Kadastro mülkiyet kaydı ve EGM Araç tescil sorgusu yapılmadan inceleme formu Müdür onayına gönderilemez.
            </p>
          </div>
        </div>

        {/* KVKK & Data Security Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="text-blue-700" size={22} />
            7. KVKK Uyumluluğu ve İleri Düzey Siber Güvenlik Altyapısı
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Sistemde yer alan başvuru sahiplerine ve personellere ait tüm hassas kişisel veriler, uluslararası siber güvenlik standartlarına (AES-256-CBC) ve <strong>6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> hükümlerine tam uyumlu olarak kriptolojik koruma altındadır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                <Lock size={18} className="text-slate-700 dark:text-slate-300" />
                <span>Veritabanı Şifreleme (Mongoose Field Encryption)</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5 font-medium leading-relaxed">
                <li>Vatandaşlara ait T.C. Kimlik Numarası, Ad Soyad, Telefon Numarası, Ev Adresi ve sosyal inceleme formundaki özel nitelikli tüm JSON verileri veritabanında <strong>şifrelenmiş (encrypted)</strong> olarak tutulur.</li>
                <li>Sunucu veya veritabanı (MongoDB) doğrudan ele geçirilse dahi, özel 64 karakterli AES-256 <code>ENCRYPTION_KEY</code> olmadan veriler kesinlikle okunamaz ve anlamsız karakterler dizisi olarak görünür.</li>
                <li>Veriler ancak personel güvenli yetkiyle sisteme girdiğinde anlık olarak çözülerek ekrana yansıtılır (On-the-fly Decryption).</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                <Smartphone size={18} className="text-slate-700 dark:text-slate-300" />
                <span>2FA Çift Aşamalı Doğrulama & Oturum Güvenliği</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5 font-medium leading-relaxed">
                <li>Süper Admin ve kritik yetkilere sahip yöneticiler için <strong>Google Authenticator</strong> destekli 2 Adımlı Doğrulama (2FA) sistemi zorunlu tutulabilir.</li>
                <li>Kullanıcı şifreleri veritabanında düz metin yerine güçlü <strong>Bcrypt</strong> algoritmasıyla &quot;hash&quot;lenerek saklanır (Geri döndürülemez).</li>
                <li>Giriş yapan personellerin oturumları, AES-GCM kullanılarak imzalanan ve şifrelenen <strong>JWE (JSON Web Encryption)</strong> JWT tokenları ile korunur; dışarıdan müdahale (XSS/CSRF) engellenir.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* MongoDB Replica Set / Transactions Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Layers className="text-indigo-700" size={22} />
            8. Veritabanı Altyapısı ve Güvenli Toplu İşlemler (MongoDB Transactions)
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Sistemde binlerce kaydın aynı anda onaylanması veya reddedilmesi (Toplu Onaylama) gibi kritik operasyonlarda veritabanı tutarlılığını sağlamak için <strong>MongoDB Transactions (Atomik İşlemler)</strong> altyapısı kullanılmaktadır. Bu sayede, toplu işlem sırasında olası bir sunucu hatası durumunda veriler otomatik olarak eski haline (Rollback) getirilir.
          </p>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              Kendi Sunucunuza (Local Hosting) Geçiş Hakkında Kritik Uyarı
            </h4>
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              MongoDB Transactions (Toplu işlemler vb.) özelliği, veritabanının bir <strong>Replica Set</strong> olarak yapılandırılmış olmasını zorunlu kılar. Şu an kullandığınız <em>MongoDB Atlas internet hizmeti</em> bu desteğe varsayılan olarak sahiptir. İleride sistemi kurumunuzun kendi iç sunucusuna (Local Server) taşıdığınızda, MongoDB&apos;yi standart tekli kurulum yerine mutlaka <strong>Replica Set (rs0)</strong> konfigürasyonunda kurmalısınız. Aksi takdirde toplu onaylama gibi transaction gerektiren özellikler çalışmayacaktır.
            </p>
          </div>
        </div>

      </main>

      {/* References Section */}
      <div className="bg-slate-900 dark:bg-slate-950 py-10 mt-10 border-t border-slate-800">
        <div className="max-w-5xl mx-auto w-full px-6 lg:px-10">
          <h3 className="text-lg font-black text-slate-100 flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-slate-400" />
            Metodoloji Kaynakçası (References & Literature)
          </h3>
          <ul className="space-y-3 text-xs text-slate-400 font-medium">
            <li className="flex gap-2">
              <span className="text-slate-600 font-bold">[1]</span>
              <span><strong>Alkire, S., & Foster, J. (2011).</strong> &quot;Counting and multidimensional poverty measurement.&quot; <em>Journal of Public Economics</em>, 95(7-8), 476-487. (MPI - Çok Boyutlu Yoksulluk Endeksi hesaplama prensipleri)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 font-bold">[2]</span>
              <span><strong>Coady, D., Grosh, M., & Hoddinott, J. (2004).</strong> &quot;Targeting of Transfers in Developing Countries: Review of Lessons and Experience.&quot; <em>World Bank Publications</em>. (PMT - Proxy Means Testing ağırlıklandırma modeli)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 font-bold">[3]</span>
              <span><strong>T.C. Aile ve Sosyal Hizmetler Bakanlığı (2023).</strong> Sosyal Yardım İstatistikleri ve Yoksulluk Ölçütleri Bülteni. (Türkiye&apos;ye özgü muhtaçlık sınırı, eğitim ve engellilik yardım limitasyonları)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 font-bold">[4]</span>
              <span><strong>UNDP & OPHI (2022).</strong> &quot;Global Multidimensional Poverty Index: Unpacking deprivation bundles to reduce multidimensional poverty.&quot; (Kesişen dezavantajlar ve kırılganlık katsayıları)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </SidebarLayout>
  );
}

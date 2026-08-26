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
            4. Toplam Puan Tavanı ve Yardım Seviyeleri Skalası (Daraltılmış Tavan & Artan Aralık Mantığı)
          </h3>

          <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl text-xs text-red-950 space-y-2">
            <strong className="text-red-900 font-extrabold text-sm block">Kademeli Değerlendirme ve Seçicilik Esası:</strong>
            <p>
              Sosyal yardım bütçesinin ve nakdi kaynakların en ağır durumdaki gerçek ihtiyaç sahiplerine adil dağıtılması amacıyla 
              <strong> Progressive / Artan Aralık Metodolojisi</strong> uygulanmaktadır:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              <li><strong>1. Derece (Daraltılmış Tavan - 15 Puan):</strong> En yüksek tavan aralığı 15 puan olarak dar tutulmuştur (136 - 150 Puan). Böylece sadece aşırı yüksek kırılganlığa sahip en mağdur ve sınırlı sayıda hane 10.000 TL yardım bandına ulaşır.</li>
              <li><strong>Kademeli Genişleyen Aralıklar (20, 25, 40 Puan):</strong> Alt derecelere doğru inildikçe puan aralıkları genişler (15 Puan → 20 Puan → 25 Puan → 40 Puan).</li>
            </ul>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Form 7 ana kategoride toplam <strong>Maksimum 150 Puan</strong> üzerinden hesaplanır. Tavsiye edilen yardım seviyeleri aşağıdadır:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">1. Derece Aşırı Muhtaç</span>
                <span className="text-2xl font-black text-emerald-900">136 - 150</span>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1">15 Puanlık Dar Tavan</p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-sm font-extrabold text-emerald-800">
                10.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase block mb-1">2. Derece Ağır Muhtaç</span>
                <span className="text-2xl font-black text-blue-900">116 - 135</span>
                <p className="text-[11px] font-semibold text-blue-700 mt-1">20 Puanlık Aralık</p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200 text-sm font-extrabold text-blue-800">
                7.500 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-800 uppercase block mb-1">3. Derece Orta Muhtaç</span>
                <span className="text-2xl font-black text-indigo-900">91 - 115</span>
                <p className="text-[11px] font-semibold text-indigo-700 mt-1">25 Puanlık Aralık</p>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200 text-sm font-extrabold text-indigo-800">
                5.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase block mb-1">4. Derece Temel Destek</span>
                <span className="text-2xl font-black text-amber-900">51 - 90</span>
                <p className="text-[11px] font-semibold text-amber-700 mt-1">40 Puanlık Kalan Aralık</p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-sm font-extrabold text-amber-800">
                2.500 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Uygun Değil / Ayni</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-200">0 - 50</span>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">51 Puanlık Taban Bandı</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                0 TL / Ayni Yardım
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Categories Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Layers className="text-indigo-600" size={22} />
            5. Değerlendirme Kriterleri ve Hesaplama Detayları
          </h3>

          <div className="space-y-6">
            
            {/* Category A */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">A. EKONOMİK DURUM (Maksimum 40 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 40 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hanedeki kişi başına düşen aylık net gelirin resmi Muhtaçlık Sınırı oranlarına göre puanlanması:</p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-5 font-medium">
                <li><strong>Muhtaçlık Sınırının %25 Altı:</strong> +40 Puan</li>
                <li><strong>Muhtaçlık Sınırının %25 – %50 Arası:</strong> +35 Puan</li>
                <li><strong>Muhtaçlık Sınırının %50 – %75 Arası:</strong> +25 Puan</li>
                <li><strong>Muhtaçlık Sınırının %75 – %100 Arası:</strong> +15 Puan</li>
                <li><strong>İlave / Düzeltme Puanları:</strong> Hanede Çalışan Yok (+10 Puan) • Düzenli Gelir Yok (+5 Puan) • SGK Kaydı Yok (+5 Puan)</li>
                <li><strong>Son 3 Ayda Vakıf Nakdi Yardım Alınması:</strong> Kişi başı <strong>-5 Puan Düşüm</strong> uygulanır (Mükerrer ve sık yardımları engelleme dengesi).</li>
              </ul>
            </div>

            {/* Category B */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">B. DEZAVANTAJLI BİREYLER (Maksimum 30 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 30 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hanede bakıma muhtaç, engelli veya özel hassasiyeti bulunan bireylerin mevcudiyeti:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Ağır Engelli (%70+): <strong>+15 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Engelli (%40-69): <strong>+10 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Evde Bakım Hastası: <strong>+10 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Kanser Tedavisi Gören: <strong>+10 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Kronik Hastalık: <strong>+6 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">65 Yaş Üstü Yalnız Yaşayan: <strong>+8 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Şehit Yakını / Gazi: <strong>+8 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Yetim/Öksüz veya Koruyucu Aile: <strong>+5 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Yabancı Uyruklu / Sığınmacı: <strong>+3 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 sm:col-span-2">Özel Sebep / Özel Durum Tanımlama: <strong>+10 / +15 / +20 / +25 Puan</strong></div>
              </div>
            </div>

            {/* Category C */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">C. ÇOCUK VE EĞİTİM DURUMU (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hanedeki öğrenim gören çocuk ve genç sayısı üzerinden kişi başı hesaplanır (Tavan: 10 Puan):</p>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-5 font-medium">
                <li><strong>0-6 Yaş Çocuk (Bakım):</strong> Kişi başı +2 Puan</li>
                <li><strong>İlkokul Öğrencisi:</strong> Kişi başı +2 Puan</li>
                <li><strong>Ortaokul Öğrencisi:</strong> Kişi başı +2 Puan</li>
                <li><strong>Lise Öğrencisi:</strong> Kişi başı +3 Puan</li>
                <li><strong>Mesleki Eğitim Merkezi Öğrencisi:</strong> Kişi başı +3 Puan</li>
                <li><strong>Açık Lise Öğrencisi:</strong> Kişi başı +3 Puan</li>
                <li><strong>Üniversite Öğrencisi:</strong> Kişi başı +4 Puan</li>
              </ul>
            </div>

            {/* Category D */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">D. BARINMA DURUMU (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Evsiz / Afetzede: <strong>+10 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Konut Ağır Hasarlı: <strong>+8 Puan</strong></div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">Sağlıksız Konut / Kiracı: <strong>+6 / +5 Puan</strong></div>
              </div>
            </div>

            {/* Category E */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">E. BEYAZ EŞYA VE EV ALETLERİ KONTROLÜ (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Eşyanın hanedeki varlık ve arıza/eskime durumuna göre puan verilir:</p>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-medium">
                <p>• <strong>Buzdolabı / Çamaşır Makinesi:</strong> Yok ise <strong>+3 Puan</strong>, Eski/Arızalı ise <strong>+1.5 Puan</strong></p>
                <p>• <strong>Fırın / Ocak:</strong> Yok ise <strong>+2 Puan</strong>, Eski/Arızalı ise <strong>+1 Puan</strong></p>
                <p>• <strong>Bulaşık M. / TV / Telefon / Klima / Süpürge:</strong> Yok ise <strong>+1 Puan</strong>, Eski/Arızalı ise <strong>+0.5 Puan</strong></p>
              </div>
            </div>

            {/* Category F */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">F. SOSYAL KIRILGANLIK VE NÜFUS ŞARTLARI (Maksimum 30 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded">Tavan: 30 Puan</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-5 font-medium">
                <li><strong>Aile İçi Şiddet Mağduru:</strong> +6 Puan</li>
                <li><strong>Kadın Hane Reisi:</strong> +5 Puan</li>
                <li><strong>Eşi Cezaevinde:</strong> +5 Puan</li>
                <li><strong>Afet Nedeniyle Gelir Kaybı:</strong> +5 Puan</li>
                <li><strong>Madde Bağımlılığı / Sosyal Güvencesiz:</strong> +5 Puan</li>
                <li><strong>Borç / İcra Baskısı:</strong> +4 Puan</li>
                <li><strong>Bakıma Muhtaç Bebek / Gebelik:</strong> +4 Puan</li>
                <li><strong>Boşanmış Ebeveyn:</strong> +3 Puan</li>
                <li><strong>Dul (Eşi Vefat Etmiş):</strong> +3 Puan</li>
                <li><strong>Eski Hükümlü:</strong> +3 Puan</li>
                <li><strong>Hane Nüfusu Puanı (OECD Ölçeği):</strong> 1-2 kişi <strong>+1 Pn</strong> | 3-4 kişi <strong>+2 Pn</strong> | 5-6 kişi <strong>+4 Pn</strong> | 7+ kişi <strong>+6 Pn</strong></li>
              </ul>
            </div>

            {/* Category G */}
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">G. PERSONEL İNCELEME KANAATİ PUANLAMA METODOLOJİSİ (Maksimum 20 Puan)</h4>
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-3 py-1 rounded">Tavan: 20 Puan</span>
              </div>
              
              <div className="bg-red-50/80 border border-red-200 p-3.5 rounded-lg text-xs text-red-950 font-medium leading-relaxed">
                <strong className="text-red-900 font-extrabold block mb-1">0 - 5 Puanlama Ölçeği Temel Mantığı:</strong>
                Sosyal yardım puanlama sisteminde amaç hanenin <strong>muhtaçlık derecesini tespit etmektir</strong>. Dolayısıyla;
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>0 PUAN:</strong> Hanenin durumu olumludur, fiziki/sosyal şartları yeterlidir, aciliyeti veya riski yoktur. İlave puana ihtiyaç duyulmadığını ifade eder.</li>
                  <li><strong>5 PUAN:</strong> Hane şartları aşırı olumsuzdur, fiziki durumu yaşanamaz haldedir, aciliyeti veya riski kriz seviyesindedir. Haneye ilave <strong>+5 Puan</strong> verilerek yardım alma önceliği en üst seviyeye çıkartılır.</li>
                </ul>
              </div>

              {/* Detailed Breakdown for each 4 subfields */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Kanaat Alanları ve Puan Karşılıkları:</h5>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">1. Yaşam Koşulları (Fiziki Ev Yapısı, Hijyen, Isınma, Eşya Durumu)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-900 dark:text-slate-100">0 Puan (İyi / Yeterli):</strong> Temiz, hijyenik, bakımlı, ısınması ve eşyaları tam, sağlıklı yaşam ortamı.
                    </div>
                    <div className="p-2 rounded bg-red-50 border border-red-200 text-red-950">
                      <strong className="text-red-900">5 Puan (Çok Kötü / Harabe):</strong> Rutubetli, soğuk, bakımsız, eşyasız, insan onuruna aykırı, yaşanamaz ev koşulları.
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">2. Aciliyet Durumu (Yardım İvediliği ve Kriz Boyutu)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-900 dark:text-slate-100">0 Puan (Acil Değil / Rutin):</strong> Hanenin anlık bir kriz hali yoktur, rutin başvuru kategorisindedir.
                    </div>
                    <div className="p-2 rounded bg-red-50 border border-red-200 text-red-950">
                      <strong className="text-red-900">5 Puan (Çok Acil / Kritik Kriz):</strong> Açlık, yakacaksız kalma, barınamama veya anlık sağlık krizi riski. Derhal yardım gerektirir.
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">3. Sosyal Destek Yetersizliği (Akraba ve Çevre Dayanışması)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-900 dark:text-slate-100">0 Puan (Desteği Var):</strong> Haneye bakacak, destek çıkacak yakın akraba veya çevre dayanışması mevcuttur.
                    </div>
                    <div className="p-2 rounded bg-red-50 border border-red-200 text-red-950">
                      <strong className="text-red-900">5 Puan (Kimsesiz / Sıfır Destek):</strong> Hanenin sığınabileceği hiçbir yakını, akrabası veya komşu desteği bulunmamaktadır.
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">4. Risk Değerlendirmesi (Güvenlik, İhmal, İstismar, Yaşlı/Çocuk Riski)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <strong className="text-slate-900 dark:text-slate-100">0 Puan (Güvenli / Risk Yok):</strong> Ortam güvenlidir, kriz veya istismar/ihmal riski tespit edilmemiştir.
                    </div>
                    <div className="p-2 rounded bg-red-50 border border-red-200 text-red-950">
                      <strong className="text-red-900">5 Puan (Hayati Risk / Tehlike):</strong> Çocuk ihmali, şiddet tehlikesi, ağır bakımsızlık veya güvenlik tehdidi mevcuttur.
                    </div>
                  </div>
                </div>

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
              <li>Aktif SGK Prim Kaydı: A Kategorisi sıfırlanır</li>
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
    </div>
    </SidebarLayout>
  );
}

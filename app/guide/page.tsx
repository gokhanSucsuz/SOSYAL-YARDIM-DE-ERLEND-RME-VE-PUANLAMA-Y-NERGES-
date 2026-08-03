"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, BookOpen, Scale, Award, AlertTriangle, FileText, CheckCircle2, Home, HeartHandshake, HelpCircle, Layers, Check } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-1">
            <ArrowLeft size={20} />
          </Link>
          <div className="bg-blue-600 p-2 rounded hidden sm:block">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">SOSYAL İNCELEME VE PUANLAMA KILAVUZU</h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
              T.C. Sosyal Yardımlaşma ve Dayanışma Vakfı Standart Metodoloji Rehberi
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
        >
          <Home size={16} /> Panele Dön
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10 space-y-10">
        
        {/* Banner Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0 opacity-70 transform translate-x-20 -translate-y-20"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-blue-200">
              <BookOpen size={14} className="text-blue-700" /> RESMİ UYGULAMA MEVZUATI VE METODOLOJİ REHBERİ
            </div>

            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Sosyal İnceleme Puanlama Sistemi ve Yardım Kriterleri
            </h2>

            <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
              Bu kılavuz, <strong>3294 Sayılı Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu</strong> çerçevesinde, 
              Sosyal İnceleme Görevlileri tarafından hanelerde gerçekleştirilen saha ziyaretlerinde uygulanan 
              <strong> objektif, şeffaf ve bilimsel puanlama metodolojisini</strong> detaylandırmak amacıyla hazırlanmıştır.
            </p>
          </div>
        </div>

        {/* System Purpose */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="text-blue-600" size={22} />
            1. Sistem Amacı ve Yasal Dayanak
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-base mb-2">Kurumsal Amaç</h4>
              <p>
                Ayni ve nakdi sosyal yardımların insan inisiyatifinden bağımsız, standartlaştırılmış matematiksel parametrelere dayalı olarak 
                en doğru ihtiyaç sahibine adil bir biçimde ulaştırılması amaçlanmaktadır. Sistem, hanelerin sosyo-ekonomik kırılganlık durumunu bütüncül olarak ölçer.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-base mb-2">Denetlenebilirlik ve Şeffaflık</h4>
              <p>
                Saha personelinin yaptığı her değerlendirme, işaretlenen detaylı seçenekler ile kayıt altına alınır ve Vakıf Müdürü onayına sunulur. Tüm veri ve puanlamalar resmi çıktı formatında imzalanabilir ve arşivlenebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Scale Overview */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="text-emerald-600" size={22} />
            2. Toplam Puan Tavanı ve Yardım Seviyeleri Skalası
          </h3>

          <p className="text-sm text-slate-600">
            Sosyal İnceleme Formu 7 ana kategoriden oluşmakta olup <strong>Maksimum Toplam Puan 130</strong>'dur. 
            Hesaplanan puan doğrultusunda sistem tarafından tavsiye edilen nakdi yardım seviyeleri aşağıdadır:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">1. Derece Yüksek</span>
                <span className="text-2xl font-black text-emerald-900">91 - 130</span>
                <p className="text-xs font-semibold text-emerald-700 mt-1">Puan Aralığı</p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-sm font-extrabold text-emerald-800">
                10.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase block mb-1">2. Derece Muhtaç</span>
                <span className="text-2xl font-black text-blue-900">71 - 90</span>
                <p className="text-xs font-semibold text-blue-700 mt-1">Puan Aralığı</p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200 text-sm font-extrabold text-blue-800">
                7.500 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-800 uppercase block mb-1">3. Derece Muhtaç</span>
                <span className="text-2xl font-black text-indigo-900">51 - 70</span>
                <p className="text-xs font-semibold text-indigo-700 mt-1">Puan Aralığı</p>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200 text-sm font-extrabold text-indigo-800">
                5.000 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase block mb-1">4. Derece Destek</span>
                <span className="text-2xl font-black text-amber-900">31 - 50</span>
                <p className="text-xs font-semibold text-amber-700 mt-1">Puan Aralığı</p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-sm font-extrabold text-amber-800">
                2.500 TL Nakdi Yardım
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Uygun Değil / Ayni</span>
                <span className="text-2xl font-black text-slate-800">0 - 30</span>
                <p className="text-xs font-semibold text-slate-600 mt-1">Puan Aralığı</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-slate-700">
                Ayni Yardım Yönlendirmesi
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Categories Breakdown */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="text-indigo-600" size={22} />
            3. Değerlendirme Kriterleri ve Hesaplama Detayları
          </h3>

          <div className="space-y-6">
            
            {/* Category A */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">A. EKONOMİK DURUM (Maksimum 40 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 40 Puan</span>
              </div>
              <p className="text-xs text-slate-600">Hanedeki kişi başına düşen aylık net gelirin resmi Açlık Sınırı oranlarına göre puanlanması:</p>
              <ul className="text-xs space-y-1.5 text-slate-700 list-disc pl-5 font-medium">
                <li><strong>Açlık Sınırının %25 Altı:</strong> +40 Puan</li>
                <li><strong>Açlık Sınırının %25 – %50 Arası:</strong> +35 Puan</li>
                <li><strong>Açlık Sınırının %50 – %75 Arası:</strong> +25 Puan</li>
                <li><strong>Açlık Sınırının %75 – %100 Arası:</strong> +15 Puan</li>
                <li><strong>İlave Puanlar:</strong> Hanede Çalışan Yok (+10 Puan) • Düzenli Gelir Yok (+5 Puan) • SGK Kaydı Yok (+5 Puan)</li>
              </ul>
            </div>

            {/* Category B */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">B. DEZAVANTAJLI BİREYLER (Maksimum 30 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 30 Puan</span>
              </div>
              <p className="text-xs text-slate-600">Hanede bakıma muhtaç, engelli veya özel hassasiyeti bulunan bireylerin mevcudiyeti:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                <div className="bg-white p-2 rounded border border-slate-200">Ağır Engelli (%70+): <strong>+15 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Engelli (%40-69): <strong>+10 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Evde Bakım Hastası: <strong>+10 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Kanser Tedavisi Gören: <strong>+10 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Kronik Hastalık: <strong>+6 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">65 Yaş Üstü Yalnız Yaşayan: <strong>+8 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Şehit Yakını / Gazi: <strong>+8 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Yetim/Öksüz veya Koruyucu Aile: <strong>+5 Puan</strong></div>
              </div>
            </div>

            {/* Category C */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">C. ÇOCUK VE EĞİTİM DURUMU (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <p className="text-xs text-slate-600">Hanedeki öğrenim gören çocuk sayısı üzerinden hesaplanır:</p>
              <ul className="text-xs space-y-1 text-slate-700 list-disc pl-5 font-medium">
                <li><strong>0-6 Yaş Çocuk:</strong> Kişi başı +2 Puan</li>
                <li><strong>İlkokul Öğrencisi:</strong> Kişi başı +1 Puan</li>
                <li><strong>Ortaokul Öğrencisi:</strong> Kişi başı +2 Puan</li>
                <li><strong>Lise Öğrencisi:</strong> Kişi başı +3 Puan</li>
                <li><strong>Üniversite Öğrencisi:</strong> Kişi başı +4 Puan</li>
              </ul>
            </div>

            {/* Category D */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">D. BARINMA DURUMU (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 font-medium">
                <div className="bg-white p-2 rounded border border-slate-200">Evsiz / Afetzede: <strong>+10 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Konut Ağır Hasarlı: <strong>+8 Puan</strong></div>
                <div className="bg-white p-2 rounded border border-slate-200">Sağlıksız Konut / Kiracı: <strong>+6 / +5 Puan</strong></div>
              </div>
            </div>

            {/* Category E */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">E. BEYAZ EŞYA VE EV ALETLERİ KONTROLÜ (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <p className="text-xs text-slate-600">Eşyanın hanedeki varlık ve arıza/eskime durumuna göre puan verilir:</p>
              <div className="text-xs text-slate-700 space-y-1 font-medium">
                <p>• <strong>Buzdolabı / Çamaşır Makinesi:</strong> Yok ise <strong>+3 Puan</strong>, Eski/Arızalı ise <strong>+1.5 Puan</strong></p>
                <p>• <strong>Fırın / Ocak:</strong> Yok ise <strong>+2 Puan</strong>, Eski/Arızalı ise <strong>+1 Puan</strong></p>
                <p>• <strong>Bulaşık M. / TV / Telefon / Klima / Süpürge:</strong> Yok ise <strong>+1 Puan</strong>, Eski/Arızalı ise <strong>+0.5 Puan</strong></p>
              </div>
            </div>

            {/* Category F */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">F. SOSYAL KIRILGANLIK (Maksimum 10 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 10 Puan</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-700 list-disc pl-5 font-medium">
                <li><strong>Aile İçi Şiddet Mağduru:</strong> +6 Puan</li>
                <li><strong>Kadın Hane Reisi:</strong> +5 Puan</li>
                <li><strong>Eşi Cezaevinde:</strong> +5 Puan</li>
                <li><strong>Afet Nedeniyle Gelir Kaybı:</strong> +5 Puan</li>
                <li><strong>Boşanmış Ebeveyn:</strong> +3 Puan</li>
              </ul>
            </div>

            {/* Category G */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-base">G. PERSONEL İNCELEME KANAATİ (Maksimum 20 Puan)</h4>
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded">Tavan: 20 Puan</span>
              </div>
              <p className="text-xs text-slate-600">
                Sosyal İnceleme Görevlisinin hane ortamını gözlemleyerek takdir ettiği kanaat puanları (0-5 Puan arası):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold text-slate-800">
                <div className="bg-white p-2.5 rounded border border-slate-200">Yaşam Koşulları (0-5)</div>
                <div className="bg-white p-2.5 rounded border border-slate-200">Aciliyet Durumu (0-5)</div>
                <div className="bg-white p-2.5 rounded border border-slate-200">Sosyal Destek (0-5)</div>
                <div className="bg-white p-2.5 rounded border border-slate-200">Risk Değerlendirme (0-5)</div>
              </div>
            </div>

          </div>
        </div>

        {/* Security & Strict Rules */}
        <div className="bg-red-50 rounded-2xl p-8 border border-red-200 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-red-900 flex items-center gap-2 border-b border-red-200 pb-3">
            <AlertTriangle className="text-red-600" size={22} />
            4. Zorunlu Sistem Kontrolleri ve Beyan Aşımı
          </h3>

          <div className="space-y-3 text-sm text-red-950 leading-relaxed">
            <p>
              <strong>Gerçeğe Aykırı Beyan Tespiti:</strong> Başvuru sahibinin gelir, mülkiyet veya aile yapısına ilişkin gerçeğe aykırı beyanda bulunduğu tespit edilirse, sistem başvuruyu <strong>DOĞRUDAN REDDEDER</strong> (Tüm puan sıfırlanır).
            </p>

            <p>
              <strong>Zorunlu Kurum Sorgulamaları:</strong> SGK sigorta dökümü, Tapu Kadastro mülkiyet kaydı ve EGM Araç tescil sorgusu yapılmadan inceleme formu Müdür onayına gönderilemez.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

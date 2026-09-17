"use client";

export const dynamic = "force-dynamic";

import React from 'react';
import Link from 'next/link';
import { SidebarLayout } from '@/components/sidebar';
import {
  BookOpen,
  Presentation,
  Target,
  Calculator,
  AlertTriangle,
  Scale,
  Award,
  Wallet,
  HeartPulse,
  Users,
  GraduationCap,
  Home,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function GuidePage() {
  return (
    <SidebarLayout>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="font-black text-lg text-slate-900 dark:text-slate-100">📘 Detaylı Sistem Kılavuzu</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Sosyal Yardım Değerlendirme ve Puanlama</p>
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
        <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-10 space-y-10">

          {/* Banner Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-0 opacity-70 transform translate-x-20 -translate-y-20"></div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-primary-200">
                <BookOpen size={14} className="text-primary-700" /> HERKES İÇİN ANLAŞILIR KILAVUZ
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                Sistemin Amacı: Neden Böyle Bir Yazılıma İhtiyacımız Var?
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Vakfımıza her gün onlarca vatandaşımız yardım talebiyle başvurmaktadır. Ancak devletimizin kaynakları ve vakfımızın bütçesi belirli bir sınır içindedir. Bu durumda en zor karar şudur: <strong>&quot;Kimin yardıma DAHA ÇOK ihtiyacı var?&quot;</strong>
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 mt-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Örneğin:</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Bir yanda hiç geliri olmayan ama başını sokacak bir evi olan bir vatandaşımız var.</li>
                  <li>Diğer yanda asgari ücretle çalışan ama evinde yatalak hastası olan ve kirada oturan bir aile var.</li>
                </ul>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-4">
                İnsan gözüyle bakıldığında kimin daha mağdur olduğuna karar vermek hem çok zordur hem de kişiden kişiye değişebilir. İşte bu sistem, insani duygulardan ve kişisel görüşlerden bağımsız, <strong>tamamen matematiğe ve bilimsel verilere (Dünya Bankası ve OECD standartlarına)</strong> dayalı adil bir karar vermek için tasarlanmıştır.
              </p>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-semibold">
                Görevli personelimiz vatandaşın evine gittiğinde sistemdeki soruları yanıtlar. Sistem arka planda bu cevapları bir süzgeçten geçirir ve <strong className="text-primary-600">0 ile 100 arasında bir &quot;Muhtaçlık Puanı&quot;</strong> hesaplar. Puan ne kadar yüksekse, ailenin durumu o kadar acil ve zordur.
              </p>
            </div>
          </div>

          {/* Section: Step by Step Logic */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Adım Adım Puanlama Sistemi (Detaylı Anlatım)</h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Toplam 100 Puanlık Algoritmanın Açıklaması</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sistem toplam 6 ana başlıkta (A, B, C, D, E, F) puanlama yapar. Bir hanenin alabileceği <strong>maksimum toplam puan 100&apos;dür</strong>. Şimdi bu başlıkların her birini, neden böyle puanlandığını açıklayarak inceleyelim:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Category A */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Wallet className="text-emerald-500" size={20} /> A. Ekonomik Durum
                  </h3>
                  <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">Maks: 25 Puan</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bu bölüm hanenin cebine giren parayı ölçer.</p>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                  <li><strong>Gelir Durumu:</strong> Hane başı geliri muhtaçlık sınırının ne kadar altındaysa sistem o kadar yüksek puan verir.</li>
                  <li><strong>Çalışan Yokluğu (+3 Puan):</strong> Evde hiç çalışan, para kazanan biri yoksa ekstra puan verilir.</li>
                  <li><strong>Düzenli Gelir ve SGK Yokluğu (+4 Puan):</strong> Ailenin düzenli geliri yoksa ve SGK güvencesi bulunmuyorsa puanı artar.</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs italic text-slate-500">
                  <strong className="not-italic text-slate-700 dark:text-slate-300">Mantık:</strong> Gelir ne kadar düşükse ve düzensizse, ailenin ekonomik riski o kadar yüksektir.
                </div>
              </div>

              {/* Category B */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <HeartPulse className="text-rose-500" size={20} /> B. Dezavantajlı Bireyler
                  </h3>
                  <span className="text-xs font-black bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200">Maks: 25 Puan</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Evde hayatı zorlaştıran sağlık sorunları var mı?</p>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                  <li><strong>Engellilik ve Hastalık:</strong> Ağır engelli birey varsa <strong>+12 puan</strong>, evde bakım hastası varsa <strong>+8 puan</strong>, kanser veya kronik hasta varsa puanlar eklenir.</li>
                  <li><strong>Özel Sosyal Durumlar:</strong> Şehit yakını/gazi olmak (+6 puan), yetim çocuk (+4 puan), yaşlı ve yalnız yaşamak (+6 puan) ailenin puanını yükseltir.</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs italic text-slate-500">
                  <strong className="not-italic text-slate-700 dark:text-slate-300">Mantık:</strong> Engelli veya hasta bir bireye bakmak, ailenin hem maddi hem de manevi yükünü inanılmaz derecede artırır. En yüksek ek puanlar bu bölüme ayrılmıştır.
                </div>
              </div>

              {/* Category C */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Users className="text-indigo-500" size={20} /> C. Kırılganlık ve Nüfus
                  </h3>
                  <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">Maks: 15 Puan</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ailenin sosyal yapısı ne kadar kırılgan?</p>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                  <li><strong>Zorlu Yaşam Koşulları:</strong> Aile içi şiddet mağduru olmak (+5 puan), evi tek başına geçindiren bir kadın olmak (+4 puan), eşin cezaevinde olması (+4 puan), borç baskısı (+3 puan) değerlendirilir.</li>
                  <li><strong>Kalabalık Aile:</strong> Evde yaşayan kişi sayısı arttıkça masraf artar. 7 ve üzeri kişi yaşayan hanelere <strong>+4 puan</strong> eklenir.</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs italic text-slate-500">
                  <strong className="not-italic text-slate-700 dark:text-slate-300">Mantık:</strong> Bir kadının tek başına çocuklarına bakmaya çalışması veya ailenin şiddet geçmişi olması o aileyi sosyal yardıma daha muhtaç hale getirir.
                </div>
              </div>

              {/* Category D */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <GraduationCap className="text-blue-500" size={20} /> D. Eğitim ve Çocuk
                  </h3>
                  <span className="text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">Maks: 15 Puan</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Evde okuyan veya bakıma muhtaç küçük çocuk var mı?</p>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                  <li><strong>Eğitim Kademesi:</strong> Sistem çocukların yaşına ve okudukları okula göre puan verir.</li>
                  <li>0-6 yaş bebek veya ilkokul/ortaokul çocuğu: <strong>+2 Puan</strong> (çocuk başı)</li>
                  <li>Lise veya mesleki eğitim: <strong>+3 Puan</strong></li>
                  <li>Üniversite öğrencisi: <strong>+4 Puan</strong></li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs italic text-slate-500">
                  <strong className="not-italic text-slate-700 dark:text-slate-300">Mantık:</strong> Eğitim kademesi yükseldikçe, ailenin kırtasiye, yol ve harçlık giderleri artar.
                </div>
              </div>

              {/* Category E */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Home className="text-amber-500" size={20} /> E. Barınma ve Temel Eşya
                  </h3>
                  <span className="text-xs font-black bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200">Maks: 10 Puan</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ailenin yaşadığı evin fiziksel şartları nasıl?</p>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                  <li><strong>Ev Şartları:</strong> Aile evsizse veya afetzede ise <strong>+8 puan</strong> alır. Ev ağır hasarlıysa (+6 puan), rutubetli/sağlıksız ise (+4 puan) eklenir. Kiracı olmak da (+3 puan) kazandırır.</li>
                  <li><strong>Temel Eşyalar:</strong> Buzdolabı ve çamaşır makinesi &quot;lüks değil, hayati zorunluluktur&quot;. Yoksa <strong>+1.5 puan</strong> verir.</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs italic text-slate-500">
                  <strong className="not-italic text-slate-700 dark:text-slate-300">Mantık:</strong> Kışın ısınmayan, rutubetli bir evde yaşamak ailenin acil yardıma ihtiyacı olduğunun en somut göstergesidir.
                </div>
              </div>

              {/* Category F */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Scale className="text-purple-500" size={20} /> F. Görevli İnceleme Kanaati
                  </h3>
                  <span className="text-xs font-black bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200">Maks: 10 Puan</span>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Uzman sosyal yardım personelinin gözlemi</p>
                <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5">
                  <li>Matematik ve formüller her şeyi göremez. Görevlinin gözlemi de çok önemlidir.</li>
                  <li>Sahaya giden personel; evin genel durumunu, ailenin çaresizliğini ve çevreden destek alıp alamayacaklarını gözlemleyerek kanaatine göre 0-10 arası ek puan verir.</li>
                </ul>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs italic text-slate-500">
                  <strong className="not-italic text-slate-700 dark:text-slate-300">Mantık:</strong> Makineye duygu katılamaz, personelin gözlemlediği &quot;aciliyet&quot; sistemin ayrılmaz bir parçası olmalıdır.
                </div>
              </div>
            </div>
          </div>

          {/* Section: Penalty and Varlik Testi */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 sm:p-8 border border-red-200 dark:border-red-900/50 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-red-900 dark:text-red-400 flex items-center gap-2 border-b border-red-200 dark:border-red-900/50 pb-3">
              <AlertTriangle className="text-red-600 dark:text-red-500" size={24} />
              Ceza Puanları ve Güvenlik (Varlık Testi)
            </h3>

            <p className="text-sm text-red-950 dark:text-red-200 leading-relaxed font-medium">
              Adaleti sağlamak sadece ihtiyacı olana puan vermekle olmaz; ihtiyacı olmadığı halde yardım almaya çalışanları engellemekle de olur. Sistem bu yüzden <strong>&quot;Ceza Puanları&quot;</strong> uygular:
            </p>

            <ul className="text-sm space-y-3 text-red-900 dark:text-red-300 font-semibold mt-4">
              <li className="flex items-center gap-3 bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 flex items-center justify-center font-black shrink-0">1</span>
                <span><strong>Araç Sahibi Olmak:</strong> Tespit edilirse hanenin toplam puanından anında <strong>-15 Puan</strong> düşer.</span>
              </li>
              <li className="flex items-center gap-3 bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 flex items-center justify-center font-black shrink-0">2</span>
                <span><strong>Birden Fazla Taşınmaz (Ev/Arsa):</strong> Tespit edilirse <strong>-20 Puan</strong> düşer.</span>
              </li>
              <li className="flex items-center gap-3 bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 flex items-center justify-center font-black shrink-0">3</span>
                <span><strong>Aktif SGK Kaydı:</strong> Evde çalışan biri varsa <strong>-5 Puan</strong> düşer.</span>
              </li>
              <li className="flex items-center gap-3 bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 flex items-center justify-center font-black shrink-0">4</span>
                <span><strong>Yakın Zamanda Yardım Almak:</strong> Aile son 3 ay içinde zaten vakıftan yardım almışsa kişi başı <strong>-5 Puan</strong> düşülür (Yardımı tabana yaymak için).</span>
              </li>
              <li className="flex items-center gap-3 bg-red-100 dark:bg-red-900/50 p-3 rounded-xl border border-red-300 dark:border-red-700">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black shrink-0">5</span>
                <span><strong>Yalan Beyan:</strong> Gelir saklandığı tespit edilirse, sistem puanı acımasızca <strong>SIFIRLAR (0)</strong> ve yardımı reddeder.</span>
              </li>
            </ul>
          </div>

          {/* Section: Output Tiers */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Sistem Nasıl Karar Veriyor? (Derecelendirme)</h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Nihai toplam puana göre otomatik sınıflandırma</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-emerald-800 dark:text-emerald-400 font-extrabold text-sm mb-1">1. DERECE</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-500 font-medium mb-3">Kritik / Çok Yüksek İhtiyaç</div>
                <div className="text-lg font-black text-emerald-900 dark:text-emerald-300 border-t border-emerald-200 dark:border-emerald-800 pt-2">86 - 100 Puan</div>
              </div>
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-center">
                <div className="text-teal-800 dark:text-teal-400 font-extrabold text-sm mb-1">2. DERECE</div>
                <div className="text-xs text-teal-700 dark:text-teal-500 font-medium mb-3">Yüksek İhtiyaç</div>
                <div className="text-lg font-black text-teal-900 dark:text-teal-300 border-t border-teal-200 dark:border-teal-800 pt-2">71 - 85 Puan</div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-center">
                <div className="text-blue-800 dark:text-blue-400 font-extrabold text-sm mb-1">3. DERECE</div>
                <div className="text-xs text-blue-700 dark:text-blue-500 font-medium mb-3">Orta Düzey İhtiyaç</div>
                <div className="text-lg font-black text-blue-900 dark:text-blue-300 border-t border-blue-200 dark:border-blue-800 pt-2">56 - 70 Puan</div>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-center">
                <div className="text-indigo-800 dark:text-indigo-400 font-extrabold text-sm mb-1">4. DERECE</div>
                <div className="text-xs text-indigo-700 dark:text-indigo-500 font-medium mb-3">Düşük-Orta İhtiyaç</div>
                <div className="text-lg font-black text-indigo-900 dark:text-indigo-300 border-t border-indigo-200 dark:border-indigo-800 pt-2">41 - 55 Puan</div>
              </div>
              <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 text-center">
                <div className="text-violet-800 dark:text-violet-400 font-extrabold text-sm mb-1">5. DERECE</div>
                <div className="text-xs text-violet-700 dark:text-violet-500 font-medium mb-3">Temel İhtiyaç</div>
                <div className="text-lg font-black text-violet-900 dark:text-violet-300 border-t border-violet-200 dark:border-violet-800 pt-2">26 - 40 Puan</div>
              </div>
              <div className="p-4 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800 text-center">
                <div className="text-fuchsia-800 dark:text-fuchsia-400 font-extrabold text-sm mb-1">6. DERECE</div>
                <div className="text-xs text-fuchsia-700 dark:text-fuchsia-500 font-medium mb-3">Dönemsel / Sınır İhtiyaç</div>
                <div className="text-lg font-black text-fuchsia-900 dark:text-fuchsia-300 border-t border-fuchsia-200 dark:border-fuchsia-800 pt-2">10 - 25 Puan</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-center">
                <div className="text-slate-800 dark:text-slate-300 font-extrabold text-sm mb-1">KAPSAM DIŞI</div>
                <div className="text-xs text-slate-700 dark:text-slate-400 font-medium mb-3">Red / Ayni Yardım</div>
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 border-t border-slate-300 dark:border-slate-600 pt-2">0 - 9 Puan</div>
              </div>
            </div>
          </div>

          {/* Section: Conclusion */}
          <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 text-white mt-12">
            <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-700 pb-3">
              <ShieldCheck className="text-emerald-500" size={24} />
              Kurumsal Katkılar ve Sonuç
            </h3>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block text-emerald-400 mb-1">Tam Şeffaflık:</strong>
                  <span className="text-sm text-slate-300">Vatandaş veya denetçiler &quot;Neden bu aileye yardım ettiniz de diğerine etmediniz?&quot; diye sorduğunda, &quot;Çünkü A ailesinin sistem puanı 85, B ailesinin ise 25&quot; şeklinde net, bilimsel ve belgelenebilir bir cevap verilir.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block text-emerald-400 mb-1">Kayırmacılığın Önlenmesi:</strong>
                  <span className="text-sm text-slate-300">Formüller sabittir, görevlinin veya müdürün inisiyatifi minimuma indirilerek adam kayırmanın önüne geçilir.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <strong className="block text-emerald-400 mb-1">Gerçek İhtiyaç Sahibine Ulaşım:</strong>
                  <span className="text-sm text-slate-300">Bütçe kısıtlı olduğunda, puanlama sistemi yardımların gerçekten en dipten, en muhtaç olanlardan başlayarak dağıtılmasını garanti altına alır.</span>
                </div>
              </li>
            </ul>
          </div>

        </main>
      </div>
    </SidebarLayout>
  );
}

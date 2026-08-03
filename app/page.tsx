"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAssessments, getAssessmentsByPersonnel, Assessment } from '@/lib/db';
import { FileText, Plus, LogOut, Users, CheckCircle2, XCircle, ShieldCheck, Printer, Clock, Filter, Check, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const currentUser = JSON.parse(userStr);
    setUser(currentUser);
    
    const loadData = async () => {
      try {
        if (currentUser.role === 'manager') {
          setAssessments(await getAllAssessments());
        } else {
          setAssessments(await getAssessmentsByPersonnel(currentUser.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router]);

  if (!user || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-500 font-medium animate-pulse">Yükleniyor...</div></div>;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const total = assessments.length;
  const pendingCount = assessments.filter(a => a.status !== 'approved').length;
  const approvedList = assessments.filter(a => a.status === 'approved');
  const approvedCount = approvedList.length;

  const filteredAssessments = assessments.filter(item => {
    if (filterStatus === 'pending') return item.status !== 'approved';
    if (filterStatus === 'approved') return item.status === 'approved';
    return true;
  });

  const handlePrintApprovedList = () => {
    setFilterStatus('approved');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Print Specific Styles for Approved List PDF */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm 12mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 10px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-table td, .print-table th {
            padding: 5px 8px !important;
            border: 1px solid #000000 !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      {/* Screen Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 z-10 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-bold leading-tight">SOSYAL YARDIM DEĞERLENDİRME VE İNCELEME SİSTEMİ</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-widest uppercase">
              {user.role === 'manager' ? 'Müdür Yetkilisi Yönetim Paneli' : 'Personel Paneli'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <Link
            href="/guide"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-slate-700"
            title="Puanlama ve İnceleme Kılavuzu"
          >
            <BookOpen size={16} className="text-blue-400 shrink-0" />
            <span>Kılavuz & Metodoloji</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right border-r border-slate-700 pr-3">
              <p className="text-[10px] text-slate-400">{user.role === 'manager' ? 'Müdür Yetkilisi' : 'İnceleyen Personel'}</p>
              <p className="text-xs sm:text-sm font-semibold truncate max-w-[120px]">{user.name}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white transition-colors active:scale-95 touch-manipulation" title="Çıkış Yap">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Screen Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5 no-print">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Gösterge Paneli</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Hane inceleme ziyaretleri, onay süreçleri ve resmi raporlama.</p>
          </div>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {user.role === 'manager' && (
              <button
                onClick={handlePrintApprovedList}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-emerald-950/20 touch-manipulation"
              >
                <Printer size={18} />
                <span>Onaylı Liste PDF Çıktısı Al ({approvedCount})</span>
              </button>
            )}

            {user.role === 'personnel' && (
              <Link href="/assessment/new" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 font-extrabold text-sm transition-all shadow-md shadow-blue-200 touch-manipulation">
                <Plus size={18} />
                Yeni İnceleme Başlat
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-slate-100 text-slate-700 rounded-xl"><Users size={26} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Toplam İnceleme</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{total}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={26} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Müdür Tarafından Onaylanan</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">{approvedCount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl"><Clock size={26} /></div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Onay Bekleyen İnceleme</p>
              <p className="text-2xl font-black text-amber-600 leading-none">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs & List Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Sosyal İnceleme Kayıtları
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tüm inceleme detaylarını tek satırda görüntüleyebilir, detayına girebilir veya onaylayabilirsiniz.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tümü ({total})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'pending' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Onay Bekleyenler ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Onaylananlar ({approvedCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">Tarih</th>
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">T.C. Kimlik</th>
                  <th className="px-4 py-3.5 font-extrabold">Başvuru Sahibi Adı Soyadı</th>
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">Hane Kişi</th>
                  {user.role === 'manager' && <th className="px-4 py-3.5 font-extrabold">İnceleyen Personel</th>}
                  <th className="px-4 py-3.5 font-extrabold text-center whitespace-nowrap">Toplam Puan</th>
                  <th className="px-4 py-3.5 font-extrabold whitespace-nowrap">Onay Durumu</th>
                  <th className="px-4 py-3.5 font-extrabold">Karar / Yardım Tipi</th>
                  <th className="px-4 py-3.5 font-extrabold text-right whitespace-nowrap">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={user.role === 'manager' ? 9 : 8} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50 font-medium">
                      Seçilen filtreye uygun sosyal inceleme kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((item, index) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700 tracking-wider whitespace-nowrap">
                        {item.applicantTc || '-'}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900 whitespace-nowrap">
                        {item.applicantName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap text-center">
                        {item.householdSize} kişi
                      </td>
                      {user.role === 'manager' && (
                        <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                          {item.personnelName}
                        </td>
                      )}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded font-black text-xs ${item.result.isRejected ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-900'}`}>
                          {item.result.totalScore} Puan
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={12} /> ONAYLANDI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock size={12} /> ONAY BEKLİYOR
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold whitespace-nowrap">
                        {item.result.isRejected ? (
                          <span className="text-red-600 uppercase">REDDEDİLDİ</span>
                        ) : (
                          <span className="text-emerald-700 uppercase">
                            {item.result.assistance.text}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link 
                          href={`/assessment/${item.id}`} 
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <FileText size={14} /> Detayları İncele
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* PRINT-ONLY APPROVED RECORDS SUMMARY LIST (LANDSCAPE OFFICIAL PDF OUTPUT)   */}
      {/* ========================================================================= */}
      <div className="print-only w-full bg-white text-black p-0 m-0 leading-tight">
        
        {/* Official Document Header */}
        <div className="text-center border-b-2 border-black pb-2 mb-3">
          <p className="text-xs font-bold uppercase tracking-widest">T.C.</p>
          <p className="text-sm font-black uppercase tracking-wider">SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</p>
          <p className="text-xs font-extrabold tracking-widest uppercase mt-0.5">MÜDÜR TARAFINDAN ONAYLANAN SOSYAL İNCELEME KAYITLARI TOPLU LİSTESİ</p>
          <p className="text-[9px] text-slate-600 mt-1">Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')} • Toplam Onaylı Kayıt: {approvedList.length}</p>
        </div>

        {/* Table - Strictly Single Row per record */}
        <table className="w-full border-collapse border border-black text-[9px] mb-6 print-table">
          <thead>
            <tr className="bg-slate-200 text-black font-extrabold uppercase border-b border-black">
              <th className="p-1 text-center w-8">NO</th>
              <th className="p-1 text-center w-24">T.C. KİMLİK NO</th>
              <th className="p-1 text-left">BAŞVURU SAHİBİ ADI SOYADI</th>
              <th className="p-1 text-center w-14">HANE KİŞİ</th>
              <th className="p-1 text-left w-36">İNCELENEN ADRES / MAH.</th>
              <th className="p-1 text-left w-32">İNCELEYEN PERSONEL</th>
              <th className="p-1 text-center w-20">ZİYARET TARİHİ</th>
              <th className="p-1 text-center w-16">PUAN</th>
              <th className="p-1 text-left w-36">ONAYLANAN DEĞERLENDİRME KARARI</th>
            </tr>
          </thead>
          <tbody>
            {approvedList.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-center font-bold text-slate-500">
                  Onaylanmış sosyal inceleme kaydı bulunmamaktadır.
                </td>
              </tr>
            ) : (
              approvedList.map((item, idx) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="p-1 text-center font-bold">{idx + 1}</td>
                  <td className="p-1 text-center font-bold">{item.applicantTc}</td>
                  <td className="p-1 font-black uppercase">{item.applicantName}</td>
                  <td className="p-1 text-center font-bold">{item.householdSize} kişi</td>
                  <td className="p-1 truncate max-w-[150px]">{item.applicantAddress || '-'}</td>
                  <td className="p-1 font-medium">{item.personnelName}</td>
                  <td className="p-1 text-center">{new Date(item.date).toLocaleDateString('tr-TR')}</td>
                  <td className="p-1 text-center font-black">{item.result.totalScore} / 130</td>
                  <td className="p-1 font-bold uppercase">{item.result.isRejected ? 'REDDEDİLDİ' : item.result.assistance.text}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Signature Block at Bottom */}
        <div className="border border-black p-3 mt-8">
          <p className="text-[9px] italic text-slate-700 mb-4">
            * İşbu liste Sosyal Yardımlaşma ve Dayanışma Vakfı Yönetim Paneli üzerinden müdür yetkilisi tarafından onaylanan resmi hane inceleme sonuçlarını içermekte olup onaylı belgedir.
          </p>

          <div className="flex justify-between items-start text-[10px] px-8 pt-2">
            <div className="text-center w-5/12">
              <p className="font-bold uppercase tracking-wider">LİSTE BİLGİSAYAR ÇIKTISI / HAZIRLAYAN</p>
              <p className="font-semibold mt-1">Sistem Otomatik Kaydı</p>
              <p className="text-[9px] text-slate-600 mt-0.5">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
            </div>

            <div className="text-center w-5/12">
              <p className="font-bold uppercase tracking-wider">MÜDÜR YETKİLİSİ / VAKIF MÜDÜRÜ</p>
              <p className="font-semibold mt-1">Adı Soyadı: <span className="underline">{user.role === 'manager' ? user.name : 'Ahmet Yılmaz (Vakıf Müdürü)'}</span></p>
              <p className="text-[9px] text-slate-600">Unvan: SYDV Vakıf Müdürü</p>
              <div className="mt-8 pt-1 border-t border-dashed border-black w-3/4 mx-auto text-[9px] font-bold">
                İmza / Mühür
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}


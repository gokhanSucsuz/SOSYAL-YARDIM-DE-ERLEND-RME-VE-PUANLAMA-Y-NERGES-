
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { 
  ArrowLeft, Download, FileSpreadsheet, Printer, Calendar, ShieldAlert
} from 'lucide-react';
import { Meeting, Assessment, getAllMeetings, getAllAssessments } from '@/lib/db';
import { LogoImage } from '@/components/logo-image';
import { useDialog } from '@/components/DialogProvider';
import Link from 'next/link';

const COLORS = {
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  indigo: '#6366f1',
  slate: '#64748b',
};


const CATEGORIES_MAP = [
  {
    id: 'A',
    title: 'A. Gelir ve Barınma',
    color: '#3b82f6', // blue
    fields: [
      { key: 'noWorker', label: 'Hanede Çalışan Yok' },
      { key: 'noRegularIncome', label: 'Düzenli Gelir Yok' },
      { key: 'noSgk', label: 'SGK Kaydı Yok' },
      { key: 'a_kiraBorcu', label: 'Kira Borcu Var' },
      { key: 'a_faturaBorcu', label: 'Fatura Borcu Var' },
      { key: 'a_krediBorcu', label: 'Kredi Borcu Var' }
    ]
  },
  {
    id: 'B',
    title: 'B. Dezavantajlı Bireyler',
    color: '#8b5cf6', // purple
    fields: [
      { key: 'b_agirEngelli', label: 'Ağır Engelli' },
      { key: 'b_engelli', label: 'Engelli' },
      { key: 'b_evdeBakim', label: 'Evde Bakım Hastası' },
      { key: 'b_kanser', label: 'Kanser Tedavisi' },
      { key: 'b_kronik', label: 'Kronik Hastalık' },
      { key: 'b_yasliYalniz', label: '65 Yaş Üstü Yalnız' },
      { key: 'b_sehitYakini', label: 'Şehit Yakını' },
      { key: 'b_gazi', label: 'Gazi' },
      { key: 'b_yetim', label: 'Yetim / Öksüz' },
      { key: 'b_koruyucuAile', label: 'Koruyucu Aile' },
      { key: 'b_yabanciUyruklu', label: 'Yabancı Uyruklu' }
    ]
  },
  {
    id: 'C',
    title: 'C. İhtiyaç Analizi',
    color: '#f59e0b', // amber
    fields: [
      { key: 'c_beslenme', label: 'Beslenme' },
      { key: 'c_giyim', label: 'Giyim' },
      { key: 'c_fatura', label: 'Fatura Desteği' },
      { key: 'c_yakacak', label: 'Yakacak Desteği' },
      { key: 'c_saglikGideri', label: 'Sağlık / Medikal Gider' },
      { key: 'c_egitimGideri', label: 'Eğitim Gideri' },
      { key: 'c_bebekBakim', label: 'Bebek Bakım' }
    ]
  },
  {
    id: 'D',
    title: 'D. Eğitim ve Fiziksel Koşullar',
    color: '#10b981', // emerald
    fields: [
      { key: 'd_evsiz', label: 'Evsiz / Barınaksız' },
      { key: 'd_afetzede', label: 'Afetzede' },
      { key: 'd_agirHasarli', label: 'Ağır Hasarlı Konut' },
      { key: 'd_sagliksiz', label: 'Sağlıksız Konut' },
      { key: 'd_dereYatagi', label: 'Riskli Bölge/Bodrum' },
      { key: 'd_kiraci', label: 'Kiracı' },
      { key: 'd_tahliyeBaskisi', label: 'Tahliye/İcra Baskısı' },
      { key: 'd_isinmaProblem', label: 'Isınma Problemi' }
    ]
  },
  {
    id: 'F',
    title: 'F. Sosyal Kırılganlık',
    color: '#ec4899', // pink
    fields: [
      { key: 'e_siddetMagduru', label: 'Şiddet Mağduru' },
      { key: 'e_kadinReis', label: 'Kadın Hane Reisi' },
      { key: 'e_esiCezaevinde', label: 'Eşi/Yakını Cezaevinde' },
      { key: 'e_afetGelirKaybi', label: 'Kaza/Afet Kaynaklı Gelir Kaybı' },
      { key: 'e_maddeBagimliligi', label: 'Madde Bağımlısı Birey' },
      { key: 'e_sosyalGuvencesiz', label: 'Sosyal Güvencesiz' },
      { key: 'e_icraBorcBaskisi', label: 'Yüksek Borç / İcra' },
      { key: 'e_gebelikBebek', label: 'Bebek / Riskli Gebelik' },
      { key: 'e_bosanmis', label: 'Boşanmış / Terk Edilmiş' },
      { key: 'e_dul', label: 'Dul (Vefat)' }
    ]
  }
];

export interface CategoryChartData {
  title: string;
  color: string;
  data: { name: string; birey: number }[];
}

export default function StatisticsPage() {
  const router = useRouter();
  const { showAlert } = useDialog();
  const [user, setUser] = useState<{ role: string, name: string } | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        router.push('/');
        return;
      }
      const u = JSON.parse(storedUser);
      if (u.role !== 'manager') {
        router.push('/');
        return;
      }
      setUser(u);
      setMeetings(await getAllMeetings());
      setAssessments(await getAllAssessments());
    };
    fetch();
  }, [router]);

  // Filter meetings by date
  const filteredMeetings = useMemo(() => {
    let list = meetings;
    if (startDate) {
      list = list.filter(m => m.date >= startDate);
    }
    if (endDate) {
      list = list.filter(m => m.date <= endDate);
    }
    return list;
  }, [meetings, startDate, endDate]);

  const filteredAssessments = useMemo(() => {
    const meetingIds = filteredMeetings.map(m => m.id);
    return assessments.filter(a => a.meetingId && meetingIds.includes(a.meetingId));
  }, [assessments, filteredMeetings]);

    const generateMeetingStats = (m: Meeting, assessments: Assessment[]) => {
    const totalCount = assessments.length;
    const approved = assessments.filter(a => a.status === 'approved');
    const pending = assessments.filter(a => a.status === 'pending');
    
    let totalScore = 0;
    let approvedAid = 0;
    let plannedAid = 0;

    // Track categorised stats
    const catCounts: Record<string, Record<string, number>> = {};
    CATEGORIES_MAP.forEach(cat => {
      catCounts[cat.id] = {};
    });

    assessments.forEach(a => {
      totalScore += a.result?.totalScore || 0;
      if (a.status === 'approved' && a.data?.assistanceAmount) approvedAid += a.data.assistanceAmount;
      if (a.data?.assistanceAmount) plannedAid += a.data.assistanceAmount;

      const d = a.data || {};
      
      CATEGORIES_MAP.forEach(cat => {
        cat.fields.forEach(field => {
          // Both true booleans and numerical values > 0 count.
          if (d[field.key]) {
            catCounts[cat.id][field.label] = (catCounts[cat.id][field.label] || 0) + 1;
          }
        });
      });
    });
    
    const categoryCharts: CategoryChartData[] = CATEGORIES_MAP.map(cat => {
      const data = Object.keys(catCounts[cat.id]).map(label => ({
        name: label,
        birey: catCounts[cat.id][label]
      })).sort((a, b) => b.birey - a.birey);
      return {
        title: cat.title,
        color: cat.color,
        data
      };
    }).filter(cat => cat.data.length > 0);

    return {
      meeting: m,
      totalCount,
      approvedCount: approved.length,
      pendingCount: pending.length,
      averageScore: totalCount > 0 ? (totalScore / totalCount).toFixed(1) : '0',
      approvedAid,
      plannedAid,
      budget: m.budgetTL || 0,
      categoryCharts,
    };
  };

  const allStats = useMemo(() => {
    return filteredMeetings.map(m => generateMeetingStats(m, filteredAssessments.filter(a => a.meetingId === m.id)));
  }, [filteredMeetings, filteredAssessments]);

    const grandTotal = useMemo(() => {
    const overallCatCounts: Record<string, Record<string, number>> = {};
    CATEGORIES_MAP.forEach(cat => {
      overallCatCounts[cat.title] = {};
    });

    const totals = allStats.reduce((acc, curr) => {
      if (curr.categoryCharts) {
        curr.categoryCharts.forEach(catChart => {
          if (!overallCatCounts[catChart.title]) overallCatCounts[catChart.title] = {};
          catChart.data.forEach(d => {
            overallCatCounts[catChart.title][d.name] = (overallCatCounts[catChart.title][d.name] || 0) + d.birey;
          });
        });
      }
      return {
        totalCount: acc.totalCount + curr.totalCount,
        approvedCount: acc.approvedCount + curr.approvedCount,
        pendingCount: acc.pendingCount + curr.pendingCount,
        approvedAid: acc.approvedAid + curr.approvedAid,
        plannedAid: acc.plannedAid + curr.plannedAid,
        budget: acc.budget + curr.budget,
      };
    }, { totalCount: 0, approvedCount: 0, pendingCount: 0, approvedAid: 0, plannedAid: 0, budget: 0 });

    const categoryCharts: CategoryChartData[] = CATEGORIES_MAP.map(cat => {
      const counts = overallCatCounts[cat.title] || {};
      const data = Object.keys(counts).map(label => ({
        name: label,
        birey: counts[label]
      })).sort((a, b) => b.birey - a.birey);
      return {
        title: cat.title,
        color: cat.color,
        data
      };
    }).filter(cat => cat.data.length > 0);

    return {
      ...totals,
      categoryCharts
    };
  }, [allStats]);

  const handleExportExcel = async () => {
    if (filteredMeetings.length === 0) {
      await showAlert('Dışa aktarılacak veri bulunamadı.', 'warning');
      return;
    }
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('İstatistik Raporu');

      sheet.columns = [
        { header: 'Toplantı No', key: 'no', width: 20 },
        { header: 'Tarih', key: 'date', width: 15 },
        { header: 'Toplam İnceleme', key: 'total', width: 20 },
        { header: 'Onaylı', key: 'approved', width: 15 },
        { header: 'Bekleyen', key: 'pending', width: 15 },
        { header: 'Onaylanan Yardım (TL)', key: 'aid', width: 25 },
        { header: 'Bütçe (TL)', key: 'budget', width: 20 },
      ];

      allStats.forEach(s => {
        sheet.addRow({
          no: s.meeting.meetingNo,
          date: s.meeting.date,
          total: s.totalCount,
          approved: s.approvedCount,
          pending: s.pendingCount,
          aid: s.approvedAid,
          budget: s.budget
        });
      });

      sheet.addRow({});
      const totalRow = sheet.addRow({
        no: 'GENEL TOPLAM',
        date: '',
        total: grandTotal.totalCount,
        approved: grandTotal.approvedCount,
        pending: grandTotal.pendingCount,
        aid: grandTotal.approvedAid,
        budget: grandTotal.budget
      });
      totalRow.font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Istatistik_Raporu_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
    } catch (e) {
      console.error(e);
      await showAlert('Excel oluşturulurken hata oluştu.', 'error');
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 no-print">
      <div className="bg-primary-900 text-white p-6 shadow-md rounded-b-3xl max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-primary-800 hover:bg-primary-700 p-2 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Gelişmiş İstatistik Raporları</h1>
              <p className="text-primary-200 text-sm">Toplantı bazlı raporlamalar, grafikler ve analizler.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors">
               <FileSpreadsheet size={18} /> Excel İndir
             </button>
             <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors">
               <Printer size={18} /> PDF Çıktısı Al
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-slate-400" size={18}/>
            <span className="font-semibold text-slate-700">Tarih Aralığı:</span>
          </div>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
          <span className="text-slate-400">-</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-6 flex justify-between">
              <span>Hane İnceleme Durumları</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">Tüm Zamanlar</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Onaylı', value: grandTotal.approvedCount },
                      { name: 'Bekleyen', value: grandTotal.pendingCount },
                    ]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                  >
                    <Cell fill={COLORS.emerald} />
                    <Cell fill={COLORS.amber} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-6 flex justify-between">
              <span>Mali Bütçe Durumu (TL)</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">Toplu Rapor</span>
            </h3>
            <div className="h-64 flex flex-col justify-center">
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-600">Toplam Bütçe</span>
                      <span className="font-bold text-slate-900">{grandTotal.budget.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-600">Kullanılan (Onaylanan)</span>
                      <span className="font-bold text-emerald-600">{grandTotal.approvedAid.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{width: `${Math.min(100, grandTotal.budget ? (grandTotal.approvedAid/grandTotal.budget)*100 : 0)}%`}}></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Overall Category Charts */}
          {grandTotal.categoryCharts && grandTotal.categoryCharts.length > 0 && (
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 mb-8 page-break-inside-avoid print:mt-6 mt-6">
              <h4 className="text-sm font-black text-slate-700 mb-6 uppercase tracking-wide">Genel Toplam Kategorik İstatistikler</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grandTotal.categoryCharts.map((catChart: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <h5 className="font-bold text-slate-700 mb-4 text-xs" style={{ color: catChart.color }}>{catChart.title}</h5>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={catChart.data} layout="vertical" margin={{ top: 5, right: 30, left: 140, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: '#475569', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => [value, 'Birey/Kayıt']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="birey" fill={catChart.color} radius={[0, 4, 4, 0]}>
                            {catChart.data.map((entry: any, i: number) => (
                              <Cell key={`cell-${i}`} fill={catChart.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
           <div className="p-6 border-b border-slate-200 bg-slate-50">
             <h3 className="font-bold text-slate-800 text-lg">Toplantı İstatistikleri (Detaylı Liste)</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-100 text-slate-600 text-sm">
                   <th className="p-4 font-semibold border-b">Toplantı</th>
                   <th className="p-4 font-semibold border-b">Tarih</th>
                   <th className="p-4 font-semibold border-b">Toplam Kayıt</th>
                   <th className="p-4 font-semibold border-b text-emerald-600">Onaylı</th>
                   <th className="p-4 font-semibold border-b text-amber-600">Bekleyen</th>
                   <th className="p-4 font-semibold border-b">Yardım (TL)</th>
                   <th className="p-4 font-semibold border-b">Bütçe (TL)</th>
                 </tr>
               </thead>
               <tbody>
                 {allStats.map((s, idx) => (
                   <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                     <td className="p-4 font-medium text-slate-800">{s.meeting.meetingNo}</td>
                     <td className="p-4 text-sm text-slate-600">{s.meeting.date}</td>
                     <td className="p-4 text-center font-semibold">{s.totalCount}</td>
                     <td className="p-4 text-center text-emerald-600 font-bold">{s.approvedCount}</td>
                     <td className="p-4 text-center text-amber-600 font-bold">{s.pendingCount}</td>
                     <td className="p-4 font-semibold text-slate-700">{s.approvedAid.toLocaleString('tr-TR')} ₺</td>
                     <td className="p-4 font-semibold text-slate-700">{s.budget.toLocaleString('tr-TR')} ₺</td>
                   </tr>
                 ))}
                 
                 {/* GRAND TOTAL ROW */}
                 <tr className="bg-slate-800 text-white">
                   <td colSpan={2} className="p-4 font-bold text-right text-lg">GENEL TOPLAM</td>
                   <td className="p-4 text-center font-bold text-lg">{grandTotal.totalCount}</td>
                   <td className="p-4 text-center font-bold text-lg text-emerald-400">{grandTotal.approvedCount}</td>
                   <td className="p-4 text-center font-bold text-lg text-amber-400">{grandTotal.pendingCount}</td>
                   <td className="p-4 font-bold text-lg">{grandTotal.approvedAid.toLocaleString('tr-TR')} ₺</td>
                   <td className="p-4 font-bold text-lg">{grandTotal.budget.toLocaleString('tr-TR')} ₺</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>

        {/* Meeting-Specific Category Charts */}
          {allStats.map((s, idx) => (
            s.categoryCharts && s.categoryCharts.length > 0 && (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6 page-break-inside-avoid print:mt-6">
                <h3 className="font-bold text-slate-700 mb-6 flex justify-between">
                  <span>{s.meeting.meetingNo} Toplantısı - Kategorik İstatistikler</span>
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{s.meeting.date}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {s.categoryCharts.map((catChart: any, index: number) => (
                    <div key={index} className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                      <h5 className="font-bold text-slate-700 mb-4 text-xs" style={{ color: catChart.color }}>{catChart.title}</h5>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={catChart.data} layout="vertical" margin={{ top: 5, right: 30, left: 140, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: '#475569', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value) => [value, 'Birey/Kayıt']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="birey" fill={catChart.color} radius={[0, 4, 4, 0]}>
                              {catChart.data.map((entry: any, i: number) => (
                                <Cell key={`cell-${i}`} fill={catChart.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRINT-ONLY VISIBLE CONTENT (PDF Export / Print Layout)       */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden print:block w-full text-black p-8">
         <div className="flex items-center gap-6 mb-8 border-b-2 border-black pb-4">
           <LogoImage />
           <div>
             <h1 className="text-2xl font-black uppercase">T.C. SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI</h1>
             <h2 className="text-lg font-bold">Resmi İstatistik ve Analiz Raporu</h2>
             <p className="text-sm mt-1">Oluşturulma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
           </div>
         </div>

         <div className="mb-6">
           <h3 className="font-bold text-xl mb-4 border-b pb-2">Özet Grafikler</h3>
           <div className="flex gap-8">
              <div className="w-1/2">
                <h4 className="font-bold mb-2">Başvuru Dağılımı</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Onaylı', value: grandTotal.approvedCount },
                          { name: 'Bekleyen', value: grandTotal.pendingCount },
                        ]}
                        cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value"
                      >
                        <Cell fill={COLORS.emerald} />
                        <Cell fill={COLORS.amber} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                 <h4 className="font-bold mb-4">Mali Özet</h4>
                 <div className="text-lg"><strong>Toplam Bütçe:</strong> {grandTotal.budget.toLocaleString('tr-TR')} ₺</div>
                 <div className="text-lg"><strong>Onaylanan Yardım:</strong> {grandTotal.approvedAid.toLocaleString('tr-TR')} ₺</div>
              </div>
           </div>
         </div>

         <h3 className="font-bold text-xl mb-4">Toplantı Detayları</h3>
         <table className="w-full text-left border-collapse border border-black">
           <thead>
             <tr className="bg-gray-200">
               <th className="p-2 border border-black font-bold">Toplantı No</th>
               <th className="p-2 border border-black font-bold">Tarih</th>
               <th className="p-2 border border-black font-bold text-center">Toplam</th>
               <th className="p-2 border border-black font-bold text-center">Onaylı</th>
               <th className="p-2 border border-black font-bold text-center">Bekleyen</th>
               <th className="p-2 border border-black font-bold">Yardım (TL)</th>
             </tr>
           </thead>
           <tbody>
             {allStats.map((s, idx) => (
               <tr key={idx}>
                 <td className="p-2 border border-black font-medium">{s.meeting.meetingNo}</td>
                 <td className="p-2 border border-black">{s.meeting.date}</td>
                 <td className="p-2 border border-black text-center">{s.totalCount}</td>
                 <td className="p-2 border border-black text-center">{s.approvedCount}</td>
                 <td className="p-2 border border-black text-center">{s.pendingCount}</td>
                 <td className="p-2 border border-black">{s.approvedAid.toLocaleString('tr-TR')} ₺</td>
               </tr>
             ))}
             <tr className="bg-gray-300 font-bold text-lg">
               <td colSpan={2} className="p-2 border border-black text-right">GENEL TOPLAM</td>
               <td className="p-2 border border-black text-center">{grandTotal.totalCount}</td>
               <td className="p-2 border border-black text-center">{grandTotal.approvedCount}</td>
               <td className="p-2 border border-black text-center">{grandTotal.pendingCount}</td>
               <td className="p-2 border border-black">{grandTotal.approvedAid.toLocaleString('tr-TR')} ₺</td>
             </tr>
           </tbody>
         </table>

         <div className="mt-16 w-full flex justify-end">
           <div className="text-center">
             <p className="font-bold text-lg">Vakıf Müdürü</p>
             <p className="mt-10">(İmza)</p>
           </div>
         </div>
      </div>

    </div>
  );
}

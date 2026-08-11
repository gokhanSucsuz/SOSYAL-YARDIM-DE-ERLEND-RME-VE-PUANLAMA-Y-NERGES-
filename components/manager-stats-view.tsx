'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Wallet, Banknote, Users, CheckCircle2, Clock, XCircle, AlertCircle, 
  Download, Printer, FileSpreadsheet, Filter, PieChart as PieChartIcon, 
  BarChart3, Home, ShieldAlert, Award, Calendar, ArrowLeft, Building2, TrendingUp
} from 'lucide-react';
import { Meeting, Assessment } from '@/lib/db';
import { LogoImage } from './logo-image';

interface ManagerStatsViewProps {
  meetings: Meeting[];
  assessments: Assessment[];
  user: { name: string; role: string };
  onBack?: () => void;
}

const COLORS = {
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#8b5cf6',
  slate: '#64748b',
};

export function ManagerStatsView({ meetings, assessments, user, onBack }: ManagerStatsViewProps) {
  const isManager = user?.role === 'manager';
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const reportMeta = useMemo(() => {
    return {
      dateStr: new Date().toLocaleDateString('tr-TR'),
      reportNo: `RPR-${meetings.length}${assessments.length}-STAT`,
    };
  }, [meetings.length, assessments.length]);

  // Selected meeting object or null
  const selectedMeeting = useMemo(() => {
    if (selectedMeetingId === 'ALL') return null;
    return meetings.find(m => m.id === selectedMeetingId) || null;
  }, [meetings, selectedMeetingId]);

  // Filtered Assessments based on selected scope
  const filteredAssessments = useMemo(() => {
    if (selectedMeetingId === 'ALL') {
      return assessments;
    }
    return assessments.filter(a => a.meetingId === selectedMeetingId);
  }, [assessments, selectedMeetingId]);

  // Search filtered assessments for the detail table
  const tableAssessments = useMemo(() => {
    if (!searchQuery.trim()) return filteredAssessments;
    const q = searchQuery.toLowerCase();
    return filteredAssessments.filter(a => 
      a.applicantName?.toLowerCase().includes(q) ||
      a.applicantTc?.includes(q) ||
      a.applicantAddress?.toLowerCase().includes(q) ||
      a.householdNo?.includes(q)
    );
  }, [filteredAssessments, searchQuery]);

  // Financial & KPI Statistics
  const stats = useMemo(() => {
    let totalBudgetTL = 0;
    if (selectedMeetingId === 'ALL') {
      meetings.forEach(m => {
        totalBudgetTL += (m.budgetTL || 0);
      });
    } else if (selectedMeeting) {
      totalBudgetTL = selectedMeeting.budgetTL || 0;
    }

    let plannedAidTL = 0;
    let approvedAidTL = 0;
    let rejectedAidTL = 0;
    let approvedCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;

    filteredAssessments.forEach(a => {
      const amount = a.result?.assistance?.amount || 0;
      if (a.result?.isRejected) {
        rejectedCount++;
        rejectedAidTL += amount;
      } else {
        plannedAidTL += amount;
        if (a.status === 'approved') {
          approvedCount++;
          approvedAidTL += amount;
        } else {
          pendingCount++;
        }
      }
    });

    const totalCount = filteredAssessments.length;
    const isExceeded = totalBudgetTL > 0 && plannedAidTL > totalBudgetTL;
    const excessTL = isExceeded ? plannedAidTL - totalBudgetTL : 0;
    const remainingBudgetTL = totalBudgetTL - plannedAidTL;

    const validHouseholds = approvedCount + pendingCount;
    const avgAidPerHousehold = validHouseholds > 0 ? Math.round(plannedAidTL / validHouseholds) : 0;

    // Household characteristics counts
    let homeOwnerCount = 0;
    let tenantCount = 0;
    let relativeAllocatedCount = 0;
    let otherHousingCount = 0;

    let disabledCount = 0;
    let chronicCount = 0;
    let largeFamilyCount = 0; // 3+ children

    let score80Plus = 0;
    let score60To79 = 0;
    let score40To59 = 0;
    let scoreBelow40 = 0;

    filteredAssessments.forEach(a => {
      const housing = a.data?.housingStatus;
      if (housing === 'ev_sahibi') homeOwnerCount++;
      else if (housing === 'kiraci') tenantCount++;
      else if (housing === 'akraba_yani' || housing === 'tahsis') relativeAllocatedCount++;
      else otherHousingCount++;

      if (a.data?.hasDisabled) disabledCount++;
      if (a.data?.hasChronicIllness) chronicCount++;
      if ((a.data?.childrenCount || 0) >= 3) largeFamilyCount++;

      const score = a.result?.totalScore || 0;
      if (score >= 80) score80Plus++;
      else if (score >= 60) score60To79++;
      else if (score >= 40) score40To59++;
      else scoreBelow40++;
    });

    return {
      totalCount,
      approvedCount,
      pendingCount,
      rejectedCount,
      totalBudgetTL,
      plannedAidTL,
      approvedAidTL,
      rejectedAidTL,
      remainingBudgetTL,
      isExceeded,
      excessTL,
      avgAidPerHousehold,
      homeOwnerCount,
      tenantCount,
      relativeAllocatedCount,
      otherHousingCount,
      disabledCount,
      chronicCount,
      largeFamilyCount,
      score80Plus,
      score60To79,
      score40To59,
      scoreBelow40,
    };
  }, [filteredAssessments, meetings, selectedMeeting, selectedMeetingId]);

  // Assistance Categories Breakdown
  const assistanceCategoriesData = useMemo(() => {
    const categoriesMap: { [key: string]: { name: string; count: number; totalTL: number } } = {
      'Nakdi Aile Yardımı': { name: 'Nakdi Aile Yardımı', count: 0, totalTL: 0 },
      'Gıda & Aşevi Yardımı': { name: 'Gıda & Aşevi Yardımı', count: 0, totalTL: 0 },
      'Yakacak / Kömür': { name: 'Yakacak / Kömür', count: 0, totalTL: 0 },
      'Eğitim & Kırtasiye': { name: 'Eğitim & Kırtasiye', count: 0, totalTL: 0 },
      'Barınma & Ev Onarımı': { name: 'Barınma & Ev Onarımı', count: 0, totalTL: 0 },
      'Sağlık & Medikal': { name: 'Sağlık & Medikal', count: 0, totalTL: 0 },
      'Diğer Sosyal Yardım': { name: 'Diğer Sosyal Yardım', count: 0, totalTL: 0 },
    };

    filteredAssessments.forEach(a => {
      if (a.result?.isRejected) return;
      const typeName = a.result?.assistance?.text || 'Nakdi Aile Yardımı';
      const amount = a.result?.assistance?.amount || 0;

      let catKey = 'Nakdi Aile Yardımı';
      if (typeName.toLowerCase().includes('gıda') || typeName.toLowerCase().includes('aşevi')) catKey = 'Gıda & Aşevi Yardımı';
      else if (typeName.toLowerCase().includes('yakacak') || typeName.toLowerCase().includes('kömür')) catKey = 'Yakacak / Kömür';
      else if (typeName.toLowerCase().includes('eğitim') || typeName.toLowerCase().includes('okul') || typeName.toLowerCase().includes('kırtasiye')) catKey = 'Eğitim & Kırtasiye';
      else if (typeName.toLowerCase().includes('barınma') || typeName.toLowerCase().includes('tadilat') || typeName.toLowerCase().includes('ev')) catKey = 'Barınma & Ev Onarımı';
      else if (typeName.toLowerCase().includes('sağlık') || typeName.toLowerCase().includes('medikal')) catKey = 'Sağlık & Medikal';
      else if (!typeName.toLowerCase().includes('nakdi')) catKey = 'Diğer Sosyal Yardım';

      categoriesMap[catKey].count += 1;
      categoriesMap[catKey].totalTL += amount;
    });

    return Object.values(categoriesMap).filter(item => item.count > 0 || item.totalTL > 0);
  }, [filteredAssessments]);

  // Decision Pie Chart Data
  const decisionPieData = useMemo(() => [
    { name: 'Müdür Onaylı', value: stats.approvedCount, color: COLORS.emerald },
    { name: 'Onay Bekleyen', value: stats.pendingCount, color: COLORS.amber },
    { name: 'Reddedilen', value: stats.rejectedCount, color: COLORS.red },
  ], [stats]);

  // Risk Score Distribution Bar Data
  const riskScoreData = useMemo(() => [
    { name: 'Çok Yüksek Risk (>80)', Hane: stats.score80Plus, fill: '#dc2626' },
    { name: 'Yüksek Risk (60-79)', Hane: stats.score60To79, fill: '#ea580c' },
    { name: 'Orta Risk (40-59)', Hane: stats.score40To59, fill: '#f59e0b' },
    { name: 'Düşük Risk (<40)', Hane: stats.scoreBelow40, fill: '#10b981' },
  ], [stats]);

  // Housing Distribution Pie Data
  const housingData = useMemo(() => [
    { name: 'Kiracı', value: stats.tenantCount, color: '#3b82f6' },
    { name: 'Ev Sahibi', value: stats.homeOwnerCount, color: '#10b981' },
    { name: 'Akraba Yanı / Tahsis', value: stats.relativeAllocatedCount, color: '#8b5cf6' },
    { name: 'Diğer / Geçici', value: stats.otherHousingCount, color: '#64748b' },
  ], [stats]);

  // Meeting comparison chart data (if ALL is selected)
  const meetingComparisonData = useMemo(() => {
    return meetings.map(m => {
      const mAssessments = assessments.filter(a => a.meetingId === m.id);
      let plannedAid = 0;
      let approvedAid = 0;
      mAssessments.forEach(a => {
        if (!a.result?.isRejected) {
          const am = a.result?.assistance?.amount || 0;
          plannedAid += am;
          if (a.status === 'approved') approvedAid += am;
        }
      });

      return {
        name: m.meetingNo || 'Toplantı',
        Bütçe: m.budgetTL || 0,
        Planlanan: plannedAid,
        Onaylanan: approvedAid,
        HaneSayisi: mAssessments.length,
      };
    });
  }, [meetings, assessments]);

  // Excel Export Handler using ExcelJS
  const handleExportExcelReport = async () => {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Sosyal İnceleme Otomasyon Sistemi';
      workbook.created = new Date();

      const scopeTitle = selectedMeetingId === 'ALL'
        ? 'TÜM TOPLANTI DOSYALARI KONSOLİDE BÜTÇE VE İSTATİSTİK RAPORU'
        : `TOPLANTI DOSYASI (${selectedMeeting?.meetingNo || ''}) İSTATİSTİK RAPORU`;

      // Sheet 1: Genel İstatistik ve Bütçe Özet
      const sheet1 = workbook.addWorksheet('İstatistik Özeti');

      sheet1.mergeCells('A1:F1');
      const titleCell = sheet1.getCell('A1');
      titleCell.value = 'T.C. SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI';
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

      sheet1.mergeCells('A2:F2');
      const subTitleCell = sheet1.getCell('A2');
      subTitleCell.value = scopeTitle;
      subTitleCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF2563EB' } };
      subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

      sheet1.getCell('A4').value = 'Rapor Tarihi:';
      sheet1.getCell('B4').value = new Date().toLocaleDateString('tr-TR');
      sheet1.getCell('A5').value = 'Raporu Alan:';
      sheet1.getCell('B5').value = `${user.name} (${user.role === 'manager' ? 'Müdür' : 'Personel'})`;

      // KPI Table
      sheet1.addRow([]);
      sheet1.addRow(['BÜTÇE VE MALE METRİKLER', 'TUTAR (TL) / DEĞER']);
      const kpiHeader = sheet1.getRow(7);
      kpiHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      kpiHeader.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      kpiHeader.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

      const kpiRows = [
        ['Toplanan Harcanabilir Vakıf Bütçesi', stats.totalBudgetTL],
        ['Planlanan / Karar Bağlanan Yardım Tutarı', stats.plannedAidTL],
        ['Müdür Tarafından Onaylanan Yardım Tutarı', stats.approvedAidTL],
        ['Kalan Vakıf Bütçesi', stats.remainingBudgetTL],
        ['Bütçe Aşım Durumu (TL)', stats.isExceeded ? `+${stats.excessTL.toLocaleString('tr-TR')} ₺ AŞIM` : 'Normal'],
        ['Ortalama Hane Başı Yardım Tutarı', stats.avgAidPerHousehold],
        ['Toplam İnceleme Yapılan Hane Sayısı', stats.totalCount],
        ['Onaylanan Hane Sayısı', stats.approvedCount],
        ['Onay Bekleyen Hane Sayısı', stats.pendingCount],
        ['Reddedilen Hane Sayısı', stats.rejectedCount],
      ];

      kpiRows.forEach(r => sheet1.addRow(r));

      sheet1.getColumn(1).width = 42;
      sheet1.getColumn(2).width = 30;

      // Sheet 2: Yardım Kategorileri
      const sheet2 = workbook.addWorksheet('Yardım Kategorileri');
      sheet2.addRow(['YARDIM KATEGORİSİ', 'HANE SAYISI', 'TOPLAM TUTAR (TL)']);
      const catHeader = sheet2.getRow(1);
      catHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      catHeader.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
      });

      assistanceCategoriesData.forEach(c => {
        sheet2.addRow([c.name, c.count, c.totalTL]);
      });
      sheet2.getColumn(1).width = 32;
      sheet2.getColumn(2).width = 18;
      sheet2.getColumn(3).width = 24;

      // Sheet 3: Detaylı Hane Listesi
      const sheet3 = workbook.addWorksheet('Hane İnceleme Kayıtları');
      sheet3.addRow(['Toplantı No', 'Sıra No', 'T.C. No', 'Başvuran Adı Soyadı', 'Mahalle', 'Muhtaçlık Puanı', 'Karar Durumu', 'Yardım Türü', 'Yardım Tutarı (TL)']);
      const detailHeader = sheet3.getRow(1);
      detailHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      detailHeader.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      });

      filteredAssessments.forEach((a, idx) => {
        const meetingNo = meetings.find(m => m.id === a.meetingId)?.meetingNo || '-';
        sheet3.addRow([
          meetingNo,
          idx + 1,
          a.applicantTc,
          a.applicantName,
          a.applicantAddress || '-',
          a.result?.totalScore || 0,
          a.result?.isRejected ? 'REDDEDİLDİ' : (a.status === 'approved' ? 'ONAYLANDI' : 'BEKLİYOR'),
          a.result?.assistance?.text || '-',
          a.result?.assistance?.amount || 0,
        ]);
      });

      sheet3.getColumn(1).width = 16;
      sheet3.getColumn(2).width = 10;
      sheet3.getColumn(3).width = 16;
      sheet3.getColumn(4).width = 26;
      sheet3.getColumn(5).width = 20;
      sheet3.getColumn(6).width = 16;
      sheet3.getColumn(7).width = 16;
      sheet3.getColumn(8).width = 28;
      sheet3.getColumn(9).width = 20;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `Resmi_Istatistik_Bütce_Raporu_${selectedMeetingId === 'ALL' ? 'TümToplantilar' : selectedMeeting?.meetingNo?.replace('/', '_')}_${dateStr}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Excel raporu oluşturulurken hata meydana geldi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Printable Official Header (Media Print Only) */}
      <div className="print-only w-full bg-white text-black p-0 m-0 leading-tight">
        <div className="border-b-2 border-black pb-3 mb-4 text-center">
          <div className="flex justify-between items-center mb-2">
            <LogoImage className="w-14 h-14 border border-black" />
            <div className="text-center flex-1 mx-4">
              <h1 className="text-sm font-bold uppercase tracking-wider">T.C. EDİRNE VALİLİĞİ</h1>
              <h2 className="text-base font-black uppercase">SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</h2>
              <p className="text-xs font-bold mt-1 underline">
                {selectedMeetingId === 'ALL' ? 'TÜM TOPLANTI DOSYALARI KONSOLİDE İSTATİSTİK RAPORU' : `TOPLANTI DOSYASI (${selectedMeeting?.meetingNo}) İSTATİSTİKİ RAPORU`}
              </p>
            </div>
            <div className="text-[10px] text-right font-mono">
              <p>Tarih: {reportMeta.dateStr}</p>
              <p>Rapor No: {reportMeta.reportNo}</p>
            </div>
          </div>
        </div>

        {/* Print Summary Table */}
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase mb-1 border-b border-black">
            1. {isManager ? 'BÜTÇE VE FİNANSAL PERFORMANS İSTATİSTİKLERİ' : 'HANE DEĞERLENDİRME İSTATİSTİKLERİ'}
          </h3>
          <table className="w-full border-collapse border border-black text-[10px] mb-3">
            <tbody>
              {isManager ? (
                <>
                  <tr className="border-b border-black bg-gray-100 font-bold">
                    <td className="p-1.5 border-r border-black">Harcanabilir Vakıf Bütçesi:</td>
                    <td className="p-1.5 border-r border-black">{stats.totalBudgetTL > 0 ? `${stats.totalBudgetTL.toLocaleString('tr-TR')} ₺` : 'Belirtilmedi'}</td>
                    <td className="p-1.5 border-r border-black">Karar Bağlanan Toplam Yardım:</td>
                    <td className="p-1.5">{stats.plannedAidTL.toLocaleString('tr-TR')} ₺</td>
                  </tr>
                  <tr className="border-b border-black font-bold">
                    <td className="p-1.5 border-r border-black">Müdür Onaylı Yardım Tutarı:</td>
                    <td className="p-1.5 border-r border-black">{stats.approvedAidTL.toLocaleString('tr-TR')} ₺</td>
                    <td className="p-1.5 border-r border-black">Kalan / Aşım Durumu:</td>
                    <td className={`p-1.5 font-black ${stats.isExceeded ? 'text-red-700' : ''}`}>
                      {stats.isExceeded ? `+${stats.excessTL.toLocaleString('tr-TR')} ₺ (BÜTÇE AŞILMIŞTIR)` : `${stats.remainingBudgetTL.toLocaleString('tr-TR')} ₺`}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1.5 border-r border-black font-bold">Toplam İnceleme Yapılan Hane:</td>
                    <td className="p-1.5 border-r border-black">{stats.totalCount} Hane</td>
                    <td className="p-1.5 border-r border-black font-bold">Ortalama Hane Başı Yardım:</td>
                    <td className="p-1.5">{stats.avgAidPerHousehold.toLocaleString('tr-TR')} ₺</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="border-b border-black bg-gray-100 font-bold">
                    <td className="p-1.5 border-r border-black">Toplam İnceleme Dosyası:</td>
                    <td className="p-1.5 border-r border-black">{stats.totalCount} Hane</td>
                    <td className="p-1.5 border-r border-black">Müdür Onaylı Hane Sayısı:</td>
                    <td className="p-1.5 text-emerald-800">{stats.approvedCount} Hane</td>
                  </tr>
                  <tr className="border-b border-black font-bold">
                    <td className="p-1.5 border-r border-black">Onay Bekleyen Hane Sayısı:</td>
                    <td className="p-1.5 border-r border-black text-amber-800">{stats.pendingCount} Hane</td>
                    <td className="p-1.5 border-r border-black">Reddedilen Hane Sayısı:</td>
                    <td className="p-1.5 text-red-800">{stats.rejectedCount} Hane</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Print Categories Table */}
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase mb-1 border-b border-black">2. YARDIM TÜR VE KATEGORİ DAĞILIMI</h3>
          <table className="w-full border-collapse border border-black text-[9px] mb-3">
            <thead>
              <tr className="bg-gray-200 border-b border-black font-bold">
                <th className="p-1 border-r border-black text-left">Yardım Türü / Kategorisi</th>
                <th className="p-1 border-r border-black text-center">Faydalanan Hane Sayısı</th>
                <th className="p-1 text-right">Tahsis Edilen Toplam Tutar (TL)</th>
              </tr>
            </thead>
            <tbody>
              {assistanceCategoriesData.map((cat, idx) => (
                <tr key={idx} className="border-b border-black">
                  <td className="p-1 border-r border-black font-semibold">{cat.name}</td>
                  <td className="p-1 border-r border-black text-center">{cat.count}</td>
                  <td className="p-1 text-right font-bold">{cat.totalTL.toLocaleString('tr-TR')} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Graphic Charts Section */}
        <div className="mb-4 page-break-inside-avoid">
          <h3 className="text-xs font-black uppercase mb-2 border-b border-black">3. İSTATİSTİKİ VE GÖRSEL GRAFİK ANALİZİ</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Visual Bar 1: Budget Utilization */}
            <div className="border border-black p-2 rounded bg-gray-50">
              <p className="text-[10px] font-bold mb-1 uppercase">A. Bütçe Kullanım & Karar Görsel Oranı</p>
              <div className="space-y-1.5 text-[9px]">
                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Vakıf Bütçesi (100% Base):</span>
                    <span>{stats.totalBudgetTL.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 border border-black rounded-xs overflow-hidden">
                    <div className="bg-blue-700 h-full w-full print-exact"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Planlanan Yardım ({stats.totalBudgetTL > 0 ? Math.round((stats.plannedAidTL / stats.totalBudgetTL) * 100) : 0}%):</span>
                    <span>{stats.plannedAidTL.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 border border-black rounded-xs overflow-hidden">
                    <div 
                      className={`${stats.isExceeded ? 'bg-red-600' : 'bg-indigo-600'} h-full print-exact`} 
                      style={{ width: `${Math.min(100, stats.totalBudgetTL > 0 ? (stats.plannedAidTL / stats.totalBudgetTL) * 100 : 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Müdür Onaylı Yardım ({stats.totalBudgetTL > 0 ? Math.round((stats.approvedAidTL / stats.totalBudgetTL) * 100) : 0}%):</span>
                    <span>{stats.approvedAidTL.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 border border-black rounded-xs overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full print-exact" 
                      style={{ width: `${Math.min(100, stats.totalBudgetTL > 0 ? (stats.approvedAidTL / stats.totalBudgetTL) * 100 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Bar 2: Decision Ratio Breakdown */}
            <div className="border border-black p-2 rounded bg-gray-50">
              <p className="text-[10px] font-bold mb-1 uppercase">B. Karar Dağılım Görsel Oran Grafiği</p>
              <div className="space-y-1.5 text-[9px]">
                <div className="flex justify-between font-bold border-b border-gray-300 pb-1">
                  <span>Toplam Hane: {stats.totalCount}</span>
                  <span>Onay: %{stats.totalCount > 0 ? Math.round((stats.approvedCount / stats.totalCount) * 100) : 0}</span>
                </div>

                {/* Stacked Percentage Bar */}
                <div className="w-full h-4 border border-black flex rounded-xs overflow-hidden my-1">
                  {stats.totalCount > 0 ? (
                    <>
                      <div className="bg-emerald-600 h-full print-exact text-[8px] text-white font-bold flex items-center justify-center" style={{ width: `${(stats.approvedCount / stats.totalCount) * 100}%` }}>
                        {stats.approvedCount > 0 ? `${stats.approvedCount}` : ''}
                      </div>
                      <div className="bg-amber-500 h-full print-exact text-[8px] text-black font-bold flex items-center justify-center" style={{ width: `${(stats.pendingCount / stats.totalCount) * 100}%` }}>
                        {stats.pendingCount > 0 ? `${stats.pendingCount}` : ''}
                      </div>
                      <div className="bg-red-600 h-full print-exact text-[8px] text-white font-bold flex items-center justify-center" style={{ width: `${(stats.rejectedCount / stats.totalCount) * 100}%` }}>
                        {stats.rejectedCount > 0 ? `${stats.rejectedCount}` : ''}
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-200 h-full w-full"></div>
                  )}
                </div>

                <div className="grid grid-cols-3 text-[8px] font-bold text-center pt-0.5">
                  <span className="text-emerald-800">■ Onaylı ({stats.approvedCount})</span>
                  <span className="text-amber-800">■ Bekleyen ({stats.pendingCount})</span>
                  <span className="text-red-800">■ Red ({stats.rejectedCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Bar 3: Risk Level Distribution */}
          <div className="border border-black p-2 rounded bg-gray-50 mb-2">
            <p className="text-[10px] font-bold mb-1 uppercase">C. Hane Risk Seviyesi Puan Dağılım Grafiği</p>
            <div className="grid grid-cols-4 gap-2 text-[8px] font-bold text-center">
              <div>
                <span className="block text-red-700">Çok Yüksek (&gt;80 Pn)</span>
                <div className="w-full bg-gray-200 h-2.5 border border-black rounded-xs overflow-hidden my-0.5">
                  <div className="bg-red-600 h-full print-exact" style={{ width: `${Math.min(100, stats.totalCount > 0 ? (stats.score80Plus / stats.totalCount) * 100 : 0)}%` }}></div>
                </div>
                <span>{stats.score80Plus} Hane</span>
              </div>
              <div>
                <span className="block text-amber-700">Yüksek (60-79 Pn)</span>
                <div className="w-full bg-gray-200 h-2.5 border border-black rounded-xs overflow-hidden my-0.5">
                  <div className="bg-amber-500 h-full print-exact" style={{ width: `${Math.min(100, stats.totalCount > 0 ? (stats.score60To79 / stats.totalCount) * 100 : 0)}%` }}></div>
                </div>
                <span>{stats.score60To79} Hane</span>
              </div>
              <div>
                <span className="block text-blue-700">Orta (40-59 Pn)</span>
                <div className="w-full bg-gray-200 h-2.5 border border-black rounded-xs overflow-hidden my-0.5">
                  <div className="bg-blue-600 h-full print-exact" style={{ width: `${Math.min(100, stats.totalCount > 0 ? (stats.score40To59 / stats.totalCount) * 100 : 0)}%` }}></div>
                </div>
                <span>{stats.score40To59} Hane</span>
              </div>
              <div>
                <span className="block text-emerald-700">Düşük (&lt;40 Pn)</span>
                <div className="w-full bg-gray-200 h-2.5 border border-black rounded-xs overflow-hidden my-0.5">
                  <div className="bg-emerald-600 h-full print-exact" style={{ width: `${Math.min(100, stats.totalCount > 0 ? (stats.scoreBelow40 / stats.totalCount) * 100 : 0)}%` }}></div>
                </div>
                <span>{stats.scoreBelow40} Hane</span>
              </div>
            </div>
          </div>
        </div>

        {/* Print Signature Block */}
        <div className="mt-8 grid grid-cols-2 text-center text-xs font-bold page-break-inside-avoid">
          <div>
            <p className="mb-8">Raporu Hazırlayan / İnceleyen</p>
            <p className="uppercase">{user.name}</p>
            <p className="text-[10px] font-normal">Sosyal İnceleme Görevlisi / Müdür</p>
          </div>
          <div>
            <p className="mb-8">ONAYLAYAN</p>
            <p className="uppercase">SYDV Vakıf Müdürü</p>
            <p className="text-[10px] font-normal">Mütevelli Heyeti Başkanı Adına</p>
          </div>
        </div>
      </div>

      {/* Screen Interactive Controls and Header */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl no-print relative overflow-hidden border border-red-600">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-2xl transition-all shrink-0 border border-white/20"
                title="Ana Ekrana Dön"
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white border border-white/30 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  T.C. SYDV MÜDÜR PANELİ İSTATİSTİK VE ANALİZ MERKEZİ
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="text-red-200" size={28} />
                <span>Sosyal Yardım ve Bütçe İstatistik Raporları</span>
              </h1>
              <p className="text-xs sm:text-sm text-red-100 mt-1">
                Her toplantı dosyası için Vakıf Bütçesi, karar dağılımları ve hane özellikleri istatistiklerini canlı inceleyin.
              </p>
            </div>
          </div>

          {/* Scope Selector and Export Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-1.5 flex items-center gap-2 shadow-inner">
              <Filter size={16} className="text-blue-400 ml-2 shrink-0" />
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer py-1.5 pr-3"
              >
                <option value="ALL" className="bg-slate-900 text-white font-bold">🌐 Tüm Toplantı Dosyaları (Konsolide Genel İstatistik)</option>
                {meetings.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white font-bold">
                    📁 Toplantı No: {m.meetingNo} ({new Date(m.date).toLocaleDateString('tr-TR')})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportExcelReport}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-md border border-emerald-400/30"
              title="Resmi İstatistik Excel Raporu İndir (.xlsx)"
            >
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Excel Raporu</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-md border border-blue-400/30"
              title="Resmi Kurum PDF Raporu Oluştur / Yazdır"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Resmi PDF / Yazdır</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exceeded Budget Alert Banner if Applicable */}
      {isManager && stats.isExceeded && (
        <div className="no-print bg-red-600 text-white p-4 sm:p-5 rounded-3xl shadow-lg border-2 border-red-400 flex items-center gap-4 animate-pulse">
          <div className="p-3 bg-white/20 rounded-2xl shrink-0">
            <AlertCircle size={28} />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg uppercase tracking-wide">🚨 DİKKAT: VAKIF BÜTÇESİ AŞILIYOR!</h3>
            <p className="text-xs sm:text-sm font-semibold text-red-100 mt-0.5">
              Seçili kapsamdaki Vakıf Bütçesi (<strong>{stats.totalBudgetTL.toLocaleString('tr-TR')} ₺</strong>), yapılması planlanan toplam yardım tutarı (<strong>{stats.plannedAidTL.toLocaleString('tr-TR')} ₺</strong>) nedeniyle <strong>+{stats.excessTL.toLocaleString('tr-TR')} ₺</strong> tutarında aşılmaktadır.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isManager ? (
          <>
            {/* Vakıf Bütçesi */}
            <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-xs space-y-2 bg-gradient-to-br from-blue-50/50 to-white relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">Vakıf Bütçesi (Harcanabilir)</span>
                <div className="p-2 bg-blue-100 text-blue-700 rounded-2xl"><Wallet size={20} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {stats.totalBudgetTL > 0 ? `${stats.totalBudgetTL.toLocaleString('tr-TR')} ₺` : 'Belirtilmedi'}
              </p>
              <p className="text-xs text-slate-500 font-semibold pt-1">
                {selectedMeetingId === 'ALL' ? 'Tüm toplantı bütçeleri toplamı' : `${selectedMeeting?.meetingNo} Toplantısı Bütçesi`}
              </p>
            </div>

            {/* Yapılacak Toplam Yardım */}
            <div className="bg-white p-5 rounded-3xl border border-indigo-200 shadow-xs space-y-2 bg-gradient-to-br from-indigo-50/50 to-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">Planlanan Toplam Yardım</span>
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl"><Banknote size={20} /></div>
              </div>
              <p className="text-2xl font-black text-indigo-950 leading-none">
                {stats.plannedAidTL.toLocaleString('tr-TR')} ₺
              </p>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1">
                <span>Onaylanan: <strong>{stats.approvedAidTL.toLocaleString('tr-TR')} ₺</strong></span>
              </div>
            </div>

            {/* Kalan Bütçe / Aşım */}
            <div className={`p-5 rounded-3xl border shadow-xs space-y-2 ${
              stats.isExceeded ? 'bg-red-50 border-red-300' : 'bg-emerald-50/60 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider ${stats.isExceeded ? 'text-red-700' : 'text-emerald-700'}`}>
                  {stats.isExceeded ? '🚨 BÜTÇE AŞIM MİKTARI' : 'Kalan Kullanılabilir Bütçe'}
                </span>
                <div className={`p-2 rounded-2xl ${stats.isExceeded ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className={`text-2xl font-black leading-none ${stats.isExceeded ? 'text-red-700' : 'text-emerald-950'}`}>
                {stats.totalBudgetTL === 0 
                  ? 'Sınırsız' 
                  : stats.isExceeded 
                  ? `+${stats.excessTL.toLocaleString('tr-TR')} ₺` 
                  : `${stats.remainingBudgetTL.toLocaleString('tr-TR')} ₺`}
              </p>
              <p className="text-xs font-semibold text-slate-600 pt-1">
                Ortalama Hane Başı: <strong>{stats.avgAidPerHousehold.toLocaleString('tr-TR')} ₺</strong>
              </p>
            </div>

            {/* İnceleme Hane Sayıları */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Değerlendirilen Hane Sayısı</span>
                <div className="p-2 bg-slate-100 text-slate-700 rounded-2xl"><Users size={20} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {stats.totalCount} Hane
              </p>
              <div className="flex items-center gap-3 text-xs font-bold pt-1">
                <span className="text-emerald-600">{stats.approvedCount} Onay</span>
                <span className="text-amber-600">{stats.pendingCount} Bekleyen</span>
                <span className="text-red-600">{stats.rejectedCount} Red</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Toplam Hane */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Toplam İnceleme Dosyası</span>
                <div className="p-2 bg-slate-100 text-slate-700 rounded-2xl"><Users size={20} /></div>
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {stats.totalCount} Hane
              </p>
              <p className="text-xs text-slate-500 font-semibold pt-1">İnceleme Görevlisi Dosya Takibi</p>
            </div>

            {/* Onaylanan Hane */}
            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-2 bg-gradient-to-br from-emerald-50/50 to-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Müdür Onaylı Hane</span>
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-2xl"><CheckCircle2 size={20} /></div>
              </div>
              <p className="text-2xl font-black text-emerald-950 leading-none">
                {stats.approvedCount} Hane
              </p>
              <p className="text-xs text-emerald-700 font-semibold pt-1">Onaylanan yardım kararları</p>
            </div>

            {/* Onay Bekleyen Hane */}
            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-2 bg-gradient-to-br from-amber-50/50 to-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Onay Bekleyen Hane</span>
                <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl"><Clock size={20} /></div>
              </div>
              <p className="text-2xl font-black text-amber-950 leading-none">
                {stats.pendingCount} Hane
              </p>
              <p className="text-xs text-amber-700 font-semibold pt-1">Müdür değerlendirmesindeki dosyalar</p>
            </div>

            {/* Reddedilen Hane */}
            <div className="bg-white p-5 rounded-3xl border border-red-200 shadow-xs space-y-2 bg-gradient-to-br from-red-50/50 to-white">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700">Reddedilen Hane</span>
                <div className="p-2 bg-red-100 text-red-700 rounded-2xl"><XCircle size={20} /></div>
              </div>
              <p className="text-2xl font-black text-red-950 leading-none">
                {stats.rejectedCount} Hane
              </p>
              <p className="text-xs text-red-700 font-semibold pt-1">Uygun görülmeyen incelemeler</p>
            </div>
          </>
        )}
      </div>

      {/* Main Charts Section */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bütçe vs Harcama Analizi veya Hane Sayısı Analizi */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Wallet className="text-blue-600" size={20} />
              <span>
                {isManager 
                  ? (selectedMeetingId === 'ALL' ? 'Toplantı Bazında Bütçe ve Yardım Karşılaştırması' : 'Bütçe ve Karar Bağlanan Yardım Oranı')
                  : (selectedMeetingId === 'ALL' ? 'Toplantı Bazında İnceleme Yapılan Hane Sayıları' : 'Hane Risk Seviyeleri Dağılımı')}
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">{isManager ? 'Mali Analiz' : 'Dosya Analizi'}</span>
          </div>

          <div className="h-72 w-full pt-2">
            {isManager ? (
              selectedMeetingId === 'ALL' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={meetingComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k₺`} />
                    <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString('tr-TR')} ₺`]} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar dataKey="Bütçe" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Vakıf Bütçesi" />
                    <Bar dataKey="Planlanan" fill="#6366f1" radius={[6, 6, 0, 0]} name="Planlanan Yardım" />
                    <Bar dataKey="Onaylanan" fill="#10b981" radius={[6, 6, 0, 0]} name="Müdür Onaylı" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Vakıf Bütçesi', Tutar: stats.totalBudgetTL, fill: '#3b82f6' },
                    { name: 'Planlanan Yardım', Tutar: stats.plannedAidTL, fill: stats.isExceeded ? '#dc2626' : '#6366f1' },
                    { name: 'Onaylanan Yardım', Tutar: stats.approvedAidTL, fill: '#10b981' },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v.toLocaleString('tr-TR')} ₺`} />
                    <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString('tr-TR')} ₺`, 'Tutar']} />
                    <Bar dataKey="Tutar" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : (
              selectedMeetingId === 'ALL' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={meetingComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip formatter={(value: any) => [`${value} Hane`, 'Hane Sayısı']} />
                    <Bar dataKey="HaneSayisi" fill="#3b82f6" radius={[6, 6, 0, 0]} name="İnceleme Yapılan Hane" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskScoreData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip formatter={(value: any) => [`${value} Hane`, 'Hane Sayısı']} />
                    <Bar dataKey="Hane" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            )}
          </div>
        </div>

        {/* Chart 2: Karar Dağılım Pastası */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <PieChartIcon className="text-indigo-600" size={20} />
              <span>İnceleme Karar Dağılımı</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">Hane Oranları</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {stats.totalCount === 0 ? (
              <p className="text-xs text-slate-400 font-semibold">Bu toplantı dosyasında kayıtlı veri bulunmuyor.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} (%${((percent || 0) * 100).toFixed(0)})`}
                  >
                    {decisionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} Hane`, 'Sayı']} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Yardım Türlerine Göre Tutar ve Hane Sayısı */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="text-purple-600" size={20} />
              <span>Yardım Kategorilerine Göre Bütçe Dağılımı</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">Kategori Analizi</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assistanceCategoriesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}k₺`} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={130} />
                <Tooltip formatter={(value: any, name: any) => [
                  name === 'totalTL' ? `${Number(value).toLocaleString('tr-TR')} ₺` : `${value} Hane`,
                  name === 'totalTL' ? 'Toplam Tutar' : 'Hane Sayısı'
                ]} />
                <Bar dataKey="totalTL" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="totalTL" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Muhtaçlık ve Risk Seviyeleri */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-red-600" size={20} />
              <span>Hane Risk ve Muhtaçlık Puan Seviyeleri</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">Puan Analizi</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskScoreData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value: any) => [`${value} Hane`, 'Hane Sayısı']} />
                <Bar dataKey="Hane" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Household Characteristics & Housing Breakdown Summary */}
      <div className="no-print bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Home className="text-blue-600" size={20} />
          <span>Hane Özellikleri ve Sosyo-Ekonomik Göstergeler</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Kiracı Haneler</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{stats.tenantCount} Hane</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ev Sahibi Haneler</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{stats.homeOwnerCount} Hane</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Akraba Yanı / Tahsis</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{stats.relativeAllocatedCount} Hane</p>
          </div>
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Engelli Birey Bulunan</span>
            <p className="text-lg font-black text-amber-950 mt-0.5">{stats.disabledCount} Hane</p>
          </div>
          <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200">
            <span className="text-[10px] font-bold text-blue-700 uppercase">Kronik Hasta Bulunan</span>
            <p className="text-lg font-black text-blue-950 mt-0.5">{stats.chronicCount} Hane</p>
          </div>
          <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200">
            <span className="text-[10px] font-bold text-purple-700 uppercase">3+ Çocuklu Aileler</span>
            <p className="text-lg font-black text-purple-950 mt-0.5">{stats.largeFamilyCount} Hane</p>
          </div>
        </div>
      </div>

      {/* Detailed Household Table */}
      <div className="no-print bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {selectedMeetingId === 'ALL' ? 'Tüm Toplantı Hane İnceleme Kayıtları' : `${selectedMeeting?.meetingNo} Toplantısı Hane Kayıtları`}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Toplam {tableAssessments.length} hane listeleniyor
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ad Soyad, T.C. veya Mahalle ara..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Filter size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Sıra / Toplantı</th>
                <th className="px-5 py-3">Başvuran T.C. / Ad Soyad</th>
                <th className="px-5 py-3">Mahalle</th>
                <th className="px-5 py-3 text-center">Puan</th>
                <th className="px-5 py-3">Karar Durumu</th>
                <th className="px-5 py-3">Yardım Türü</th>
                <th className="px-5 py-3 text-right">Tutar (TL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tableAssessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 font-semibold">
                    Seçilen kriterlere uygun hane kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                tableAssessments.map((item, idx) => {
                  const mNo = meetings.find(m => m.id === item.meetingId)?.meetingNo || '-';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-bold text-slate-500">
                        #{idx + 1} <span className="text-[10px] text-blue-600 font-black ml-1">({mNo})</span>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-extrabold text-slate-900">{item.applicantName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.applicantTc}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600 font-semibold">{item.applicantAddress || '-'}</td>
                      <td className="px-5 py-3 text-center font-black">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          (item.result?.totalScore || 0) >= 80 ? 'bg-red-100 text-red-800' :
                          (item.result?.totalScore || 0) >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.result?.totalScore || 0}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-bold">
                        {item.result?.isRejected ? (
                          <span className="text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            Reddedildi
                          </span>
                        ) : item.status === 'approved' ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            Müdür Onaylı
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px]">
                            Onay Bekliyor
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-700 font-semibold">{item.result?.assistance?.text || '-'}</td>
                      <td className="px-5 py-3 text-right font-black text-slate-900">
                        {item.result?.isRejected ? '0 ₺' : `${(item.result?.assistance?.amount || 0).toLocaleString('tr-TR')} ₺`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

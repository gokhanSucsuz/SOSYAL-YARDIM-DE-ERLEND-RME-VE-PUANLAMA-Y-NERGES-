"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAssessmentById, Assessment } from '@/lib/db';
import { ShieldCheck, Printer, ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';
import { SectionCard } from '@/components/ui-components'; // We can adapt or just write simple HTML

export default function AssessmentDetail() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        const data = await getAssessmentById(params.id as string);
        if (data) setAssessment(data);
        else router.push('/');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router, params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse font-medium text-slate-500">Yükleniyor...</div></div>;
  if (!assessment) return <div className="p-8 text-center">Bulunamadı</div>;

  const { data: state, result: calc } = assessment;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: #ffffff; }
          .no-print { display: none !important; }
          .print-full { width: 100% !important; max-width: 100% !important; border: none !important; padding: 0 !important; }
          .print-break-inside-avoid { break-inside: avoid; }
          .print-bg { background-color: transparent !important; }
          .min-h-screen { min-height: auto !important; }
        }
      `}} />

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10 no-print">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-2">
            <ArrowLeft size={20} />
          </Link>
          <div className="bg-blue-600 p-2 rounded hidden sm:block">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">İNCELEME DETAYI</h1>
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Referans: {assessment.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium shadow-sm"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Yazdır</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-10 print-full">
        
        {/* Title area */}
        <div className="mb-8 border-b border-slate-200 pb-6 print:border-slate-800 print:mb-4">
          <h2 className="text-3xl font-black text-slate-900">{assessment.applicantName}</h2>
          <p className="text-slate-500 font-medium mt-1">TC Kimlik: {assessment.applicantTc}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">Tarih: {new Date(assessment.date).toLocaleDateString('tr-TR')}</span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">İnceleyen: {assessment.personnelName}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 print:block">
          {/* Main Info */}
          <div className="flex-1 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden print-break-inside-avoid print:border-slate-300">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 print:bg-white"><h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Puan Detayları</h3></div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">A. Ekonomik</p>
                  <p className="text-lg font-bold text-slate-800">{calc.scoreA} Puan</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">B. Dezavantajlılık</p>
                  <p className="text-lg font-bold text-slate-800">{calc.scoreB} Puan</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">C. Çocuk/Eğitim</p>
                  <p className="text-lg font-bold text-slate-800">{calc.scoreC} Puan</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">D. Barınma</p>
                  <p className="text-lg font-bold text-slate-800">{calc.scoreD} Puan</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">E. Kırılganlık</p>
                  <p className="text-lg font-bold text-slate-800">{calc.scoreE} Puan</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg print:bg-white print:border print:border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">F. Kanaat</p>
                  <p className="text-lg font-bold text-slate-800">{calc.scoreF} Puan</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden print-break-inside-avoid print:border-slate-300">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 print:bg-white"><h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Güvenlik ve Kontroller</h3></div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-600">Araç Kaydı Kontrolü</span>
                    <span className="font-bold">{state.check_arac ? 'Yapıldı' : 'Yapılmadı'}</span>
                  </li>
                  <li className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-600">Tapu Kontrolü</span>
                    <span className="font-bold">{state.check_tapu ? 'Yapıldı' : 'Yapılmadı'}</span>
                  </li>
                  <li className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-600">SGK Kontrolü</span>
                    <span className="font-bold">{state.check_sgk ? 'Yapıldı' : 'Yapılmadı'}</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Gerçeğe Aykırı Beyan</span>
                    <span className={`font-bold ${state.falseStatement ? 'text-red-600' : 'text-emerald-600'}`}>{state.falseStatement ? 'Tespirt Edildi' : 'Yok'}</span>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>

          {/* Right Summary */}
          <div className="w-full lg:w-80 space-y-6 print:w-full print:mt-6">
            
            <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 print:border-slate-300 print:bg-white print:text-black overflow-hidden print-break-inside-avoid">
              <div className="p-6 border-b border-slate-800 print:border-slate-300">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 print:text-slate-500">Toplam Puan</h3>
                <div className={`text-6xl font-black ${calc.isRejected ? 'text-red-500' : 'text-white'} print:text-black`}>
                  {calc.totalScore}
                </div>
              </div>
              <div className="p-6 bg-slate-800/50 print:bg-slate-50">
                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 print:text-slate-500">Tavsiye Edilen Sonuç</h4>
                <div className={`text-xl font-bold ${calc.isRejected ? 'text-red-500' : (calc.totalScore > 30 ? 'text-emerald-400' : 'text-slate-300')} print:text-black`}>
                  {calc.assistance.amount > 0 ? `${calc.assistance.amount.toLocaleString('tr-TR')} TL` : calc.assistance.text.toUpperCase()}
                </div>
              </div>
            </div>

            {calc.priorities.length > 0 && !calc.isRejected && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 print:border-slate-300 print-break-inside-avoid">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Öncelik Durumu</h4>
                <ul className="space-y-2">
                  {calc.priorities.map((p, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700 font-medium">
                      <CheckCircle2 size={16} className="text-blue-500 mr-2 shrink-0 mt-0.5 print:text-slate-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        </div>

        {/* Print Only Signature Block */}
        <div className="hidden print:block border border-slate-300 rounded-xl p-6 mt-12 bg-white">
          <h4 className="font-bold text-slate-800 mb-8 border-b border-slate-200 pb-2">Onay ve İmzalar</h4>
          <div className="flex justify-between items-end pt-12 px-4">
             <div className="text-center">
               <div className="w-48 border-b border-slate-800 mb-2"></div>
               <span className="text-sm font-bold text-slate-800">Sosyal İnceleme Görevlisi</span>
               <p className="text-xs text-slate-500 mt-1">{assessment.personnelName}</p>
             </div>
             <div className="text-center">
               <div className="w-48 border-b border-slate-800 mb-2"></div>
               <span className="text-sm font-bold text-slate-800">Vakıf Müdürü</span>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}

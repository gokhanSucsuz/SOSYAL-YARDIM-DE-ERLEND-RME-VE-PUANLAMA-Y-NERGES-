"use client";

export const dynamic = "force-dynamic";

import { AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { LogoImage } from '@/components/logo-image';

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 relative p-4 py-12 selection:bg-red-600 selection:text-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-950/10 border border-slate-200 w-full max-w-md relative overflow-hidden text-slate-900 text-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
        
        <div className="flex justify-center mb-6 mt-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <LogoImage className="relative w-24 h-24 rounded-2xl shadow-xl border-2 border-slate-200 object-cover" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black mb-3 text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <AlertTriangle className="text-amber-500" size={32} /> Bakım Çalışması
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 mb-6 font-medium leading-relaxed">
          Sistemlerimizde planlı bir bakım ve iyileştirme çalışması yapılmaktadır. Daha iyi bir hizmet sunabilmek için şu an geçici olarak servis dışıyız.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-left">
          <Clock className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-900 mb-1">Ne zaman açılacak?</h3>
            <p className="text-xs text-amber-700 font-medium">Çalışma tamamlanır tamamlanmaz sistem otomatik olarak tekrar kullanıma açılacaktır. Anlayışınız için teşekkür ederiz.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-slate-400 flex items-center gap-1 font-medium">
        <ShieldCheck size={14} /> T.C. SYDV Otomasyonu Güvenlik Birimi
      </div>
    </div>
  );
}

"use client";

import { useRouter } from 'next/navigation';
import { ShieldCheck, User } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  
  const handleLogin = (role: 'personnel' | 'manager', name: string, id: string) => {
    localStorage.setItem('currentUser', JSON.stringify({ id, name, role }));
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2 text-center text-slate-800 tracking-tight">Sosyal İnceleme Puanlama Sistemi ve Yardım Kriterleri</h1>
        <p className="text-sm text-slate-500 text-center mb-8">Test hesabı seçerek giriş yapın</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleLogin('personnel', 'Sosyal Yardım ve İnceleme Görevlisi', 'p1')}
            className="w-full flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group text-left"
          >
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mr-4 text-slate-500">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-blue-800">Personel Girişi</p>
              <p className="text-xs text-slate-500 group-hover:text-blue-600">Sosyal Yardım ve İnceleme Görevlisi</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleLogin('manager', 'Vakıf Müdürü', 'm1')}
            className="w-full flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-colors group text-left"
          >
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors mr-4 text-slate-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-amber-800">Müdür Girişi</p>
              <p className="text-xs text-slate-500 group-hover:text-amber-600">Vakıf Müdürü Yetkilisi</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

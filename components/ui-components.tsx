import React from 'react';

export const SectionCard = ({ title, icon: Icon, maxScore, currentScore, children, className = "" }: any) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6 print:border-slate-300 print:shadow-none print:mb-4 ${className}`}>
    <div className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between print:bg-white">
      <div className="flex items-center space-x-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
      </div>
      {maxScore > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bölüm Puanı</span>
          <span className={`bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold ${currentScore === maxScore ? 'bg-blue-100 text-blue-700' : ''} print:bg-transparent print:p-0`}>
            {currentScore} / {maxScore}
          </span>
        </div>
      )}
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

export const CheckboxItem = ({ label, checked, onChange, isAlert = false, points = null }: any) => (
  <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors group ${
    checked
      ? (isAlert ? 'bg-red-50 border-red-200' : 'bg-blue-50/30 border-blue-200')
      : 'bg-white border-slate-100 hover:bg-slate-50'
  } print:border-slate-300 print:bg-white print:p-2`}>
    <div className="flex-shrink-0 mt-0.5">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border-slate-300 ${isAlert ? 'text-red-600 focus:ring-red-500' : 'text-blue-600 focus:ring-blue-500'}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    <div className="ml-3 flex-1 flex justify-between items-center">
      <span className={`text-sm font-medium leading-snug ${checked && isAlert ? 'text-red-800' : 'text-slate-700'}`}>
        {label}
      </span>
      {points && (
        <span className={`text-[10px] font-bold ${checked ? 'text-blue-600' : 'text-slate-400'}`}>+{points} Puan</span>
      )}
    </div>
  </label>
);

export const RadioItem = ({ label, name, checked, onChange, points }: any) => (
  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors group ${
    checked ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'
  } print:border-slate-300 print:bg-white print:p-2`}>
    <div className="flex items-center space-x-3 flex-1">
      <input
        type="radio"
        name={name}
        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
        checked={checked}
        onChange={() => onChange()}
      />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <span className={`text-[10px] font-bold ${checked ? 'text-blue-600' : 'text-slate-400'}`}>+{points} Puan</span>
  </label>
);

export const ScoreButtons = ({ value, onChange, label }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 last:border-0 print:border-slate-300">
    <span className="text-sm font-medium text-slate-700 mb-2 sm:mb-0">{label}</span>
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`w-10 h-10 rounded-md text-sm font-bold transition-colors border ${
            value === num
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          } print:border-slate-400 print:text-black print:${value === num ? 'bg-slate-200' : 'bg-white'}`}
        >
          {num}
        </button>
      ))}
    </div>
  </div>
);

export const CounterItem = ({ label, value, onChange, pointsPerItem }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white print:border-slate-300 print:p-2">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-[10px] font-bold text-slate-400">+{pointsPerItem} Puan / Kişi</span>
    </div>
    <div className="flex items-center space-x-3">
      <button 
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold"
      >-</button>
      <span className="w-6 text-center font-bold text-slate-800">{value}</span>
      <button 
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold"
      >+</button>
    </div>
  </div>
);

export const ApplianceStatusItem = ({ label, icon: Icon, value = 'yeni', onChange, pointsYok, pointsEski }: any) => {
  const currentVal = value || 'yeni';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
      <div className="flex items-center space-x-3 mb-3 sm:mb-0">
        {Icon && (
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg shrink-0">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h4 className="text-sm font-bold text-slate-800">{label}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentVal === 'yok' && <span className="text-red-600 font-semibold">Yok (Mevcut Değil) • +{pointsYok} Puan</span>}
            {currentVal === 'eski' && <span className="text-amber-600 font-semibold">Var (Eski / Arızalı) • +{pointsEski} Puan</span>}
            {currentVal === 'yeni' && <span className="text-slate-400 font-medium">Var (Yeni / Çalışır) • 0 Puan</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg shrink-0 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onChange('yok')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            currentVal === 'yok'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          Yok
        </button>
        <button
          type="button"
          onClick={() => onChange('eski')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            currentVal === 'eski'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          Var (Eski)
        </button>
        <button
          type="button"
          onClick={() => onChange('yeni')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            currentVal === 'yeni'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          Var (Yeni)
        </button>
      </div>
    </div>
  );
};

"use client";

import React from 'react';

export const SectionCard = ({ title, icon: Icon, maxScore, currentScore, children, className = "", hideScore = false }: any) => (
  <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden mb-5 print:border-slate-300 dark:border-slate-600 print:shadow-none print:mb-4 ${className}`}>
    <div className="bg-slate-50/80 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 print:bg-white dark:bg-slate-800">
      <div className="flex items-center space-x-2.5">
        {Icon && <Icon size={18} className="text-primary-600 shrink-0" />}
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{title}</h2>
      </div>
      {!hideScore && maxScore > 0 && currentScore !== undefined && (
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Bölüm Puanı</span>
          <span className={`bg-primary-50 text-primary-800 border border-primary-200 text-xs px-2.5 py-1 rounded-full font-black ${currentScore === maxScore ? 'bg-primary-600 text-white border-primary-600' : ''} print:bg-transparent print:p-0`}>
            {currentScore} / {maxScore} Puan
          </span>
        </div>
      )}
    </div>
    <div className="p-4 sm:p-5">
      {children}
    </div>
  </div>
);

export const CheckboxItem = ({ label, checked, onChange, isAlert = false, points = null }: any) => (
  <label className={`flex items-center min-h-[50px] p-3.5 border rounded-xl cursor-pointer transition-all active:scale-[0.99] touch-manipulation select-none ${
    checked
      ? (isAlert ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 ring-1 ring-rose-400 dark:ring-rose-500' : 'bg-primary-50/60 dark:bg-primary-900/30 border-primary-400 dark:border-primary-500 ring-1 ring-primary-400 dark:ring-primary-500')
      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900'
  } print:border-slate-300 dark:border-slate-600 print:bg-white dark:bg-slate-800 print:p-2`}>
    <div className="flex-shrink-0 mr-3 flex items-center justify-center">
      <input
        type="checkbox"
        className={`w-5 h-5 rounded border-slate-300 dark:border-slate-600 transition-transform ${isAlert ? 'text-rose-600 focus:ring-rose-500' : 'text-primary-600 focus:ring-primary-500'}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    <div className="flex-1 flex justify-between items-center gap-2">
      <span className={`text-sm font-semibold leading-snug ${checked && isAlert ? 'text-rose-900 dark:text-rose-100 font-bold' : checked ? 'text-primary-950 dark:text-primary-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {points && (
        <span className={`text-xs font-black shrink-0 px-2 py-0.5 rounded-md ${checked ? (isAlert ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-900 dark:text-rose-100' : 'bg-primary-200 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100') : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}>
          +{points} P.
        </span>
      )}
    </div>
  </label>
);

export const RadioItem = ({ label, name, checked, onChange, points }: any) => (
  <label className={`flex items-center min-h-[50px] p-3.5 border rounded-xl cursor-pointer transition-all active:scale-[0.99] touch-manipulation select-none ${
    checked ? 'bg-primary-50/60 dark:bg-primary-900/30 border-primary-400 dark:border-primary-500 ring-1 ring-primary-400 dark:ring-primary-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900'
  } print:border-slate-300 dark:border-slate-600 print:bg-white dark:bg-slate-800 print:p-2`}>
    <div className="flex-shrink-0 mr-3 flex items-center justify-center">
      <input
        type="radio"
        name={name}
        className="w-5 h-5 text-primary-600 border-slate-300 dark:border-slate-600 focus:ring-primary-500"
        checked={checked}
        onChange={() => onChange()}
      />
    </div>
    <div className="flex-1 flex justify-between items-center gap-2">
      <span className={`text-sm font-semibold leading-snug ${checked ? 'text-primary-950 dark:text-primary-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {points !== undefined && (
        <span className={`text-xs font-black shrink-0 px-2 py-0.5 rounded-md ${checked ? 'bg-primary-200 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}>
          +{points} P.
        </span>
      )}
    </div>
  </label>
);

export const ScoreButtons = ({ value, onChange, label, description }: any) => {
  const scaleLabels: { [key: number]: { text: string; color: string } } = {
    0: { text: "0 Puan: İyi / Yeterli / İhtiyaç Yok", color: "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    1: { text: "1 Puan: Az Kırılgan / Hafif Olumsuz", color: "bg-primary-50 text-primary-800 border-primary-200" },
    2: { text: "2 Puan: Orta Seviye İhtiyaç / Kısmen Olumsuz", color: "bg-sky-50 text-sky-800 border-sky-200" },
    3: { text: "3 Puan: Belirgin İhtiyaç / Kötü Koşullar", color: "bg-amber-50 text-amber-800 border-amber-200" },
    4: { text: "4 Puan: Yüksek Muhtaçlık / Çok Kötü", color: "bg-orange-50 text-orange-900 border-orange-200" },
    5: { text: "5 Puan: Aşırı Kötü / Kritik Acil İhtiyaç", color: "bg-rose-100 text-rose-900 border-rose-300 font-extrabold" },
  };

  const currentLabel = scaleLabels[value] || scaleLabels[0];

  return (
    <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl mb-3 last:mb-0 print:border-slate-300 dark:border-slate-600 print:bg-white dark:bg-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block">{label}</span>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>

        {/* Selected Score Badge */}
        <div className={`px-2.5 py-1 rounded-lg text-xs border font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0 ${currentLabel.color}`}>
          <span>{currentLabel.text}</span>
        </div>
      </div>

      {/* Touch-Friendly Button Row (Large Touch Targets for Phones) */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-2">
        {[0, 1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;
          return (
            <button
              type="button"
              key={num}
              onClick={() => onChange(num)}
              className={`flex flex-col items-center justify-center h-12 sm:h-14 rounded-xl text-xs font-bold transition-all border active:scale-95 touch-manipulation select-none ${
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200 font-extrabold ring-2 ring-primary-400 ring-offset-1'
                  : 'bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-base sm:text-lg font-black">{num}</span>
              <span className={`text-[9px] font-semibold hidden xs:inline ${isSelected ? 'text-primary-100' : 'text-slate-400'}`}>
                {num === 0 ? 'İyi' : num === 5 ? 'Kritik' : `${num}P`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const CounterItem = ({ label, value, onChange, pointsPerItem }: any) => (
  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs print:border-slate-300 dark:border-slate-600 print:p-2">
    <div className="flex flex-col pr-2">
      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{label}</span>
      <span className="text-xs font-semibold text-slate-400 mt-0.5">+{pointsPerItem} Puan / Kişi</span>
    </div>
    <div className="flex items-center space-x-2 shrink-0">
      <button 
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:bg-slate-700 active:bg-slate-300 flex items-center justify-center font-black text-xl active:scale-95 touch-manipulation"
      >-</button>
      <span className="w-8 text-center font-black text-lg text-slate-900 dark:text-slate-100">{value}</span>
      <button 
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 active:bg-primary-200 flex items-center justify-center font-black text-xl active:scale-95 touch-manipulation"
      >+</button>
    </div>
  </div>
);

export const ApplianceStatusItem = ({ label, icon: Icon, value = 'yeni', onChange, pointsYok, pointsEski }: any) => {
  const currentVal = value || 'yeni';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:border-slate-600 transition-colors gap-3">
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-lg shrink-0">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentVal === 'yok' && <span className="text-rose-600 font-bold">Yok (Mevcut Değil) • +{pointsYok} Puan</span>}
            {currentVal === 'eski' && <span className="text-amber-600 font-bold">Var (Eski / Arızalı) • +{pointsEski} Puan</span>}
            {currentVal === 'yeni' && <span className="text-slate-400 font-medium">Var (Yeni / Çalışır) • 0 Puan</span>}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onChange('yok')}
          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'yok'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:bg-slate-700/70'
          }`}
        >
          Yok
        </button>
        <button
          type="button"
          onClick={() => onChange('eski')}
          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'eski'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:bg-slate-700/70'
          }`}
        >
          Eski
        </button>
        <button
          type="button"
          onClick={() => onChange('yeni')}
          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'yeni'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:bg-slate-700/70'
          }`}
        >
          Yeni
        </button>
      </div>
    </div>
  );
};

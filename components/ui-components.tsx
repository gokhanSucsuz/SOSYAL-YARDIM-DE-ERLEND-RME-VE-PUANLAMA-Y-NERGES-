"use client";

import React from 'react';

export const SectionCard = ({ title, icon: Icon, maxScore, currentScore, children, className = "", hideScore = false }: any) => (
  <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden mb-2.5 print:border-slate-300 dark:border-slate-600 print:shadow-none print:mb-2 ${className}`}>
    <div className="bg-slate-50/80 border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-1.5 print:bg-white dark:bg-slate-800">
      <div className="flex items-center space-x-2">
        {Icon && <Icon size={16} className="text-primary-600 shrink-0" />}
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{title}</h2>
      </div>
      {!hideScore && maxScore > 0 && currentScore !== undefined && (
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Bölüm Puanı</span>
          <span className={`bg-primary-50 text-primary-800 border border-primary-200 text-[11px] px-2 py-0.5 rounded-full font-black ${currentScore === maxScore ? 'bg-primary-600 text-white border-primary-600' : ''} print:bg-transparent print:p-0`}>
            {currentScore} / {maxScore} Puan
          </span>
        </div>
      )}
    </div>
    <div className="p-2.5 sm:p-3.5">
      {children}
    </div>
  </div>
);

export const CheckboxItem = ({ label, checked, onChange, isAlert = false, points = null }: any) => (
  <label className={`flex items-center min-h-[38px] p-2 sm:p-2.5 border rounded-xl cursor-pointer transition-all active:scale-[0.99] touch-manipulation select-none ${
    checked
      ? (isAlert ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 ring-1 ring-rose-400 dark:ring-rose-500' : 'bg-primary-50/60 dark:bg-primary-900/30 border-primary-400 dark:border-primary-500 ring-1 ring-primary-400 dark:ring-primary-500')
      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900'
  } print:border-slate-300 dark:border-slate-600 print:bg-white dark:bg-slate-800 print:p-1.5`}>
    <div className="flex-shrink-0 mr-2.5 flex items-center justify-center">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border-slate-300 dark:border-slate-600 transition-transform ${isAlert ? 'text-rose-600 focus:ring-rose-500' : 'text-primary-600 focus:ring-primary-500'}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    <div className="flex-1 flex justify-between items-center gap-1.5">
      <span className={`text-xs sm:text-sm font-semibold leading-tight ${checked && isAlert ? 'text-rose-900 dark:text-rose-100 font-bold' : checked ? 'text-primary-950 dark:text-primary-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {points && (
        <span className={`text-[10px] sm:text-xs font-black shrink-0 px-1.5 py-0.5 rounded-md ${checked ? (isAlert ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-900 dark:text-rose-100' : 'bg-primary-200 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100') : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}>
          +{points} P.
        </span>
      )}
    </div>
  </label>
);

export const RadioItem = ({ label, name, checked, onChange, points }: any) => (
  <label className={`flex items-center min-h-[38px] p-2 sm:p-2.5 border rounded-xl cursor-pointer transition-all active:scale-[0.99] touch-manipulation select-none ${
    checked ? 'bg-primary-50/60 dark:bg-primary-900/30 border-primary-400 dark:border-primary-500 ring-1 ring-primary-400 dark:ring-primary-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-900'
  } print:border-slate-300 dark:border-slate-600 print:bg-white dark:bg-slate-800 print:p-1.5`}>
    <div className="flex-shrink-0 mr-2.5 flex items-center justify-center">
      <input
        type="radio"
        name={name}
        className="w-4 h-4 text-primary-600 border-slate-300 dark:border-slate-600 focus:ring-primary-500"
        checked={checked}
        onChange={() => onChange()}
      />
    </div>
    <div className="flex-1 flex justify-between items-center gap-1.5">
      <span className={`text-xs sm:text-sm font-semibold leading-tight ${checked ? 'text-primary-950 dark:text-primary-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {points !== undefined && (
        <span className={`text-[10px] sm:text-xs font-black shrink-0 px-1.5 py-0.5 rounded-md ${checked ? 'bg-primary-200 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}>
          +{points} P.
        </span>
      )}
    </div>
  </label>
);

export const ScoreButtons = ({ value, onChange, label, description }: any) => {
  const scaleLabels: { [key: number]: { text: string; color: string } } = {
    0: { text: "0: İyi / Yeterli", color: "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    1: { text: "1: Az Kırılgan", color: "bg-primary-50 text-primary-800 border-primary-200" },
    2: { text: "2: Orta Seviye", color: "bg-sky-50 text-sky-800 border-sky-200" },
    3: { text: "3: Belirgin İhtiyaç", color: "bg-amber-50 text-amber-800 border-amber-200" },
    4: { text: "4: Yüksek Muhtaçlık", color: "bg-orange-50 text-orange-900 border-orange-200" },
    5: { text: "5: Kritik Acil", color: "bg-rose-100 text-rose-900 border-rose-300 font-extrabold" },
  };

  const currentLabel = scaleLabels[value] || scaleLabels[0];

  return (
    <div className="p-2 sm:p-2.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl mb-2 last:mb-0 print:border-slate-300 dark:border-slate-600 print:bg-white dark:bg-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
        <div>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 block">{label}</span>
          {description && <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>}
        </div>

        {/* Selected Score Badge */}
        <div className={`px-2 py-0.5 rounded-lg text-[11px] border font-bold flex items-center gap-1 self-start sm:self-auto shrink-0 ${currentLabel.color}`}>
          <span>{currentLabel.text}</span>
        </div>
      </div>

      {/* Button Row */}
      <div className="grid grid-cols-6 gap-1 sm:gap-1.5 mt-1">
        {[0, 1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;
          return (
            <button
              type="button"
              key={num}
              onClick={() => onChange(num)}
              className={`flex flex-col items-center justify-center h-8 sm:h-9 rounded-lg text-xs font-bold transition-all border active:scale-95 touch-manipulation select-none ${
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm font-extrabold ring-1 ring-primary-400'
                  : 'bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs sm:text-sm font-black">{num}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const CounterItem = ({ label, value, onChange, pointsPerItem }: any) => (
  <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs print:border-slate-300 dark:border-slate-600">
    <div className="flex flex-col pr-1.5 min-w-0">
      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">{label}</span>
      <span className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-0.5">+{pointsPerItem} P./Kişi</span>
    </div>
    <div className="flex items-center space-x-1.5 shrink-0">
      <button 
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-sm active:scale-95 touch-manipulation"
      >-</button>
      <span className="w-6 text-center font-black text-sm text-slate-900 dark:text-slate-100">{value}</span>
      <button 
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 flex items-center justify-center font-black text-sm active:scale-95 touch-manipulation"
      >+</button>
    </div>
  </div>
);

export const ApplianceStatusItem = ({ label, icon: Icon, value = 'yeni', onChange, pointsYok, pointsEski }: any) => {
  const currentVal = value || 'yeni';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:border-slate-600 transition-colors gap-2">
      <div className="flex items-center space-x-2.5 min-w-0">
        {Icon && (
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-lg shrink-0">
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{label}</h4>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            {currentVal === 'yok' && <span className="text-rose-600 font-bold">Yok • +{pointsYok} P</span>}
            {currentVal === 'eski' && <span className="text-amber-600 font-bold">Eski • +{pointsEski} P</span>}
            {currentVal === 'yeni' && <span className="text-slate-400 font-medium">Yeni • 0 P</span>}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onChange('yok')}
          className={`py-1 px-2.5 rounded-md text-xs font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'yok'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'
          }`}
        >
          Yok
        </button>
        <button
          type="button"
          onClick={() => onChange('eski')}
          className={`py-1 px-2.5 rounded-md text-xs font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'eski'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'
          }`}
        >
          Eski
        </button>
        <button
          type="button"
          onClick={() => onChange('yeni')}
          className={`py-1 px-2.5 rounded-md text-xs font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'yeni'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'
          }`}
        >
          Yeni
        </button>
      </div>
    </div>
  );
};

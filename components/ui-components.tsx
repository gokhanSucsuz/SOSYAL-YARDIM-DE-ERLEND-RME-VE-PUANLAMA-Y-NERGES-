"use client";

import React from 'react';

export const SectionCard = ({ title, icon: Icon, maxScore, currentScore, children, className = "", hideScore = false }: any) => (
  <div className={`bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/90 rounded-2xl shadow-xs overflow-hidden mb-2 print:border-slate-300 dark:border-slate-600 print:shadow-none print:mb-2 ${className}`}>
    <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-800/90 border-b border-slate-200/80 dark:border-slate-700/80 px-3 sm:px-4 py-1.5 sm:py-2 flex flex-wrap items-center justify-between gap-1.5 print:bg-white">
      <div className="flex items-center space-x-2">
        <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-primary-500 to-indigo-600 shrink-0" />
        {Icon && <Icon size={15} className="text-primary-600 dark:text-primary-400 shrink-0" />}
        <h2 className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">{title}</h2>
      </div>
      {!hideScore && maxScore > 0 && currentScore !== undefined && (
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Modül Puanı</span>
          <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-black border transition-all ${
            currentScore >= maxScore
              ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white border-primary-600 shadow-xs'
              : currentScore > 0
              ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
          } print:bg-transparent print:p-0`}>
            {currentScore} / {maxScore} Puan
          </span>
        </div>
      )}
    </div>
    <div className="p-2 sm:p-3">
      {children}
    </div>
  </div>
);

export const CheckboxItem = ({ label, checked, onChange, isAlert = false, points = null }: any) => (
  <label className={`group flex items-center min-h-[36px] px-2.5 py-1.5 sm:py-2 border rounded-xl cursor-pointer transition-all active:scale-[0.99] touch-manipulation select-none ${
    checked
      ? (isAlert
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 ring-1 ring-rose-400/50 dark:ring-rose-500/40 shadow-2xs'
          : 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-500 dark:border-primary-500 ring-1 ring-primary-400/50 dark:ring-primary-500/40 shadow-2xs')
      : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/70 dark:hover:bg-slate-800'
  } print:border-slate-300 print:bg-white print:p-1.5`}>
    <div className="flex-shrink-0 mr-2 flex items-center justify-center">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border-slate-300 dark:border-slate-600 transition-transform cursor-pointer ${isAlert ? 'text-rose-600 focus:ring-rose-500' : 'text-primary-600 focus:ring-primary-500'}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
    <div className="flex-1 flex justify-between items-center gap-1.5 min-w-0">
      <span className={`text-[11px] sm:text-xs font-semibold leading-snug ${checked && isAlert ? 'text-rose-950 dark:text-rose-100 font-bold' : checked ? 'text-primary-950 dark:text-primary-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {points !== null && points !== undefined && (
        <span className={`text-[10px] font-black shrink-0 px-1.5 py-0.5 rounded-md border ${
          checked
            ? (isAlert
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-primary-600 text-white border-primary-600')
            : 'bg-slate-100 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 border-slate-200/70 dark:border-slate-700'
        }`}>
          {Number(points) > 0 ? `+${points}` : points} P.
        </span>
      )}
    </div>
  </label>
);

export const RadioItem = ({ label, name, checked, onChange, points }: any) => (
  <label className={`group flex items-center min-h-[36px] px-2.5 py-1.5 sm:py-2 border rounded-xl cursor-pointer transition-all active:scale-[0.99] touch-manipulation select-none ${
    checked
      ? 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-500 dark:border-primary-500 ring-1 ring-primary-400/50 dark:ring-primary-500/40 shadow-2xs'
      : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/70 dark:hover:bg-slate-800'
  } print:border-slate-300 print:bg-white print:p-1.5`}>
    <div className="flex-shrink-0 mr-2 flex items-center justify-center">
      <input
        type="radio"
        name={name}
        className="w-4 h-4 text-primary-600 border-slate-300 dark:border-slate-600 focus:ring-primary-500 cursor-pointer"
        checked={checked}
        onChange={() => onChange()}
      />
    </div>
    <div className="flex-1 flex justify-between items-center gap-1.5 min-w-0">
      <span className={`text-[11px] sm:text-xs font-semibold leading-snug ${checked ? 'text-primary-950 dark:text-primary-100 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {points !== undefined && (
        <span className={`text-[10px] font-black shrink-0 px-1.5 py-0.5 rounded-md border ${
          checked
            ? 'bg-primary-600 text-white border-primary-600'
            : 'bg-slate-100 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 border-slate-200/70 dark:border-slate-700'
        }`}>
          +{points} P.
        </span>
      )}
    </div>
  </label>
);

export const ScoreButtons = ({ value, onChange, label, description }: any) => {
  const scaleLabels: { [key: number]: { text: string; color: string } } = {
    0: { text: "0: İyi / Yeterli", color: "bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    1: { text: "1: Az Kırılgan", color: "bg-primary-50 dark:bg-primary-950/50 text-primary-800 dark:text-primary-300 border-primary-200 dark:border-primary-800" },
    2: { text: "2: Orta Seviye", color: "bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800" },
    3: { text: "3: Belirgin İhtiyaç", color: "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
    4: { text: "4: Yüksek Muhtaçlık", color: "bg-orange-50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
    5: { text: "5: Kritik Acil", color: "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700 font-extrabold" },
  };

  const currentLabel = scaleLabels[value] || scaleLabels[0];

  return (
    <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-xl print:border-slate-300 print:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block leading-tight">{label}</span>
          {description && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>

        {/* Selected Score Badge */}
        <div className={`px-2 py-0.5 rounded-lg text-[10px] border font-bold flex items-center gap-1 shrink-0 ${currentLabel.color}`}>
          <span>{currentLabel.text}</span>
        </div>
      </div>

      {/* Button Row */}
      <div className="grid grid-cols-6 gap-1 mt-1">
        {[0, 1, 2, 3, 4, 5].map((num) => {
          const isSelected = value === num;
          return (
            <button
              type="button"
              key={num}
              onClick={() => onChange(num)}
              className={`flex flex-col items-center justify-center h-8 rounded-lg text-xs font-bold transition-all border active:scale-95 touch-manipulation select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white border-primary-600 shadow-xs font-black ring-1 ring-primary-400'
                  : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs font-black">{num}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const CounterItem = ({ label, value, onChange, pointsPerItem }: any) => (
  <div className={`flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all shadow-2xs print:border-slate-300 ${
    value > 0
      ? 'bg-primary-50/70 dark:bg-primary-950/30 border-primary-400 dark:border-primary-600 ring-1 ring-primary-400/30'
      : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80'
  }`}>
    <div className="flex flex-col pr-1.5 min-w-0">
      <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">{label}</span>
      <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
        +{pointsPerItem} P./Kişi {value > 0 && <strong className="ml-1 text-emerald-600 dark:text-emerald-400">(+{value * pointsPerItem} P.)</strong>}
      </span>
    </div>
    <div className="flex items-center space-x-1 shrink-0">
      <button 
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-black text-sm active:scale-95 touch-manipulation"
      >−</button>
      <span className="w-6 text-center font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">{value}</span>
      <button 
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-lg bg-primary-600 text-white border border-primary-600 hover:bg-primary-500 flex items-center justify-center font-black text-sm active:scale-95 touch-manipulation shadow-2xs"
      >+</button>
    </div>
  </div>
);

export const ApplianceStatusItem = ({ label, icon: Icon, value = 'yeni', onChange, pointsYok, pointsEski }: any) => {
  const currentVal = value || 'yeni';
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-2.5 py-2 rounded-xl border transition-all gap-2 ${
      currentVal === 'yok'
        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700/80'
        : currentVal === 'eski'
        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/80'
        : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300'
    }`}>
      <div className="flex items-center space-x-2 min-w-0">
        {Icon && (
          <div className={`p-1.5 rounded-lg shrink-0 ${
            currentVal === 'yok' ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300' :
            currentVal === 'eski' ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300' :
            'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
          }`}>
            <Icon size={15} />
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{label}</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {currentVal === 'yok' && <span className="text-rose-600 dark:text-rose-400 font-extrabold">Yok • +{pointsYok} P.</span>}
            {currentVal === 'eski' && <span className="text-amber-600 dark:text-amber-400 font-extrabold">Eski/Arızalı • +{pointsEski} P.</span>}
            {currentVal === 'yeni' && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Var (İyi) • 0 P.</span>}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900/70 p-0.5 rounded-lg shrink-0 w-full sm:w-auto border border-slate-200/60 dark:border-slate-700/60">
        <button
          type="button"
          onClick={() => onChange('yok')}
          className={`py-1 px-2.5 rounded-md text-[11px] font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'yok'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Yok
        </button>
        <button
          type="button"
          onClick={() => onChange('eski')}
          className={`py-1 px-2.5 rounded-md text-[11px] font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'eski'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Eski
        </button>
        <button
          type="button"
          onClick={() => onChange('yeni')}
          className={`py-1 px-2.5 rounded-md text-[11px] font-extrabold transition-all active:scale-95 touch-manipulation text-center ${
            currentVal === 'yeni'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Yeni
        </button>
      </div>
    </div>
  );
};

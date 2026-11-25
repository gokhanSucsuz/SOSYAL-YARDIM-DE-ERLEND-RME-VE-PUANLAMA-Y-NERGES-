"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, Check, AlertCircle, Save, Trash2 } from 'lucide-react';

export type UnsavedChoice = 'save' | 'discard' | 'cancel';

interface DialogContextProps {
  showAlert: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => Promise<void>;
  showConfirm: (message: string, confirmText?: string, cancelText?: string) => Promise<boolean>;
  showUnsavedChanges: (message?: string) => Promise<UnsavedChoice>;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

type DialogState = {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'unsaved';
  message: string;
  alertType?: 'info' | 'warning' | 'error' | 'success';
  confirmText?: string;
  cancelText?: string;
  resolve?: (value: any) => void;
};

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'alert',
    message: '',
  });

  const showAlert = useCallback((message: string, alertType: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    return new Promise<void>((resolve) => {
      setDialog({
        isOpen: true,
        type: 'alert',
        message,
        alertType,
        resolve,
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, confirmText = 'Onayla', cancelText = 'İptal') => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        isOpen: true,
        type: 'confirm',
        message,
        confirmText,
        cancelText,
        resolve,
      });
    });
  }, []);

  const showUnsavedChanges = useCallback((message = 'İnceleme formunda kaydedilmemiş değişiklikler yaptınız. Çıkmadan önce bu değişiklikleri kaydetmek ister misiniz?') => {
    return new Promise<UnsavedChoice>((resolve) => {
      setDialog({
        isOpen: true,
        type: 'unsaved',
        message,
        resolve,
      });
    });
  }, []);

  const close = useCallback((result: any = false) => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (dialog.resolve) {
      if (dialog.type === 'confirm' || dialog.type === 'unsaved') {
        dialog.resolve(result);
      } else {
        dialog.resolve(undefined);
      }
    }
  }, [dialog]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showUnsavedChanges }}>
      {children}
      <AnimatePresence>
        {dialog.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => {
                if (dialog.type === 'alert') close();
                else if (dialog.type === 'unsaved') close('cancel');
              }}
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-w-md w-full mx-auto flex flex-col"
            >
              {dialog.type === 'alert' && (
                <div className="p-5 pb-0 flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 shadow-sm ${
                    dialog.alertType === 'error' ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400' :
                    dialog.alertType === 'warning' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' :
                    dialog.alertType === 'success' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' :
                    'bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                  }`}>
                    {dialog.alertType === 'error' ? <AlertCircle size={28} /> :
                     dialog.alertType === 'warning' ? <AlertTriangle size={28} /> :
                     dialog.alertType === 'success' ? <Check size={28} /> :
                     <Info size={28} />}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1.5">Sistem Bildirimi</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{dialog.message}</p>
                </div>
              )}

              {dialog.type === 'confirm' && (
                <div className="p-5 pb-0 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3.5 shadow-sm">
                    <AlertTriangle size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1.5">İşlem Onayı</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed">{dialog.message}</p>
                </div>
              )}

              {dialog.type === 'unsaved' && (
                <div className="p-5 pb-1 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 shadow-sm border border-amber-200 dark:border-amber-800/50">
                    <Save size={26} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mb-1.5">
                    Değişiklikler Kaydedilsin mi?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {dialog.message}
                  </p>
                </div>
              )}

              {dialog.type === 'unsaved' ? (
                <div className="p-5 flex flex-col gap-2 mt-1">
                  <button
                    onClick={() => close('save')}
                    className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-500 hover:to-primary-500 shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Save size={16} />
                    <span>Kaydet ve Kapat</span>
                  </button>
                  <button
                    onClick={() => close('discard')}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Trash2 size={15} />
                    <span>Kaydetmeden Kapat</span>
                  </button>
                  <button
                    onClick={() => close('cancel')}
                    className="w-full py-2 px-4 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    İncelemeye Devam Et (İptal)
                  </button>
                </div>
              ) : (
                <div className="p-5 flex gap-2.5 mt-2">
                  {dialog.type === 'confirm' && (
                    <button
                      onClick={() => close(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {dialog.cancelText}
                    </button>
                  )}
                  <button
                    onClick={() => close(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-colors shadow-sm ${
                      dialog.type === 'confirm' ? 'bg-primary-700 hover:bg-primary-800' :
                      dialog.alertType === 'error' ? 'bg-red-600 hover:bg-red-700' :
                      dialog.alertType === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
                      dialog.alertType === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      'bg-primary-700 hover:bg-primary-800'
                    }`}
                  >
                    {dialog.type === 'confirm' ? dialog.confirmText : 'Tamam'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

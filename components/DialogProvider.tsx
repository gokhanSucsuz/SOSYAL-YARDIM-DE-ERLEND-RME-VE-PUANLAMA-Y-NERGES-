"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, Check, AlertCircle } from 'lucide-react';

interface DialogContextProps {
  showAlert: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => Promise<void>;
  showConfirm: (message: string, confirmText?: string, cancelText?: string) => Promise<boolean>;
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
  type: 'alert' | 'confirm';
  message: string;
  alertType?: 'info' | 'warning' | 'error' | 'success';
  confirmText?: string;
  cancelText?: string;
  resolve?: (value: boolean | void | PromiseLike<boolean | void>) => void;
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
        resolve: resolve as (value: boolean | void | PromiseLike<boolean | void>) => void,
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
        resolve: resolve as (value: boolean | void | PromiseLike<boolean | void>) => void,
      });
    });
  }, []);

  const close = useCallback((result: boolean = false) => {
    setDialog(prev => ({ ...prev, isOpen: false }));
    if (dialog.resolve) {
      if (dialog.type === 'confirm') {
        dialog.resolve(result);
      } else {
        dialog.resolve();
      }
    }
  }, [dialog]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AnimatePresence>
        {dialog.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-secondary-900/40 backdrop-blur-sm"
              onClick={() => { if (dialog.type === 'alert') close() }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto flex flex-col"
            >
              {dialog.type === 'alert' && (
                <div className="p-6 pb-0 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    dialog.alertType === 'error' ? 'bg-red-100 text-red-600' :
                    dialog.alertType === 'warning' ? 'bg-amber-100 text-amber-600' :
                    dialog.alertType === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-primary-100 text-primary-600'
                  }`}>
                    {dialog.alertType === 'error' ? <AlertCircle size={32} /> :
                     dialog.alertType === 'warning' ? <AlertTriangle size={32} /> :
                     dialog.alertType === 'success' ? <Check size={32} /> :
                     <Info size={32} />}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">Bilgi</h3>
                  <p className="text-secondary-600 text-sm">{dialog.message}</p>
                </div>
              )}

              {dialog.type === 'confirm' && (
                <div className="p-6 pb-0 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">Emin misiniz?</h3>
                  <p className="text-secondary-600 text-sm whitespace-pre-line">{dialog.message}</p>
                </div>
              )}

              <div className="p-6 flex gap-3 mt-2">
                {dialog.type === 'confirm' && (
                  <button
                    onClick={() => close(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-secondary-700 bg-secondary-100 hover:bg-secondary-200 transition-colors"
                  >
                    {dialog.cancelText}
                  </button>
                )}
                <button
                  onClick={() => close(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-colors ${
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorTheme = 'blue' | 'emerald' | 'crimson' | 'purple';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorTheme: 'blue',
  setColorTheme: () => null,
});

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('color-theme') as ColorTheme;
    if (savedTheme) {
      setColorThemeState(savedTheme);
      document.documentElement.setAttribute('data-color-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-color-theme', 'blue');
    }
  }, []);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem('color-theme', theme);
    document.documentElement.setAttribute('data-color-theme', theme);
  };

  // To prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useColorTheme = () => useContext(ThemeContext);

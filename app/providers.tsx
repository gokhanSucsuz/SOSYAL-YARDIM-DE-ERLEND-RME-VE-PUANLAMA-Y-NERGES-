"use client";

import { ReactNode } from "react";
import { DialogProvider } from "@/components/DialogProvider";
import { ThemeProvider } from "next-themes";
import { ColorThemeProvider } from "@/components/theme-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ColorThemeProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
}

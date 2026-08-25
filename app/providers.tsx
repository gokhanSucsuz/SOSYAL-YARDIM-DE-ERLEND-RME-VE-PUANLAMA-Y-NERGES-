"use client";

import { ReactNode } from "react";
import { DialogProvider } from "@/components/DialogProvider";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DialogProvider>
        {children}
      </DialogProvider>
    </ThemeProvider>
  );
}
